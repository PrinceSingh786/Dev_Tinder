const express = require("express");

const { auth } = require("../Middlewares/auth");
const User = require("../models/user");
const Connection = require("../models/Connection");
const userrouter = express.Router();

userrouter.get("/user/requests", auth, async (req, res) => {
  console.log("Fetching user requests");
  try {
    const loggedInUser = req.user;
    const userRequests = await Connection.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["name", "bio"]);
    if (!userRequests || userRequests.length === 0) {
      return res.status(404).send("No user requests found");
    }
    res.json({
      message: "User requests fetched successfully",
      data: userRequests,
    });
  } catch (err) {
    console.error("Error fetching user requests:", err);
    res.status(500).send("Internal server error");
  }
});

userrouter.get("/user/connections", auth, async (req, res) => {
  console.log("Fetching user connections");
  try {
    const loggedInUser = req.user;
    const userConnections = await Connection.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["name", "bio"])
      .populate("toUserId", ["name", "bio"]);

    if (!userConnections || userConnections.length === 0) {
      return res.status(404).send("No user connections found");
    }

    const abc = userConnections.map((x) => {
      if (x.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return x.toUserId;
      } else {
        return x.fromUserId;
      }
    });

    res.json({
      message: "User connections fetched successfully",
      data: abc,
    });
  } catch (err) {
    console.error("Error fetching user connections:", err);
    res.status(500).send("Internal server error");
  }
});
module.exports = userrouter;
