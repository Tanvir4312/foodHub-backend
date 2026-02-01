import { Meal, ProviderProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createProviderProfile = async (
  data: Omit<ProviderProfile, "user_id">,
  id: string,
) => {
  const result = await prisma.providerProfile.create({
    data: {
      ...data,
      user_id: id,
    },
  });
  return result;
};

// ------Meals-------------
const getAllMeal = async () => {
  const result = await prisma.meal.findMany({
    include: {
      categories: {
        select : {
            name : true,
            description : true
        }
      }
    },
  });
  return result;
};

const createMeals = async (payload: {
  name: string;
  description: string;
  price: number;
  image_url?: string;
  provider_id: string;
  category_id: string;
}) => {
  await prisma.providerProfile.findFirstOrThrow({
    where: {
      id: payload.provider_id,
    },
  });
  await prisma.category.findFirstOrThrow({
    where: {
      id: payload.category_id,
    },
  });
  const result = await prisma.meal.create({
    data: payload,
  });
  return result;
};

const updateMeals = async (mealsData: Meal, id: string) => {
  const result = await prisma.meal.update({
    where: {
      id,
    },
    data: mealsData,
  });
  return result;
};

export const providerServices = {
  createProviderProfile,
  getAllMeal,
  createMeals,
  updateMeals,
};
