import express from "express";
import cors from "cors";
import { empRouter } from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Mount routes at both paths to support local `/api/*` and Vercel `/api/*`
app.use("/employees", empRouter);
app.use("/api/employees", empRouter);

export default app;
