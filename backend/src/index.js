const express = require("express");
require("dotenv").config();
const http = require("http");

const main = require("./config/db");
const redisClient = require("./config/redis");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/userAuth");
const profileRouter = require("./routes/profile");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const collabRouter = require("./routes/collab.routes");

const { initSocket } = require("./socket");

const app = express();

/* 🔥 MUST BE FIRST */
app.use(express.json());
app.use(cookieParser());

/* 🔥 CORS MUST COME BEFORE ROUTES */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* 🔥 ROUTES AFTER MIDDLEWARE */
app.use("/user", authRouter);
app.use("/user", profileRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
app.use("/collab", collabRouter);

const start = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB & Redis connected");

    const server = http.createServer(app);
    initSocket(server);

    server.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
};

start();
