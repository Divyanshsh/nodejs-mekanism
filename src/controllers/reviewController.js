import mongoose from "mongoose";
import Book from "../models/Book.js";
import Review from "../models/Review.js";

export async function createReview(req, res) {
    try {
        const { rating, comment = '' } = req.body
        const { bookId } = req.params
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid book id'
            })
        }

        if (!Number.isInteger(rating)) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be in whole number'
            })
        }

        if (!comment) {
            return res.status(400).json({
                success: false,
                message: 'Comment is required'
            })
        }

        const book = await Book.findOne({
            _id: bookId,
            status: 'published'
        })

        if (!book) {
            return res.status(400).json({
                success: false,
                message: 'Published book not found'
            })
        }

        const review = await Review.create({
            book: bookId,
            reader: req.user.id,
            rating,
            comment
        })

        await review.populate('reader', 'name')

        return res.status(201).json({
            success: true,
            message: 'Review added successfully'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Issue - Not able to create review'
        })
    }
}

export async function getReviews(req, res) {
    try {
        const { bookId } = req.params
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid book id'
            })
        }

        const book = await Book.findOne({
            _id: bookId,
            status: 'published'
        })

        if (!book) {
            return res.status(400).json({
                success: false,
                message: 'Published book not found'
            })
        }

        const review = await Review.find({ book: bookId })

        return res.status(200).json({
            success: false,
            reviews: review
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Issue - Not able to create review'
        })
    }
}

export async function deleteReview(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review id'
            })
        }

        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            reader: req.user.id
        })

        if (!review) {
            return res.status(400).json({
                success: false,
                message: 'Review does not exist'
            })
        }

        return res.status(201).json({
            success: true,
            message: 'Review deleted successfully'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Issue - Not able to create review'
        })
    }
}