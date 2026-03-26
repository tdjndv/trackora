import jwt from "jsonwebtoken"

export function signToken(user) {
    return jwt.sign(
        {sub: user.id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    )
}

export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
}