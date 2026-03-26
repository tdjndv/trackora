import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, signout } = useAuth()

  if (!user) return null

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Left: Brand + Links */}
        <div className="flex items-center gap-6">
          <Link to="/accounts" className="group flex items-center gap-2">
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Trackora</div>
              <div className="text-xs text-slate-500">Personal finance tracker</div>
            </div>
          </Link>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-slate-200 md:block" />

          {/* Links */}
          <div className="flex items-center gap-2">
            <Link to="/accounts" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm sm:flex">
              Accounts
            </Link>

            <Link to="/transactions" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm sm:flex">
              Transactions
            </Link>

            <Link to="/dashboard" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm sm:flex">
              Dashboard
            </Link>

            <Link to="/subscription" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm sm:flex">
              Subscription
            </Link>
          </div>
        </div>

        {/* Right: User + Sign out */}
        <div className="flex items-center gap-3">
          <div className="items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm sm:flex">
            <div className="max-w-[300px] truncate">
              <span className="text-slate-500">Signed in as </span>
              <span className="font-medium text-slate-900">{user.email}</span>
              <span className="font-medium text-slate-900"> | Plan: {user.plan}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={signout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 active:scale-[0.99]"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}