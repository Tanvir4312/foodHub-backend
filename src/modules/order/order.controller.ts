import { NextFunction, Request, Response } from "express";
import { orderServices } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
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

const getUserOwnOrder = async (req: Request, res: Response) => {
    const userId = req.user?.id
    
  try {
    const order = await orderServices.getUserOwnOrder(userId as string);

    res.status(200).json(order);
  } catch (e) {
    res.status(404).json({
      message : "Meal not found"
    })
  }
};

const getOrderById = async (req: Request, res: Response) => {
    const orderId = req.params.id
    
  try {
    const order = await orderServices.getOrderById(orderId as string);

    res.status(200).json(order);
  } catch (e) {
    res.status(404).json({
      message : "Meal not found"
    })
  }
};

const getIncomingOrder = async (req: Request, res: Response) => {
    const userId = req.user?.id
    
  try {
    const order = await orderServices.getIncomingOrder(userId as string);

    res.status(200).json(order);
  } catch (e) {
    res.status(404).json({
      message : "Meal not found"
    })
  }
};

export const orderController = {
  createOrder,
  getUserOwnOrder,
  getOrderById,
  getIncomingOrder
};
