import { Router } from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
import { createBook, deleteBook, getBooks, updateBook } from "../controllers/bookController.js";

const router = Router()

router.post('/book/create', authenticate, authorizeRole('author'), createBook)
router.put('/book/update/:id', authenticate, authorizeRole('author'), updateBook)
router.delete('/book/delete/:id', authenticate, authorizeRole('author'), deleteBook)
router.get('/books', authenticate, getBooks)

export default router;