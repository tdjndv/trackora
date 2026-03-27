import * as accountsRepo from "./accounts.repo.js"

import {accountDto} from "./accounts.dto.js"

export async function addAccount(id, body) {
    const account = await accountsRepo.createAccount(id, body)

    return accountDto(account)
}

export async function getAccount(user_id, account_id) {
    const account = await accountsRepo.getAccount(user_id, account_id)

    return accountDto(account)
}

export async function putAccount(user_id, account_id, body) {
    const account = await accountsRepo.putAccount(user_id, account_id, body)

    return accountDto(account)
}

export async function deleteAccount(user_id, account_id) {
    await accountsRepo.deleteAccount(user_id, account_id)
}

export async function getAccounts(user_id, query) {
    const accounts = await accountsRepo.getAccounts(user_id, query)

    return accounts.map(accountDto)
}

export async function changeDefault(user_id, body) {
    const account = await accountsRepo.changeDefault(user_id, body.account_id)

    return accountDto(account)
}

export async function getDefault(user_id) {
    const account = await accountsRepo.getDefault(user_id)

    return accountDto(account)
}