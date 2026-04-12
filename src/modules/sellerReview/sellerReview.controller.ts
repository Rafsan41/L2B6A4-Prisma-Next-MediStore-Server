import { Request, Response } from "express";
import { sellerReviewService } from "./sellerReview.service.js";

const createSellerReview = async (req: Request, res: Response) => {
    try {
        const customerId = req.user!.id;
        const result = await sellerReviewService.createSellerReview(customerId, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getSellerReviews = async (req: Request, res: Response) => {
    try {
        const { sellerId } = req.params;
        const result = await sellerReviewService.getSellerReviews(sellerId as string);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sellerReviewController = {
    createSellerReview,
    getSellerReviews,
};
