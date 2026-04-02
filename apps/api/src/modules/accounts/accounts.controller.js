import * as accountsService from "./accounts.service.js"

export async function addAccount(req, res) {
    const account = await accountsService.addAccount(req.user.id, req.validated.body)

    return res.json(account)
}

export async function getAccount(req, res) {
    const account = await accountsService.getAccount(req.user.id, req.validated.params.id)

    return res.json(account)
}

export async function putAccount(req, res) {
    const account = await accountsService.putAccount(req.user.id, req.validated.params.id, req.validated.body)

    return res.json(account)
}

export async function deleteAccount(req, res) {
    await accountsService.deleteAccount(req.user.id, req.validated.params.id)

    return res.json(true)
}

export async function getAccounts(req, res) {
    const accounts = await accountsService.getAccounts(req.user.id, req.validated.query)

    return res.json(accounts)
}

export async function getRecent(req, res) {
    const account = await accountsService.getRecent(req.user.id)

    return res.json(account)
}

export async function setRecent(req, res) {
    const account = await accountsService.setRecent(req.user.id, req.validated.body)

    return res.json(account)
}