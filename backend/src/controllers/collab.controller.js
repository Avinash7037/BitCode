const crypto = require("crypto");

const createRoom = async (req, res) => {
  const roomId = crypto.randomUUID();
  res.status(200).json({ roomId });
};

module.exports = { createRoom };
