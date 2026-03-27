import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "../api/auth"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import type {
  ResetPasswordErrors,
  ResetPasswordField,
  ResetPasswordForm
} from "../types/auth"

export default function ResetPasswordPage() {
    const navigate = useNavigate()

  const [resetData, setResetData] = useState<ResetPasswordForm>({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [internalError, setInternalError] = useState<string>("")
  const [errors, setErrors] = useState<ResetPasswordErrors>({})

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate("/signin")
    }
  })

  useEffect(() => {
    if (resetPasswordMutation.isError) {
      const error = resetPasswordMutation.error as any
      const issues = error?.response?.data?.issues

      if (!issues) {
        setInternalError(
          error?.response?.data?.message || "Something went wrong"
        )
        return
      }

      const newErrors: ResetPasswordErrors = {}
      for (const issue of issues) {
        newErrors[issue.path[0] as ResetPasswordField] = issue.message
      }

      setErrors(newErrors)
      setInternalError("")
    } else {
      setErrors({})
      setInternalError("")
    }
  }, [resetPasswordMutation.isError, resetPasswordMutation.error])

  function handleChange(field: ResetPasswordField, value: string) {
    setResetData((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    resetPasswordMutation.mutate(resetData)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Trackora
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Update your password securely.
            </p>
          </div>

          {/* Divider */}
          <div className="my-7 border-t border-slate-200" />

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Internal Error */}
            {internalError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {internalError}
              </div>
            ) : null}

            {/* Email */}
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
                autoComplete="email"
                value={resetData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {errors.email ? (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              ) : null}
            </div>

            {/* Old Password */}
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Old Password
              </label>
              <input
                id="oldPassword"
                type="password"
                autoComplete="current-password"
                value={resetData.oldPassword}
                onChange={(e) =>
                  handleChange("oldPassword", e.target.value)
                }
                placeholder="Enter your current password"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {errors.oldPassword ? (
                <p className="mt-1 text-sm text-red-600">
                  {errors.oldPassword}
                </p>
              ) : null}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={resetData.newPassword}
                onChange={(e) =>
                  handleChange("newPassword", e.target.value)
                }
                placeholder="Enter your new password"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {errors.newPassword ? (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword}
                </p>
              ) : null}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={resetData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                placeholder="Re-enter your new password"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {errors.confirmPassword ? (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              ) : null}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60"
            >
              {resetPasswordMutation.isPending
                ? "Resetting password..."
                : "Reset Password"}
            </button>
          </form>

          {/* Back to Sign In */}
          <div className="mt-7 text-center text-sm text-slate-600">
            Back to{" "}
            <Link
              to="/signin"
              className="font-medium text-slate-900 hover:underline"
            >
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}