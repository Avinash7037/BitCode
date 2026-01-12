const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_KEY);

    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const user = await User.findById(payload._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      return res.status(401).json({ message: "Token blocked" });
    }

    req.result = user;
    req.token = token;

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = adminMiddleware;
