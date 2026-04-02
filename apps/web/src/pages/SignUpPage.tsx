import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { SignUpErrors, SignUpField, SignUpForm } from "../types/auth"
import { useMutation } from "@tanstack/react-query"

export default function SignUpPage() {
  const { signup, user } = useAuth()
  const navigate = useNavigate()

  const [signUpData, setSignUpData] = useState<SignUpForm>({
    email: "",
    password: "",
    confirm: ""
  })

  const [internalError, setInternalError] = useState<string>("")
  const [errors, setErrors] = useState<SignUpErrors>({})

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate("/transactions")
    }
  })

  useEffect(() => {
    if (user) {
      navigate("/transactions")
    }
  }, [user])

  useEffect(() => {
    if (signupMutation.isError) {
      
      const error = signupMutation.error as any
      const issues = error.response.data.issues
  
      if (!issues) {
        setInternalError(error.response.data.message)
        return
      }
      
      const newErrors : SignUpErrors = {}
      for (const issue of issues) {
        newErrors[issue.path[0] as SignUpField] = issue.message
      }
      setErrors(newErrors)
    } else {
      setErrors({})
    }
  }, [signupMutation.isError])
      
  async function handleSubmit(e: any) {
    e.preventDefault()
    signupMutation.mutate(signUpData)
  }
  
  function handleChange(field: SignUpField, value: string) {
    setSignUpData(prev => ({...prev, [field]: value}))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Trackora
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Create your account and start tracking smarter.
            </p>
          </div>

          <div className="my-7 border-t border-slate-200" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {internalError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {internalError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60"
            >
              {signupMutation.isPending ? "Creating account..." : "Sign Up"}
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
                value={signUpData.email}
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
                value={signUpData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {errors.password ? (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                value={signUpData.confirm}
                onChange={(e) => handleChange("confirm", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {errors.confirm ? (
                <p className="mt-1 text-sm text-red-600">{errors.confirm}</p>
              ) : null}
            </div>
          </form>

          <div className="mt-7 text-center text-sm text-slate-600">
            Already have an account?{" "}
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