import express from "express";
import { employees } from "./employees.js";

export const empRouter = express.Router();

empRouter.use("/data", employees);
