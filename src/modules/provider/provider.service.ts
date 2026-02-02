import {
  DietaryPreference,
  Meal,
  ProviderProfile,
} from "../../../generated/prisma/client";
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
        include: {
          categories: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

const getProviderById = async (id: string) => {
  return await prisma.providerProfile.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      meals: {
        include: {
          categories: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

// ------Meals-------------
const getAllMeal = async (

  search: string,
  minPrice: number,
  maxPrice: number,
) => {
  const andCondition: MealWhereInput[] = [];


  if (search) {
    andCondition.push({
      OR: [
        {
          categories: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (minPrice || maxPrice) {
    andCondition.push({
      price: {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      },
    });
  }

  const result = await prisma.meal.findMany({
    where:
      andCondition.length > 0
        ? {
            AND: [...andCondition, { isAvailable: true }],
          }
        : {isAvailable: true},

    include: {
      categories: {
        select: {
          name: true,
          description: true,
        },
      },
    },
  });

  return result;
};

const getMealsById = async (id: string) => {
  return await prisma.meal.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      categories: {
        select: {
          name: true,
        },
      },
    },
  });
};

const createMeals = async (payload: {
  name: string;
  description: string;
  price: number;
  dietary: DietaryPreference;
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
  getProviderById,
  getAllMeal,
  getMealsById,
  createMeals,
  updateMeals,
  deleteMeals,
};
