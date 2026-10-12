import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 80
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    role: {
        type: String,
        enum: ['auther', 'reader'],
        required: true,
        default: 'reader'
    }
}, { timestamps: true })

userSchema.pre('save', function () {
    if (!this.isModified('password')) return;
    this.password = bcrypt.hash(this.password, 12)
})

userSchema.method.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema)

