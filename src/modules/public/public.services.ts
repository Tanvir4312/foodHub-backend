import { MealWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

// Cattegory
const getAllCategory = async () => {
  const allCategory = await prisma.category.findMany();
  const totalCategory = await prisma.category.count();
  return { data: allCategory, totalCategory };
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      meals: {
        select: {
          id: true,
          name: true,
          image_url: true,
          description: true,
          price: true,
          averageRating: true,
        },
      },
    },
  });
  if (!category) {
    throw new Error("Category not available");
  }

  return category;
};

// Meals
const getAllMeal = async (
  search: string,
  dietaryParams: string,
  minPrice: number,
  maxPrice: number,
  page: number,
  limit: number,
  skip: number,
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
  const allowedDietary = [
    "VEGAN",
    "VEGETARIAN",
    "NON_VEGETARIAN",
    "KETO",
    "GLUTEN_FREE",
    "DAIRY_FREE",
    "NUT_FREE",
    "EGG_FREE",
    "LOW_CARB",
    "LOW_FAT",
    "HIGH_PROTEIN",
  ];

  if (dietaryParams) {
    const isValid = dietaryParams
      ?.split(",")
      .every((params) => allowedDietary.includes(params));

    if (!isValid) {
      throw new Error("Invalid dietary preference provided.");
    }

    if (dietaryParams && dietaryParams?.length > 0) {
      andCondition.push({
        dietary: {
          in: [dietaryParams as any],
        },
      });
    }
  }

  const result = await prisma.meal.findMany({
    take: limit,
    skip,
    where:
      andCondition.length > 0
        ? {
            AND: [...andCondition, { isAvailable: true, isDeleted: false }],
          }
        : { isAvailable: true, isDeleted: false },

    include: {
      categories: {
        select: {
          name: true,
          description: true,
        },
      },
      reviews: {
        select: {
          comment: true,
          rating: true,
          user_id: true,
        },
      },
    },
  });
  const total_meal = await prisma.meal.count();

  return {
    data: result,
    pagination: {
      limit,
      total_meal,
      current_Page: page,
      totatl_page: Math.ceil(total_meal / limit),
    },
  };
};

const getAllTopMeal = async () => {
  return await prisma.meal.findMany({
    where: {
      averageRating: {
        gte: 4,
        lte: 5,
      },
      isAvailable: true,
    },
    orderBy: {
      averageRating: "desc",
    },
  });
};

const getMealsById = async (id: string) => {
  const meal = await prisma.meal.findUnique({
    where: {
      id,
    },
    include: {
      categories: {
        select: {
          name: true,
        },
      },
      reviews : true
    },
  });
  if (!meal) {
    throw new Error("Meal not found");
  }
  return meal;
};

// Provider
const getAllProvider = async () => {
  const provider = await prisma.providerProfile.findMany({
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
  const total_provider = await prisma.providerProfile.count();

  return { data: provider, total_provider };
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

// AddToCart
const addToCart = async (
  userId: string,
  mealId: string,
  quyantity: number,
  price: number,
) => {
  return await prisma.$transaction(async (tx) => {
    const meal = await tx.meal.findUnique({
      where: {
        id: mealId,
      },
    });

    const providerId = meal?.provider_id;

    if (!providerId) {
      throw new Error("Meal not found");
    }

    let cart = await tx.cart.findUnique({
      where: {
        user_id_provider_id: { user_id: userId, provider_id: providerId },
      },
    });

    if (!cart) {
      cart = await tx.cart.create({
        data: {
          user_id: userId,
          provider_id: providerId,
        },
      });
    }

    const total_cart = await tx.cart.count();

    const existingCartItem = await tx.cartItem.findUnique({
      where: {
        cart_id_meal_id: {
          cart_id: cart.id,
          meal_id: mealId,
        },
      },
    });

    if (existingCartItem) {
      const cartItem = await tx.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quyantity,
          price: existingCartItem.price + price,
        },
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image_url: true,
              price: true,
              provider: {
                select: {
                  name: true,
                  logo_url: true,
                },
              },
            },
          },
        },
      });
      return {
        data: cartItem,
        total_cart,
      };
    } else {
      const cartItem = await tx.cartItem.create({
        data: {
          cart_id: cart.id,
          meal_id: mealId,
          quantity: quyantity,
          price,
        },
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image_url: true,
              price: true,
              provider: {
                select: {
                  name: true,
                  logo_url: true,
                },
              },
            },
          },
        },
      });
      return { data: cartItem, total_cart };
    }
  });
};

const getOwnCart = async (id: string) => {
  return await prisma.cart.findMany({
    where: {
      user_id: id,
    },
    include: {
      cartItems: {
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              price: true,
              image_url: true,
            },
          },
        },
      },
    },
  });
};

const getOwnCartCount = async (id: string) => {
  return await prisma.cart.count({
    where: {
      user_id: id,
    },
  });
};

const cartDelete = async (cartId: string) => {
  return await prisma.cart.delete({
    where: {
      id: cartId,
    },
  });
};

const itemDelete = async (itemsId: string) => {
  return await prisma.cartItem.delete({
    where: {
      id: itemsId,
    },
  });
};

export const publicServices = {
  getAllCategory,
  getCategoryById,
  getAllMeal,
  getAllTopMeal,
  getAllProvider,
  getProviderById,
  getMealsById,
  addToCart,
  getOwnCart,
  getOwnCartCount,
  cartDelete,
  itemDelete,
};
