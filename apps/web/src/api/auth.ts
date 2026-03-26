import {api} from "./client"

export async function signin(email: string, password: string) {
    const res = await api.post("/auth/signin", {email, password})
    return res.data
}

export async function signup(email: string, password: string, confirm: string) {
    const res = await api.post("/auth/signup", {email, password, confirm})
    await api.post("/email/signup", {to: email})
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

