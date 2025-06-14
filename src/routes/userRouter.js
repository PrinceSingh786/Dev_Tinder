const express = require("express");

const { auth } = require("../Middlewares/auth");
const User = require("../models/user");

const userrouter = express.Router();

userrouter.get("/user", async (req, res) => {
  const name = req.body.name;
  try {
    res.send(await User.findOne({ name: req.body.name }));
  } catch (err) {
    res.status(400).send("Error fetching user data");
  }
});

userrouter.delete("/user", async (req, res) => {
  try {
    await User.findOneAndDelete({});
    res.send("Deleted successfully");
  } catch (err) {
    res.status(400).send("Error bhaiya ji");
  }
});

userrouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error fetching feed data");
  }
});

userrouter.patch("/user/:_id", async (req, res) => {
  try {
    const updatekrlo = ["name", "bio", "email"];
    const isValidUpdate = Object.keys(req.body).every((key) =>
      updatekrlo.includes(key)
    );
    if (req.body.name === "ramu aka") {
      throw new Error("Name cannot be ramu aka   chalo bhago !");
    }
    if (!isValidUpdate) {
      return res.status(400).send("Invalid update fields");
    }
    const eid = req.params?._id;
    const data = req.body;
    const updatedUser = await User.findByIdAndUpdate(eid, data, {
      new: true, // Return the updated document
      runValidators: true, // Ensure that the update respects the schema validation
    });
    res.send("all is ok " + updatedUser);
  } catch (err) {
    res.status(400).send("Error updating user data: " + err.message);
  }
});

module.exports = userrouter;
