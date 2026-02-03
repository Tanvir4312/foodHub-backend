import { NextFunction, Request, Response } from "express";
import { orderServices } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    
  try {
    const orderCreate = await orderServices.createOrder(req.body, userId as string);

    res.status(200).json(orderCreate);
  } catch (e) {
    res.status(404).json({
      message : "Meal not found"
    })
  }
};

export const orderController = {
  createOrder,
};
