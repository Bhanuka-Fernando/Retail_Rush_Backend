const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User_Profile = require("../models/profileSchema");
const Items = require("../models/itemSchema");
const Store_Profile = require('../models/storeSchema');

const authmiddleware = require('../middleware/AuthMiddleware');


console.log("dfdfdfdf")
router.post("/Main_login", async (req, res) => {
    const { username_log, password_log } = req.body;

    try {
        // Find user by username
        const user = await User_Profile.findOne({ name: username_log });

        if (!user) {

            const store = await Store_Profile.findOne({name:username_log});
            console.log("store log in",store);
            const isMatch = await bcrypt.compare(password_log,store.password);
            if (!isMatch) {
              return res.status(401).send({ message: "Password is incorrect", success: false });
          }else{

            const token = jwt.sign({ id: store._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            const isStore = true

            res.status(200).send({ message: "Login Successful", success: true, data: token, email:store.storeId,name:store.name,store:isStore });

          }

           

          

            if(!store){

              return res.status(404).send({ message: "Username does not exist", success: false });

            }
        }else{

          // Compare 
        console.log(user)
        console.log("USer Name",user.name);
        console.log("USer PW",user.password);
        //const isMatch = password_log === user.pass;

        const isMatch = await bcrypt.compare(password_log,user.password);

        if (!isMatch) {
            return res.status(401).send({ message: "Password is incorrect", success: false });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).send({ message: "Login Successful", success: true, data: token, email:user.email,name:user.name });


        }

        
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error logging in", success: false, error: error.message });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User_Profile.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User_Profile({
        name,
        email,
        password: hashedPassword
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: 'Error registering user' });
    }
  });

  router.get("/getUserDetails", authmiddleware, async (req, res) => {
    console.log("getuserdetails")
    try {
      // The userID is set by the auth middleware
      const userID = req.body.userID;
  
      // Find user by ID
      const user = await User_Profile.findById(userID).select("-pass"); // Exclude password from response
  
      if (!user) {
        return res
          .status(404)
          .send({ message: "User not found", success: false });
      }
      
  
      res.status(200).send({
        message: "User details fetched successfully",
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error fetching user details",
        success: false,
        error: error.message,
      });
    }
  });




module.exports =router;