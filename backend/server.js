const express = require("express");

const app = express();
require('dotenv').config();
require("./config/database").connect();
const PORT = process.env.PORT || 4000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

// Route imports
const user = require("./Routes/user");
const store = require("./Routes/store");
const customer = require("./Routes/customer");
const employee = require("./Routes/employee");
const product = require("./Routes/product");
const inventory = require("./Routes/inventory");
const sale = require("./Routes/sale");
const buyback = require("./Routes/buyback");
const repair = require("./Routes/repair");
const expense = require("./Routes/expense");
const payment = require("./Routes/payment");
const report = require("./Routes/report");

// Mount routes
app.use("/api/v1/auth", user);
app.use("/api/v1/store", store);
app.use("/api/v1/customer", customer);
app.use("/api/v1/employee", employee);
app.use("/api/v1/product", product);
app.use("/api/v1/inventory", inventory);
app.use("/api/v1/sale", sale);
app.use("/api/v1/buyback", buyback);
app.use("/api/v1/repair", repair);
app.use("/api/v1/expense", expense);
app.use("/api/v1/payment", payment);
app.use("/api/v1/report", report);

// Basic test route
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Quality Mobiles API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      stores: "/api/v1/store",
      customers: "/api/v1/customer",
      employees: "/api/v1/employee",
      products: "/api/v1/product",
      inventory: "/api/v1/inventory",
      sales: "/api/v1/sale",
      buybacks: "/api/v1/buyback",
      repairs: "/api/v1/repair",
      expenses: "/api/v1/expense",
      payments: "/api/v1/payment",
      reports: "/api/v1/report",
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(` API Base URL: http://localhost:${PORT}/api/v1`);
});