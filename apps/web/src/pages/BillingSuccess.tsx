import { Link } from "react-router-dom"

export default function BillingSuccess() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-6">
                <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-10 w-10 text-emerald-600"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>

                        <h1 className="mt-6 text-3xl font-bold text-slate-900">
                            Payment successful
                        </h1>

                        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
                            Your payment has been processed successfully. Thank you for supporting
                            Trackora. Your billing information has been updated, and you can now
                            continue using your account.
                        </p>

                        <div className="mt-8 grid w-full gap-4 rounded-2xl bg-slate-50 p-5 text-left md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-sm font-medium text-slate-500">Status</p>
                                <p className="mt-2 text-base font-semibold text-emerald-600">
                                    Completed
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-sm font-medium text-slate-500">Access</p>
                                <p className="mt-2 text-base font-semibold text-slate-900">
                                    Ready to use
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                to="/dashboard"
                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                            >
                                Go to Dashboard
                            </Link>

                            <Link
                                to="/billing"
                                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                View Billing
                            </Link>
                        </div>

                        <p className="mt-6 text-xs text-slate-500">
                            If your account does not update immediately, refresh the page in a few seconds.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}