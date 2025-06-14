const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const { auth } = require("../Middlewares/auth");
const express = require("express");
const bcrypt = require("bcrypt"); // For hashing passwords
const authrouter = express.Router();

authrouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashpassword = await bcrypt.hash(password, 10);
  const userdata = new User({
    ...req.body,
    password: hashpassword,
  });
  console.log("Hashed password:", hashpassword);
  try {
    validateSignupData(req);
    await userdata.save();
    res.send("User data saved successfully");
  } catch (err) {
    res.status(400).send("Error saving user data" + err);
  }
});

authrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials1");
    }
    const isMatch = await user.validatekrobhai(password);
    if (!isMatch) {
      throw new Error("Invalid credentials2");
    } else {
      const token = await user.getJWT();
      console.log("Generated token:", token);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 12 * 60 * 1000),
      });
      res.send("Login successful");
    }
  } catch (err) {
    res.status(400).send("Error logging in: " + err.message);
  }
});

authrouter.post("/logout", auth, async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()), // Set cookie to expire immediately
    });
    res.send("Logout successful");
  } catch (err) {
    res.status(400).send("Error logging out: " + err.message);
  }
});

module.exports = authrouter;
