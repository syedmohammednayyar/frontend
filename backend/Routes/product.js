const express = require("express");
const router = express.Router();
const { createProduct, listProducts, updateProduct, deleteProduct, transferProduct } = require("../controllers/Product");
const { auth, isAdmin } = require("../middleware/auth");

// ONLY ADMIN CAN MANAGE INVENTORY (Create, Update, Delete, Transfer)
router.post("/create", auth, isAdmin, createProduct);
router.get("/list", auth, listProducts);
router.patch("/update/:id", auth, isAdmin, updateProduct);
router.delete("/delete/:id", auth, isAdmin, deleteProduct);
router.post("/transfer/:id", auth, isAdmin, transferProduct);

module.exports = router;