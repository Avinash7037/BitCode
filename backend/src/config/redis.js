const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-19934.c212.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 19934,

    // 🔁 Auto-reconnect strategy (VERY IMPORTANT)
    reconnectStrategy: (retries) => {
      console.log(`🔄 Redis reconnect attempt: ${retries}`);
      return Math.min(retries * 100, 3000); // retry max every 3s
    },
  },
});

/* =======================
   🔴 REQUIRED EVENT HANDLERS
   ======================= */

// 🟢 When connection is established
redisClient.on("connect", () => {
  console.log("🟢 Redis connected");
});

// ✅ When Redis is fully ready
redisClient.on("ready", () => {
  console.log("✅ Redis ready to use");
});

// 🔴 Prevent app crash (THIS FIXES YOUR ERROR)
redisClient.on("error", (err) => {
  console.error("🔴 Redis error:", err.message);
  // ❌ DO NOT throw
});

// 🟡 When Redis disconnects
redisClient.on("end", () => {
  console.log("🟡 Redis connection closed");
});

// 🧹 Optional safety
process.on("SIGINT", async () => {
  console.log("🛑 Closing Redis connection...");
  await redisClient.quit();
  process.exit(0);
});

module.exports = redisClient;
