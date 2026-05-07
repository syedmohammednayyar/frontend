const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unit_price: {
    type: Number,
    required: true,
  },
  line_total: {
    type: Number,
    required: true,
  },
});

const paymentSchema = new mongoose.Schema({
  payment_method: {
    type: String,
    enum: ["cash", "card", "bank_transfer", "upi", "wallet"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
  reference_no: String,
  notes: String,
  paid_at: {
    type: Date,
    default: Date.now,
  },
});

const saleSchema = new mongoose.Schema({
  sale_no: {
    type: String,
    required: true,
    unique: true,
  },
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    default: null,
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  tax_total: {
    type: Number,
    default: 0,
  },
  discount_total: {
    type: Number,
    default: 0,
  },
  exchange_total: {
    type: Number,
    default: 0,
  },
  grand_total: {
    type: Number,
    required: true,
  },
  amount_paid: {
    type: Number,
    default: 0,
  },
  payment_status: {
    type: String,
    enum: ["pending", "partial", "paid"],
    default: "pending",
  },
  note: String,
  items: [saleItemSchema],
  payments: [paymentSchema],
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

module.exports = mongoose.model("Sale", saleSchema);