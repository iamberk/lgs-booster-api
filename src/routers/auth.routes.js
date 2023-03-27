const router = require("express").Router();
const {
  login,
  register,
  me,
  forgetPassword,
  resetCodeCheck,
  getUserbyId,
  getAllUsers,
  resetPassword,
  updateProfile,
  deleteUser
} = require("../controllers/auth.controller");
const authValidation = require("../middlewares/validations/auth.validation");
const { tokenCheck } = require("../middlewares/auth");

router.post("/login", authValidation.login, login);

router.post("/register", authValidation.register, register);

router.get("/me", tokenCheck, me);

router.post("/forget-password", forgetPassword);

router.put("/update-profile/:id", updateProfile);

router.post("/reset-code-check", resetCodeCheck);

router.post("/reset-password", resetPassword);

router.get("/get-user/:id", getUserbyId);

router.get("/get-users", getAllUsers);

router.delete("/delete-user/:id", deleteUser);

module.exports = router;
