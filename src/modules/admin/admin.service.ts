import { prisma } from "../../lib/prisma";
import {
  Category,
  OrderStatus,
  UserStatus,
} from "../../../generated/prisma/client";

// ----------User-------------
const getAllUser = async () => {
  const allUser = await prisma.user.findMany({
    include: {
      providerProfile: true,
    },
  });
  return allUser;
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  const updateUser = await prisma.user.update({
    where: { id },
    data: { status },
  });
  return updateUser;
};

// ------------Categories-------------
const createCategories = async (category: Category) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name: category.name },
  });

  if (existingCategory) {
    throw new Error("This category name already exists");
  }

  const createCategory = await prisma.category.create({
    data: category,
  });
  return createCategory;
};

const updateCategory = async (id: string, data: Category) => {
  const categoryUpdate = await prisma.category.update({
    where: {
      id,
    },
    data,
  });
  return categoryUpdate;
};

const deleteCategory = async (id: string) => {
  const categoryDelete = await prisma.category.delete({
    where: {
      id,
    },
  });
  return categoryDelete;
};

// ----------Orders-----------
const getAllOrder = async () => {
  const allUser = await prisma.order.findMany({
    include: {
      provider: {
        select: {
          name: true,
          location: true,
          phone_number: true,
        },
      },
      orderItems: {
        select: {
          meal: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
    },
  });
  return allUser;
};

const updateOrderStatus = async (id: string, status: OrderStatus) => {
  return await prisma.order.update({
    where: { id },
    data: { status },
  });
};

// --------Meals--------
const mealIsDeleted = async (id: string, data: boolean) => {
  return await prisma.meal.update({
    where: { id },
    data: {
      isDeleted: data,
    },
  });
};

// ----------Stats-------------
const getStats = async (userId: string) => {
  return await prisma.$transaction(async (tx) => {
    const isAdmin = await tx.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!isAdmin) {
      throw new Error("Forbidden");
    }

    const userCount = await tx.user.count();

    const activeUser = await tx.user.count({
      where: {
        status: "ACTIVE",
      },
    });
    const suspendedUser = await tx.user.count({
      where: {
        status: "SUSPENDED",
      },
    });

    const totalRevenue = await tx.order.aggregate({
      _sum: {
        total_amount: true,
      },
      where: {
        status: "DELIVERED",
      },
    });

    const averageOrderValue = await tx.order.aggregate({
      _avg: {
        total_amount: true,
      },
    });
    // const aov = Number(averageOrderValue).toFixed(2);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyAov = await tx.order.aggregate({
      where: {
        status: "DELIVERED",
        createdAt: {
          gte: startOfMonth,
        },
      },
      _avg: {
        total_amount: true,
      },
    });

    const totalDeliveredOrder = await tx.order.count({
      where: {
        status: "DELIVERED",
      },
    });

    const totalPendingOrder = await tx.order.count({
      where: {
        status: "PENDING",
      },
    });

    const totalCanclledOrder = await tx.order.count({
      where: {
        status: "CANCELLED",
      },
    });

    const activeProvider = await tx.providerProfile.count({
      where: {
        isAvailable: true,
      },
    });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newSingUps24H = await tx.user.count({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newSignUps7D = await tx.user.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    return {
      active_user: activeUser,
      supended_user: suspendedUser,
      total_user: userCount,
      total_revenue: totalRevenue,
      average_order_value: averageOrderValue,
      monthly_AOV: monthlyAov,
      total_delivered: totalDeliveredOrder,
      pending_orders: totalPendingOrder,
      cancleed_orders: totalCanclledOrder,
      active_providers: activeProvider,
      last_24H_singups: newSingUps24H,
      last_7D_singups: newSignUps7D,
    };
  });
};

export const adminServices = {
  getAllUser,
  updateUserStatus,
  createCategories,
  updateCategory,
  deleteCategory,
  getAllOrder,
  updateOrderStatus,
  mealIsDeleted,
  getStats,
};
