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

export const providerServices = {
  createProviderProfile,
  createMeals,
};
