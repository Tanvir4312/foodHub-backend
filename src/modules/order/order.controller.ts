import { NextFunction, Request, Response } from "express";
import { orderServices } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const orderCreate = await orderServices.createOrder(
      req.body,
      userId as string,
    );

    res.status(200).json(orderCreate);
  } catch (e) {
    res.status(404).json({
      message: "Meal not found",
    });
  }
};

const getUserOwnOrder = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const order = await orderServices.getUserOwnOrder(userId as string);

    res.status(200).json(order);
  } catch (e) {
    res.status(404).json({
      message: "Meal not found",
    });
  }
};

const getOrderById = async (req: Request, res: Response) => {
  const orderId = req.params.id;

  try {
    const order = await orderServices.getOrderById(orderId as string);

    res.status(200).json(order);
  } catch (e) {
    res.status(404).json({
      message: "Meal not found",
    });
  }
};

const getIncomingOrder = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const order = await orderServices.getIncomingOrder(userId as string);

    res.status(200).json(order);
  } catch (e) {
    res.status(404).json({
      message: "Meal not found",
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  const id = req.params.id;
  const status = req.body.status;
  const userId = req.user?.id;

  try {
    const order = await orderServices.updateOrderStatus(
      id as string,
      status,
      userId as string,
    );

    res.status(200).json(order);
  } catch (e) {
    res.status(404).json({
      message: "Meal not found",
    });
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
const userId = req.user?.id
  try {
    const order = await orderServices.deleteOrder(id as string, userId as string);

    res.status(200).json(order);
  } catch (e) {
    res.status(404).json({
      message: "This Order alredy ACCEPTED, do not delete this order",
    });
  }
};

export const orderController = {
  createOrder,
  getUserOwnOrder,
  getOrderById,
  getIncomingOrder,
  updateOrderStatus,
  deleteOrder,
};
