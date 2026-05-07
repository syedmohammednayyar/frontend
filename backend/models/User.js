const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        // ❌ Remove unique: true from here
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Manager", "Salesperson", "Sales", "Staff", "Technician", "Visitor", "Employee"],
        default: "Visitor",
    },
}, {
    timestamps: true
});

// ✅ Use only this for unique index
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);