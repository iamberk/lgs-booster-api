const router = require("express").Router();
const practiceController = require("../../controllers/practice.controller");

router.get("/get-practice/:id", practiceController.getPracticeById);

router.get("/get-practices", practiceController.getAllPractices);

router.post("/create-practice", practiceController.createPractice);

router.patch("/update-practice/:id", practiceController.updatePractice);

router.delete("/delete-practice/:id", practiceController.deletePractice);

module.exports = router;