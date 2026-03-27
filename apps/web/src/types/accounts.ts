export const ACCOUNT_TYPES = [
    "CHECKING",
    "SAVINGS",
    "CREDIT_CARD",
    "CASH",
    "WECHAT",
    "ZHIFUBAO",
    "INVESTMENT",
    "OTHER"
] as const

export type AccountDTO = {
    id: string
    user_id: string
    name: string
    type: string
    currency: string
    created_at: string
    updated_at: string
}

export type AddAccountForm = {
    name: string
    type: string
    currency: string
}
export type AddAccountField = "name" | "type" | "currency"
export type AddAccountErrors = Partial<Record<AddAccountField, string>>

export type FilterAccountForm = {
    name: string
    type: string
    currency: string
}
export type FilterAccountField = "name" | "type" | "currency"
export type FilterAccountErrors = Partial<Record<FilterAccountField, string>>

