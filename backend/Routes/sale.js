const express = require("express");
const router = express.Router();
const { createSale, listSales, getSale, updateSale, deleteSale } = require("../controllers/Sale");
const { auth } = require("../middleware/auth");

router.post("/create", auth, createSale);
router.get("/list", auth, listSales);
router.get("/get/:id", auth, getSale);
router.patch("/update/:id", auth, updateSale);
router.delete("/delete/:id", auth, deleteSale);

module.exports = router;