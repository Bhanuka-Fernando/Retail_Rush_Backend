const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User_Profile = require("../models/profileSchema");
const Items = require("../models/itemSchema");


console.log("dfdfdfdf")
router.post("/Main_login", async (req, res) => {
    const { username_log, password_log } = req.body;

    try {
        // Find user by username
        const user = await User_Profile.findOne({ name: username_log });

        if (!user) {
            return res.status(404).send({ message: "Username does not exist", success: false });
        }

        // Compare 
        console.log(user)
        console.log("USer Name",user.name);
        console.log("USer PW",user.pass);
        const isMatch = password_log === user.pass;

        if (!isMatch) {
            return res.status(401).send({ message: "Password is incorrect", success: false });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).send({ message: "Login Successful", success: true, data: token });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error logging in", success: false, error: error.message });
    }
});




module.exports =router;