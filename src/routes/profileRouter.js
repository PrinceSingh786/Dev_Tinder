const User = require("../models/user");
const { auth } = require("../Middlewares/auth");
const { validateEditprofile } = require("../utils/validation");
const { validateNewPassword } = require("../utils/validation");
const bcrypt = require("bcrypt"); // For hashing passwords

const express = require("express");

const profilerouter = express.Router();

profilerouter.get("/profile/view", auth, async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  console.log("Profile route accessed" + email);

  const myuser = await User.findOne({ email: req.body.email });
  res.send(myuser);
});

profilerouter.patch("/profile/edit", auth, async (req, res) => {
  const edituser = req.body;
  console.log("Edit profile request received:", edituser);
  if (validateEditprofile(edituser)) {
    try {
      const loggedInUser = req.user;
      Object.keys(edituser).forEach(
        (key) => (loggedInUser[key] = edituser[key])
      );
      await loggedInUser.save();
      res.send("Profile updated successfully" + " " + loggedInUser.name);
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).send("Error updating profile");
    }
  } else {
    res.status(400).send("Invalid edit profile request");
  }
});

profilerouter.patch("/profile/password", auth, async (req, res) => {
  const { newpassword } = req.body;
  console.log("Password update request received:", newpassword);
  if (validateNewPassword(newpassword)) {
    try {
      const hashpassword = await bcrypt.hash(newpassword, 10);

      loggedInUser = req.user;
      loggedInUser.password = hashpassword;
      await loggedInUser.save();
      res.send("Password updated successfully" + " " + loggedInUser.name);
    } catch (err) {
      console.error("Error updating password:", err);
    }
  } else {
    res.status(400).send("Invalid password update request");
  }
});

module.exports = profilerouter;
