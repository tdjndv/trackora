export function accountDto(account) {
    if (!account) return null

    return {
        id: account.id,
        user_id: account.user_id,
        name: account.name,
        type: account.type,
        currency: account.currency,
        created_at: account.created_at,
        updated_at: account.updated_at,
    }
}