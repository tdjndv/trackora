import { Link } from "react-router-dom"

export default function IntroPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Trackora</h1>
                        <p className="text-sm text-slate-500">Simple personal finance tracking</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/signin"
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/signup"
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <main className="mx-auto max-w-6xl px-6 py-16">
                <section className="grid items-center gap-10 md:grid-cols-2">
                    <div>
                        <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                            Smarter money tracking starts here
                        </div>

                        <h2 className="mt-6 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                            Take control of your money with Trackora
                        </h2>

                        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                            Track income, monitor expenses, organize accounts, and understand where
                            your money goes — all in one clean dashboard built for everyday use.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                to="/signup"
                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                            >
                                Get started free
                            </Link>

                            <Link
                                to="/signin"
                                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                Already have an account?
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
                            <span>Track transactions</span>
                            <span>Create budgets</span>
                            <span>View summaries</span>
                            <span>Manage accounts</span>
                        </div>
                    </div>

                    {/* Product preview card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="rounded-2xl bg-slate-900 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-300">Current balance</p>
                                    <h3 className="mt-2 text-3xl font-bold">$12,480.35</h3>
                                </div>
                                <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
                                    +8.4%
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <p className="text-sm text-slate-300">Income</p>
                                    <p className="mt-2 text-xl font-semibold text-emerald-300">$4,250.00</p>
                                </div>

                                <div className="rounded-2xl bg-white/5 p-4">
                                    <p className="text-sm text-slate-300">Expenses</p>
                                    <p className="mt-2 text-xl font-semibold text-rose-300">$2,180.40</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-slate-900">Housing</h4>
                                    <span className="text-sm font-medium text-rose-600">42%</span>
                                </div>
                                <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                                    <div className="h-2 w-[42%] rounded-full bg-rose-500" />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-slate-900">Food</h4>
                                    <span className="text-sm font-medium text-amber-600">21%</span>
                                </div>
                                <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                                    <div className="h-2 w-[21%] rounded-full bg-amber-500" />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-slate-900">Savings</h4>
                                    <span className="text-sm font-medium text-emerald-600">27%</span>
                                </div>
                                <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                                    <div className="h-2 w-[27%] rounded-full bg-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mt-20">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-slate-900">Everything you need to track your finances</h3>
                        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                            Keep your money organized with a simple workflow designed for clarity,
                            speed, and better financial decisions.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="w-fit rounded-2xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">
                                Accounts
                            </div>
                            <h4 className="mt-4 text-lg font-semibold text-slate-900">Manage all your accounts</h4>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Add checking, savings, cash, credit card, and other accounts in one place.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="w-fit rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                                Transactions
                            </div>
                            <h4 className="mt-4 text-lg font-semibold text-slate-900">Track income and expenses</h4>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Log your daily activity and clearly see how money moves through your life.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="w-fit rounded-2xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                                Dashboard
                            </div>
                            <h4 className="mt-4 text-lg font-semibold text-slate-900">Get instant summaries</h4>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                View totals, category breakdowns, and net balance with a simple dashboard.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="mt-20">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
                        <div className="mx-auto max-w-3xl text-center">
                            <h3 className="text-3xl font-bold text-slate-900">
                                Start building better financial habits today
                            </h3>
                            <p className="mt-4 text-slate-600">
                                Join Trackora and make your income, expenses, and financial goals easier to manage.
                            </p>

                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <Link
                                    to="/signup"
                                    className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                                >
                                    Create account
                                </Link>

                                <Link
                                    to="/signin"
                                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}