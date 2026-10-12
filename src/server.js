import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

import authRoutes from './routes/authRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'

dotenv.config()
const app = express()
app.use(express.json({ limit: '1mb' }))
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/reviews', reviewRoutes)

app.use((req, res) => {
    res.status(404).json({
        status: false,
        message: 'Route not found'
    })
})

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('MongoDB connected')
        app.listen(PORT, () => {
            console.log(`Server is running at PORT: ${PORT}`)
        })
    } catch (error) {
        console.error('Server running failed', error)
        process.exit(1)
    }
}

startServer()