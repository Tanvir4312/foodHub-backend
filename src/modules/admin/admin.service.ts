import { NextFunction } from "express";
import { UserStatus } from "../../enum/userStatus";
import { prisma } from "../../lib/prisma";
import { categoryType } from "../../types/categoryType";

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
const createCategories = async (category: categoryType) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name: category.name },
  });

  if (existingCategory) {
    throw new Error("Duplicate error");
  }

  const createCategory = await prisma.category.create({
    data: category,
  });
  return createCategory;
};

export const adminServices = {
  getAllUser,
  updateUserStatus,
  createCategories,
};
