import express from "express"
import cors from "cors"

import cookieParser from "cookie-parser"

//routes
import authRoutes from "./modules/auth/auth.routes.js"
import accountsRoutes from "./modules/accounts/accounts.routes.js"
import transactionsRoutes from "./modules/transactions/transactions.routes.js"

//error handler
import * as errorHandler from "./middleware/errorHandler.js"

import stripeWebhookRouter from "./stripe/webhook.js"
import billingRouter from "./stripe/general.js"
import emailRouter from "./resend/general.js"

const app = express()
app.use("/stripe", stripeWebhookRouter)

app.use(express.json())

app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}))

app.use("/billing", billingRouter)
app.use("/email", emailRouter)

app.use("/auth", authRoutes)
app.use("/accounts", accountsRoutes)
app.use("/transactions", transactionsRoutes)

const port = process.env.PORT

app.get("/health", (req, res) => {
    res.json({ok: true, message: `Server is running on ${port}`})
})

app.use(errorHandler.notFound)
app.use(errorHandler.generalError)

app.listen(port, () => {
    console.log(`Server starts listening on ${port}`)
})