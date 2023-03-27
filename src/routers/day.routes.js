const router = require("express").Router();

const {createDay} = require("../controllers/day.controller");


router.post("/create-day", createDay);

module.exports = router;