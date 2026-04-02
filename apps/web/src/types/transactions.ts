export const TRANSACTION_CATEGORIES = [
  "GROCERIES",
  "RENT",
  "UTILITIES",
  "INSURANCE",
  "EATING_OUT",
  "SHOPPING",
  "ENTERTAINMENT",
  "SUBSCRIPTION",
  "HEALTH",
  "TRANSPORT",
  "TRAVEL",
  "EDUCATION",
  "DEBT_PAYMENT",
  "SALARY",
  "BONUS",
  "FREELANCE",
  "INVESTMENT_INCOME",
  "GIFT",
  "TRANSFER",
  "SAVINGS",
  "INVESTMENT",
  "OTHER",
] as const

export type TransactionDTO = {
    id: string
    account_id: string
    amount: number
    note: string | null
    category: string
    occurred_at: string

    account: {
        id: string
        name: string
        type: string
        currency: string
    }
}

export type FilterTransactionsForm = {
    note: string
    category: string
    from: string
    to: string
    min_amount: string
    max_amount: string
    limit: string
    page: string
}

export type FilterTransactionsField = "min_amount" | "max_amount" | "note" | "from" | "to" | "category" | "limit" | "page"

export type QuickAddTransactionForm = {
    note: string
    amount: string
}

export type QuickAddTransactionField = "note" | "amount"
export type QuickAddTransactionErrors = Partial<Record<QuickAddTransactionField, string>>

export type DetailedAddTransactionForm = {
    amount: string
    note: string
    occurred_at: string
    category: string
}

export type DetailedAddTransactionField = "amount" | "note" | "occurred_at" | "category"