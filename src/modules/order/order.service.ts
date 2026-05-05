import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { paginationHelper } from "../../helper/paginationHelper";

type OrderPlace = {
  delivery_address: string;
  phone_number: string;
  couponCode?: string; // optional — user না দিলেও order হবে
  items: {
    mealId: string;
    quantity: number;
  }[];
};

const createOrder = async (payload: OrderPlace, userId: string) => {
  const { delivery_address, phone_number, items, couponCode } = payload;

  if (items.length === 0) {
    throw new Error("Please add at least one item to your order");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user?.status === "SUSPENDED") {
    throw new Error(
      "We've noticed some unusual activity on your account, and it is currently restricted from placing new orders. Reach out to our help center to resolve this.",
    );
  }

  if (user?.role === "PROVIDER") {
    throw new Error("Provider not allowed to order");
  }

  // coupon দিলে আগেই validate করো — transaction এর বাইরে
  // কারণ invalid coupon হলে order create ই হবে না
  let discountPercent = 0;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase().trim() },
    });

    if (!coupon) throw new Error("Invalid coupon code");
    if (!coupon.isActive) throw new Error("Coupon is inactive");
    if (new Date() > coupon.expiresAt) throw new Error("Coupon has expired");
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit reached");
    }

    discountPercent = coupon.discount;
  }

  const mealIds = items.map((item) => item.mealId).filter(Boolean);

  if (mealIds.length === 0) {
    throw new Error("Please add at least one valid item to your order");
  }

  return await prisma.$transaction(async (tx) => {
    const meals = await tx.meal.findMany({
      where: { id: { in: mealIds } },
    });

    if (mealIds.length !== meals.length) {
      throw new Error("Some meal missing!! Please try again.");
    }

    const providerId = meals[0]?.provider_id;
    if (!providerId) {
      throw new Error("Provider not found for this order");
    }

    let subtotal = 0;

    const orderItemsData = items.map((item) => {
      const meal = meals.find((m) => item.mealId === m.id);
      if (!meal) throw new Error("Meal not found!!");

      const itemTotal = meal.price * item.quantity;
      subtotal += itemTotal;

      return {
        meal_id: meal.id,
        quantity: item.quantity,
        price: meal.price,
        total_price: itemTotal,
      };
    });

    // discount + delivery + tax সহ final amount calculate
    const discountAmount = (subtotal * discountPercent) / 100;
    const afterDiscount = subtotal - discountAmount;
    const totalAmount = Math.floor(afterDiscount + 70 + afterDiscount * 0.1);

    const order = await tx.order.create({
      data: {
        user_id: userId,
        provider_id: providerId,
        total_amount: totalAmount,
        delivery_address,
        phone_number,
        coupon_code: couponCode ? couponCode.toUpperCase().trim() : null,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            meal: {
              select: { name: true },
            },
          },
        },
      },
    });

    // coupon ব্যবহার হলে usedCount বাড়াও — order create সফল হওয়ার পরে
    // একই transaction এ থাকায় order fail হলে এটাও rollback হবে
    if (couponCode) {
      await tx.coupon.update({
        where: { code: couponCode.toUpperCase().trim() },
        data: { usedCount: { increment: 1 } },
      });
    }

    return order;
  });
};

const getUserOwnOrder = async (userId: string, query: Record<string, any>) => {
  const { status, sortOrder, page, limit } = query;
  const {
    page: pageNum,
    limit: limitNum,
    skip,
  } = paginationHelper({
    page: page as string,
    limit: (limit as string) || "5",
  });

  const whereCondition: any = {
    user_id: userId,
  };

  if (status && status !== "all") {
    whereCondition.status = status;
  }

  const result = await prisma.order.findMany({
    where: whereCondition,
    include: {
      orderItems: {
        include: {
          meal: {
            select: {
              name: true,
              price: true,
              image_url: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: sortOrder === "asc" ? "asc" : "desc",
    },
    skip,
    take: limitNum,
  });

  const total = await prisma.order.count({ where: whereCondition });

  return {
    data: result,
    pagination: {
      limit: limitNum,
      total_meal: total,
      current_Page: pageNum,
      totatl_page: Math.ceil(total / limitNum),
    },
  };
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
              image_url: true
            },
          },
        },
      },
    },
  });
};

const getIncomingOrder = async (userId: string, query: Record<string, any>) => {
  const { status, sortOrder, page, limit } = query;
  const {
    page: pageNum,
    limit: limitNum,
    skip,
  } = paginationHelper({
    page: page as string,
    limit: (limit as string) || "5",
  });

  return await prisma.$transaction(async (tx) => {
    const provider = await tx.providerProfile.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!provider) {
      return { data: [], pagination: { limit: limitNum, total_meal: 0, current_Page: pageNum, totatl_page: 1 } };
    }

    const providerId = provider.id;

    const whereCondition: any = {
      provider_id: providerId,
    };

    if (status && status !== "all") {
      whereCondition.status = status;
    }

    const result = await tx.order.findMany({
      where: whereCondition,
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
      orderBy: {
        createdAt: sortOrder === "asc" ? "asc" : "desc",
      },
      skip,
      take: limitNum,
    });

    const total = await tx.order.count({ where: whereCondition });

    return {
      data: result,
      pagination: {
        limit: limitNum,
        total_meal: total,
        current_Page: pageNum,
        totatl_page: Math.ceil(total / limitNum),
      },
    };
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
