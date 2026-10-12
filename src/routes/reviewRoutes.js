import { Router } from "express";
import { createReview, deleteReview, getReviews } from "../controllers/reviewController.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = Router()

router.post('/review/create', authenticate, authorizeRole('reader'), createReview)
router.delete('/review/delete/:id', authenticate, authorizeRole('reader'), deleteReview)
router.get('/reviews', authenticate, getReviews)

export default router;