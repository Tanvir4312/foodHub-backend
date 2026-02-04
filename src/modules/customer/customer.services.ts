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
  data: Omit<Review, "user_id">,
) => {
  return await prisma.$transaction(async (tx) => {
    const isEligible = await tx.order.findFirst({
      where: {
        user_id: userId,
        status: "DELIVERED",
        orderItems: {
          some: {
            meal_id: data.meal_id,
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
        meal_id: data.meal_id,
      },
    });

    if (alreadyReviewed) {
      throw new Error("You have already reviewed this meal.");
    }

    return await tx.review.create({
      data: {
        user_id: userId,
        meal_id: data.meal_id,
        rating: data.rating,
        comment: data.comment,
      },
    });
  });
};

export const customerservices = {
  updateCustomerProfile,
  crateCustomerReview,
};
