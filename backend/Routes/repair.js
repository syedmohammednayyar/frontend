const express = require("express");
const router = express.Router();
const { createRepair, listRepairs, updateRepair, deleteRepair } = require("../controllers/Repair");
const { auth } = require("../middleware/auth");

router.post("/create", auth, createRepair);
router.get("/list", auth, listRepairs);
router.patch("/update/:id", auth, updateRepair);
router.delete("/delete/:id", auth, deleteRepair);

module.exports = router;