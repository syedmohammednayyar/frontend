// const bcrypt = require("bcrypt");

// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();


//signup route handler
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        console.log("📥 Signup request:", req.body);
        
        const { name, email, password, role } = req.body;
        
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }
        
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();
        
        // ✅ ONLY check email - NO username check
        const existingUser = await User.findOne({ email: normalizedEmail });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: role || "Visitor"
        });
        
        console.log("✅ User created:", user.email);
        
        // Return success response
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.createdAt
            }
        });

    } catch (error) {
        console.error("❌ Signup Error:", error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }
        
        return res.status(500).json({
            success: false,
            message: error.message || "Registration failed"
        });
    }
};

//login
exports.login = async (req, res) => {
    try{
        //data fetch
        let {email, password} = req.body;
        //validation on email password
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill all the details",
            })
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        //check for register user
        const user = await User.findOne({email: normalizedEmail});

    // not a register user
    if(!user){
        return res.status(401).json({
            success: false,
            message: "User is not registered",
        })
    }

    const payload = {
        email:user.email,
        id:user._id,
        role:user.role,
    }
    //verify password and generate jwt token
    if(await bcrypt.compare(password,user.password)){
  //password match
  let token = jwt.sign(payload,
            process.env.JWT_SECRET,
            {
                expiresIn:"2h",
            }
        );
        // user = user.toObject();
         user.token = token;
        user.password = undefined;
    const options = {
      expires: new Date(Date.now() + 3 * 24 *60 *60*1000),
      httpOnly: true,
    }
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message:"User Logged in successfully",
        })

    }
     else{
        //password do not match
        return res.status(401).json({
            success:false,
            message:"Password Incorrect",
        });
     }
    }
    catch(error){
    console.log(error);
    res.status(500).json({
        success: false,
        message:"Internall server error",

    })
    }
}