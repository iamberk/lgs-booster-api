const Practice = require("../models/practice.model");
const APIError = require("../utils/errors");
const Response = require("../utils/response");

const getPracticeById = async (req, res) => {
  try {
    const { id } = req.params;

    const practice = await Practice.findById(id);

    if (!practice) {
      throw new APIError("Practice not found!", 401);
    }

    return new Response(practice, "Practice found succesfully").success(res);
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const createPractice = async (req, res) => {
  try {
    const { practice_type, start_day, end_day } = req.body;

    const practiceSave = new Practice(req.body);

    if (start_day > end_day) {
      throw new APIError("Start day must be less than end day!", 401);
    }
    if (practice_type > 0 || practice_type < 5) {
      throw new APIError("Practice type must be between 0 and 5!", 401);
    }

    await practiceSave
      .save()
      .then((data) => {
        return new Response(data, "Practice created succesfully").created(res);
      })
      .catch((err) => {
        throw new APIError("Practice can not created, please try again!", 400);
      });
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const getAllPractices = async (req, res) => {
  try {
    const practices = await Practice.find();

    if (!practices) {
      throw new APIError("Practices not found!", 401);
    }

    return new Response(practices, "Practices found succesfully").success(res);
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

const updatePractice = async (req, res) => {
  try {
    const { id } = req.params;
    const { practice_type, start_day, end_day } = req.body;

    const practiceInfo = await Practice.findById(id);

    if (!practiceInfo) {
      throw new APIError("Practice not found!", 401);
    }

    if (start_day > end_day) {
      throw new APIError("Start day must be less than end day!", 401);
    }
    if (practice_type < 0 || practice_type > 5) {
      throw new APIError("Practice type must be between 0 and 5!", 401);
    }

    await practiceInfo.updateOne(req.body, (err, data) => {
      if (err) {
        throw new APIError("Practice can not updated, please try again!", 400);
      }
      return new Response(data, "Practice updated succesfully").success(res);
    });
  } catch (error) {
    return new Response(
      error,
      "Practice can not updated, please try again!"
    ).error500(res);
  }
};

const deletePractice = async (req, res) => {
  try {
    const { id } = req.params;

    const practiceInfo = await Practice.findById(id);

    if (!practiceInfo) {
      throw new APIError("Practice not found!", 401);
    }

    await practiceInfo.delete((err, data) => {
      if (err) {
        throw new APIError("Practice can not deleted, please try again!", 400);
      }
      return new Response(data, "Practice deleted succesfully").success(res);
    });
  } catch (error) {
    return new Response(error, "Unexcepted error, please try again!").error500(
      res
    );
  }
};

module.exports = {
  createPractice,
  getPracticeById,
  getAllPractices,
  updatePractice,
  deletePractice,
};
