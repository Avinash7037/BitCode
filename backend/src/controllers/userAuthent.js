const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const TOKEN_EXPIRE = "7d";
const COOKIE_AGE = 7 * 24 * 60 * 60 * 1000;

/* 🔥 Correct cookie config for localhost (5173 → 3000) */
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax", // REQUIRED for cross-port cookies
  secure: false, // true only on https
  maxAge: COOKIE_AGE,
};

/* ---------------- REGISTER ---------------- */
const register = async (req, res) => {
  try {
    validate(req.body);

    const { emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";

    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId, role: "user" },
      process.env.JWT_KEY,
      { expiresIn: TOKEN_EXPIRE }
    );

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      user: reply,
      message: "Signup successful",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(400).json({ message: err.message });
  }
};

/* ---------------- LOGIN ---------------- */
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({ message: "Email & Password required" });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: TOKEN_EXPIRE }
    );

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      user: reply,
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- LOGOUT ---------------- */
const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.send("Already logged out");

    const payload = jwt.decode(token);

    await redisClient.set(`token:${token}`, "blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);

    /* 🔥 Properly remove cookie */
    res.clearCookie("token", {
      sameSite: "lax",
      secure: false,
    });

    res.send("Logged out successfully");
  } catch (err) {
    res.status(503).send("Error: " + err.message);
  }
};

/* ---------------- ADMIN REGISTER ---------------- */
const adminRegister = async (req, res) => {
  try {
    validate(req.body);

    req.body.password = await bcrypt.hash(req.body.password, 10);

    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: TOKEN_EXPIRE }
    );

    res.cookie("token", token, cookieOptions);

    res.status(201).send("Admin Registered Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

/* ---------------- DELETE PROFILE ---------------- */
const deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.result._id);
    res.clearCookie("token");
    res.status(200).send("Deleted Successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
};
