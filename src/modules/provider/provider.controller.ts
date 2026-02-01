import { NextFunction, Request, Response } from "express";
import { providerServices } from "./provider.service";

const createProviderProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.user?.id;
  if (!id) {
    return res.status(400).json({ message: "user not found" });
  }

  try {
    const providerProfileCreate = await providerServices.createProviderProfile(
      req.body,
      id,
    );
    res.status(200).json(providerProfileCreate);
  } catch (e) {
    next(e);
  }
};
// -------Meals------------
const createMeals = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
  try {
    const providerProfileCreate = await providerServices.createMeals(req.body);
    res.status(200).json(providerProfileCreate);
  } catch (e) {
    next(e);
  }
};

export const providerController = {
  createProviderProfile,
  createMeals,
};
