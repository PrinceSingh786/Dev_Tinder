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

connectionSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionSchema.pre("save", function (next) {
  const connection = this;
  if (connection.fromUserId.toString() === connection.toUserId.toString()) {
    throw new Error("You cannot send a connection request to yourself");
  }
  next();
});

module.exports = mongoose.model("connectionSchema", connectionSchema);
