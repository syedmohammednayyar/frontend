const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  reserved_quantity: {
    type: Number,
    default: 0,
  },
  min_stock_level: {
    type: Number,
    default: 0,
  },
  unit_price: {
    type: Number,
    required: true,
  },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

inventorySchema.index({ store_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model("Inventory", inventorySchema);