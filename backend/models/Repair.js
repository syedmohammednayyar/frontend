const mongoose = require("mongoose");

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  unitCost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Purchased"],
    default: "Pending",
  },
});

const repairSchema = new mongoose.Schema({
  ticket_no: {
    type: String,
    required: true,
    unique: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    default: null,
  },
  store_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    default: null,
  },
  device_model: {
    type: String,
    required: true,
  },
  problem: String,
  technician_name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Delivered", "Cancelled"],
    default: "Pending",
  },
  parts: [partSchema],
  parts_charge: {
    type: Number,
    default: 0,
  },
  labor_cost: {
    type: Number,
    default: 0,
  },
  got_amount: {
    type: Number,
    default: 0,
  },
  in_cash: {
    type: Number,
    default: 0,
  },
  in_online: {
    type: Number,
    default: 0,
  },
  out_cash: {
    type: Number,
    default: 0,
  },
  out_online: {
    type: Number,
    default: 0,
  },
  warranty: {
    type: String,
    enum: ["3 months", "6 months", "12 months"],
    default: "3 months",
  },
  estimated_completion: Date,
  notes: String,
  payment_status: {
    type: String,
    enum: ["pending", "partial", "paid"],
    default: "pending",
  },
  outstanding_amount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

module.exports = mongoose.model("Repair", repairSchema);