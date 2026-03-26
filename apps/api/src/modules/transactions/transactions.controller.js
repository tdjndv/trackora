import * as transactionsService from "./transactions.service.js"

export async function createTransaction(req, res) {
    const transaction = await transactionsService.createTransaction(req.user.id, req.validated.body)

    return res.json(transaction)
}

export async function getTransaction(req, res) {
    const transaction = await transactionsService.getTransaction(req.user.id, req.validated.params.id)

    return res.json(transaction)
}

export async function putTransaction(req, res) {
    const transaction = await transactionsService.putTransaction(req.user.id, req.validated.params.id, req.validated.body)

    return res.json(transaction)
}

export async function deleteTransaction(req, res) {
    await transactionsService.deleteTransaction(req.user.id, req.validated.params.id)

    return res.json(true)
}

export async function getTransactions(req, res) {
    const transactions = await transactionsService.getTransactions(req.user.id, req.validated.query)

    return res.json(transactions)
}

export async function getSummaries(req, res) {
    const summaries = await transactionsService.getSummaries(req.user.id, req.validated.query)

    return res.json(summaries)
}