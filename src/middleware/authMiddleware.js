import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function authenticate(req, res, next) {
    try {
        const authorization = req.headers.authorization
        if (!authorization.startsWith('Bearer')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication is failed'
            })
        }
        const token = authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User account not found'
            })
        }

        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        }
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid request or authentication failed'
        });
    }
}

export function authorizeRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to perform this action"
            })
        }
        next()
    }
}