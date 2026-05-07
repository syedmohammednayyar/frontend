const Sale = require("../models/Sale");
const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");

// Helper function to generate sale number
async function generateSaleNumber() {
  const count = await Sale.countDocuments();
  return `SALE-${String(count + 1).padStart(6, "0")}`;
}

exports.createSale = async (req, res) => {
  let session = null;
  let useTransaction = false;
  
  try {
    // Check if the connection supports transactions (needs replica set or sharded)
    // Sale.db is the Mongoose Connection object
    const client = Sale.db.getClient();
    const topologyType = client.topology?.description?.type || '';
    
    if (topologyType.includes('ReplicaSet') || topologyType === 'Sharded') {
      session = await Sale.startSession();
      session.startTransaction();
      useTransaction = true;
    } else {
      console.warn(`MongoDB transactions not supported on topology: ${topologyType}. Proceeding without transaction.`);
      session = null;
    }
  } catch (error) {
    console.warn("Error checking for transaction support or starting session:", error.message);
    session = null;
    useTransaction = false;
  }

  try {
    const { storeId, customerId, discountTotal, exchangeTotal, note, items, payments } = req.body;
    
    let subtotal = 0;
    const saleItems = [];

    // Process each item
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.store_id.toString() !== storeId.toString()) {
        throw new Error(`Product ${product.job_id} does not belong to this store`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.job_id}`);
      }

      const lineTotal = product.selling_price * item.quantity;
      subtotal += lineTotal;

      saleItems.push({
        product: item.productId,
        quantity: item.quantity,
        unit_price: product.selling_price,
        line_total: lineTotal,
      });

      // Update inventory directly on Product
      product.quantity -= item.quantity;
      await product.save({ session });

      // Log stock movement
      const movementData = {
        product_id: product._id,
        from_store: storeId,
        quantity: item.quantity,
        movement_type: "SALE",
        user_id: req.user.id,
        notes: `Sold in sale` 
      };

      if (session) {
        await StockMovement.create([movementData], { session });
      } else {
        await StockMovement.create(movementData);
      }
    }

    const grandTotal = subtotal - (discountTotal || 0) - (exchangeTotal || 0);
    const amountPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    const saleNo = await generateSaleNumber();
    const saleData = {
      sale_no: saleNo,
      store_id: storeId,
      customer_id: customerId || null,
      employee_id: req.user.id,
      subtotal,
      discount_total: discountTotal || 0,
      exchange_total: exchangeTotal || 0,
      grand_total: grandTotal,
      amount_paid: amountPaid,
      payment_status: amountPaid >= grandTotal ? "paid" : (amountPaid > 0 ? "partial" : "pending"),
      note: note || "",
      items: saleItems,
      payments: payments.map(p => ({
        payment_method: p.paymentMethod,
        amount: p.amount,
        notes: p.notes,
      })),
    };

    let sale;
    if (session) {
      const created = await Sale.create([saleData], { session });
      sale = created[0];
      await session.commitTransaction();
    } else {
      sale = await Sale.create(saleData);
    }
    
    const populatedSale = await Sale.findById(sale._id)
      .populate("items.product")
      .populate("customer_id")
      .populate("store_id");

    return res.status(201).json({
      success: true,
      sale: populatedSale,
      items: populatedSale.items,
      payments: populatedSale.payments,
      message: "Sale created successfully",
    });
  } catch (error) {
    if (session && useTransaction) {
      await session.abortTransaction();
    }
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

exports.listSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .select("id")
      .sort({ created_at: -1 });
    
    return res.status(200).json({
      success: true,
      rows: sales,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id)
      .populate("items.product")
      .populate("customer_id")
      .populate("store_id");
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    return res.status(200).json({
      success: true,
      sale,
      items: sale.items,
      payments: sale.payments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    
    if (req.body.customerId !== undefined) updates.customer_id = req.body.customerId;
    if (req.body.storeId !== undefined) updates.store_id = req.body.storeId;
    if (req.body.note !== undefined) updates.note = req.body.note;
    
    const sale = await Sale.findByIdAndUpdate(id, updates, { new: true });
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    const populatedSale = await Sale.findById(id)
      .populate("items.product")
      .populate("customer_id");

    return res.status(200).json({
      success: true,
      sale: populatedSale,
      items: populatedSale.items,
      payments: populatedSale.payments,
      message: "Sale updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByIdAndDelete(id);
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sale deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};