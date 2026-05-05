import { Request, Response } from "express";
import { foodBlogsService } from "./foodBlogs.service";
import { UserRole } from "../../../generated/prisma/enums";
import { Blogs, UpdateBlogs } from "./foodBlogs.interface";

const createFoodBlog = async (req: Request, res: Response) => {
    const payload = req.body;
    const role = req.user?.role;
    try {
        const result = await foodBlogsService.createFoodBlog(payload as Blogs, role as UserRole);
        res.status(200).json({
            success: true,
            message: "Food blog created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create food blog",
            error
        });
    }
}

const getAllFoodBlog = async (req: Request, res: Response) => {
    try {
        const result = await foodBlogsService.getAllFoodBlog(req.query);
        res.status(200).json({
            success: true,
            message: "Food blog fetched successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch food blog",
            error
        });
    }
}

const updateFoodBlog = async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const role = req.user?.role;
    try {
        const result = await foodBlogsService.updateFoodBlog(id as string, payload as UpdateBlogs, role as UserRole);
        res.status(200).json({
            success: true,
            message: "Food blog updated successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update food blog",
            error
        });
    }
}

const deleteFoodBlog = async (req: Request, res: Response) => {
    const { id } = req.params;
    const role = req.user?.role;
    try {
        const result = await foodBlogsService.deleteFoodBlog(id as string, role as UserRole);
        res.status(200).json({
            success: true,
            message: "Food blog deleted successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete food blog",
            error
        });
    }
}

export const foodBlogsController = { createFoodBlog, getAllFoodBlog, updateFoodBlog, deleteFoodBlog };
