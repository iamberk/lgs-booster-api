const router = require("express").Router();
const authController = require("../../controllers/auth.controller");
const authValidation = require("../../middlewares/validations/auth.validation");
const { tokenCheck } = require("../../middlewares/auth");

router.post("/login", authValidation.login, authController.login);

router.post("/register", authValidation.register, authController.register);

router.get("/me", tokenCheck, authController.me);

router.post("/forget-password", authController.forgetPassword);

router.patch("/update-profile/:id", authController.updateProfile);

router.post("/reset-code-check", authController.resetCodeCheck);

router.post("/reset-password", authController.resetPassword);

router.get("/get-user/:id", authController.getUserbyId);

router.get("/get-users", authController.getAllUsers);

router.delete("/delete-user/:id", authController.deleteUser);

module.exports = router;
