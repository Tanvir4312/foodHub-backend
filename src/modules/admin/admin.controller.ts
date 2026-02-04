import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import { paginationHelper } from "../../helper/paginationHelper";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllUser();
    res.status(200).json(result);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};
const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.params.id;
  const { status } = req.body;

  try {
    if (!["ACTIVE", "SUSPENDED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const result = await adminServices.updateUserStatus(
      userId as string,
      status,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// ----------Categories-----------
const createCategories = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.createCategories(req.body);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllCategory();
    res.status(200).json(result);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};
const updateCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const result = await adminServices.updateCategory(id as string, data);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const deleteCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  try {
    const result = await adminServices.deleteCategory(id as string);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

// --------Orders-------------
const getAllOrder = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllOrder();
    res.status(200).json(result);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  const id = req.params.id;
  const status = req.body.status;

  try {
    const result = await adminServices.updateOrderStatus(id as string, status);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

// -----Meals-----------
const mealIsDeleted = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body.isDeleted;

  try {
    const result = await adminServices.mealIsDeleted(id as string, data);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

export const adminController = {
  getAllUser,
  updateUserStatus,
  createCategories,
  getAllCategory,
  updateCategories,
  deleteCategories,
  getAllOrder,
  updateOrderStatus,
  mealIsDeleted,
};
