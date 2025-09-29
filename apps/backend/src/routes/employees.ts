import express from "express";
import { empSchema, updateSchema } from "../validation/index.js";
import { prisma } from "../lib/prisma.js";

export const employees = express.Router();

employees.post("/", async (req, res) => {
  const parseBody = empSchema.safeParse(req.body);
  if (!parseBody.success) {
    res.status(403).json({
      msg: "Validation failed",
      success: false,
    });
    return;
  }

  const userExit = await prisma.employee.findUnique({
    where: {
      email: parseBody.data.email,
    },
  });

  if (userExit) {
    res.status(409).json({
      msg: "User already exist",
      success: false,
    });
  }

  try {
    const employee = await prisma.employee.create({
      data: {
        name: parseBody.data.name,
        email: parseBody.data.email,
        position: parseBody.data.position,
      },
    });

    res.status(200).json({
      id: employee.id,
      msg: "Employee created successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Internal error",
      success: false,
    });
  }
});

employees.get("/", async (req, res) => {
  try {
    const allEmployees = await prisma.employee.findMany();
    res.status(200).json({
      msg: "All employees data",
      success: true,
      allEmployees,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Internal server error",
      success: false,
    });
    return;
  }
});

employees.patch("/update/:empId", async (req, res) => {
  const { empId } = req.params;
  const parseBody = updateSchema.safeParse(req.body);

  if (!parseBody.success || !empId) {
    res.status(404).json({
      msg: "Validation failed",
      success: false,
    });
    return;
  }

  try {
    const userExit = await prisma.employee.findUnique({
      where: {
        id: empId,
      },
    });

    if (!userExit) {
      res.status(404).json({
        msg: "Employee not found",
        success: false,
      });
      return;
    }

    await prisma.employee.update({
      where: {
        id: empId,
      },
      data: {
        name: parseBody.data?.name,
        email: parseBody.data?.email,
        position: parseBody.data?.position,
      },
    });
    res.status(200).json({
      msg: "Employee update successfull",
      success: true,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Internal server error",
      success: false,
    });
    return;
  }
});

employees.delete("/:empId", async (req, res) => {
  const { empId } = req.params;

  const userExit = await prisma.employee.findUnique({
    where: {
      id: empId,
    },
  });
  if (!userExit) {
    res.status(404).json({
      msg: "Employee not found",
      success: false,
    });
    return;
  }

  try {
    await prisma.employee.delete({
      where: {
        id: empId,
      },
    });
    res.status(200).json({
      msg: "Employee deleted successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Internal server error",
      success: false,
    });
    return;
  }
});
