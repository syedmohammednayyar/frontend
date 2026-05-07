const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");

const generateJobId = async () => {
  const lastProduct = await Product.findOne({ job_id: { $regex: /^JOB-/ } }).sort({ created_at: -1 });
  if (!lastProduct || !lastProduct.job_id) {
    return 'JOB-10001';
  }
  const lastId = parseInt(lastProduct.job_id.split('-')[1]);
  if (isNaN(lastId)) return `JOB-${Math.floor(10000 + Math.random() * 90000)}`;
  return `JOB-${lastId + 1}`;
};

exports.createProduct = async (req, res) => {
  try {
    const { 
      store_id, name, brand, model, category, sku, barcode,
      imei, serial_number, ram, storage, color, battery_health, condition, warranty_status,
      purchase_price, selling_price, tax, discount, final_price,
      quantity, stock_status, min_stock_alert,
      supplier_name, purchase_date, notes, images, active 
    } = req.body;
    
    if (!store_id) {
      return res.status(400).json({ success: false, message: "Store ID is required" });
    }

    // Check IMEI uniqueness if provided
    if (imei) {
      const existingImei = await Product.findOne({ imei });
      if (existingImei) {
        return res.status(400).json({ success: false, message: "IMEI already exists" });
      }
    }

    const job_id = await generateJobId();

    const product = await Product.create({
      job_id,
      store_id,
      name,
      brand,
      model,
      category,
      sku,
      barcode,
      imei,
      serial_number,
      ram,
      storage,
      color,
      battery_health,
      condition,
      warranty_status,
      purchase_price: purchase_price || 0,
      selling_price: selling_price || 0,
      tax: tax || 0,
      discount: discount || 0,
      final_price: final_price || selling_price || 0,
      quantity: quantity !== undefined ? quantity : 1,
      stock_status: stock_status || "In Stock",
      min_stock_alert: min_stock_alert || 0,
      supplier_name,
      purchase_date,
      notes,
      images,
      active: active !== undefined ? active : true,
    });

    // Log stock movement
    await StockMovement.create({
      product_id: product._id,
      to_store: store_id,
      quantity: product.quantity,
      movement_type: "PURCHASE",
      user_id: req.user.id, // Assuming req.user is set by auth middleware
      notes: "Initial product creation"
    });

    return res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const { storeId, search } = req.query;
    
    const filter = { active: true };
    if (storeId) {
      filter.store_id = storeId;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { job_id: { $regex: search, $options: "i" } },
        { imei: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } }
      ];
    }
    
    const products = await Product.find(filter)
      .populate("store_id", "name code")
      .sort({ created_at: -1 });
    
    return res.status(200).json({
      success: true,
      rows: products, // Return as rows to match frontend expectation
    });
  } catch (error) {
    console.error("Error listing products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check IMEI uniqueness if it's being updated
    if (updates.imei) {
      const existingImei = await Product.findOne({ imei: updates.imei, _id: { $ne: id } });
      if (existingImei) {
        return res.status(400).json({ success: false, message: "IMEI already exists" });
      }
    }
    
    const product = await Product.findByIdAndUpdate(id, updates, { 
      new: true, 
      runValidators: true 
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.transferProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { target_store_id } = req.body;

    if (!target_store_id) {
      return res.status(400).json({ success: false, message: "Target store ID is required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const source_store_id = product.store_id;

    if (source_store_id.toString() === target_store_id) {
      return res.status(400).json({ success: false, message: "Product is already in the target store" });
    }

    product.store_id = target_store_id;
    await product.save();

    await StockMovement.create({
      product_id: product._id,
      from_store: source_store_id,
      to_store: target_store_id,
      quantity: product.quantity,
      movement_type: "TRANSFER",
      user_id: req.user.id,
      notes: "Store transfer"
    });

    return res.status(200).json({
      success: true,
      message: "Product transferred successfully",
      data: product
    });

  } catch (error) {
    console.error("Error transferring product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};