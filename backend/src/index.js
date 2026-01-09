const express = require("express");
const app = express();
require("dotenv").config();

const main = require("./config/db");
const cookieParser = require("cookie-parser");
const redisClient = require("./config/redis");

const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const collabRouter = require("./routes/collab.routes");

const cors = require("cors");
const http = require("http");
const { initSocket } = require("./socket");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
app.use("/collab", collabRouter);

const InitializeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB Connected");

    const server = http.createServer(app);

    // ✅ correct socket initialization
    initSocket(server);

    server.listen(process.env.PORT, () => {
      console.log("Server listening at port:", process.env.PORT);
    });
  } catch (err) {
    console.error("Error:", err);
  }
};

InitializeConnection();
