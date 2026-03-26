import { api } from "./client";

export async function getSummaries(params: {
    account_ids?: string
    from?: string
    to?: string
}) {
    const cleaned: Record<string, string> = {}
    if (params.account_ids) cleaned.account_ids = params.account_ids
    if (params.from) cleaned.from = params.from
    if (params.to) cleaned.to = params.to

    const res = await api.get("/transactions/summary", {params: cleaned})
    return res.data
}