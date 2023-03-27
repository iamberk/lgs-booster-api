const router = require("express").Router();

const {createDay, getDayById, getAllDays, updateDay, deleteDay} = require("../controllers/day.controller");


router.get("/get-day/:id", getDayById);

router.get("/get-days", getAllDays);

router.post("/create-day", createDay);

router.put("/update-day/:id", updateDay);

router.delete("/delete-day/:id", deleteDay);

module.exports = router;