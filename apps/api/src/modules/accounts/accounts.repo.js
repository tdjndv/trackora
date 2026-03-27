import {prisma} from "../../utils/prisma.js"

export async function createAccount(id, body) {

    const count = await prisma.account.count({
        where: { user_id: id}
    })

    return await prisma.account.create({
        data: {
            user_id: id,
            name: body.name,
            type: body.type,
            currency: body.currency,
            isDefault: count === 0
        }
    })
}

export async function getAccount(user_id, account_id) {
    return await prisma.account.findFirst({
        where: {id: account_id, user_id: user_id}
    })
}

export async function deleteAccount(user_id, account_id) {
    await prisma.account.deleteMany({
        where: {id: account_id, user_id: user_id}
    })
}

export async function putAccount(user_id, account_id, body) {

    await prisma.account.updateMany({
        where: {
            id: account_id,
            user_id: user_id
        },
        data: {
            name: body.name,
            type: body.type,
            currency: body.currency,
        }
    })

    return await prisma.account.findUnique({
        where: {id: account_id}
    })

}

export async function getAccounts(user_id, query) {
    return await prisma.account.findMany({
        where: {
            user_id: user_id,
            ...(query.name && {
                name: {
                    contains: query.name,
                    mode: "insensitive"
                }
            }),
            ...(query.type && {type: query.type}),
            ...(query.currency && {currency: query.currency})
        },
        orderBy: {created_at: "desc"}
    })
}

export async function setRecent(user_id, account_id) {
    return await prisma.user.update({
        where: {id: user_id},
        data: {
            most_recent_account_id: account_id,
        },
        include: {
            most_recent_account: true
        }
    })
}

export async function getRecent(user_id) {
    const temp = await prisma.user.findUnique({
        where: {id: user_id},
        select: {
            most_recent_account: true
        }
    })
    return temp.most_recent_account ?? null
}

