const express = require("express");
const router = express.Router();
const User = require("../models/User");

const {login,signup} = require("../controllers/Auth");
const {auth,isAdmin,isManager,isSalesperson} = require("../middleware/auth");

router.post("/login",login);
router.post("/signup", signup);

//testing protected routes for test
router.get("/test",auth,(req, res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to the protected route for test"
    })
})

//protected route
router.get("/manager",auth,isManager, (req, res)=>{
    res.json({
        success: true,
        message:"welcome to the protected routes for students",
    })
});

router.get("/admin",auth,isAdmin, (req, res)=>{
    res.json({
        success: true,
        message:"welcome to the protected routes for Admin",
    })
});

router.get("/salesperson",auth,isSalesperson, (req, res)=>{
    res.json({
        success: true,
        message:"welcome to the protected routes for Admin",
    })
});

module.exports = router;