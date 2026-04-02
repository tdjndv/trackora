import {verifyToken} from "../utils/jwt.js"

export function requireAuth(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ok: false, message: "Not signed in"})
    }

    try {
        const payload = verifyToken(token)

        req.user = {
            id: payload.sub,
            email: payload.email
        }
        next()
    } catch {
        return res.status(401).json({ok: false, message: "Invalid or expired token"})
    }
}