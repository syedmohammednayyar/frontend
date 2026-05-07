const mongoose = require("mongoose");

const paymentEntrySchema = new mongoose.Schema({
  store_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    default: null,
  },
  entry_type: {
    type: String,
    enum: ["in", "out"],
    required: true,
  },
  dealer_name: {
    type: String,
    required: true,
  },
  cash_amount: {
    type: Number,
    default: 0,
  },
  online_amount: {
    type: Number,
    default: 0,
  },
  payment_status: {
    type: String,
    enum: ["pending", "partial", "paid"],
    default: "paid",
  },
  outstanding_amount: {
    type: Number,
    default: 0,
  },
  entry_date: {
    type: Date,
    required: true,
  },
  source_type: String,
  source_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  notes: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

module.exports = mongoose.model("PaymentEntry", paymentEntrySchema);