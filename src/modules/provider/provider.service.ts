import { Meal, ProviderProfile } from "../../../generated/prisma/client";
import { MealWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

// ------Provider-------
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

const getAllProvider = async () => {
  return await prisma.providerProfile.findMany({
    include: {
      meals: {
        where : {
            isAvailable : true
        }
      },
    },
  });
};

// ------Meals-------------
const getAllMeal = async (isAvailable: boolean) => {
  const andCondition: MealWhereInput[] = [];

  if (typeof isAvailable === "boolean") {
    andCondition.push({ isAvailable });
  }

  const result = await prisma.meal.findMany({
    where: {
      AND: andCondition,
    },
    include: {
      categories: {
        select: {
          name: true,
          description: true,
        },
      },
    },
  });
  const totalMeal = await prisma.meal.count();
  return { data: result, totalMeal };
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

const deleteMeals = async (id: string) => {
  const result = await prisma.meal.delete({
    where: {
      id,
    },
  });
  return result;
};

export const providerServices = {
  createProviderProfile,
  getAllProvider,
  getAllMeal,
  createMeals,
  updateMeals,
  deleteMeals,
};
