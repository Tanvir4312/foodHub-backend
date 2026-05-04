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

const getMyReviews = async (email: string) => {
    const result = await prisma.review.findMany({
        where: {
            user: {
                email: email
            }
        },
        include: {
            meal: {
                select: {
                    name: true,
                    image_url: true
                }
            }
        }
    });
    return result
}

export const reviewService = { getAllReviews, getMyReviews };