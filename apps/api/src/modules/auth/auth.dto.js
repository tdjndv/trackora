export function userDto(user) {
    if (!user) return null

    return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        plan: user.plan,
        subscription_status: user.subscription_status,
        current_period_end: user.current_period_end,
        cancel_at_period_end: user.cancel_at_period_end,
        has_used_trial: user.has_used_trial
    }
}