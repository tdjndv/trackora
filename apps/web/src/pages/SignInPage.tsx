import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ErrorCard from "../components/ErrorCard"

export default function SignInPage() {
  const { signin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await signin(email, password)
      navigate("/accounts")
    } catch (error: any) {
      setError(error.response.data.message)
      setEmail("")
      setPassword("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">

          {/* App Name */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Trackora
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Track your income and expenses with clarity.
            </p>
          </div>

          {/* Divider */}
          <div className="my-7 border-t border-slate-200" />

          {/* Error */}
          {error ? <ErrorCard title="Sign in failed" message={error} closable={true} /> : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-7 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-slate-900 hover:underline"
            >
              Create one
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}