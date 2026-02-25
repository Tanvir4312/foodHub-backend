import { count } from "node:console";
import { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getMyCustomerProfile = async (id: string) => {
  const customerProfile = await prisma.user.findUnique({
    where: { id },
  });
  if (!customerProfile) {
    throw new Error("This is not Your profile");
  }
  return customerProfile;
};

const updateCustomerProfile = async (
  id: string,
  payload: {
    image?: string;
    name?: string;
    phone_number?: string;
  } = {},
) => {
  return await prisma.user.update({
    where: { id },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.image && { image: payload.image }),
      ...(payload.phone_number && { phone_number: payload.phone_number }),
    },
  });
};

const crateCustomerReview = async (
  userId: string,
  data: Omit<Review, "user_id" | "meal_id">,
  mealId: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const isEligible = await tx.order.findFirst({
      where: {
        user_id: userId,
        status: "DELIVERED",
        orderItems: {
          some: {
            meal_id: mealId,
          },
        },
      },
    });
    if (!isEligible) {
      throw new Error("You can only review meals from your delivered orders.");
    }

    if (data.rating < 1 || data.rating > 5) {
      throw new Error("You can rating 1 to 5.");
    }

    const alreadyReviewed = await tx.review.findFirst({
      where: {
        user_id: userId,
        meal_id: mealId,
      },
    });

    if (alreadyReviewed) {
      throw new Error("You have already reviewed this meal.");
    }

    const user = await tx.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const newReview = await tx.review.create({
      data: {
        user_id: userId,
        meal_id: mealId,
        name: user.name,
        rating: data.rating,
        comment: data.comment,
      },
    });

    const states = await tx.review.aggregate({
      where: { meal_id: mealId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const averageRating = Number(states._avg.rating?.toFixed(1)) || 0;

    await tx.meal.update({
      where: { id: mealId },
      data: {
        averageRating,
        totalReviews: states._count.rating || 0,
      },
    });
    return newReview;
  });
};

const getCartById = async (userId: string, cartId: string) => {
  return await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: {
        id: cartId,
      },
      include: {
        cartItems: {
          select: {
            quantity: true,
            price: true,
            meal: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (cart?.user_id !== userId) {
      throw new Error("You are not authorized to access this specific cart.");
    }
    return cart;
  });
};

export const customerservices = {
  getMyCustomerProfile,
  updateCustomerProfile,
  crateCustomerReview,
  getCartById,
};
