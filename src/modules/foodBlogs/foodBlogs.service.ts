import { FoodBlog, UserRole } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { Blogs } from "./foodBlogs.interface";


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

const getAllFoodBlog = async () => {
    const result = await prisma.foodBlog.findMany();
    return result;
}

export const foodBlogsService = { createFoodBlog, getAllFoodBlog };