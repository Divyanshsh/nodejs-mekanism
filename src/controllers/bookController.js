import mongoose from "mongoose"
import Book from "../models/Book.js"

export async function createBook(req, res) {
    try {
        const {
            title,
            description,
            content,
            category,
            converImage,
            tags,
            status
        } = req.body

        if (status && !['draft', 'published'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must by draft or published'
            })
        }

        const book = await Book.create({
            title,
            description,
            content,
            category,
            converImage,
            tags,
            author: req.user.id,
            status,
            publishedAt: status === 'published' ? new Date() : null
        })

        return res.status(201).json({
            success: true,
            message: 'Book successfully created',
            data: book
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Issue - Book was not created'
        })
    }
}

export async function getBooks(req, res) {
    try {
        const book = await Book.find({
            author: req.user.id
        }).sort({ updatedAt: -1 })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to fetch books'
        })
    }
}

async function findOwnedBook(bookId, authorId) {
    if (!mongoose.isValidObjectId(bookId)) {
        return null
    }

    return Book.findOne({
        _id: bookId,
        author: authorId
    })
}

export async function updateBook(req, res) {
    try {
        const book = await findOwnedBook(req.params.id, req.user.id)
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            })
        }

        const allowedFields = [
            'title',
            'description',
            'content',
            'category',
            'converImage',
            'tags',
        ]

        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                book[field] = req.body[field]
            }
        }

        await book.save()

        return res.status(201).json({
            success: true,
            message: 'Book updated successfully',
            data: book
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update book'
        })
    }
}

export async function deleteBook(req, res) {
    try {
        const book = await findOwnedBook(req.params.id, req.user.id)

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            })
        }

        await Book.deleteOne({ _id: book._id })
        return res.status(201).json({
            success: true,
            message: 'Book deleted successfully',
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: 'Issue - Book was not deleted'
        })
    }
}