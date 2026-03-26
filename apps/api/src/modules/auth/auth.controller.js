import * as authService from "./auth.service.js"

import {signToken} from "../../utils/jwt.js"

function setCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.MODE === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

export function clearCookie(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.MODE === "production",
        path: "/"
    })
    return res.json(true)
}

export async function signIn(req, res) {
    const user = await authService.signIn(req.validated.body)

    const token = signToken(user)

    setCookie(res, token)

    return res.json(user)
}

export async function signUp(req, res) {
    const user = await authService.signUp(req.validated.body)

    const token = signToken(user)

    setCookie(res, token)

    return res.json(user)
}

export async function me(req, res) {
    const user = await authService.getUserByEmail(req.user.email)
    return res.json(user)
}