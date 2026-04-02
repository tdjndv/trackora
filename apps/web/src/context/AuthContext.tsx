import React, { createContext, useContext, useEffect, useState } from "react"
import * as authApi from "../api/auth.ts"

import type { UserDTO } from "../types/auth.ts"

type AuthState = {
  user:  UserDTO | null
  loading: boolean
  signin: (input: {email: string, password: string}) => Promise<void>
  signup: (input: {email: string, password: string, confirm: string}) => Promise<void>
  signout: () => Promise<void>
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null)
  const [loading, setLoading] = useState(true)

  async function refreshMe() {
    try {
      const me = await authApi.me()
      setUser(me)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    const run = async () => {
      await refreshMe()
      setLoading(false)
    }
    run()
  }, [])

  async function signin(input: {email: string, password: string}) {
    await authApi.signin(input)
    await refreshMe()
  }

  async function signup(input: {email: string, password: string, confirm: string}) {
    await authApi.signup(input)
    await refreshMe()
  }

  async function signout() {
    await authApi.signout()
    setUser(null)
  }

  const value: AuthState = {
    user,
    loading,
    signin,
    signup,
    signout,
    refreshMe,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}