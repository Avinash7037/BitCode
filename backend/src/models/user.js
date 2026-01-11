const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    emailId: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/bottts/svg?seed=BitCode",
    },
    problemSolved: [{ type: mongoose.Schema.Types.ObjectId, ref: "problem" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
