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

export type AccountType = typeof ACCOUNT_TYPES[number]

export type AccountDTO = {
    id: string
    user_id: string
    name: string
    type: AccountType
    currency: string
    created_at: string
    updated_at: string
    isDefault: boolean
}

export function isAccountType(type: string) {
    return (ACCOUNT_TYPES as readonly string[]).includes(type)
}

export function stringToAccountType(type: string) {
    return isAccountType(type) ? type as AccountType : undefined
}