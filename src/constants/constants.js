export const Book_Category = ["Technology", "Fiction", "Science", "Mystery", "Other"]

export function createToken(user) {
    return jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_SECRET || 'id' }
    )
}