import { Request, Response } from "express";
import { userServices } from "./user.services";

const getOwnUserData = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const result = await userServices.getOwnUserData(userId as string);

    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

export const userController = {
  getOwnUserData,
};
