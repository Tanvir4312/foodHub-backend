import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

type OrderPlace = {
  delivery_address: string;
  phone_number: string;
  items: {
    mealId: string;
    quantity: number;
  }[];
};

const createOrder = async (payload: OrderPlace, userId: string) => {
  const { delivery_address, phone_number, items } = payload;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user?.status === "SUSPENDED") {
    throw new Error(
      "We've noticed some unusual activity on your account, and it is currently restricted from placing new orders. Reach out to our help center to resolve this.",
    );
  }

  //   Get All meal id
  const mealIds = items.map((item) => item.mealId);

  return await prisma.$transaction(async (tx) => {
    //   check kora hocche je item e je meal id ache sei id er data meal e ache kina
    const meals = await tx.meal.findMany({
      where: {
        id: { in: mealIds },
      },
    });

    // mealIds er id length ar meal database theke pawa meals er length ek kina
    if (mealIds.length !== meals.length) {
      throw new Error("Some meal missing!!Please try again.");
    }

    // jei meal er order koreche tar provider id neya, ar ek order e ekoi provider er meal thakbe
    const providerId = meals[0]?.provider_id;

    if (!providerId) {
      throw new Error("Provider not found for this order");
    }

    let calculateAmount = 0;

    const orderItemsData = items.map((item) => {
      const meal = meals.find((m) => item.mealId === m.id);

      if (!meal) {
        throw new Error("Meal not found!!");
      }

      const individualOrderTotapPrice = meal.price * item.quantity;
      //   console.log("alada alada total price", individualOrderTotapPrice);

      calculateAmount += meal.price * item.quantity;
      //   console.log("Meal", meal);

      return {
        meal_id: meal.id,
        quantity: item.quantity,
        price: meal.price,
        total_price: individualOrderTotapPrice,
      };
    });

    return await tx.order.create({
      data: {
        user_id: userId,
        provider_id: providerId,
        total_amount: Math.floor(calculateAmount + 70 + calculateAmount * 0.1),
        delivery_address,
        phone_number,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            meal: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  });
};

const getUserOwnOrder = async (userId: string) => {
  return await prisma.order.findMany({
    where: {
      user_id: userId,
    },
    include: {
      orderItems: {
        include: {
          meal: {
            select: {
              name: true,
              price: true,
              image_url : true
            },
          },
        },
      },
    },
  });
};

const getOrderById = async (orderId: string) => {
  return await prisma.order.findUniqueOrThrow({
    where: {
      id: orderId,
    },
    include: {
      orderItems: {
        include: {
          meal: {
            select: {
              name: true,
              price: true,
              image_url : true
            },
          },
        },
      },
    },
  });
};

const getIncomingOrder = async (userId: string) => {
  return await prisma.$transaction(async (tx) => {
    const provider = await tx.providerProfile.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!provider) {
      return [];
    }

    const providerId = provider?.id;

    if (!providerId) {
      throw new Error("Provider not found");
    }

    return await tx.order.findMany({
      where: {
        provider_id: providerId,
      },
      include: {
        orderItems: {
          include: {
            meal: {
              select: {
                name: true,
                dietary: true,
                categories: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  });
};

const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  userId: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const provider = await tx.providerProfile.findUniqueOrThrow({
      where: {
        user_id: userId,
      },
    });

    const providerId = provider.id;

    if (!provider) {
      throw new Error("Provider not found");
    }

    return await prisma.order.update({
      where: {
        id,
        provider_id: providerId,
      },
      data: {
        status,
      },
    });
  });
};

const deleteOrder = async (id: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!order || order.user_id !== userId) {
    throw new Error("Order not found");
  }

  if (order.status !== "PENDING") {
    throw new Error("This Order alredy ACCEPTED, do not delete this order");
  }

  return await prisma.order.delete({
    where: {
      id,
    },
  });
};

export const orderServices = {
  createOrder,
  getUserOwnOrder,
  getOrderById,
  getIncomingOrder,
  updateOrderStatus,
  deleteOrder,
};
