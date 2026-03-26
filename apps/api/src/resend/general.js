import {Router} from "express"

import {resend} from "../utils/resend.js"

import { successMessage, failedMessage, signupMessage } from "./message.js"

const router = Router()

router.post("/signup", async (req, res) => {
    const {to} = req.body

    const data = await resend.emails.send({
        subject: "You have signed up for Trackora",
        from: process.env.EMAIL_FROM,
        to: to,
        html: signupMessage
    })
    return res.json("sent")
})

export async function sendPaymentSuccess(email) {
    const data = await resend.emails.send({
        subject: "Subscription Updated: Payment Success",
        from: process.env.EMAIL_FROM,
        to: email,
        html: successMessage
    })
}

export async function sendPaymentFailed(email) {
    const data = await resend.emails.send({
        subject: "Subscription Updated: Payment Failed",
        from: process.env.EMAIL_FROM,
        to: email,
        html: failedMessage
    })
}

export default router