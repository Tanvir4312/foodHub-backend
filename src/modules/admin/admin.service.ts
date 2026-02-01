import { UserStatus } from "../../enum/userStatus";
import { prisma } from "../../lib/prisma";
import { Category } from "../../../generated/prisma/client";

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

const getAllCategory = async () => {
  const allCategory = await prisma.category.findMany({
    include: {
      meals: true,
    },
  });
  const totalCategory = await prisma.category.count();
  return { data: allCategory, totalCategory };
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
      provider: true,
    },
  });
  return allUser;
};

export const adminServices = {
  getAllUser,
  updateUserStatus,
  createCategories,
  getAllCategory,
  updateCategory,
  deleteCategory,
  getAllOrder,
};
