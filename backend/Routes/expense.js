const express = require("express");
const router = express.Router();
const {
  createExpense,
  listExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getExpensesByDateRange,
} = require("../controllers/Expense");
const { auth, isAdmin, isManager } = require("../middleware/auth");

// All expense routes require authentication
router.use(auth);

// Expense CRUD operations
router.post("/create", createExpense);
router.get("/list", listExpenses);
router.get("/get/:id", getExpense);
router.patch("/update/:id", isManager, updateExpense);
router.delete("/delete/:id", isAdmin, deleteExpense);

// Expense analytics routes
router.get("/stats", getExpenseStats);
router.get("/by-date-range", getExpensesByDateRange);

module.exports = router;