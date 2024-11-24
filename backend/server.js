import { Chalk } from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { morganMiddleware, systemLogs } from "./utils/Logger.js";
import connectionToDB from "./config/connectDB.js";
import mongoSanitize from "express-mongo-sanitize";

await connectionToDB();
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(morganMiddleware);

app.get("/api/v1/test", (req, res) => {
  res.json({ Hi: "Welcome to Invoice APPLICATION" });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`App is running at: ${PORT} on mode : ${process.env.NODE_ENV}`);
  systemLogs.info(
    `App is running at: ${PORT} on mode : ${process.env.NODE_ENV}`
  );
});
