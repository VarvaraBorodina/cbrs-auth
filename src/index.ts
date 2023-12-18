import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", router());

const start = async () => {
  try {
    const MONGO_URL =
      "mongodb+srv://varvara:sfIdbnrYYYlLhvPN@cluster0.tvw5xob.mongodb.net/?retryWrites=true&w=majority";
    await mongoose.connect(MONGO_URL);
    mongoose.connection.on("error", (error: Error) => console.log(error));
    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
