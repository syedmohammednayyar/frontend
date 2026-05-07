const Expense = require("../models/Expense");
const Store = require("../models/Store");

// Create Expense
exports.createExpense = async (req, res) => {
  try {
    const {
      store_ref,
      reason,
      out_cash,
      out_online,
      expense_date,
      notes,
    } = req.body;

    // Validate store if provided
    if (store_ref) {
      const existingStore = await Store.findById(store_ref);
      if (!existingStore) {
        return res.status(404).json({
          success: false,
          message: "Store not found",
        });
      }
    }

    // Create expense
    const expense = await Expense.create({
      store_ref: store_ref || null,
      reason,
      out_cash: parseFloat(out_cash) || 0,
      out_online: parseFloat(out_online) || 0,
      expense_date: expense_date || new Date(),
      notes: notes || "",
    });

    return res.status(201).json({
      success: true,
      data: expense,
      message: "Expense created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// List all Expenses
exports.listExpenses = async (req, res) => {
  try {
    const { storeId, fromDate, toDate, category } = req.query;
    let filter = {};

    if (storeId) {
      filter.store_ref = storeId;
    }

    if (fromDate && toDate) {
      filter.expense_date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    if (category) {
      filter.reason = { $regex: category, $options: "i" };
    }

    const expenses = await Expense.find(filter)
      .populate("store_ref", "name code")
      .sort({ expense_date: -1 });

    const rows = expenses.map(expense => ({
      id: expense._id,
      store_ref: expense.store_ref?._id || expense.store_ref,
      store_name: expense.store_ref?.name || "N/A",
      reason: expense.reason,
      out_cash: expense.out_cash,
      out_online: expense.out_online,
      total_amount: expense.out_cash + expense.out_online,
      expense_date: expense.expense_date,
      notes: expense.notes,
      created_at: expense.created_at,
    }));

    return res.status(200).json({
      success: true,
      rows: rows,
      count: rows.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Single Expense
exports.getExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id)
      .populate("store_ref", "name code");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if expense exists
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Validate store if being updated
    if (updates.store_ref) {
      const existingStore = await Store.findById(updates.store_ref);
      if (!existingStore) {
        return res.status(404).json({
          success: false,
          message: "Store not found",
        });
      }
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedExpense,
      message: "Expense updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Expense Statistics
exports.getExpenseStats = async (req, res) => {
  try {
    const { storeId, fromDate, toDate } = req.query;
    let filter = {};

    if (storeId) {
      filter.store_ref = storeId;
    }

    if (fromDate && toDate) {
      filter.expense_date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    const stats = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalOutCash: { $sum: "$out_cash" },
          totalOutOnline: { $sum: "$out_online" },
          totalExpenses: { $sum: { $add: ["$out_cash", "$out_online"] } },
          count: { $sum: 1 },
          avgExpense: { $avg: { $add: ["$out_cash", "$out_online"] } },
        },
      },
    ]);

    // Get expenses by reason/category
    const expensesByReason = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
          totalAmount: { $sum: { $add: ["$out_cash", "$out_online"] } },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 },
    ]);

    // Get monthly expense trend
    const monthlyTrend = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: "$expense_date" },
            month: { $month: "$expense_date" },
          },
          totalAmount: { $sum: { $add: ["$out_cash", "$out_online"] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    return res.status(200).json({
      success: true,
      summary: stats[0] || {
        totalOutCash: 0,
        totalOutOnline: 0,
        totalExpenses: 0,
        count: 0,
        avgExpense: 0,
      },
      expensesByReason,
      monthlyTrend,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Expense by Date Range
exports.getExpensesByDateRange = async (req, res) => {
  try {
    const { fromDate, toDate, storeId } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "fromDate and toDate are required",
      });
    }

    let filter = {
      expense_date: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
    };

    if (storeId) {
      filter.store_ref = storeId;
    }

    const expenses = await Expense.find(filter)
      .populate("store_ref", "name code")
      .sort({ expense_date: -1 });

    const totalCash = expenses.reduce((sum, exp) => sum + exp.out_cash, 0);
    const totalOnline = expenses.reduce((sum, exp) => sum + exp.out_online, 0);
    const totalExpenses = totalCash + totalOnline;

    return res.status(200).json({
      success: true,
      summary: {
        totalCash,
        totalOnline,
        totalExpenses,
        count: expenses.length,
      },
      expenses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};