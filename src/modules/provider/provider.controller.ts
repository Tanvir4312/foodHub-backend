import { NextFunction, Request, Response } from "express";
import { providerServices } from "./provider.service";

// ------Provider-------
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
  } catch (e: any) {
    if (e.code === "P2002") {
      e.message =
        "This email is already associated with an existing account. Please use a different email.";
    } else {
      e.message = "Something went wrong while adding the item to the cart.";
    }
    next(e);
  }
};

const updateProviderOwnProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const id = req.params.id;
  const providerData = req.body;
  try {
    const providerOwnProfile = await providerServices.updateProviderOwnProfile(
      userId as string,
      id as string,
      providerData,
    );
    res.status(200).json(providerOwnProfile);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};
// -------Meals------------

const getProviderOwnMeals = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const providerOwnMeal = await providerServices.getProviderOwnMeals(
      userId as string,
    );
    res.status(200).json(providerOwnMeal);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const createMeals = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.user?.id;
  try {
    const mealsCreate = await providerServices.createMeals(
      req.body,
      id as string,
    );
    res.status(200).json(mealsCreate);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
    if (e.code === "P2025") {
      e.message = "Missing required fields: name, price, or category.";
    } else {
      e.message = "Something went wrong while crating the meal.";
    }
    next(e);
  }
};

const updateMeals = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.id;

  try {
    const mealsUpdate = await providerServices.updateMeals(
      req.body,
      id as string,
      userId as string,
    );
    res.status(200).json(mealsUpdate);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const deleteMeals = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const mealsDelete = await providerServices.deleteMeals(id as string);
    res.status(200).json(mealsDelete);
  } catch (e) {
    next(e);
  }
};

// Stats

const getStats = async (req: Request, res: Response) => {
  const id = req?.user?.id;

  try {
    const mealsDelete = await providerServices.getStates(id as string);
    res.status(200).json(mealsDelete);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

export const providerController = {
  createProviderProfile,
  updateProviderOwnProfile,
  getProviderOwnMeals,
  createMeals,
  updateMeals,
  deleteMeals,
  getStats,
};
