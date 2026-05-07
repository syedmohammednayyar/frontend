const Sale = require("../models/Sale");
const Store = require("../models/Store");
const Product = require("../models/Product");

// Sales Report
exports.getSalesReport = async (req, res) => {
    try {
        const { from, to, storeId, period } = req.query;
        
        console.log("📊 Sales Report Request:", { from, to, storeId, period });
        
        // Validate required parameters
        if (!from || !to) {
            return res.status(400).json({
                success: false,
                message: "From and To dates are required"
            });
        }
        
        const filter = {
            created_at: {
                $gte: new Date(from),
                $lte: new Date(to)
            }
        };
        
        if (storeId) {
            filter.store_id = storeId;
        }
        
        const sales = await Sale.find(filter).populate("items.product");
        
        const groupedByDate = new Map();
        
        sales.forEach(sale => {
            const date = sale.created_at.toISOString().slice(0, 10);
            const row = groupedByDate.get(date) || {
                date,
                transactions: 0,
                unitsSold: 0,
                revenue: 0
            };
            
            row.transactions += 1;
            row.unitsSold += sale.items.reduce((sum, item) => sum + item.quantity, 0);
            row.revenue += sale.grand_total;
            
            groupedByDate.set(date, row);
        });
        
        const rows = Array.from(groupedByDate.values()).sort((a, b) => a.date.localeCompare(b.date));
        
        return res.status(200).json({
            success: true,
            type: "sales",
            period: period || "custom",
            from,
            to,
            store: storeId || null,
            rows,
            summary: {
                totalTransactions: rows.reduce((sum, r) => sum + r.transactions, 0),
                totalUnitsSold: rows.reduce((sum, r) => sum + r.unitsSold, 0),
                totalRevenue: rows.reduce((sum, r) => sum + r.revenue, 0)
            }
        });
        
    } catch (error) {
        console.error("❌ Sales Report Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Product Report
exports.getProductReport = async (req, res) => {
    try {
        const { from, to, storeId } = req.query;
        
        if (!from || !to) {
            return res.status(400).json({
                success: false,
                message: "From and To dates are required"
            });
        }
        
        const filter = {
            created_at: {
                $gte: new Date(from),
                $lte: new Date(to)
            }
        };
        
        if (storeId) {
            filter.store_id = storeId;
        }
        
        const sales = await Sale.find(filter).populate("items.product");
        const groupedByProduct = new Map();
        
        sales.forEach(sale => {
            sale.items.forEach(item => {
                const product = item.product;
                if (!product) return;
                
                const row = groupedByProduct.get(product._id.toString()) || {
                    productId: product._id,
                    sku: product.sku,
                    productName: product.name,
                    category: product.category,
                    transactions: 0,
                    unitsSold: 0,
                    revenue: 0
                };
                
                row.transactions += 1;
                row.unitsSold += item.quantity;
                row.revenue += item.line_total;
                
                groupedByProduct.set(product._id.toString(), row);
            });
        });
        
        const rows = Array.from(groupedByProduct.values()).sort((a, b) => b.revenue - a.revenue);
        
        return res.status(200).json({
            success: true,
            type: "product",
            from,
            to,
            store: storeId || null,
            rows,
            summary: {
                totalProducts: rows.length,
                totalUnitsSold: rows.reduce((sum, r) => sum + r.unitsSold, 0),
                totalRevenue: rows.reduce((sum, r) => sum + r.revenue, 0)
            }
        });
        
    } catch (error) {
        console.error("❌ Product Report Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Store Report
exports.getStoreReport = async (req, res) => {
    try {
        const { from, to } = req.query;
        
        if (!from || !to) {
            return res.status(400).json({
                success: false,
                message: "From and To dates are required"
            });
        }
        
        const filter = {
            created_at: {
                $gte: new Date(from),
                $lte: new Date(to)
            }
        };
        
        const sales = await Sale.find(filter).populate("store_id");
        const stores = await Store.find();
        const storeMap = new Map(stores.map(s => [s._id.toString(), s.name]));
        
        const groupedByStore = new Map();
        
        sales.forEach(sale => {
            if (!sale.store_id) return;
            
            const storeId = sale.store_id._id.toString();
            const row = groupedByStore.get(storeId) || {
                storeId,
                storeName: storeMap.get(storeId) || "Unknown Store",
                transactions: 0,
                unitsSold: 0,
                revenue: 0
            };
            
            row.transactions += 1;
            row.unitsSold += sale.items.reduce((sum, item) => sum + item.quantity, 0);
            row.revenue += sale.grand_total;
            
            groupedByStore.set(storeId, row);
        });
        
        const rows = Array.from(groupedByStore.values()).sort((a, b) => b.revenue - a.revenue);
        
        return res.status(200).json({
            success: true,
            type: "store",
            from,
            to,
            rows,
            summary: {
                totalStores: rows.length,
                totalTransactions: rows.reduce((sum, r) => sum + r.transactions, 0),
                totalRevenue: rows.reduce((sum, r) => sum + r.revenue, 0)
            }
        });
        
    } catch (error) {
        console.error("❌ Store Report Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Dashboard Summary
exports.getDashboardSummary = async (req, res) => {
    try {
        const { fromDate, toDate, storeId } = req.query;
        
        const filter = {};
        if (fromDate && toDate) {
            filter.created_at = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }
        if (storeId) filter.store_id = storeId;
        
        const sales = await Sale.find(filter);
        
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.grand_total, 0);
        const totalSales = sales.length;
        const totalItemsSold = sales.reduce((sum, sale) => 
            sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        
        return res.status(200).json({
            success: true,
            summary: {
                totalRevenue,
                totalSales,
                totalItemsSold,
                averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0
            },
            period: {
                from: fromDate || null,
                to: toDate || null
            }
        });
        
    } catch (error) {
        console.error("❌ Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Financial Report
exports.getFinancialReport = async (req, res) => {
    try {
        const { fromDate, toDate, storeId } = req.query;
        
        if (!fromDate || !toDate) {
            return res.status(400).json({
                success: false,
                message: "From and To dates are required"
            });
        }
        
        const filter = {};
        if (storeId) filter.store_ref = storeId;
        
        // Get expenses
        const Expense = require("../models/Expense");
        const expenses = await Expense.find({
            expense_date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
            ...filter
        });
        
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.out_cash + exp.out_online, 0);
        
        // Get sales revenue
        const sales = await Sale.find({
            created_at: { $gte: new Date(fromDate), $lte: new Date(toDate) },
            ...(storeId && { store_id: storeId })
        });
        
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.grand_total, 0);
        
        return res.status(200).json({
            success: true,
            summary: {
                totalRevenue,
                totalExpenses,
                netProfit: totalRevenue - totalExpenses,
                profitMargin: totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(2) : 0
            },
            period: { from: fromDate, to: toDate }
        });
        
    } catch (error) {
        console.error("❌ Financial Report Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Top Products Report
exports.getTopProductsReport = async (req, res) => {
    try {
        const { from, to, limit = 10 } = req.query;
        
        if (!from || !to) {
            return res.status(400).json({
                success: false,
                message: "From and To dates are required"
            });
        }
        
        const filter = {
            created_at: { $gte: new Date(from), $lte: new Date(to) }
        };
        
        const sales = await Sale.find(filter).populate("items.product");
        const productStats = new Map();
        
        sales.forEach(sale => {
            sale.items.forEach(item => {
                const product = item.product;
                if (!product) return;
                
                const stats = productStats.get(product._id.toString()) || {
                    productId: product._id,
                    sku: product.sku,
                    name: product.name,
                    category: product.category,
                    unitsSold: 0,
                    revenue: 0
                };
                
                stats.unitsSold += item.quantity;
                stats.revenue += item.line_total;
                
                productStats.set(product._id.toString(), stats);
            });
        });
        
        const topProducts = Array.from(productStats.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, parseInt(limit));
        
        return res.status(200).json({
            success: true,
            topProducts,
            period: { from, to }
        });
        
    } catch (error) {
        console.error("❌ Top Products Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};