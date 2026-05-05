import { FoodBlog, UserRole, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { Blogs, UpdateBlogs } from "./foodBlogs.interface";
import { paginationHelper } from "../../helper/paginationHelper";


const createFoodBlog = async (payload: Blogs, role: UserRole) => {
    if (role !== UserRole.ADMIN) {
        throw new Error("You are not authorized to create food blog");
    }

    const result = await prisma.foodBlog.create({
        data: {
            title: payload.title,
            description: payload.description,
            image: payload.image,

        }
    })
    return result;
}

const getAllFoodBlog = async (query: Record<string, unknown>) => {
  const { searchTerm, page, limit } = query;
  const {
    page: pageNum,
    limit: limitNum,
    skip,
  } = paginationHelper({
    page: page as string,
    limit: limit as string,
  });

  const whereCondition: Prisma.FoodBlogWhereInput = {};

  if (searchTerm) {
    whereCondition.title = {
      contains: searchTerm as string,
      mode: "insensitive",
    };
  }

  const result = await prisma.foodBlog.findMany({
    where: whereCondition,
    skip,
    take: limitNum,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.foodBlog.count({ where: whereCondition });

  return {
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPage: Math.ceil(total / limitNum),
    },
    data: result,
  };
};

const updateFoodBlog = async (id: string, payload: UpdateBlogs, role: UserRole) => {
    if (role !== UserRole.ADMIN) {
        throw new Error("You are not authorized to update food blog");
    }
    const result = await prisma.foodBlog.update({
        where: { id },
        data: payload
    })
    return result;
}

const deleteFoodBlog = async (id: string, role: UserRole) => {
    if (role !== UserRole.ADMIN) {
        throw new Error("You are not authorized to delete food blog");
    }
    const result = await prisma.foodBlog.delete({
        where: { id }
    })
    return result;
}

export const foodBlogsService = { createFoodBlog, getAllFoodBlog, updateFoodBlog, deleteFoodBlog };