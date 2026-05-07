const Store = require("../models/Store");

// Create Store
exports.createStore = async (req, res) => {
    try {
        console.log("📥 Create Store Request:", req.body);
        
        const { name, code, store_type, parent, is_active } = req.body;
        
        // ✅ FIX: Proper validation
        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "Store name and code are required"
            });
        }
        
        // Check if store with same code exists
        const existingStore = await Store.findOne({ code });
        if (existingStore) {
            return res.status(400).json({
                success: false,
                message: "Store with this code already exists"
            });
        }
        
        // Create store
        const store = await Store.create({
            name,
            code,
            store_type: store_type || "main",
            parent: parent || null,
            is_active: is_active !== undefined ? is_active : true
        });
        
        console.log("✅ Store created:", store.code);
        
        return res.status(201).json({
            success: true,
            data: store,
            message: "Store created successfully"
        });
        
    } catch (error) {
        console.error("❌ Create Store Error:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Store code already exists"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// List all Stores
exports.listStores = async (req, res) => {
    try {
        const stores = await Store.find().sort({ created_at: -1 });
        
        return res.status(200).json({
            success: true,
            rows: stores
        });
        
    } catch (error) {
        console.error("❌ List Stores Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get Single Store
exports.getStore = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findById(id);
        
        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            data: store
        });
        
    } catch (error) {
        console.error("❌ Get Store Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update Store
exports.updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const store = await Store.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );
        
        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            data: store,
            message: "Store updated successfully"
        });
        
    } catch (error) {
        console.error("❌ Update Store Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete Store
exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findByIdAndDelete(id);
        
        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Store deleted successfully"
        });
        
    } catch (error) {
        console.error("❌ Delete Store Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};