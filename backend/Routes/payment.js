const express = require("express");
const router = express.Router();
const {
  createPaymentEntry,
  listPaymentEntries,
  getPaymentEntry,
  updatePaymentEntry,
  deletePaymentEntry,
  getOutstandingBalances,
  getPaymentStats,
} = require("../controllers/Payment");
const { auth, isAdmin, isManager } = require("../middleware/auth");

// All payment routes require authentication
router.use(auth);

// Payment CRUD operations
router.post("/create", createPaymentEntry);
router.get("/list", listPaymentEntries);
router.get("/get/:id", getPaymentEntry);
router.patch("/update/:id", isManager, updatePaymentEntry);
router.delete("/delete/:id", isAdmin, deletePaymentEntry);

// Payment analytics routes
router.get("/outstanding", getOutstandingBalances);
router.get("/stats", getPaymentStats);

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { createPaymentEntry, listPaymentEntries, updatePaymentEntry, deletePaymentEntry } = require("../controllers/Payment");
// const { auth } = require("../middleware/auth");

// router.post("/create", auth, createPaymentEntry);
// router.get("/list", auth, listPaymentEntries);
// router.patch("/update/:id", auth, updatePaymentEntry);
// router.delete("/delete/:id", auth, deletePaymentEntry);

// module.exports = router;