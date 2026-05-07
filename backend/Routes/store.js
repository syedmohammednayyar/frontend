const express = require("express");
const router = express.Router();
const { createStore, listStores, updateStore, deleteStore } = require("../controllers/Store");
const { auth, isAdmin, isManager } = require("../middleware/auth");

router.post("/create", auth, isAdmin, createStore);
router.get("/list", auth, listStores);
router.patch("/update/:id", auth, isManager, updateStore);
router.delete("/delete/:id", auth, isAdmin, deleteStore);

module.exports = router;