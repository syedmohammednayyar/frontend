const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  store_type: {
    type: String,
    enum: ["main", "addon"],
    default: "main",
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    default: null,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

module.exports = mongoose.model("Store", storeSchema);