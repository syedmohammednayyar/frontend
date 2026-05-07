const Inventory = require("../models/Inventory");

exports.listInventory = async (req, res) => {
  try {
    const { store_id } = req.query;
    const filter = {};
    if (store_id) filter.store_id = store_id;

    const rows = await Inventory.find(filter)
      .populate("product_id")
      .populate("store_id");

    const formattedRows = rows.map(row => ({
      store_id: row.store_id._id,
      product_id: row.product_id._id,
      sku: row.product_id.sku,
      name: row.product_id.name,
      category: row.product_id.category,
      quantity: row.quantity,
      reserved_quantity: row.reserved_quantity,
      min_stock_level: row.min_stock_level,
      unit_price: row.unit_price,
      updated_at: row.updated_at,
    }));

    return res.status(200).json({
      success: true,
      rows: formattedRows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};