const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    store_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      default: null,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    out_cash: {
      type: Number,
      default: 0,
      min: 0,
    },
    out_online: {
      type: Number,
      default: 0,
      min: 0,
    },
    expense_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Create indexes for better query performance
expenseSchema.index({ expense_date: -1 });
expenseSchema.index({ store_ref: 1 });
expenseSchema.index({ reason: 1 });

module.exports = mongoose.model("Expense", expenseSchema);