import { api} from "./client"

export async function checkout() {
    const res = await api.post("/billing/checkout-session")
    window.location.href = res?.data.url
}

export async function cancelSubscription(input: {value: boolean}) {
    const res = await api.post("/billing/cancel-at-period-end", input)
    return res.data
}

export async function getSubscription() {
    const res = await api.get("/billing/me")
    return res.data
}