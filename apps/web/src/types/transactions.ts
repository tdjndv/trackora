export type CreateTransactionField = "amount" | "occurred_at" | "category" | "note"
export type CreateFieldErrors = Partial<Record<CreateTransactionField, string>>

export type FilterTransactionField = "note" | "category" | "from" | "to" | "min_amount" | "max_amount"
export type FilterFieldErrors = Partial<Record<FilterTransactionField, string>>

export const TRANSACTION_CATEGORIES = [
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
] as const

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number]

export type TransactionDTO = {
    id: string
    account_id: string
    amount: number
    note: string | null
    category: TransactionCategory
    occurred_at: string

    account: {
        id: string
        name: string
        type: string
        currency: string
    }
}