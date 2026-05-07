const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  job_id: { type: String, required: true, unique: true },
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  
  // GENERAL
  name: { type: String, required: true },
  brand: { type: String, default: "" },
  model: { type: String, default: "" },
  category: { type: String, default: "new_phone" },
  sku: { type: String, default: "" },
  barcode: { type: String, default: "" },

  // DEVICE DETAILS
  imei: { type: String, default: "" },
  serial_number: { type: String, default: "" },
  ram: { type: String, default: "" },
  storage: { type: String, default: "" },
  color: { type: String, default: "" },
  battery_health: { type: String, default: "" },
  condition: { type: String, default: "New" },
  warranty_status: { type: String, default: "None" },

  // PRICING
  purchase_price: { type: Number, default: 0 },
  selling_price: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  final_price: { type: Number, required: true },

  // STOCK
  quantity: { type: Number, default: 1 },
  stock_status: { type: String, default: "In Stock" },
  min_stock_alert: { type: Number, default: 0 },

  // ADDITIONAL
  supplier_name: { type: String, default: "" },
  purchase_date: { type: Date, default: Date.now },
  notes: { type: String, default: "" },
  images: [{ type: String }],
  
  active: { type: Boolean, default: true }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

// To optimize search by IMEI but allow multiple empty IMEIs:
productSchema.index({ imei: 1 }, { unique: true, partialFilterExpression: { imei: { $type: "string", $gt: "" } } });
// Fast store filtering
productSchema.index({ store_id: 1 });
productSchema.index({ job_id: 1 });

module.exports = mongoose.model("Product", productSchema);