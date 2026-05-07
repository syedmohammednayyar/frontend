const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  from_store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  to_store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  quantity: { type: Number, required: true },
  movement_type: { type: String, enum: ["TRANSFER", "SALE", "ADJUSTMENT", "PURCHASE", "RETURN"], required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  notes: { type: String, default: "" }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model("StockMovement", stockMovementSchema);