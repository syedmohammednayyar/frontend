const mongoose = require("mongoose");

const buybackSchema = new mongoose.Schema({
  imei: {
    type: String,
    required: true,
    unique: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  color: String,
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
  job_no: String,
  ic_number: String,
  cash_amount: {
    type: Number,
    default: 0,
  },
  online_amount: {
    type: Number,
    default: 0,
  },
  exchange_amount: {
    type: Number,
    default: 0,
  },
  exchange_model: String,
  condition: {
    type: String,
    enum: ["Excellent", "Good", "Fair", "Poor"],
    required: true,
  },
  market_value: {
    type: Number,
    required: true,
  },
  negotiated_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Processed", "Rejected"],
    default: "Pending",
  },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

module.exports = mongoose.model("Buyback", buybackSchema);