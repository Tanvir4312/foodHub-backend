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
const getAllMeal = async (req: Request, res: Response) => {

  try {
    const mealsCreate = await providerServices.getAllMeal();
    res.status(200).json(mealsCreate);
  } catch (e) {
   res.status(404).json({
    message : "Meal not found",
    error : e
   })
  }
};
const createMeals = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const mealsCreate = await providerServices.createMeals(req.body);
    res.status(200).json(mealsCreate);
  } catch (e) {
    next(e);
  }
};

const updateMeals = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
   
  try {
    const mealsUpdate = await providerServices.updateMeals(req.body, id as string);
    res.status(200).json(mealsUpdate);
  } catch (e) {
    next(e);
  }
};

const deleteMeals = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
   
  try {
    const mealsDelete = await providerServices.deleteMeals(id as string);
    res.status(200).json(mealsDelete);
  } catch (e) {
    next(e);
  }
};

export const providerController = {
  createProviderProfile,
  getAllMeal,
  createMeals,
  updateMeals,
  deleteMeals
};
