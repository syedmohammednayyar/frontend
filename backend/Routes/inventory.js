const express = require("express");
const router = express.Router();
const { listInventory } = require("../controllers/Inventory");
const { auth } = require("../middleware/auth");

router.get("/list", auth, listInventory);

module.exports = router;