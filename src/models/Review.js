import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
        index: true
    },
    reader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validator: {
            validator: Number.isInteger,
            message: 'Rating must be a number from 1 to 5'
        }
    },
    comment: {
        type: String,
        trim: true,
        maxLength: 1000,
        default: ''
    }
}, { timestamps: true })

reviewSchema.index(
    { book: 1, reader: 1 },
    { unique: true }
)

reviewSchema.index({ book: 1, createdAt: -1 })

export default mongoose.model('Review', reviewSchema)