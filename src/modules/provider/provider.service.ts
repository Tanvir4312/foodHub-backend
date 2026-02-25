import { connect } from "node:http2";
import {
  DietaryPreference,
  Meal,
  ProviderProfile,
} from "../../../generated/prisma/client";

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

const updateProviderOwnProfile = async (
  userId: string,
  id: string,
  providerData: ProviderProfile,
) => {
  return await prisma.$transaction(async (tx) => {
    const ownProfile = await tx.providerProfile.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!ownProfile) {
      throw new Error("Your profile not found");
    }
    const providerOwnId = ownProfile.id;

    if (providerOwnId !== id) {
      throw new Error("You can't upadate other's profile.");
    }

    return await tx.providerProfile.update({
      where: {
        id: providerOwnId,
      },
      data: providerData,
    });
  });
};

// ------Meals-------------

const getProviderOwnMeals = async (userId: string) => {
  return await prisma.$transaction(async (tx) => {
    const provider = await tx.providerProfile.findUniqueOrThrow({
      where: {
        user_id: userId,
      },
    });

    const providerId = provider.id;
    if (!providerId) {
      throw new Error("Provider Not Found!!");
    }

    return await tx.meal.findMany({
      where: {
        provider_id: providerId,
      },
      include: {
        reviews: {
          select: {
            rating: true,
            comment: true,
          },
        },
      },
    });
  });
};

const createMeals = async (
  payload: {
    name: string;
    description: string;
    price: number;
    dietary: DietaryPreference;
    image_url?: string;
    category_name: string;
  },
  userId: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const provider = await tx.providerProfile.findUnique({
      where: {
        user_id: userId,
      },
    });
    
        if (!provider) {
          throw new Error(
            "Provider profile not found. Please complete your provider profile first.",
          );
        }

    const providerId = provider?.id;

    await prisma.providerProfile.findFirstOrThrow({
      where: {
        id: providerId,
      },
    });
    await prisma.category.findFirstOrThrow({
      where: {
        name: payload.category_name,
      },
    });
    const result = await prisma.meal.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        dietary: payload.dietary,
        image_url: payload.image_url || null,
        provider: {
          connect: { id: providerId },
        },
        categories: {
          connect: { name: payload.category_name },
        },
      },
      include: {
        categories: {
          select: {
            name: true,
          },
        },
      },
    });
    return result;
  });
};

const updateMeals = async (mealsData: Meal, id: string, userId: string) => {
  return await prisma.$transaction(async (tx) => {
    const provider = await tx.providerProfile.findUniqueOrThrow({
      where: {
        user_id: userId,
      },
    });

    const providerOwnMeals = await tx.meal.findMany({
      where: {
        provider_id: provider.id,
      },
    });

    const matched = providerOwnMeals.find(
      (providerOwnMeal) => providerOwnMeal.id === id,
    );

    if (!matched) {
      throw new Error("This is not your meal");
    }
    const matchedId = matched?.id;

    return await tx.meal.update({
      where: {
        id: matchedId,
      },
      data: mealsData,
    });
  });
};

const deleteMeals = async (id: string) => {
  const result = await prisma.meal.delete({
    where: {
      id,
    },
  });
  return result;
};

const getStates = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const provider = await tx.providerProfile.findUnique({
      where: {
        user_id: id,
      },
    });
    if (!provider) {
      throw new Error("unauthorized");
    }

    const providerId = provider.id;

    const totalOrders = await tx.order.count({
      where: {
        provider_id: providerId,
      },
    });

    const totalActiveOrder = await tx.order.count({
      where: {
        provider_id: providerId,
        status: { in: ["ACCEPTED", "PREPARING", "OUTFORDELIVERY"] },
      },
    });

    const totalDeliveredOrder = await tx.order.count({
      where: {
        provider_id: providerId,
        status: "DELIVERED",
      },
    });

    const revenueData = await tx.order.aggregate({
      where: {
        provider_id: providerId,
        status: "DELIVERED",
      },
      _sum: {
        total_amount: true,
      },
    });

    const totalMeals = await tx.meal.count({
      where: {
        provider_id: providerId,
      },
    });

    return {
      success: true,
      data: {
        totalOrders,
        totalActiveOrder,
        totalDeliveredOrder,
        revenueData,
        totalMeals,
      },
    };
  });
};

export const providerServices = {
  createProviderProfile,
  updateProviderOwnProfile,
  getProviderOwnMeals,
  createMeals,
  updateMeals,
  deleteMeals,
  getStates,
};
