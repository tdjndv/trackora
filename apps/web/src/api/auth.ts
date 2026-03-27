import {api} from "./client"

export async function signin(input: {email: string, password: string}) {
    const res = await api.post("/auth/signin", input)
    return res.data
}

export async function signup(input: {email: string, password: string, confirm: string}) {
    const res = await api.post("/auth/signup", input)
    await api.post("/email/signup", {to: input.email})
    return res.data
}

export async function resetPassword(input: {email: string; oldPassword: string; newPassword: string; confirmPassword: string}) {
    const res = await api.put("/auth/reset-password", input)
    return res.data
}

export async function me() {
    const res = await api.get("/auth/me")
    return res.data
}

export async function signout() {
    const res = await api.post("/auth/signout")
    return res.data
}

