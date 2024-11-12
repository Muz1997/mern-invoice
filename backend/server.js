import { Chalk } from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";

const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.get("/api/v1/test", (req, res) => {
  res.json({ Hi: "Welcome to Invoice APP" });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`App is running at: ${PORT} on mode : ${process.env.NODE_ENV}`);
});
