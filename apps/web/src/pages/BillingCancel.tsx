import { Link } from "react-router-dom"

export default function BillingCancel() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-6">
                <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-10 w-10 text-rose-600"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6"/>
                            </svg>
                        </div>

                        <h1 className="mt-6 text-3xl font-bold text-slate-900">
                            Payment not completed
                        </h1>

                        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
                            Your payment was canceled or something interrupted the process.  
                            No charges were made. You can try again anytime.
                        </p>

                        <div className="mt-8 grid w-full gap-4 rounded-2xl bg-slate-50 p-5 text-left md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-sm font-medium text-slate-500">Status</p>
                                <p className="mt-2 text-base font-semibold text-rose-600">
                                    Canceled
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-sm font-medium text-slate-500">Payment</p>
                                <p className="mt-2 text-base font-semibold text-slate-900">
                                    Not processed
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                to="/billing"
                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                            >
                                Try payment again
                            </Link>

                            <Link
                                to="/dashboard"
                                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                Back to dashboard
                            </Link>
                        </div>

                        <p className="mt-6 text-xs text-slate-500">
                            If you continue to experience issues, please contact support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}