export type UserDTO = {
    id: string
    email: string
    plan: string
    subscription_status: string
    current_period_end: string
    cancel_at_period_end: boolean
    has_used_trial: boolean
    created_at: string
    updated_at: string
}