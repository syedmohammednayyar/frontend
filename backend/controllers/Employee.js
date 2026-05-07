const Employee = require("../models/Employee");
const Store = require("../models/Store");

// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const { 
      name, 
      role, 
      store, 
      store_ref, 
      login_username, 
      email, 
      phone, 
      sales_count, 
      join_date 
    } = req.body;

    // Check if employee with same email exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exists",
      });
    }

    // Check if username is unique (if provided)
    if (login_username) {
      const existingUsername = await Employee.findOne({ login_username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    // Create employee
    const employee = await Employee.create({
      name,
      role,
      store,
      store_ref: store_ref || null,
      login_username: login_username || null,
      email,
      phone,
      sales_count: sales_count || 0,
      join_date: join_date || null,
    });

    return res.status(201).json({
      success: true,
      data: employee,
      message: "Employee created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// List all Employees
exports.listEmployees = async (req, res) => {
  try {
    const { storeId } = req.query;
    let filter = {};
    
    if (storeId) {
      filter.store_ref = storeId;
    }

    const employees = await Employee.find(filter)
      .populate("store_ref", "name code")
      .sort({ created_at: -1 });

    const rows = employees.map(emp => ({
      id: emp._id,
      name: emp.name,
      role: emp.role,
      store: emp.store,
      store_ref: emp.store_ref?._id || emp.store_ref,
      login_username: emp.login_username,
      email: emp.email,
      phone: emp.phone,
      sales_count: emp.sales_count,
      join_date: emp.join_date,
      created_at: emp.created_at,
    }));

    return res.status(200).json({
      success: true,
      rows: rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Single Employee
exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findById(id)
      .populate("store_ref", "name code");
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check if employee exists
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Check email uniqueness if being updated
    if (updates.email && updates.email !== employee.email) {
      const existingEmployee = await Employee.findOne({ email: updates.email });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message: "Employee with this email already exists",
        });
      }
    }

    // Check username uniqueness if being updated
    if (updates.login_username && updates.login_username !== employee.login_username) {
      const existingUsername = await Employee.findOne({ login_username: updates.login_username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedEmployee,
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findByIdAndDelete(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};