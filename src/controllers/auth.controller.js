const user = require('../models/user.model');
const bcrypt = require('bcrypt');
const APIError = require('../utils/errors');

const login = async (req, res) => {
    console.log(req.body);

    return res.json(req.body)
}
const register = async (req, res) => {
    const { email } = req.body;

    const userCheck = await user.findOne({ email });

    if (userCheck) {
        throw new APIError('User already exists', 401)
    }

    req.body.password = await bcrypt.hash(req.body.password , 10);

    try {
        const userSave = new user(req.body);
        await userSave.save()
            .then(response => {
                return res.status(201).json({ 
                    message: 'User created successfully',
                    success: true,
                    data: response 
                });
            },)
            .catch(err => {
                return res.status(400).json({ 
                    message: 'User not created',
                    success: false,
                    data: err 
                });
            });
            
    } catch (err) {
        console.log(err);
    }

    console.log(req.body);
}

module.exports = {  login, register }   