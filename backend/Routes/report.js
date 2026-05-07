const express = require("express");
const router = express.Router();
const {
    getSalesReport,
    getProductReport,
    getStoreReport,
    getDashboardSummary,
    getFinancialReport,
    getTopProductsReport
} = require("../controllers/Report");
const { auth } = require("../middleware/auth");

// All report routes require authentication
router.use(auth);

// Report endpoints
router.get("/sales", getSalesReport);
router.get("/products", getProductReport);
router.get("/stores", getStoreReport);
router.get("/dashboard", getDashboardSummary);
router.get("/financial", getFinancialReport);
router.get("/top-products", getTopProductsReport);

module.exports = router;