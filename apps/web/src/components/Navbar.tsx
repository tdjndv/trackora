import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect, useRef, useState } from "react"

export default function Navbar() {
  const { user, signout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!user) return null

  const navLinkClass = (path: string) =>
    [
      "hidden items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-sm transition sm:flex",
      location.pathname === path
        ? "border-slate-900 bg-slate-900 text-white"
        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ].join(" ")

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link to="/accounts" className="group flex items-center gap-2">
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Trackora</div>
              <div className="text-xs text-slate-500">Personal finance tracker</div>
            </div>
          </Link>

          <div className="hidden h-8 w-px bg-slate-200 md:block" />

          <div className="flex items-center gap-2">
            <Link to="/accounts" className={navLinkClass("/accounts")}>
              Accounts
            </Link>

            <Link to="/transactions" className={navLinkClass("/transactions")}>
              Transactions
            </Link>

            <Link to="/dashboard" className={navLinkClass("/dashboard")}>
              Dashboard
            </Link>

            <Link to="/subscription" className={navLinkClass("/subscription")}>
              Subscription
            </Link>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 active:scale-[0.99]"
          >
            <span className="max-w-[180px] truncate">{user.email}</span>
            <span className="text-slate-500">▾</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Signed in as
                </div>
                <div className="mt-1 truncate text-sm font-semibold text-slate-900">
                  {user.email}
                </div>
                <div className="mt-2 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  Plan: {user.plan}
                </div>
              </div>

              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate("/accounts")
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  Accounts
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate("/transactions")
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  Transactions
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate("/dashboard")
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate("/subscription")
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  Subscription
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate("/reset-password")
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  Reset Password
                </button>

                <div className="my-2 border-t border-slate-200" />

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    signout()
                    navigate("/")
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}