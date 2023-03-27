const day = require("../models/day.model");
const user = require("../models/user.model");
const APIError = require("../utils/errors");
const Response = require("../utils/response");

const createDay = async (req, res) => {
    const {   user_id } = req.body;

    const userCheck = await user.findById(user_id);

    if (!userCheck) {
        throw new APIError("User not found!", 401);
    }
    
    const daySave = new day(req.body);
    
    await daySave
    .save()
    .then((data) => {
      return new Response(data, "Day created succesfully").created(res);
    })
    .catch((err) => {
      throw new APIError("Day can not created, please try again!", 400);
    });
}


// const register = async (req, res) => {
//     const { email, username } = req.body;
  
//     const userMailCheck = await user.findOne({ email });
//     const usernameCheck = await user.findOne({ username });
  
//     if (usernameCheck) {
//       throw new APIError(
//         "Username already exist, please enter a different username!",
//         401
//       );
//     }
//     if (userMailCheck) {
//       throw new APIError(
//         "Email already exist, please enter a different email!",
//         401
//       );
//     }
//   req.body.password = await bcrypt.hash(req.body.password, 10);

//   const userSave = new user(req.body);

//   await userSave
//     .save()
//     .then((data) => {
//       return new Response(data, "User registered succesfully").created(res);
//     })
//     .catch((err) => {
//       throw new APIError("User can not registered, please try again!", 400);
//     });
// };


module.exports = {
    createDay
}
