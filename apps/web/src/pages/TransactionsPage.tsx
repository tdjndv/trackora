// TransactionsPage.tsx
import React, { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
  listTransactions,
  createTransaction,
  putTransaction,
  deleteTransaction,
  quickAddTransaction,
} from "../api/transactions"

import {
  formatCents,
  todayYYYYMMDD,
  toYYYYMMDD,
  stringToCategory,
  getErrorMessage,
  enumToString
} from "../utils/general.ts"

import {
  TRANSACTION_CATEGORIES,
  type CreateFieldErrors,
  type FilterFieldErrors,
  type TransactionCategory,
  type TransactionDTO
} from "../types/transactions.ts"

import { getDefaultAccount, listAccounts } from "../api/accounts"
import type { PaginatedResponse } from "../types/general.ts"
import LoadingPage from "./LoadingPage"

export default function TransactionsPage() {
  const queryClient = useQueryClient()

  const [searchParams, setSearchParams] = useSearchParams()

  const [createFieldErrors, setCreateFieldErrors] = useState<CreateFieldErrors>({})
  const [filterFieldErrors, setFilterFieldErrors] = useState<FilterFieldErrors>({})

  function clearCreateErrors() {
    setCreateFieldErrors({})
  }

  function clearFilterErrors() {
    setFilterFieldErrors({})
  }

  const params = useMemo(() => {
    const account_id = searchParams.get("account_id") ?? ""
    const from = searchParams.get("from") ?? ""
    const to = searchParams.get("to") ?? ""
    const page = searchParams.get("page") ?? "1"
    const limit = searchParams.get("limit") ?? "10"
    const note = searchParams.get("note") ?? ""
    const category = searchParams.get("category") ?? ""
    const min_amount = searchParams.get("min_amount") ?? ""
    const max_amount = searchParams.get("max_amount") ?? ""

    return { account_id, from, to, page, limit, note, category, min_amount, max_amount }
  }, [searchParams])

  const pageNum = Number(params.page) || 1
  const limitNum = Number(params.limit) || 10

  const toUndef = (v: string) => (v.trim() ? v : undefined)

  const [draftFrom, setDraftFrom] = useState(params.from)
  const [draftTo, setDraftTo] = useState(params.to)

  useEffect(() => setDraftFrom(params.from), [params.from])
  useEffect(() => setDraftTo(params.to), [params.to])

  const setFilter = (key: string, value: string, { resetPage = true } = {}) => {
    const next = new URLSearchParams(searchParams)
    if (!value) next.delete(key)
    else next.set(key, value)
    if (resetPage) next.set("page", "1")
    setSearchParams(next)
  }

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams)
    next.set("page", String(Math.max(1, nextPage)))
    setSearchParams(next)
  }

  const clearAll = () => setSearchParams(new URLSearchParams())

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: () => listAccounts({}),
    placeholderData: (prev) => prev,
  })
  const accountsData = accountsQuery.data

  const defaultAccountQuery = useQuery({
    queryKey: ["default_account"],
    queryFn: () => getDefaultAccount(),
  })

  const defaultAccount = defaultAccountQuery.data

  const transactionsQuery = useQuery({
    queryKey: ["transactions", params],
    queryFn: () =>
      listTransactions({
        account_id: toUndef(params.account_id),
        from: toUndef(params.from),
        to: toUndef(params.to),
        page: toUndef(params.page),
        limit: toUndef(params.limit),
        note: toUndef(params.note),
        category: stringToCategory(params.category),
        min_amount: toUndef(params.min_amount),
        max_amount: toUndef(params.max_amount),
      }),
    placeholderData: (prev) => prev,
    retry: 1
  })

  useEffect(() => {
    if (transactionsQuery.isError) {
      const error = transactionsQuery.error as any
      const issues = error.response.data.issues

      const fieldErrors: Record<string, string> = {}
      for (const issue of issues) {
        fieldErrors[issue.path[0]] = issue.message
      }
      setFilterFieldErrors(fieldErrors)
    } else {
      clearFilterErrors()
    }
  }, [transactionsQuery.isError, transactionsQuery.error])

  const txRes: PaginatedResponse<TransactionDTO> | undefined = transactionsQuery.data ?? undefined
  const transactions: TransactionDTO[] = txRes?.data ?? []
  const meta = txRes?.meta

  const [createAccountId, setCreateAccountId] = useState<string>(params.account_id)
  const [createAmount, setCreateAmount] = useState<string>("")
  const [createNote, setCreateNote] = useState<string>("")
  const [createCategory, setCreateCategory] = useState<TransactionCategory | "">("")
  const [createOccurredAt, setCreateOccurredAt] = useState<string>(todayYYYYMMDD())

  const [quickNote, setQuickNote] = useState<string>("")
  const [quickAmount, setQuickAmount] = useState<string>("")

  useEffect(() => {
    if (params.account_id) setCreateAccountId(params.account_id)
  }, [params.account_id])

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<TransactionDTO | null>(null)

  const [editAccountId, setEditAccountId] = useState("")
  const [editAmount, setEditAmount] = useState("")
  const [editNote, setEditNote] = useState("")
  const [editCategory, setEditCategory] = useState<TransactionCategory | "">("")
  const [editOccurredAt, setEditOccurredAt] = useState(todayYYYYMMDD())

  const openEdit = (transaction: TransactionDTO) => {
    setEditingTransaction(transaction)
    setEditAccountId(transaction.account_id)
    setEditAmount(formatCents(transaction.amount).slice(1))
    setEditNote(transaction.note ?? "")
    setEditCategory(transaction.category ?? "")
    setEditOccurredAt(toYYYYMMDD(transaction.occurred_at))
    setIsEditOpen(true)
  }

  const closeEdit = () => {
    setIsEditOpen(false)
    setEditingTransaction(null)
  }

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      setCreateAmount("")
      setCreateNote("")
      setCreateCategory("")
      setCreateOccurredAt(todayYYYYMMDD())
    },
    onError: (error: any) => {
      const fieldErrors: Record<string, string> = {}
      for (const issue of error.response.data.issues) {
        fieldErrors[issue.path[0]] = issue.message
      }
      setCreateFieldErrors(fieldErrors)
    }
  })

  const quickAddMutation = useMutation({
    mutationFn: quickAddTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["transactions"]})
      setQuickAmount("")
      setQuickNote("")
    }
  })

  const updateMutation = useMutation({
    mutationFn: putTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      closeEdit()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!createAccountId) return
    if (!createCategory) return

    clearCreateErrors()

    createMutation.mutate({
      account_id: createAccountId,
      amount: createAmount,
      note: createNote || undefined,
      category: createCategory,
      occurred_at: createOccurredAt,
    })
  }

  const handleQuick = async (e: any) => {
    e.preventDefault()
    if (!quickNote) return
    if (!quickAmount) return
    if (!defaultAccount) return
 
    quickAddMutation.mutate({
      account_id: defaultAccount.id,
      amount: quickAmount,
      note: quickNote
    })
  }

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTransaction) return

    updateMutation.mutate({
      id: editingTransaction.id,
      account_id: editAccountId,
      amount: editAmount || undefined,
      note: editNote || undefined,
      category: editCategory || undefined,
      occurred_at: editOccurredAt || undefined,
    })
  }

  const handleDelete = (transaction: TransactionDTO) => {
    if (!confirm(`Delete transaction ${transaction.note || ""} Category: ${transaction.category}"?`)) return
    deleteMutation.mutate({ id: transaction.id })
  }

  if (transactionsQuery.isLoading && !transactionsQuery.data) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
              Trackora
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Transactions
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Filter, create, edit, and manage your income and expenses in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={clearAll}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            Clear all filters
          </button>
        </div>

        {transactionsQuery.isFetching && transactionsQuery.data ? (
          <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            Updating transactions...
          </div>
        ) : null}

        {/* Quick Add */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Quick add</h2>
              <p className="mt-1 text-sm text-slate-500">
                Just note + amount for fast entry. We’ll use your default account automatically.
              </p>
            </div>

            <div className="flex items-center">
              {defaultAccountQuery.isLoading ? (
                <div className="rounded-2xl bg-slate-50 px-4 py-2 text-xs text-slate-500 ring-1 ring-inset ring-slate-200">
                  Loading default account...
                </div>
              ) : defaultAccount ? (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 px-4 py-2 text-sm text-sky-800 ring-1 ring-inset ring-sky-200">
                  <span className="text-base leading-none">⭐</span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-sky-600">
                      Using default account
                    </span>
                    <span className="font-semibold">
                      {defaultAccount.name} ({defaultAccount.currency})
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-700 ring-1 ring-inset ring-amber-200">
                  No default account selected
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={handleQuick}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            {/* Note */}
            <input
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="e.g. Starbucks"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />

            {/* Amount */}
            <input
              value={quickAmount}
              onChange={(e) => setQuickAmount(e.target.value)}
              inputMode="decimal"
              placeholder="-5.45"
              className="w-full sm:w-40 rounded-xl border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={quickAddMutation.isPending}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
              {quickAddMutation.isPending ? "Adding..." : "Add"}
            </button>
          </form>
          {quickAddMutation.isSuccess ? (
            <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              Transaction added.
            </div>
          ) : null}
        </div>

        {/* Create Transaction */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Add transaction</h2>
              <p className="mt-1 text-sm text-slate-500">
                Record new income or expense activity for one of your accounts.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600 ring-1 ring-inset ring-slate-200">
              Amount supports decimals like <span className="font-medium">12.99</span>. Use
              negative for expenses and positive for income.
            </div>
          </div>

          <form onSubmit={handleCreate} className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <div className="xl:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Account</label>
              <select
                value={createAccountId}
                onChange={(e) => setCreateAccountId(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Select account</option>
                {(accountsData ?? []).map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.currency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Amount</label>
              <input
                value={createAmount}
                onChange={(e) => {
                  setCreateAmount(e.target.value)
                  setCreateFieldErrors((prev) => ({ ...prev, amount: undefined }))
                }}
                inputMode="decimal"
                placeholder="e.g. -12.99"
                required
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {createFieldErrors.amount ? (
                <div className="mt-1 text-xs font-medium text-red-600">{createFieldErrors.amount}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Occurred at</label>
              <input
                type="date"
                min="2000-01-01"
                max={todayYYYYMMDD()}
                value={createOccurredAt}
                onChange={(e) => setCreateOccurredAt(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select
                value={createCategory}
                onChange={(e) => setCreateCategory(e.target.value as TransactionCategory)}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Select category</option>
                {TRANSACTION_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {enumToString(c)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Note</label>
              <input
                value={createNote}
                onChange={(e) => setCreateNote(e.target.value)}
                placeholder="Optional"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="xl:col-span-6 flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60"
              >
                {createMutation.isPending ? "Adding..." : "Add transaction"}
              </button>

              {createMutation.isSuccess ? (
                <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                  Transaction added.
                </div>
              ) : null}
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <p className="mt-1 text-sm text-slate-500">
                Narrow results by account, note, category, date range, and amount.
              </p>
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Reset filters
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Account</label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={params.account_id}
                onChange={(e) => setFilter("account_id", e.target.value)}
              >
                <option value="">All</option>
                {(accountsData ?? []).map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.currency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Note</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={params.note}
                onChange={(e) => setFilter("note", e.target.value)}
                placeholder="e.g. Costco"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={params.category}
                onChange={(e) => setFilter("category", e.target.value)}
              >
                <option value="">All</option>
                {TRANSACTION_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {enumToString(c)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">From</label>
              <input
                type="date"
                min="2000-01-01"
                max={todayYYYYMMDD()}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={draftFrom}
                onChange={(e) => setDraftFrom(e.target.value)}
                onBlur={() => setFilter("from", draftFrom)}
              />
              {filterFieldErrors.from ? (
                <div className="mt-1 text-xs font-medium text-red-600">{filterFieldErrors.from}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">To</label>
              <input
                type="date"
                min="2000-01-01"
                max={todayYYYYMMDD()}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={draftTo}
                onChange={(e) => setDraftTo(e.target.value)}
                onBlur={() => setFilter("to", draftTo)}
              />
              {filterFieldErrors.to ? (
                <div className="mt-1 text-xs font-medium text-red-600">{filterFieldErrors.to}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Min amount</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={params.min_amount}
                onChange={(e) => setFilter("min_amount", e.target.value)}
                inputMode="decimal"
                placeholder="0.00"
              />
              {filterFieldErrors.min_amount ? (
                <div className="mt-1 text-xs font-medium text-red-600">{filterFieldErrors.min_amount}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Max amount</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={params.max_amount}
                onChange={(e) => {
                  setFilter("max_amount", e.target.value)
                }}
                inputMode="decimal"
                placeholder="100.00"
              />
              {filterFieldErrors.max_amount ? (
                <div className="mt-1 text-xs font-medium text-red-600">{filterFieldErrors.max_amount}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Limit</label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={params.limit}
                onChange={(e) => setFilter("limit", e.target.value)}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="w-full rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-800 ring-1 ring-inset ring-sky-200">
                Page <span className="font-semibold">{pageNum}</span> • Limit{" "}
                <span className="font-semibold">{limitNum}</span>
                {transactionsQuery.isFetching ? (
                  <span className="ml-2 text-xs font-medium text-sky-700">Updating…</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-6">
          {transactions.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">No transactions found</h3>
              <p className="mt-2 text-sm text-slate-600">
                Try changing your filters or add a new transaction above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => {
                const isIncome = tx.amount > 0
                return (
                  <div
                    key={tx.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-xl font-bold text-slate-900">
                            {formatCents(tx.amount)}
                          </div>

                          <span
                            className={
                              "rounded-full px-2.5 py-1 text-xs font-semibold " +
                              (isIncome
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                                : "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200")
                            }
                          >
                            {isIncome ? "Income" : "Expense"}
                          </span>

                          {tx.category ? (
                            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
                              {enumToString(tx.category)}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-2 text-sm text-slate-600">
                          {tx.account ? (
                            <>
                              {tx.account.name} • {tx.account.type} • {tx.account.currency}
                            </>
                          ) : (
                            <>account_id: {tx.account_id}</>
                          )}
                        </div>

                        {tx.note ? (
                          <div className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            Note: {tx.note}
                          </div>
                        ) : null}

                        <div className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                          {toYYYYMMDD(tx.occurred_at)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(tx)}
                          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(tx)}
                          disabled={deleteMutation.isPending}
                          className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 shadow-sm transition hover:bg-rose-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              disabled={!meta?.hasPrev}
              onClick={() => setPage(pageNum - 1)}
            >
              Prev
            </button>

            <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-700 ring-1 ring-inset ring-slate-200">
              Page <span className="font-semibold">{pageNum}</span>
            </div>

            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              disabled={!meta?.hasNext}
              onClick={() => setPage(pageNum + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
              onClick={closeEdit}
            />

            <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Edit transaction</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Update transaction details and save your changes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-xl px-3 py-2 text-slate-600 transition hover:bg-slate-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Account</label>
                  <select
                    value={editAccountId}
                    onChange={(e) => setEditAccountId(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="">Select Account</option>
                    {(accountsData ?? []).map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.currency})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Amount</label>
                  <input
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    inputMode="decimal"
                    placeholder="e.g. -12.99"
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as TransactionCategory)}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="">Select category</option>
                    {TRANSACTION_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {enumToString(c)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Occurred At</label>
                  <input
                    type="date"
                    min="2001-01-01"
                    max={todayYYYYMMDD()}
                    value={editOccurredAt}
                    onChange={(e) => setEditOccurredAt(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Note</label>
                  <input
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {updateMutation.isError ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {getErrorMessage(updateMutation.error)}
                  </div>
                ) : null}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}