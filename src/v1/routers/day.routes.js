const router = require("express").Router();
const daycontroller = require("../../controllers/day.controller");

router.get("/get-day/:id", daycontroller.getDayById);

router.get("/get-days", daycontroller.getAllDays);

router.post("/create-day", daycontroller.createDay);

router.patch("/update-day/:id", daycontroller.updateDay);

router.delete("/delete-day/:id", daycontroller.deleteDay);

module.exports = router;