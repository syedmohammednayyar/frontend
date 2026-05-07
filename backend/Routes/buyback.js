const express = require("express");
const router = express.Router();
const { createBuyback, listBuybacks, updateBuyback, deleteBuyback } = require("../controllers/Buyback");
const { auth } = require("../middleware/auth");

router.post("/create", auth, createBuyback);
router.get("/list", auth, listBuybacks);
router.patch("/update/:id", auth, updateBuyback);
router.delete("/delete/:id", auth, deleteBuyback);

module.exports = router;