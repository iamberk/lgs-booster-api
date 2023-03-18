const router = require('express').Router();
const AuthValidation = require('../middlewares/validations/auth.validation'); 
const {login, register} = require("../controllers/auth.controller");


router.post('/register', AuthValidation.register, register);

router.post('/login', login);

module.exports = router;