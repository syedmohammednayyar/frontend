const PaymentEntry = require("../models/Payment");
const Store = require("../models/Store");
const Sale = require("../models/Sale");
const Repair = require("../models/Repair");

// Create Payment Entry
exports.createPaymentEntry = async (req, res) => {
  try {
    const {
      store_ref,
      entry_type,
      dealer_name,
      cash_amount,
      online_amount,
      payment_status,
      outstanding_amount,
      entry_date,
      source_type,
      source_id,
      notes,
    } = req.body;

    // Validate required fields
    if (!entry_type || !dealer_name || !entry_date) {
      return res.status(400).json({
        success: false,
        message: "entry_type, dealer_name, and entry_date are required",
      });
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

    // Validate source if provided
    if (source_id && source_type) {
      if (source_type === "sale") {
        const sale = await Sale.findById(source_id);
        if (!sale) {
          return res.status(404).json({
            success: false,
            message: "Sale not found",
          });
        }
      } else if (source_type === "repair") {
        const repair = await Repair.findById(source_id);
        if (!repair) {
          return res.status(404).json({
            success: false,
            message: "Repair not found",
          });
        }
      }
    }

    // Calculate total amount
    const totalAmount = (parseFloat(cash_amount) || 0) + (parseFloat(online_amount) || 0);
    
    // Determine payment status if not provided
    let finalPaymentStatus = payment_status;
    if (!finalPaymentStatus) {
      if (totalAmount > 0) {
        finalPaymentStatus = "paid";
      } else {
        finalPaymentStatus = "pending";
      }
    }

    // Create payment entry
    const paymentEntry = await PaymentEntry.create({
      store_ref: store_ref || null,
      entry_type,
      dealer_name,
      cash_amount: parseFloat(cash_amount) || 0,
      online_amount: parseFloat(online_amount) || 0,
      payment_status: finalPaymentStatus,
      outstanding_amount: parseFloat(outstanding_amount) || 0,
      entry_date: new Date(entry_date),
      source_type: source_type || null,
      source_id: source_id || null,
      notes: notes || "",
    });

    // Update source document if applicable
    if (source_id && source_type === "sale") {
      const sale = await Sale.findById(source_id);
      if (sale) {
        const totalPaid = (sale.amount_paid || 0) + totalAmount;
        sale.amount_paid = totalPaid;
        
        if (totalPaid >= sale.grand_total) {
          sale.payment_status = "paid";
        } else if (totalPaid > 0) {
          sale.payment_status = "partial";
        }
        
        await sale.save();
      }
    } else if (source_id && source_type === "repair") {
      const repair = await Repair.findById(source_id);
      if (repair) {
        const totalPaid = (repair.in_cash || 0) + (repair.in_online || 0) + (repair.got_amount || 0) + totalAmount;
        const totalCharge = (repair.parts_charge || 0) + (repair.labor_cost || 0);
        const newOutstanding = totalCharge - totalPaid;
        
        repair.outstanding_amount = newOutstanding > 0 ? newOutstanding : 0;
        
        if (newOutstanding <= 0) {
          repair.payment_status = "paid";
        } else if (totalPaid > 0) {
          repair.payment_status = "partial";
        }
        
        await repair.save();
      }
    }

    return res.status(201).json({
      success: true,
      data: paymentEntry,
      message: "Payment entry created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// List all Payment Entries
exports.listPaymentEntries = async (req, res) => {
  try {
    const { 
      storeId, 
      entryType, 
      paymentStatus,
      fromDate, 
      toDate,
      sourceType,
      dealerName 
    } = req.query;
    
    let filter = {};

    if (storeId) {
      filter.store_ref = storeId;
    }

    if (entryType) {
      filter.entry_type = entryType;
    }

    if (paymentStatus) {
      filter.payment_status = paymentStatus;
    }

    if (sourceType) {
      filter.source_type = sourceType;
    }

    if (dealerName) {
      filter.dealer_name = { $regex: dealerName, $options: "i" };
    }

    if (fromDate && toDate) {
      filter.entry_date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    const payments = await PaymentEntry.find(filter)
      .populate("store_ref", "name code")
      .populate("source_id")
      .sort({ entry_date: -1 });

    const rows = payments.map(payment => ({
      id: payment._id,
      store_ref: payment.store_ref?._id || payment.store_ref,
      store_name: payment.store_ref?.name || "N/A",
      entry_type: payment.entry_type,
      dealer_name: payment.dealer_name,
      cash_amount: payment.cash_amount,
      online_amount: payment.online_amount,
      total_amount: payment.cash_amount + payment.online_amount,
      payment_status: payment.payment_status,
      outstanding_amount: payment.outstanding_amount,
      entry_date: payment.entry_date,
      source_type: payment.source_type,
      source_id: payment.source_id,
      source_reference: payment.source_type === "sale" ? payment.source_id?.sale_no : 
                       payment.source_type === "repair" ? payment.source_id?.ticket_no : null,
      notes: payment.notes,
      created_at: payment.created_at,
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

// Get Single Payment Entry
exports.getPaymentEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await PaymentEntry.findById(id)
      .populate("store_ref", "name code")
      .populate("source_id");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Payment Entry
exports.updatePaymentEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if payment exists
    const payment = await PaymentEntry.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment entry not found",
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

    // Validate source if being updated
    if (updates.source_id && updates.source_type) {
      if (updates.source_type === "sale") {
        const sale = await Sale.findById(updates.source_id);
        if (!sale) {
          return res.status(404).json({
            success: false,
            message: "Sale not found",
          });
        }
      } else if (updates.source_type === "repair") {
        const repair = await Repair.findById(updates.source_id);
        if (!repair) {
          return res.status(404).json({
            success: false,
            message: "Repair not found",
          });
        }
      }
    }

    // Recalculate total if amounts are updated
    if (updates.cash_amount !== undefined || updates.online_amount !== undefined) {
      const cashAmount = updates.cash_amount !== undefined ? parseFloat(updates.cash_amount) : payment.cash_amount;
      const onlineAmount = updates.online_amount !== undefined ? parseFloat(updates.online_amount) : payment.online_amount;
      const totalAmount = cashAmount + onlineAmount;
      
      if (totalAmount > 0 && !updates.payment_status) {
        updates.payment_status = "paid";
      }
    }

    const updatedPayment = await PaymentEntry.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedPayment,
      message: "Payment entry updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete Payment Entry
exports.deletePaymentEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await PaymentEntry.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment entry deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Outstanding Balances
exports.getOutstandingBalances = async (req, res) => {
  try {
    const { storeId } = req.query;
    let filter = {};

    if (storeId) {
      filter.store_ref = storeId;
    }

    // Get outstanding sales
    const outstandingSales = await Sale.find({
      ...filter,
      payment_status: { $in: ["pending", "partial"] },
    })
      .populate("customer_id", "name email phone")
      .populate("store_ref", "name code");

    const salesOutstanding = outstandingSales.map(sale => ({
      source_type: "sale",
      source_id: sale._id,
      store_ref: sale.store_ref?._id || sale.store_ref,
      store_name: sale.store_ref?.name || "N/A",
      party_name: sale.customer_id?.name || "Walk-in Customer",
      reference_no: sale.sale_no,
      total_amount: sale.grand_total,
      paid_amount: sale.amount_paid,
      outstanding_amount: sale.grand_total - sale.amount_paid,
      payment_status: sale.payment_status,
      created_at: sale.created_at,
    }));

    // Get outstanding repairs
    const outstandingRepairs = await Repair.find({
      ...filter,
      payment_status: { $in: ["pending", "partial"] },
    })
      .populate("customer", "name email phone")
      .populate("store_ref", "name code");

    const repairsOutstanding = outstandingRepairs.map(repair => ({
      source_type: "repair",
      source_id: repair._id,
      store_ref: repair.store_ref?._id || repair.store_ref,
      store_name: repair.store_ref?.name || "N/A",
      party_name: repair.customer?.name || repair.customer_name,
      reference_no: repair.ticket_no,
      total_amount: (repair.parts_charge || 0) + (repair.labor_cost || 0),
      paid_amount: (repair.in_cash || 0) + (repair.in_online || 0) + (repair.got_amount || 0),
      outstanding_amount: repair.outstanding_amount || 0,
      payment_status: repair.payment_status,
      created_at: repair.created_at,
    }));

    const allOutstanding = [...salesOutstanding, ...repairsOutstanding];
    
    // Sort by created date
    allOutstanding.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const totalOutstanding = allOutstanding.reduce((sum, item) => sum + item.outstanding_amount, 0);

    return res.status(200).json({
      success: true,
      rows: allOutstanding,
      total_outstanding: totalOutstanding,
      count: allOutstanding.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Payment Statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const { storeId, fromDate, toDate } = req.query;
    let filter = {};

    if (storeId) {
      filter.store_ref = storeId;
    }

    if (fromDate && toDate) {
      filter.entry_date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    // Get payment summary by entry type
    const summary = await PaymentEntry.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$entry_type",
          totalCash: { $sum: "$cash_amount" },
          totalOnline: { $sum: "$online_amount" },
          totalAmount: { $sum: { $add: ["$cash_amount", "$online_amount"] } },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get payments by source type
    const bySourceType = await PaymentEntry.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$source_type",
          totalAmount: { $sum: { $add: ["$cash_amount", "$online_amount"] } },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get payments by status
    const byStatus = await PaymentEntry.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$payment_status",
          totalAmount: { $sum: { $add: ["$cash_amount", "$online_amount"] } },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get daily payment trend
    const dailyTrend = await PaymentEntry.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$entry_date" } },
            type: "$entry_type",
          },
          totalAmount: { $sum: { $add: ["$cash_amount", "$online_amount"] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": -1 } },
      { $limit: 30 },
    ]);

    // Get top dealers
    const topDealers = await PaymentEntry.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$dealer_name",
          totalAmount: { $sum: { $add: ["$cash_amount", "$online_amount"] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 },
    ]);

    // Calculate totals
    const incomingSummary = summary.find(s => s._id === "in") || { totalAmount: 0, count: 0 };
    const outgoingSummary = summary.find(s => s._id === "out") || { totalAmount: 0, count: 0 };

    return res.status(200).json({
      success: true,
      summary: {
        incoming: {
          total: incomingSummary.totalAmount,
          count: incomingSummary.count,
          totalCash: incomingSummary.totalCash || 0,
          totalOnline: incomingSummary.totalOnline || 0,
        },
        outgoing: {
          total: outgoingSummary.totalAmount,
          count: outgoingSummary.count,
          totalCash: outgoingSummary.totalCash || 0,
          totalOnline: outgoingSummary.totalOnline || 0,
        },
        netCashFlow: (incomingSummary.totalAmount || 0) - (outgoingSummary.totalAmount || 0),
      },
      bySourceType,
      byStatus,
      dailyTrend,
      topDealers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};