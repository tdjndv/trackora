import express from "express"
import stripe from "../utils/stripe.js"
import { requireAuth } from "../middleware/requireAuth.js"
import { prisma } from "../utils/prisma.js"

const router = express.Router()

router.post("/checkout-session", requireAuth, async (req, res) => {
    const userId = req.user.id
    const priceId = process.env.STRIPE_PRICE_ID

    const user = await prisma.user.findUnique({
        where: {id: userId}
    })

    let customerId = user.stripe_customer_id

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
                user_id: user.id
            }
        })

        customerId = customer.id

        await prisma.user.update({
            where: {id: user.id},
            data: {
                stripe_customer_id: customerId
            }
        })
    }

    const sessionConfig = {
        mode: "subscription",
        customer: customerId,
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ],
        success_url: `${process.env.APP_URL}/billing/success`,
        cancel_url: `${process.env.APP_URL}/billing/cancel`,

        metadata: {
            user_id: user.id
        }
    }

    if (!user.has_used_trial) {
        sessionConfig.subscription_data = {
            trial_period_days: 7
        }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    res.json({url: session.url})
    
})

router.post("/cancel-at-period-end", requireAuth, async(req, res) => {
    const user = await prisma.user.update({
        where: {id: req.user.id},
        data: {
            cancel_at_period_end: req.body.value
        }
    })

    if (!user.stripe_subscription_id) {
        return res.status(400).json({message: "Subscription not found"})
    }

    
    const subscription = await stripe.subscriptions.update(
        user.stripe_subscription_id,
        {
            cancel_at_period_end: req.body.value
        }
    )

    return res.json({
        message: "Subscription will cancel at period end",
        subscription
    })
})

router.get("/me", requireAuth, async(req, res) => {
    const user = await prisma.user.findUnique({
        where: {id: req.user.id},
        select: {
            plan: true,
            subscription_status: true,
            cancel_at_period_end: true,
            current_period_end: true
        }
    })
    return res.json(user)
})

export default router