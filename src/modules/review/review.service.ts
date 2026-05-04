import { prisma } from "../../lib/prisma";


const getAllReviews = async () => {
    const result = await prisma.review.findMany({
        include: {

            meal: {
                select: {
                    name: true
                }
            }
        }
    });
    return result
}

export const reviewService = { getAllReviews };