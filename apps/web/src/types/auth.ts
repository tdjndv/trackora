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

    most_recent_account_id: string | null
    most_recent_account?: {
        id: string
        name: string
    } | null
}

export type SignInForm = {
    email: string
    password: string
}

export type SignInField = "email" | "password"
export type SignInErrors = Partial<Record<SignInField, string>>

export type SignUpForm = {
    email: string
    password: string
    confirm: string
}

export type SignUpField = "email" | "password" | "confirm"
export type SignUpErrors = Partial<Record<SignUpField, string>>

export type ResetPasswordForm = {
    email: string
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export type ResetPasswordField = "email" | "oldPassword" | "newPassword" | "confirmPassword"
export type ResetPasswordErrors = Partial<Record<ResetPasswordField, string>>