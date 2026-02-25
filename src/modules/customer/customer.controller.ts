import { Request, Response } from "express";
import { customerservices } from "./customer.services";

const getMyCustomerProfile = async (req: Request, res: Response) => {
  const id = req.user?.id;
  

  try {
    const result = await customerservices.getMyCustomerProfile(
      id as string,
     
    );

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      message: "User not found",
    });
  }
};

const updateCustomerProfile = async (req: Request, res: Response) => {
  const id = req.user?.id;
  const data = req.body;

  try {
    const result = await customerservices.updateCustomerProfile(
      id as string,
      data,
    );

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      message: "User not found",
    });
  }
};

const crateCustomerReview = async (req: Request, res: Response) => {
  const id = req.user?.id;
  const mealId = req.params.mealId;
  const data = req.body;

  try {
    const result = await customerservices.crateCustomerReview(
      id as string,
      data,
      mealId as string,
    );

    res.status(200).json(result);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const getCartById = async (req: Request, res: Response) => {
  const id = req.user?.id;
  const cartId = req.params.cartId;
  try {
    const result = await customerservices.getCartById(
      id as string,
      cartId as string,
    );

    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

export const customerController = {
  getMyCustomerProfile,
  updateCustomerProfile,
  crateCustomerReview,
  getCartById,
};
