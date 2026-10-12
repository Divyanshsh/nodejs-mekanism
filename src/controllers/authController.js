import User from '../models/User.js'
import { createToken } from '../constants/constants.js';

export async function register(req, res) {
    try {
        const { name, email, password, role } = req.body;

        if (!name.trim() || !email.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, Email, and Password are required"
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at-least 8 characters"
            })
        }

        if (!['author', 'reader'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be Author or Reader"
            })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const existingUser = await User.findOne({
            email: normalizedEmail
        })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exist'
            })
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role
        })

        return res.status(201).json({
            success: true,
            message: 'Registration Successfully',
            token: createToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Registration failed'
        })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and Password required'
            })
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select('+password')

        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({
                success: false,
                message: 'Invalid Email or Password'
            })
        }

        return res.json({
            success: true,
            message: 'Login Successfull',
            token: createToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Login failed'
        })
    }
}

export async function getMe(req, res) {
    return res.status(200).json({
        success: true,
        message: 'Success',
        user: req.user
    })
}