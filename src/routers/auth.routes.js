const router = require('express').Router();
const {login, register} = require("../controllers/auth.controller");
const AuthValidation = require('../middlewares/Validations/auth.validation'); 


router.post('/register', AuthValidation.register, register);

router.post('/login', AuthValidation.login, login);

module.exports = router;