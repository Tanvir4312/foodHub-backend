import { Request, Response } from "express";
import { adminServices } from "./admin.service";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllUser();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).json({
        error : "Something went wrong",
        details : err
    })
  }
};

export const adminController = {
  getAllUser,
};
