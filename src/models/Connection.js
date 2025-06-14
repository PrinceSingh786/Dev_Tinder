const mongoose = require("mongoose");
const connectionSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["ignored", "pending", "accepted", "rejected"],
      message: "Status must be either ignored, pending, accepted, or rejected",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
