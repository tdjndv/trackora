export function transactionDto(transaction) {
    if (!transaction) return null

    return {
        id: transaction.id,
        account_id: transaction.account_id,
        amount: transaction.amount,
        note: transaction.note,
        category: transaction.category,
        occurred_at: transaction.occurred_at,

        account: transaction.account
    }
}