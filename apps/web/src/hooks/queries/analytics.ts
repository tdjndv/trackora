import { useQuery } from "@tanstack/react-query"
import { getInsights, getSummaries } from "../../api/analytics"

export function useAnalyticsQuery(input?: {account_ids?: string, from?: string, to?: string}) {
    return useQuery({
        queryKey: ["analytics", input],
        queryFn: () => getSummaries(input),
        placeholderData: (prev) => prev
    })
}

export function useInsightsQuery(input?: {account_ids: string, from: string, to: string}) {
    return useQuery({
        queryKey: ["insights", input],
        queryFn: () => getInsights(input),
        placeholderData: (prev) => prev,
    })
}