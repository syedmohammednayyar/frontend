const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// Note: Use lowercase 'controllers' or check your actual folder name
const { 
  createEmployee, 
  listEmployees, 
  getEmployee, 
  updateEmployee, 
  deleteEmployee 
} = require("../controllers/Employee");

const { auth, isAdmin, isManager } = require("../middleware/auth");

// All employee routes require authentication
router.use(auth);

// Employee CRUD operations
router.post("/create", isAdmin, createEmployee);
router.get("/list", listEmployees);
router.get("/get/:id", getEmployee);
router.patch("/update/:id", isManager, updateEmployee);
router.delete("/delete/:id", isAdmin, deleteEmployee);

module.exports = router;