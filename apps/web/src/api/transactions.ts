import {api} from "./client"

import type { TransactionCategory, TransactionDTO } from "../types/transactions"
import type { PaginatedResponse } from "../types/general"

export async function listTransactions(params: {
    account_id?: string
    from?: string
    to?: string
    page?: string
    limit?: string
    note?: string
    category?: TransactionCategory
    min_amount?: string
    max_amount?: string
}) {

    const cleaned: Record<string, string> = {}
    if (params.account_id) cleaned.account_id = params.account_id
    if (params.from) cleaned.from = params.from
    if (params.to) cleaned.to = params.to
    if (params.category) cleaned.category = params.category
    if (params.note) cleaned.note = params.note
    if (params.min_amount) cleaned.min_amount = params.min_amount
    if (params.max_amount) cleaned.max_amount = params.max_amount
    if (params.page) cleaned.page = params.page
    if (params.limit) cleaned.limit = params.limit
    
    const res = await api.get("/transactions", {params: cleaned})
    return res.data as PaginatedResponse<TransactionDTO>
}

export async function createTransaction(input: {
    account_id: string
    amount: string
    note?: string
    category: TransactionCategory
    occurred_at: string
}) {
    const res = await api.post("/transactions", input)
    return res.data as TransactionDTO
}

export async function putTransaction(input: {
  id: string
  account_id: string
  amount?: string
  note?: string
  category?: TransactionCategory
  occurred_at?: string
}) {
  const { id, ...rest } = input

  const cleaned: Record<string, string> = {}
  if (rest.account_id) cleaned.account_id = rest.account_id
  if (rest.amount) cleaned.amount = rest.amount
  if (rest.category) cleaned.category = rest.category
  if (rest.note) cleaned.note = rest.note
  if (rest.occurred_at) cleaned.occurred_at = rest.occurred_at

  const res = await api.put(`/transactions/${id}`, cleaned)
  return res.data as TransactionDTO
}

export async function deleteTransaction(input: { id: string }) {
  await api.delete(`/transactions/${input.id}`)
  return input.id
}

export async function quickAddTransaction(input: {account_id: string; note: string; amount: string}) {
  const res = await api.post("/transactions/quick_add", input)
  return res.data as TransactionDTO
}