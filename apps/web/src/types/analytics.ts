export type FilterAnalyticsForm = {
    from: string
    to: string
}

export type FilterAnalyticsField = "from" | "to"
export type FilterAnalyticsErrors = Partial<Record<FilterAnalyticsField, string>>