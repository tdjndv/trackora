import {z} from "zod"

const MIN_DATE="2000-01-01"

export const categorySchema = z.enum([
    "GROCERIES",
  "RENT",
  "TRANSPORT",
  "EATING_OUT",
  "SHOPPING",
  "SUBSCRIPTION",
  "HEALTH",
  "ENTERTAINMENT",
  "TRAVEL",
  "SALARY",
  "BONUS",
  "INVESTMENT",
  "TRANSFER",
    "OTHER",
])

export const validDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((s) => {
        const d = new Date(s + "T00:00:00.000Z")
        return d.toISOString().slice(0, 10) === s
    })
    .refine((s) => s >= MIN_DATE, "Date must be after 2000-01-01")
    .refine((s) => {
        const today = new Date().toISOString().slice(0, 10)
        return s <= today
    }, `Date must be before ${new Date().toISOString().slice(0, 10)}`)

export const standardTimeSchema = validDateSchema
    .transform((s) => new Date(s + "T00:00:00.000Z"))

function nextDayUTC(d) {
    const nd = new Date(d)
    nd.setUTCDate(nd.getUTCDate() + 1)
    return nd
}

export const toExclusiveTimeSchema = validDateSchema
    .transform((s) => nextDayUTC(new Date(s + "T00:00:00.000Z")))

export const amountSchema = z
    .string()
    .regex(/^-?\d+(\.\d{1,2})?$/, "Please enter a valid amount")
    .transform((val) => {
        const number = Number(val)
        return Math.round(number * 100)
    })
    .refine((val) => val !== 0, "Amount cannot be zero")

export const createTransactionBodySchema = z.object({
    account_id: z.cuid(),
    amount: amountSchema,
    note: z.string().max(1000).optional(),
    category: categorySchema.default("OTHER"),
    occurred_at: standardTimeSchema
})

export const putTransactionBodySchema = z.object({
    account_id: z.cuid().optional(),
    amount: amountSchema.optional(),
    note: z.string().max(1000).optional(),
    category: categorySchema.optional(),
    occurred_at: standardTimeSchema.optional()
})

export const transactionParamsSchema = z.object({
    id: z.cuid()
})

export const getTransactionsQuerySchema = z.object({
    account_id: z.cuid().optional(),
    from: standardTimeSchema.optional(),
    to: toExclusiveTimeSchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    note: z.string().optional(),
    category: categorySchema.optional(),
    min_amount: amountSchema.optional(),
    max_amount: amountSchema.optional()
})

export const getTransactionsSummariesQuerySchema = z.object({
    account_ids: z.string().optional()
        .transform((val) => {
            if (!val) return
            return val.split(",").map((v) => v.trim()).filter(Boolean)
        })
        .pipe(z.array(z.cuid()).optional()),

    from: standardTimeSchema.optional(),
    to: toExclusiveTimeSchema.optional()
})