const router = require("express").Router();

const { createPractice, getPracticeById, getAllPractices, updatePractice, deletePractice } = require("../controllers/practice.controller");


router.get("/get-practice/:id", getPracticeById);

router.get("/get-practices", getAllPractices);

router.post("/create-practice", createPractice);

router.put("/update-practice/:id", updatePractice);

router.delete("/delete-practice/:id", deletePractice);

module.exports = router;