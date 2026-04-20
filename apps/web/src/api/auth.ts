import {api} from "./client"
import axios from "axios"

export async function signin(input: {email: string, password: string}) {
    try {
        const res = await api.post("/auth/signin", input)
        return res.data
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data

            throw {
                message: data?.message,
                issues: data?.issues,
                status: error.response?.status,
            }
        }

        throw {
            message: "Network error",
            issues: undefined,
            status: undefined,
        }
    }
}

export async function signup(input: {
  email: string
  password: string
  confirm: string
}) {
  try {
    const res = await api.post("/auth/signup", input)

    await api.post("/email/signup", {
      to: input.email,
    })

    return res.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data

      throw {
        message: data?.message || "Signup failed",
        issues: data?.issues,
        status: error.response?.status,
      }
    }

    throw {
      message: "Network error",
      issues: undefined,
      status: undefined,
    }
  }
}

export async function resetPassword(input: {email: string; oldPassword: string; newPassword: string; confirmPassword: string}) {
    try {
        const res = await api.put("/auth/reset-password", input)
        return res.data
    } catch(error: any) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data

            throw {
                message: data?.message,
                issues: data?.issues,
                status: error.response?.status,
            }
        }

        throw {
            message: "Network error",
            issues: undefined,
            status: undefined,
        }
    }
}

export async function me() {
    const res = await api.get("/auth/me")
    return res.data
}

export async function signout() {
    const res = await api.post("/auth/signout")
    return res.data
}

