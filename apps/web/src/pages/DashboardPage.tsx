import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { listAccounts } from "../api/accounts"
import { getSummaries } from "../api/dashboard"
import LoadingPage from "./LoadingPage"

import { formatCents, minYYYYMMDD } from "../utils/general"
import { useSearchParams } from "react-router-dom"

import type { DashboardFilterErrors } from "../types/dashboard"

import { todayYYYYMMDD } from "../utils/general"

export default function DashboardPage() {
    const [searchParams, setSearchParams] = useSearchParams()

    const [filterErrors, setFilterErrors] = useState<DashboardFilterErrors>({})

    const params = useMemo(() => {
        const account_ids = searchParams.get("account_ids") || undefined
        const from = searchParams.get("from") || undefined
        const to = searchParams.get("to") || undefined

        return { account_ids, from, to }
    }, [searchParams])

    function setFilter(key: string, value: string) {
        const next = new URLSearchParams(searchParams)
        if (!value) {
            next.delete(key)
        } else {
            next.set(key, value)
        }
        setSearchParams(next)
    }

    function clearFilters() {
        const base = new URLSearchParams()
        base.set("account_ids", allAccountIds())
        setSearchParams(base)
    }

    const [draftFrom, setDraftFrom] = useState<string>("")
    const [draftTo, setDraftTo] = useState<string>("")

    const accountsQuery = useQuery({
        queryKey: ["accounts"],
        queryFn: () => listAccounts({}),
        placeholderData: (prev) => prev
    })
    const accountsData = accountsQuery.data

    function allAccountIds() {
        if (!accountsData) return ""
        return accountsData.map((account) => account.id).join(",")
    }

    const dashboardQuery = useQuery({
        queryKey: ["dashboard", { account_ids: params.account_ids, from: params.from, to: params.to }],
        queryFn: () => getSummaries({ account_ids: params.account_ids, from: params.from, to: params.to }),
        placeholderData: (prev) => prev,
        retry: 1
    })
    const dashboardData = dashboardQuery.data

    function clearFilterErrors() {
        setFilterErrors({})
    }

    useEffect(() => {
        if (dashboardQuery.isError) {
            const error = dashboardQuery.error as any
            const issues = error.response.data.issues
            const errors: Record<string, string> = {}
            for (const issue of issues) {
                errors[issue.path[0]] = issue.message
            }
            setFilterErrors(errors)
        } else {
            clearFilterErrors()
        }
    }, [dashboardQuery.isError, dashboardQuery.error])

    if (dashboardQuery.isLoading && !dashboardQuery.data) {
        return <LoadingPage />
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                            Trackora
                        </div>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            Dashboard
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Check the summary for your accounts and understand your financial activity at a glance.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-inset ring-slate-200">
                        {accountsQuery.isLoading
                            ? "Loading accounts..."
                            : `Showing ${accountsData?.length ?? 0} accounts`}
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Filter your dashboard by account and date range.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            Clear filters
                        </button>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Account</label>
                            <select
                                value={params.account_ids}
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (value === "all") {
                                        setFilter("account_ids", allAccountIds())
                                    } else {
                                        setFilter("account_ids", value)
                                    }
                                }}
                                required
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            >
                                <option value="all">All</option>
                                {(accountsData ?? []).map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.name} {account.currency}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">From</label>
                            <input
                                type="date"
                                min={minYYYYMMDD()}
                                max={todayYYYYMMDD()}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                value={draftFrom}
                                onChange={(e) => setDraftFrom(e.target.value)}
                                onBlur={() => setFilter("from", draftFrom)}
                            />
                            {filterErrors.from ? (
                                <div className="mt-1 text-sm font-medium text-red-600">{filterErrors.from}</div>
                            ) : null}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">To</label>
                            <input
                                type="date"
                                min={minYYYYMMDD()}
                                max={todayYYYYMMDD()}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                value={draftTo}
                                onChange={(e) => setDraftTo(e.target.value)}
                                onBlur={() => setFilter("to", draftTo)}
                            />
                            {filterErrors.to ? (
                                <div className="mt-1 text-sm font-medium text-red-600">{filterErrors.to}</div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="text-sm font-medium text-slate-500">Total Income</div>
                        <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Income
                        </div>
                        <div className="mt-4 text-2xl font-bold text-slate-900">
                            {formatCents(dashboardData?.total_income ?? 0)}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="text-sm font-medium text-slate-500">Total Expense</div>
                        <div className="mt-3 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                            Expense
                        </div>
                        <div className="mt-4 text-2xl font-bold text-slate-900">
                            {formatCents(dashboardData?.total_expense ?? 0)}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-sky-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="text-sm font-medium text-slate-500">Transactions</div>
                        <div className="mt-3 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                            Activity
                        </div>
                        <div className="mt-4 text-2xl font-bold text-slate-900">
                            {dashboardData?.count ?? 0}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-indigo-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="text-sm font-medium text-slate-500">Net</div>
                        <div className="mt-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            Summary
                        </div>
                        <div className="mt-4 text-2xl font-bold text-slate-900">
                            {formatCents(dashboardData?.net ?? 0)}
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Category breakdown</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                See how your income and expenses are distributed by category.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-600 ring-1 ring-inset ring-slate-200">
                            {(dashboardData?.by_category ?? []).length} categories
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {(dashboardData?.by_category ?? []).map((category: any) => {
                            const isIncome = category.income !== 0
                            return (
                                <div
                                    key={category.category}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                                            {category.category}
                                        </h3>

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                isIncome
                                                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                                                    : "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200"
                                            }`}
                                        >
                                            {isIncome ? "Income" : "Expense"}
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-2xl font-bold text-slate-900">
                                            {isIncome
                                                ? `+${formatCents(category.income)}`
                                                : `-${formatCents(category.expense)}`}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <div className="h-2.5 w-full rounded-full bg-slate-100">
                                            <div
                                                className={`h-2.5 rounded-full ${
                                                    isIncome ? "bg-emerald-500" : "bg-rose-500"
                                                }`}
                                                style={{ width: `${category.percent * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500">
                                        <span>{category.count} transactions</span>
                                        <span>{(category.percent * 100).toFixed(2)}%</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {(dashboardData?.by_category ?? []).length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                            <h3 className="text-lg font-semibold text-slate-900">No category data</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Try adjusting your filters or add more transactions to see analytics here.
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}