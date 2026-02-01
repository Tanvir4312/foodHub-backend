import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllUser();
    res.status(200).json(result);
  } catch (err) {}
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

export const adminController = {
  getAllUser,
  updateUserStatus,
};
