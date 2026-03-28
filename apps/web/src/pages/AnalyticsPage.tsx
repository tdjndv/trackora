import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getInsights } from "../api/analytics"

import { formatCents, minYYYYMMDD } from "../utils/general"

import type { FilterAnalyticsForm, FilterAnalyticsField } from "../types/analytics"

import { todayYYYYMMDD } from "../utils/general"
import { useRecentAccountQuery } from "../hooks/queries/accounts"
import { useAnalyticsQuery } from "../hooks/queries/analytics"

export default function AnalyticsPage() {

    const {data: recentAccount} = useRecentAccountQuery()

    const [filterAnalyticsData, setFilterAnalyticsData] = useState<FilterAnalyticsForm>({
        from: "",
        to: ""
    })
    
    function handleFilterAccountDataChange(field: FilterAnalyticsField, value: string) {
        setFilterAnalyticsData(prev => ({...prev, [field]: value}))
    }
    
    function resetFilterAccountData() {
        setFilterAnalyticsData({from: "", to: ""})
    }

    const [draftFrom, setDraftFrom] = useState<string>("")
    const [draftTo, setDraftTo] = useState<string>(todayYYYYMMDD())

    const {data: analyticsData} = useAnalyticsQuery({...filterAnalyticsData, account_ids: recentAccount?.id ?? ""})

    const insightsQuery = useQuery({
        queryKey: ["insights"],
        queryFn: () => getInsights({ account_ids: recentAccount.id, from: filterAnalyticsData.from, to: filterAnalyticsData.to }),
        placeholderData: (prev) => prev,
        enabled: true,
        retry: 1
    })
    const insightsData = insightsQuery.data

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
                            Analytics
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Check the summary for your accounts and understand your financial activity at a glance.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Filter your analytics by date range.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={resetFilterAccountData}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            Clear filters
                        </button>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">From</label>
                            <input
                                type="date"
                                min={minYYYYMMDD()}
                                max={todayYYYYMMDD()}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                value={draftFrom}
                                onChange={(e) => setDraftFrom(e.target.value)}
                                onBlur={() => handleFilterAccountDataChange("from", draftFrom)}
                            />
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
                                onBlur={() => handleFilterAccountDataChange("to", draftTo)}
                            />
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
                            {formatCents(analyticsData?.total_income ?? 0)}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="text-sm font-medium text-slate-500">Total Expense</div>
                        <div className="mt-3 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                            Expense
                        </div>
                        <div className="mt-4 text-2xl font-bold text-slate-900">
                            {formatCents(analyticsData?.total_expense ?? 0)}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-sky-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="text-sm font-medium text-slate-500">Transactions</div>
                        <div className="mt-3 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                            Activity
                        </div>
                        <div className="mt-4 text-2xl font-bold text-slate-900">
                            {analyticsData?.count ?? 0}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-indigo-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="text-sm font-medium text-slate-500">Net</div>
                        <div className="mt-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            Summary
                        </div>
                        <div className="mt-4 text-2xl font-bold text-slate-900">
                            {formatCents(analyticsData?.net ?? 0)}
                        </div>
                    </div>
                </div>

                {/* AI Insights */}
                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">AI Insights</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Generate a user-friendly summary based on your current analytics filters.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => insightsQuery.refetch()}
                            disabled={insightsQuery.isFetching}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {insightsQuery.isFetching
                                ? "Generating..."
                                : insightsData
                                ? "Regenerate insights"
                                : "Generate insights"}
                        </button>
                    </div>

                    {insightsQuery.isFetching ? (
                        <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-500" />
                                <div>
                                    <div className="text-sm font-semibold text-indigo-800">AI is analyzing your transactions...</div>
                                    <div className="mt-1 text-sm text-indigo-700">
                                        Looking at your filtered activity, categories, and spending patterns.
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {insightsQuery.isError ? (
                        <div className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            Failed to generate insights.
                        </div>
                    ) : null}

                    {insightsData ? (
                        <div className="mt-6 space-y-4">
                            <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-800 ring-1 ring-inset ring-indigo-200">
                                {insightsData.headline}
                            </div>

                            <div className="space-y-3">
                                {(insightsData.insights ?? []).slice(0, 3).map((insight: string, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                                    >
                                        <div className="mt-0.5 text-indigo-500">✨</div>
                                        <div>{insight}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {!insightsQuery.isFetching && !insightsData && !insightsQuery.isError ? (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                            No AI insights yet. Click <span className="font-medium text-slate-700">Generate insights</span> to analyze the current filtered transactions.
                        </div>
                    ) : null}
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
                            {(analyticsData?.by_category ?? []).length} categories
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {(analyticsData?.by_category ?? []).map((category: any) => {
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

                    {(analyticsData?.by_category ?? []).length === 0 ? (
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