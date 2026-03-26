import { TRANSACTION_CATEGORIES, type TransactionCategory } from "../types/transactions"

export function minYYYYMMDD() {
    return "2000-01-01"
}

export function todayYYYYMMDD() {
    return new Date().toISOString().slice(0, 10)
}

export function formatCents(cents: number) {
    const dollars = Math.trunc(cents / 100)
    const remainder = Math.abs(cents) % 100
    const centsString = remainder < 10 ? `0${remainder}` : String(remainder)
    return `$${dollars}.${centsString}`
}

export function toYYYYMMDD(iso: string) {
    if (!iso) return ""
    return iso.slice(0, 10)
}

export function stringToCategory(category: string) {
    const normalized = category.trim().toUpperCase()
    return TRANSACTION_CATEGORIES.includes(
        normalized as TransactionCategory
    )
    ? (normalized as TransactionCategory)
    : undefined
}

export function enumToString(category: string) {
    return category.toLowerCase().replace(/_/g, " ")
        .split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
}

export function getErrorMessage(error: any) {
    return error.response.data.message
}

