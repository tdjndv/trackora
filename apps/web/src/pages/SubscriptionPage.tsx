import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cancelSubscription, checkout, getSubscription } from "../api/stripe"
import { toYYYYMMDD } from "../utils/general"
import { useAuth } from "../context/AuthContext"

export default function SubscriptionPage() {
    const queryClient = useQueryClient()

    const { refreshMe } = useAuth()

    const subscriptionQuery = useQuery({
        queryKey: ["subscription"],
        queryFn: getSubscription
    })
    const subscriptionData = subscriptionQuery.data

    const cancelMutation = useMutation({
        mutationFn: cancelSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subscription"]
            })
        }
    })

    function trial() {
        return subscriptionData?.has_used_trial ?? true
    }

    function free() {
        return subscriptionData?.plan === "FREE"
    }

    function cancel() {
        return subscriptionData?.cancel_at_period_end
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-5xl p-6">
                <div className="flex flex-col items-center text-center">
                    <div className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                        Trackora Billing
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                        Subscription
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        Manage your Trackora plan and unlock advanced income and expense analytics.
                    </p>

                    {free() ? (
                        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                            You are currently on the free plan. Start your 7-day free trial to access exclusive analytics.
                        </div>
                    ) : null}
                </div>

                <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="grid gap-8 md:grid-cols-[1.3fr_0.9fr]">
                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Current plan</p>
                                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                        {subscriptionData?.plan ?? ""}
                                    </h2>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        free()
                                            ? "bg-slate-100 text-slate-700"
                                            : cancel()
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-emerald-50 text-emerald-700"
                                    }`}
                                >
                                    {free()
                                        ? "Free"
                                        : cancel()
                                        ? "Canceling"
                                        : "Active"}
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm font-medium text-slate-500">Price</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">
                                        $4.99 CAD / month
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {trial() ? "Includes a 7-day free trial" : "Standard monthly billing"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm font-medium text-slate-500">Status</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">
                                        {subscriptionData?.subscription_status ?? "canceled"}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Your current Stripe subscription state
                                    </p>
                                </div>
                            </div>

                            {!free() ? (
                                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                                    {!cancel() ? (
                                        <>
                                            <p className="text-sm font-medium text-slate-500">Next billing date</p>
                                            <p className="mt-2 text-base font-semibold text-slate-900">
                                                {toYYYYMMDD(subscriptionData?.current_period_end)}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                Your subscription will renew automatically on this date.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm font-medium text-slate-500">Scheduled cancellation</p>
                                            <p className="mt-2 text-base font-semibold text-rose-700">
                                                {toYYYYMMDD(subscriptionData?.current_period_end)}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                Your subscription remains active until the end of the current billing cycle.
                                            </p>
                                        </>
                                    )}
                                </div>
                            ) : null}
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Plan benefits
                            </h3>

                            <div className="mt-4 space-y-3 text-sm text-slate-600">
                                <div className="rounded-2xl bg-white p-4 shadow-sm">
                                    View deeper income and expense analytics
                                </div>
                                <div className="rounded-2xl bg-white p-4 shadow-sm">
                                    Understand spending by category more clearly
                                </div>
                                <div className="rounded-2xl bg-white p-4 shadow-sm">
                                    Access premium subscription features inside Trackora
                                </div>
                            </div>

                            <div className="mt-6">
                                {free() ? (
                                    <button
                                        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]"
                                        onClick={() => {
                                            checkout()
                                            refreshMe()
                                        }}
                                    >
                                        Start free trial
                                    </button>
                                ) : cancel() ? (
                                    <button
                                        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]"
                                        onClick={() => cancelMutation.mutate({ value: false })}
                                    >
                                        Resume subscription
                                    </button>
                                ) : (
                                    <button
                                        className="w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-[0.99]"
                                        onClick={() => cancelMutation.mutate({ value: true })}
                                    >
                                        Cancel at end of billing cycle
                                    </button>
                                )}
                            </div>

                            <p className="mt-3 text-xs leading-5 text-slate-500">
                                Changes to your subscription may take a moment to appear after Stripe updates your billing status.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}