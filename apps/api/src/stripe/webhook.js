import express from "express"
import { prisma } from "../utils/prisma.js"
import stripe from "../utils/stripe.js"
import { sendPaymentSuccess, sendPaymentFailed } from "../resend/general.js"

const router = express.Router()

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"]

    let event

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    } catch (e) {
      console.log("Webhook signature failed")
      return res.status(400).send("Invalid signature")
    }

    try {
      const existing = await prisma.stripeWebhookEvent.findUnique({
        where: {id: event.id}
      })

      if (existing) {
        return res.json({received: true})
      }

      switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object

        const userId = session.metadata.user_id
        const customerId = session.customer
        const subscriptionId = session.subscription

        await prisma.user.update({
          where: { id: userId },
          data: {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          },
        })
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object

        const subscriptionId = invoice.parent.subscription_details.subscription

        const customerId = invoice.customer

        const user = await prisma.user.findUnique({
          where: { stripe_customer_id: customerId },
        })

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const endDate = subscription.items.data[0].current_period_end
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripe_subscription_id: subscriptionId,
            plan: "PRO",
            subscription_status: subscription.status,
            current_period_end: new Date(endDate * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end,
            has_used_trial: true,
          },
        })

        sendPaymentSuccess(user.email)
        console.log(`${user.email} invoice paid for ${invoice.amount_paid}`)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object
        const customerId = invoice.customer

        const user = await prisma.user.findUnique({
          where: {stripe_customer_id: customerId}
        })

        await prisma.user.update({
          where: {id: user.id},
          data: {
            subscription_status: "past_due"
          }
        })

        sendPaymentFailed(user.email)
        console.log(`${user.email} payment failed`)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object
        const customerId = subscription.customer

        const user = await prisma.user.findUnique({
          where: { stripe_customer_id: customerId },
        })

        const endDate = subscription.items.data[0].current_period_end 

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscription_status: subscription.status,
            current_period_end: new Date(endDate * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end,
            plan:
              subscription.status === "active" || subscription.status === "trialing"
                ? "PRO"
                : "FREE",
            
          },
        })

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object
        const customerId = subscription.customer

        const user = await prisma.user.findUnique({
          where: { stripe_customer_id: customerId },
        })
        if (!user) break
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: "FREE",
            subscription_status: "canceled",
            current_period_end: null,
            cancel_at_period_end: false
          },
        })
        break
      }
    }

    await prisma.stripeWebhookEvent.create({
      data: {
        id: event.id,
        type: event.type
      }
    })

    res.json({ received: true })

    } catch (e) {
      if (e.code === "P2025") {
        console.log("user deleted, ignore webhook")
      } else {
        console.log("Webhook handler error", e)
      }
      return res.json({recieved: true})
    }

  }
)

export default router