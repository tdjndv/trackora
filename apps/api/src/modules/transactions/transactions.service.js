import * as transactionsRepo from "./transactions.repo.js"

import {transactionDto} from "./transactions.dto.js"

export async function createTransaction(id, body) {
    const transaction = await transactionsRepo.createTransaction(id, body)

    return transactionDto(transaction)
}

export async function getTransaction(user_id, transaction_id) {
    const transaction = await transactionsRepo.getTransaction(user_id, transaction_id)

    return transactionDto(transaction)
}

export async function putTransaction(user_id, transaction_id, body) {
    const transaction = await transactionsRepo.putTransaction(user_id, transaction_id, body)

    return transactionDto(transaction)
}

export async function deleteTransaction(user_id, transaction_id) {
    await transactionsRepo.deleteTransaction(user_id, transaction_id)
}

export async function getTransactions(user_id, query) {
    const transactions = await transactionsRepo.getTransactions(user_id, query)

    return transactions
}

export async function getSummaries(user_id, query) {
    const summaries = await transactionsRepo.getSummaries(user_id, query)

    return summaries
}