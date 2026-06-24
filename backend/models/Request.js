const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    skillOffered: String,
    skillWanted: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);