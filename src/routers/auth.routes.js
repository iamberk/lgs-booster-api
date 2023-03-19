const router = require('express').Router();
const {login, register, me, forgetPassword} = require("../controllers/auth.controller");
const AuthValidation = require('../middlewares/Validations/auth.validation'); 
const { tokenCheck } = require('../middlewares/auth');

router.post('/register', AuthValidation.register, register);

router.post('/login', AuthValidation.login, login);

router.get('/me', tokenCheck, me);

router.post("/forget-password", forgetPassword)

module.exports = router;