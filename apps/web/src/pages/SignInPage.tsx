import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import type { SignInForm, SignInErrors, SignInField } from "../types/auth"

import { useAppDispatch, useAppSelector } from "../app/hooks"
import { signin } from "../features/auth/authSlice"

export default function SignInPage() {
  const {user, loading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [signInData, setSignInData] = useState<SignInForm>({
    email: "",
    password: ""
  })

  const [internalError, setInternalError] = useState<string>("")
  const [errors, setErrors] = useState<SignInErrors>({})

  useEffect(() => {
    if (user) {
      navigate("/transactions")
    }
  }, [user])

  function clearErrors() {
    setInternalError("")
    setErrors({})
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    clearErrors()
    try {
      await dispatch(signin(signInData)).unwrap()
      navigate("/transactions")
    } catch (error: any) {
      if (Array.isArray(error?.issues)) {
        const newErrors: SignInErrors = {}

        for (const issue of error?.issues) {
          const field = issue.path[0] as SignInField
          newErrors[field] = issue.message
        }
        setErrors(newErrors)
      } else {
        setInternalError(error.message)
      }
    }
  }

  function handleChange(field: SignInField, value: string) {
    setSignInData(prev => ({...prev, [field]: value}))
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {internalError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {internalError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={signInData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {errors.email ? (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={signInData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {errors.password ? (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              ) : null}
            </div>
          </form>

          <div className="mt-7 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-slate-900 hover:underline"
            >
              Create one
            </Link>
          </div>
            
          <div className="mt-3 text-center text-sm text-slate-600">
            Forgot your password?{" "}
            <Link
              to="/reset-password"
              className="font-medium text-slate-900 hover:underline"
            >
              Reset here
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}