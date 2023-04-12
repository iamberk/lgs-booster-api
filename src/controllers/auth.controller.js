const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const {
  createToken,
  createTemporaryToken,
  decodedTemporaryToken,
} = require("../middlewares/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const moment = require("moment");

const login = async (req, res) => {
  try {
    console.log("login çalıştı");
    const { email, password } = req.body;

    const userInfo = await user.findOne({ email });

    if (!userInfo) throw new APIError("Email or password is incorrect!", 401);

    const comparePassword = await bcrypt.compare(password, userInfo.password);

    if (!comparePassword)
      throw new APIError("Email or password is incorrect!", 401);

    createToken(userInfo, res);
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const register = async (req, res) => {
  try {
    console.log("register çalıştı");

    const { email, username } = req.body;

    const userMailCheck = await user.findOne({ email });
    const usernameCheck = await user.findOne({ username });

    if (usernameCheck) {
      throw new APIError(
        "Username already exist, please enter a different username!",
        401
      );
    }
    if (userMailCheck) {
      throw new APIError(
        "Email already exist, please enter a different email!",
        401
      );
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const userSave = new user(req.body);

    await userSave
      .save()
      .then((data) => {
        return new Response(data, "User registered succesfully").created(res);
      })
      .catch((err) => {
        console.log(err);
        throw new APIError("User can not registered, please try again!", 400);
      });
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const me = async (req, res) => {
  try {
    console.log("me çalıştı");
    const { _id, email, username } = req.user;
    const userData = {
      _id,
      email,
      username,
    };
    return new Response(userData).success(res);
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const forgetPassword = async (req, res) => {
  try {
    console.log("forget password çalıştı");

    const { email } = req.body;

    const userInfo = await user
      .findOne({ email })
      .select(" name lastname email ");

    if (!userInfo) return new APIError("Invalid username", 400);

    const resetCode = crypto.randomBytes(3).toString("hex");
    console.log("resetCode : ", resetCode);

    // await sendEmail({
    //   from: process.env.EMAIL_ADDRESS,
    //   to: userInfo.email,
    //   subject: "Password Reset",
    //   text: `Your password reset code: ${resetCode}`,
    // });

    await user.updateOne(
      { email },
      {
        reset: {
          code: resetCode,
          time: moment(new Date())
            .add(15, "minute")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    return new Response(true, "Please check your email box.").success(res);
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const resetCodeCheck = async (req, res) => {
  try {
    console.log("reset-code-check çalıştı");

    const { email, code } = req.body;

    const userInfo = await user
      .findOne({ email })
      .select("_id name lastname email reset");

    if (!userInfo) throw new APIError("Invalid Code!", 401);

    const dbTime = moment(userInfo.reset.time);
    const nowTime = moment(new Date());

    const timeDiff = dbTime.diff(nowTime, "minutes");

    if (timeDiff <= 0 || userInfo.reset.code !== code) {
      throw new APIError("Invalid Code", 401);
    }

    const temporaryToken = await createTemporaryToken(
      userInfo._id,
      userInfo.email
    );

    return new Response(
      { temporaryToken },
      "You can reset your password now."
    ).success(res);
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const resetPassword = async (req, res) => {
  try {
    console.log("reset-password çalıştı");

    const { password, temporaryToken } = req.body;

    const decodedToken = await decodedTemporaryToken(temporaryToken);
    console.log("decodedToken : ", decodedToken);

    const hashPassword = await bcrypt.hash(password, 10);

    await user.findByIdAndUpdate(
      { _id: decodedToken._id },
      {
        reset: {
          code: null,
          time: null,
        },
        password: hashPassword,
      }
    );

    return new Response(
      decodedToken,
      "Password reset is complated succesfully"
    ).success(res);
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const getUserbyId = async (req, res) => {
  try {
    console.log("getUserById çalıştı");

    const { id } = req.params;

    const userInfo = await user.findById(id);

    if (!userInfo) throw new APIError("User not found!", 401);

    return new Response(userInfo).success(res);
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log("getAllUsers çalıştı");

    const userInfo = await user.find();

    if (!userInfo) throw new APIError("Users not found!", 401);

    return new Response(userInfo).success(res);
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log("deleteUser çalıştı");

    const { id } = req.params;

    const userInfo = await user.findByIdAndDelete(id);

    if (!userInfo) throw new APIError("User not found!", 401);

    return new Response(userInfo).success(res);
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log("updateProfile çalıştı");

    const { id } = req.params;
    const { name, lastname, username, password } = req.body;

    const userInfo = await user.findById(id);

    if (!userInfo) {
      throw new APIError("User not found!", 401);
    }

    const comparePassword = await bcrypt.compare(password, userInfo.password);

    if (!comparePassword)
      throw new APIError("Email or password is incorrect!", 401);

    const usernameCheck = await user.findOne({ username });

    if (usernameCheck) {
      throw new APIError(
        "Username already exist, please enter a different username!",
        401
      );
    }
    const userDetail = {
      name,
      lastname,
      username,
    };

    userInfo.updateOne(userDetail, (err, data) => {
      if (err) {
        throw new APIError("User can not updated, please try again!", 400);
      }
      return new Response(data, "User updated succesfully").success(res);
    });
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(res);
  }
};

module.exports = {
  login,
  register,
  me,
  forgetPassword,
  resetCodeCheck,
  updateProfile,
  resetPassword,
  getUserbyId,
  deleteUser,
  getAllUsers,
};

/* 

# User Detail
updateEmail
updateUsername


# Day Detail
updateDay - days, missed_days, miss_count, last_day, streak_point, longest_streak, day_status

# Stats
updateStats - point, success_rate


# Subscription Detail
updateSubscription
*/
