import { Request, Response } from "express";
import { reviewService } from "./review.service";

const getAllReviews = async (req: Request, res: Response) => {
    try {
        const result = await reviewService.getAllReviews();
        res.status(200).json({
            success: true,
            message: "Review fetched successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error
        });
    }
};

export const reviewController = { getAllReviews };