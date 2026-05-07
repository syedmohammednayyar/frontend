const express = require("express");
const router = express.Router();
const { createCustomer, listCustomers, updateCustomer, deleteCustomer } = require("../controllers/Customer");
const { auth } = require("../middleware/auth");

router.post("/create", auth, createCustomer);
router.get("/list", auth, listCustomers);
router.patch("/update/:id", auth, updateCustomer);
router.delete("/delete/:id", auth, deleteCustomer);

module.exports = router;