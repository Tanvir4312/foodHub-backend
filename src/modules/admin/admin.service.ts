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
    throw new Error("This category name already exists");
  }

  const createCategory = await prisma.category.create({
    data: category,
  });
  return createCategory;
};

const getAllCategory = async () => {
  const allCategory = await prisma.category.findMany({
    include: {
      meals: true,
    },
  });
  return allCategory;
};

const updateCategory = async (id: string, data: categoryType) => {
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

export const adminServices = {
  getAllUser,
  updateUserStatus,
  createCategories,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
