const Buyback = require("../models/Buyback");
const Customer = require("../models/Customer");
const Store = require("../models/Store");

// Create Buyback
exports.createBuyback = async (req, res) => {
  try {
    const {
      imei,
      brand,
      model,
      color,
      customer,
      store_ref,
      job_no,
      ic_number,
      cash_amount,
      online_amount,
      exchange_amount,
      exchange_model,
      condition,
      market_value,
      negotiated_price,
      status,
    } = req.body;

    // Check if buyback with same IMEI exists
    const existingBuyback = await Buyback.findOne({ imei });
    if (existingBuyback) {
      return res.status(400).json({
        success: false,
        message: "Buyback with this IMEI already exists",
      });
    }

    // Validate customer if provided
    if (customer) {
      const existingCustomer = await Customer.findById(customer);
      if (!existingCustomer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }
    }

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

    // Create buyback
    const buyback = await Buyback.create({
      imei,
      brand,
      model,
      color: color || "",
      customer: customer || null,
      store_ref: store_ref || null,
      job_no: job_no || "",
      ic_number: ic_number || "",
      cash_amount: cash_amount || 0,
      online_amount: online_amount || 0,
      exchange_amount: exchange_amount || 0,
      exchange_model: exchange_model || "",
      condition,
      market_value,
      negotiated_price,
      status: status || "Pending",
    });

    return res.status(201).json({
      success: true,
      data: buyback,
      message: "Buyback created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// List all Buybacks
exports.listBuybacks = async (req, res) => {
  try {
    const { storeId, status, fromDate, toDate } = req.query;
    let filter = {};

    if (storeId) {
      filter.store_ref = storeId;
    }

    if (status) {
      filter.status = status;
    }

    if (fromDate && toDate) {
      filter.created_at = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    const buybacks = await Buyback.find(filter)
      .populate("customer", "name email phone")
      .populate("store_ref", "name code")
      .sort({ created_at: -1 });

    const rows = buybacks.map(buyback => ({
      id: buyback._id,
      imei: buyback.imei,
      brand: buyback.brand,
      model: buyback.model,
      color: buyback.color,
      customer: buyback.customer?._id || buyback.customer,
      customer_name: buyback.customer?.name || "Walk-in Customer",
      store_ref: buyback.store_ref?._id || buyback.store_ref,
      store_name: buyback.store_ref?.name || "N/A",
      job_no: buyback.job_no,
      ic_number: buyback.ic_number,
      cash_amount: buyback.cash_amount,
      online_amount: buyback.online_amount,
      exchange_amount: buyback.exchange_amount,
      exchange_model: buyback.exchange_model,
      condition: buyback.condition,
      market_value: buyback.market_value,
      negotiated_price: buyback.negotiated_price,
      status: buyback.status,
      created_at: buyback.created_at,
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

// Get Single Buyback
exports.getBuyback = async (req, res) => {
  try {
    const { id } = req.params;

    const buyback = await Buyback.findById(id)
      .populate("customer", "name email phone")
      .populate("store_ref", "name code");

    if (!buyback) {
      return res.status(404).json({
        success: false,
        message: "Buyback not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: buyback,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Buyback
exports.updateBuyback = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if buyback exists
    const buyback = await Buyback.findById(id);
    if (!buyback) {
      return res.status(404).json({
        success: false,
        message: "Buyback not found",
      });
    }

    // Validate customer if being updated
    if (updates.customer) {
      const existingCustomer = await Customer.findById(updates.customer);
      if (!existingCustomer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }
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

    // Check IMEI uniqueness if being updated
    if (updates.imei && updates.imei !== buyback.imei) {
      const existingBuyback = await Buyback.findOne({ imei: updates.imei });
      if (existingBuyback) {
        return res.status(400).json({
          success: false,
          message: "Buyback with this IMEI already exists",
        });
      }
    }

    const updatedBuyback = await Buyback.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedBuyback,
      message: "Buyback updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete Buyback
exports.deleteBuyback = async (req, res) => {
  try {
    const { id } = req.params;

    const buyback = await Buyback.findByIdAndDelete(id);

    if (!buyback) {
      return res.status(404).json({
        success: false,
        message: "Buyback not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Buyback deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Buyback Statistics
exports.getBuybackStats = async (req, res) => {
  try {
    const { storeId, fromDate, toDate } = req.query;
    let filter = {};

    if (storeId) {
      filter.store_ref = storeId;
    }

    if (fromDate && toDate) {
      filter.created_at = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    const stats = await Buyback.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalCashAmount: { $sum: "$cash_amount" },
          totalOnlineAmount: { $sum: "$online_amount" },
          totalExchangeAmount: { $sum: "$exchange_amount" },
          totalMarketValue: { $sum: "$market_value" },
          totalNegotiatedPrice: { $sum: "$negotiated_price" },
        },
      },
    ]);

    const totalBuybacks = await Buyback.countDocuments(filter);
    const totalValue = await Buyback.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: "$negotiated_price" },
        },
      },
    ]);

    // Get top brands
    const topBrands = await Buyback.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$brand",
          count: { $sum: 1 },
          totalValue: { $sum: "$negotiated_price" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return res.status(200).json({
      success: true,
      totalBuybacks,
      totalValue: totalValue[0]?.total || 0,
      stats,
      topBrands,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Buyback Status
exports.updateBuybackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Accepted", "Processed", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: Pending, Accepted, Processed, Rejected",
      });
    }

    const buyback = await Buyback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!buyback) {
      return res.status(404).json({
        success: false,
        message: "Buyback not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: buyback,
      message: `Buyback status updated to ${status}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};