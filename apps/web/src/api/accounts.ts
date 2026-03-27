import {api} from "./client"

import type { AccountDTO } from "../types/accounts"

export async function listAccounts(params? : {name?: string, type?: string | null, currency?: string}) {
    const cleaned: Record<string, string> = {}

    if (params?.name) cleaned.name = params.name
    if (params?.type) cleaned.type = params.type
    if (params?.currency) cleaned.currency = params.currency

    const res = await api.get("/accounts", {params: cleaned})
    return res.data as AccountDTO[]
}

export async function createAccount(input: {name: string, type: string | null, currency: string}) {
    const res = await api.post("/accounts", input)
    return res.data as AccountDTO
}

export async function putAccount(input: {
    id: string
    name?: string
    type?: string
    currency?: string
}) {
    const {id, ...rest} = input

    const cleaned: Record<string, string> = {}
    if (rest?.name) cleaned.name = rest.name
    if (rest?.type) cleaned.type = rest.type
    if (rest?.currency) cleaned.currency = rest.currency

    const res = await api.put(`/accounts/${id}`, cleaned)
    return res.data as AccountDTO
}

export async function deleteAccount(input: {id: string}) {
    await api.delete(`/accounts/${input.id}`)
    return input.id
}

export async function getRecentAccount() {
    const res = await api.get("/accounts/recent")
    return res.data
}

export async function setRecentAccount(input: {account_id: string | null}) {
    const res = await api.put("/accounts/recent", input)
    return res.data
}