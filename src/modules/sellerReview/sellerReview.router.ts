import { Router } from "express";
import { sellerReviewController } from "./sellerReview.controller.js";
import { requireAuth } from "../../lib/authMiddleware.js";
import { UserRole } from "../../lib/authMiddleware.js";

const router = Router();

router.post("/seller-reviews", requireAuth(UserRole.CUSTOMER), sellerReviewController.createSellerReview);

router.get("/seller-reviews/:sellerId", sellerReviewController.getSellerReviews);

export const sellerReviewRouter = router;
