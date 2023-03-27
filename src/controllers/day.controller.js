const day = require("../models/day.model");
const user = require("../models/user.model");
const APIError = require("../utils/errors");
const Response = require("../utils/response");

const createDay = async (req, res) => {
  const { practices, user_id } = req.body;

  const userCheck = await user.findById(user_id);

  if (!userCheck) {
    throw new APIError("User not found!", 401);
  }

  const targetUser = await user.findById(user_id);

  const dayDetail = {
    practices,
    user_id,
    day_number: targetUser.last_day + 1,
  };

  const daySave = new day(dayDetail);

  await daySave
    .save()
    .then((data) => {
      user.findByIdAndUpdate(user_id, { $inc: { last_day: 1 } }, { new: true });
      return new Response(data, "Day created succesfully").created(res);
    })
    .catch((err) => {
      console.log(err);
      throw new APIError("Day can not created, please try again!", 400);
    });
};

const getDayById = async (req, res) => {
  const { id } = req.params;

  const dayInfo = await day.findById(id);

  if (!dayInfo) {
    throw new APIError("Day not found!", 401);
  }

  return new Response(dayInfo, "Day found succesfully").success(res);
};

const getAllDays = async (req, res) => {
  const days = await day.find();

  return new Response(days, "Days found succesfully").success(res);
};

const updateDay = async (req, res) => {
 try {
     const { id } = req.params;
     const { practices, user_id, day_number } = req.body;
   
     const dayInfo = await day.findById(id);
   
     if (!dayInfo) {
       throw new APIError("Day not found!", 401);
     }
   
     const dayDetail = {
       practices,
       user_id,
       day_number,
     };
   
     await dayInfo.updateOne(dayDetail, (err, data) => {
       if (err) {
         console.log(err);
         throw new APIError("Day can not updated, please try again!", 400);
       }
   
       return new Response(data, "Day updated succesfully").success(res);
     });
 } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(res);
 }
};

const deleteDay = async (req, res) => {
 try {
     const { id } = req.params;
   
     const dayInfo = await day.findById(id);
   
     if (!dayInfo) {
       throw new APIError("Day not found!", 401);
     }
   
     dayInfo.delete((err, data) => {
       if (err) {
         throw new APIError("Day can not deleted, please try again!", 400);
       }
       return new Response(data, "Day deleted succesfully").success(res);
     });
 } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(res);
 }
};
module.exports = {
  createDay,
  getDayById,
  getAllDays,
  updateDay,
  deleteDay,
};
