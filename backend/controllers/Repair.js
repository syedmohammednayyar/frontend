const Repair = require("../models/Repair");
const Customer = require("../models/Customer");
const Store = require("../models/Store");

// Helper function to generate ticket number
async function generateTicketNumber() {
  const count = await Repair.countDocuments();
  const year = new Date().getFullYear();
  return `RPR-${year}-${String(count + 1).padStart(5, "0")}`;
}

// Create Repair Ticket
exports.createRepair = async (req, res) => {
  try {
    const {
      ticket_no,
      customer_name,
      customer,
      store_ref,
      device_model,
      problem,
      technician_name,
      status,
      parts,
      parts_charge,
      labor_cost,
      got_amount,
      in_cash,
      in_online,
      out_cash,
      out_online,
      warranty,
      estimated_completion,
      notes,
    } = req.body;

    // Generate ticket number if not provided
    const finalTicketNo = ticket_no || await generateTicketNumber();

    // Check if ticket number exists
    const existingRepair = await Repair.findOne({ ticket_no: finalTicketNo });
    if (existingRepair) {
      return res.status(400).json({
        success: false,
        message: "Ticket number already exists",
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

    // Calculate outstanding amount
    const totalCharge = (parseFloat(parts_charge) || 0) + (parseFloat(labor_cost) || 0);
    const totalPaid = (parseFloat(in_cash) || 0) + (parseFloat(in_online) || 0) + (parseFloat(got_amount) || 0);
    const outstandingAmount = totalCharge - totalPaid;
    
    // Determine payment status
    let paymentStatus = "pending";
    if (outstandingAmount <= 0) {
      paymentStatus = "paid";
    } else if (totalPaid > 0) {
      paymentStatus = "partial";
    }

    // Create repair ticket
    const repair = await Repair.create({
      ticket_no: finalTicketNo,
      customer_name,
      customer: customer || null,
      store_ref: store_ref || null,
      device_model,
      problem: problem || "",
      technician_name,
      status: status || "Pending",
      parts: parts || [],
      parts_charge: parseFloat(parts_charge) || 0,
      labor_cost: parseFloat(labor_cost) || 0,
      got_amount: parseFloat(got_amount) || 0,
      in_cash: parseFloat(in_cash) || 0,
      in_online: parseFloat(in_online) || 0,
      out_cash: parseFloat(out_cash) || 0,
      out_online: parseFloat(out_online) || 0,
      warranty: warranty || "3 months",
      estimated_completion: estimated_completion || null,
      notes: notes || "",
      payment_status: paymentStatus,
      outstanding_amount: outstandingAmount > 0 ? outstandingAmount : 0,
    });

    return res.status(201).json({
      success: true,
      data: repair,
      message: "Repair ticket created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// List all Repair Tickets
exports.listRepairs = async (req, res) => {
  try {
    const { storeId, status, customerId, fromDate, toDate, technician } = req.query;
    let filter = {};

    if (storeId) {
      filter.store_ref = storeId;
    }

    if (status) {
      filter.status = status;
    }

    if (customerId) {
      filter.customer = customerId;
    }

    if (technician) {
      filter.technician_name = { $regex: technician, $options: "i" };
    }

    if (fromDate && toDate) {
      filter.created_at = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    const repairs = await Repair.find(filter)
      .populate("customer", "name email phone")
      .populate("store_ref", "name code")
      .sort({ created_at: -1 });

    const rows = repairs.map(repair => ({
      id: repair._id,
      ticket_no: repair.ticket_no,
      customer_name: repair.customer_name,
      customer: repair.customer?._id || repair.customer,
      customer_email: repair.customer?.email,
      customer_phone: repair.customer?.phone,
      store_ref: repair.store_ref?._id || repair.store_ref,
      store_name: repair.store_ref?.name,
      device_model: repair.device_model,
      problem: repair.problem,
      technician_name: repair.technician_name,
      status: repair.status,
      parts: repair.parts,
      parts_charge: repair.parts_charge,
      labor_cost: repair.labor_cost,
      total_charge: repair.parts_charge + repair.labor_cost,
      got_amount: repair.got_amount,
      in_cash: repair.in_cash,
      in_online: repair.in_online,
      out_cash: repair.out_cash,
      out_online: repair.out_online,
      total_paid: repair.in_cash + repair.in_online + repair.got_amount,
      warranty: repair.warranty,
      estimated_completion: repair.estimated_completion,
      notes: repair.notes,
      payment_status: repair.payment_status,
      outstanding_amount: repair.outstanding_amount,
      created_at: repair.created_at,
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

// Get Single Repair Ticket
exports.getRepair = async (req, res) => {
  try {
    const { id } = req.params;

    const repair = await Repair.findById(id)
      .populate("customer", "name email phone")
      .populate("store_ref", "name code");

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: repair,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Repair Ticket
exports.updateRepair = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if repair exists
    const repair = await Repair.findById(id);
    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair ticket not found",
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

    // Recalculate outstanding amount if financial fields are updated
    if (updates.parts_charge !== undefined || 
        updates.labor_cost !== undefined || 
        updates.in_cash !== undefined || 
        updates.in_online !== undefined ||
        updates.got_amount !== undefined) {
      
      const partsCharge = updates.parts_charge !== undefined ? parseFloat(updates.parts_charge) : repair.parts_charge;
      const laborCost = updates.labor_cost !== undefined ? parseFloat(updates.labor_cost) : repair.labor_cost;
      const inCash = updates.in_cash !== undefined ? parseFloat(updates.in_cash) : repair.in_cash;
      const inOnline = updates.in_online !== undefined ? parseFloat(updates.in_online) : repair.in_online;
      const gotAmount = updates.got_amount !== undefined ? parseFloat(updates.got_amount) : repair.got_amount;
      
      const totalCharge = partsCharge + laborCost;
      const totalPaid = inCash + inOnline + gotAmount;
      const outstandingAmount = totalCharge - totalPaid;
      
      updates.outstanding_amount = outstandingAmount > 0 ? outstandingAmount : 0;
      
      // Update payment status
      if (outstandingAmount <= 0) {
        updates.payment_status = "paid";
      } else if (totalPaid > 0) {
        updates.payment_status = "partial";
      } else {
        updates.payment_status = "pending";
      }
    }

    const updatedRepair = await Repair.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedRepair,
      message: "Repair ticket updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete Repair Ticket
exports.deleteRepair = async (req, res) => {
  try {
    const { id } = req.params;

    const repair = await Repair.findByIdAndDelete(id);

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Repair ticket deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Repair Status
exports.updateRepairStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "In Progress", "Completed", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: Pending, In Progress, Completed, Delivered, Cancelled",
      });
    }

    const repair = await Repair.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: repair,
      message: `Repair status updated to ${status}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Add Part to Repair
exports.addPart = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, qty, unitCost, status } = req.body;

    const repair = await Repair.findById(id);
    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair ticket not found",
      });
    }

    // Add new part
    repair.parts.push({
      name,
      qty: parseInt(qty),
      unitCost: parseFloat(unitCost),
      status: status || "Pending",
    });

    // Recalculate parts charge
    repair.parts_charge = repair.parts.reduce((sum, part) => sum + (part.qty * part.unitCost), 0);
    
    // Recalculate outstanding amount
    const totalCharge = repair.parts_charge + repair.labor_cost;
    const totalPaid = repair.in_cash + repair.in_online + repair.got_amount;
    const outstandingAmount = totalCharge - totalPaid;
    
    repair.outstanding_amount = outstandingAmount > 0 ? outstandingAmount : 0;
    
    // Update payment status
    if (outstandingAmount <= 0) {
      repair.payment_status = "paid";
    } else if (totalPaid > 0) {
      repair.payment_status = "partial";
    }

    await repair.save();

    return res.status(200).json({
      success: true,
      data: repair,
      message: "Part added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Part Status
exports.updatePartStatus = async (req, res) => {
  try {
    const { id, partId } = req.params;
    const { status } = req.body;

    const repair = await Repair.findById(id);
    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair ticket not found",
      });
    }

    const part = repair.parts.id(partId);
    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    part.status = status;
    await repair.save();

    return res.status(200).json({
      success: true,
      data: repair,
      message: "Part status updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Make Payment on Repair
exports.makePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, notes } = req.body;

    const repair = await Repair.findById(id);
    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair ticket not found",
      });
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0",
      });
    }

    // Update payment based on method
    if (paymentMethod === "cash") {
      repair.in_cash += paymentAmount;
    } else if (paymentMethod === "online") {
      repair.in_online += paymentAmount;
    } else {
      repair.got_amount += paymentAmount;
    }

    // Recalculate totals
    const totalPaid = repair.in_cash + repair.in_online + repair.got_amount;
    const totalCharge = repair.parts_charge + repair.labor_cost;
    const outstandingAmount = totalCharge - totalPaid;
    
    repair.outstanding_amount = outstandingAmount > 0 ? outstandingAmount : 0;
    
    // Update payment status
    if (outstandingAmount <= 0) {
      repair.payment_status = "paid";
    } else if (totalPaid > 0) {
      repair.payment_status = "partial";
    }

    await repair.save();

    return res.status(200).json({
      success: true,
      data: repair,
      message: `Payment of ${paymentAmount} received via ${paymentMethod}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Repair Statistics
exports.getRepairStats = async (req, res) => {
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

    const stats = await Repair.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalPartsCharge: { $sum: "$parts_charge" },
          totalLaborCost: { $sum: "$labor_cost" },
          totalReceived: { $sum: { $add: ["$in_cash", "$in_online", "$got_amount"] } },
          totalOutstanding: { $sum: "$outstanding_amount" },
        },
      },
    ]);

    const totalRepairs = await Repair.countDocuments(filter);
    const totalRevenue = await Repair.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ["$in_cash", "$in_online", "$got_amount"] } },
        },
      },
    ]);

    const topTechnicians = await Repair.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$technician_name",
          count: { $sum: 1 },
          totalValue: { $sum: { $add: ["$parts_charge", "$labor_cost"] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const averageCompletionTime = await Repair.aggregate([
      { 
        $match: { 
          ...filter,
          status: "Completed",
          estimated_completion: { $exists: true }
        } 
      },
      {
        $project: {
          timeDiff: {
            $dateDiff: {
              startDate: "$created_at",
              endDate: "$estimated_completion",
              unit: "day"
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          avgDays: { $avg: "$timeDiff" }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      totalRepairs,
      totalRevenue: totalRevenue[0]?.total || 0,
      stats,
      topTechnicians,
      averageCompletionDays: averageCompletionTime[0]?.avgDays || 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};