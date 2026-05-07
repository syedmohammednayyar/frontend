const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Manager", "Salesman", "Technician", "Staff"],
    required: true,
  },
  store: {
    type: String,
    required: true,
  },
  store_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    default: null,
  },
  login_username: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  sales_count: {
    type: Number,
    default: 0,
  },
  join_date: {
    type: Date,
    default: null,
  },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

module.exports = mongoose.model("Employee", employeeSchema);