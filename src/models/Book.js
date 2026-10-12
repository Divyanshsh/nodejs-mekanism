import mongoose from "mongoose";
import { Book_Category } from "../constants/constants.js";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 200
    },
    description: {
        type: String,
        trim: true,
        maxLength: 3000,
        default: ''
    },
    content: {
        type: String,
        required: true,
        minLength: 1
    },
    category: {
        type: String,
        required: true,
        enum: Book_Category
    },
    tags: {
        type: [String],
        default: []
    },
    coverImage: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
        index: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    publishedAt: {
        type: Date,
        default: null
    },
    views: {
        type: Number,
        default: 0,
        min: 0
    }
}, { timestamps: true })

bookSchema.index({ title: 'text', descriptio: 'text' })
bookSchema.index({ category: 1, status: 1 })
bookSchema.index({ status: 1, publishedAt: -1 })

export default mongoose.model('Book', bookSchema)