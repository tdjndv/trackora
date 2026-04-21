import {z} from "zod"
import { ALLOWED_ACCOUNT_TYPES } from "../../static/accountTypes.js"

export const accountTypeSchema = z.enum(ALLOWED_ACCOUNT_TYPES)

export const createAccountBodySchema = z.object({
    name: z.string().min(1, "Name is required").max(50),
    type: accountTypeSchema,
    currency: z.string().length(3).default("CAD")
})

export const getAccountParamsSchema = z.object({
    id: z.cuid()
})

export const putAccountBodySchema = z.object({
    name: z.string().min(1, "Name is required").max(50).optional(),
    type: accountTypeSchema.optional(),
    currency: z.string().length(3).default("CAD").optional()
})

export const getAccountsQuerySchema = z.object({
    name: z.string().optional(),
    type: accountTypeSchema.optional(),
    currency: z.string().length(3).optional()
})

export const setRecentBodySchema = z.object({
    account_id: z.cuid().nullable()
})