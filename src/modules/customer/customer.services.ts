import { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

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

    const newReview = await tx.review.create({
      data: {
        user_id: userId,
        meal_id: mealId,
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

export const customerservices = {
  updateCustomerProfile,
  crateCustomerReview,
};
