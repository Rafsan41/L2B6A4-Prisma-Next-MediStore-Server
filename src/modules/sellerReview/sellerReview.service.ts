import { prisma } from "../../lib/prisma.js";

interface CreateSellerReviewData {
    sellerId: string;
    rating: number;
    comment?: string;
    parentId?: string;
}

const createSellerReview = async (customerId: string, data: CreateSellerReviewData) => {
    const seller = await prisma.user.findFirst({
        where: { id: data.sellerId, role: "SELLER" },
    });

    if (!seller) {
        throw new Error("Seller not found");
    }

    const hasOrdered = await prisma.sellerOrder.findFirst({
        where: {
            sellerId: data.sellerId,
            order: { customerId },
        },
    });

    if (!hasOrdered) {
        throw new Error("You can only review sellers you have ordered from");
    }

    const result = await prisma.sellerReview.create({
        data: {
            customerId,
            sellerId: data.sellerId,
            rating: data.rating,
            comment: data.comment ?? null,
            parentId: data.parentId ?? null,
        },
        include: {
            customer: { select: { id: true, name: true, image: true } },
        },
    });

    return result;
};

const getSellerReviews = async (sellerId: string) => {
    const [reviews, stats] = await Promise.all([
        prisma.sellerReview.findMany({
            where: { sellerId, parentId: null },
            orderBy: { createdAt: "desc" },
            include: {
                customer: { select: { id: true, name: true, image: true } },
                replies: {
                    include: {
                        customer: { select: { id: true, name: true, image: true } },
                    },
                },
            },
        }),
        prisma.sellerReview.aggregate({
            where: { sellerId, parentId: null },
            _avg: { rating: true },
            _count: { rating: true },
        }),
    ]);

    return {
        averageRating: stats._avg.rating ?? 0,
        totalReviews: stats._count.rating,
        reviews,
    };
};

export const sellerReviewService = {
    createSellerReview,
    getSellerReviews,
};
