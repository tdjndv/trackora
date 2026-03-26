import {prisma} from "../../utils/prisma.js"

//checking if this account really belongs to this user
async function userAccountMatch(user, account) {
    const existing = await prisma.account.findFirst({
        where: {id: account, user_id: user}
    })

    if (!existing) {
        const e = new Error("Forbidden access")
        e.status = 403
        throw e
    }
}

export async function createTransaction(id, body) {

    await userAccountMatch(id, body.account_id)

    return await prisma.transaction.create({
        data: {
            user_id: id,
            account_id: body.account_id,
            amount: body.amount,
            category: body.category,
            note: body.note,
            occurred_at: body.occurred_at
        }
    })
}

export async function putTransaction(user_id, transaction_id, body) {
    await userAccountMatch(user_id, body.account_id)

    await prisma.transaction.updateMany({
        where: {
            id: transaction_id,
            user_id: user_id
        },
        data: {
            user_id: user_id,
            account_id: body.account_id,
            amount: body.amount,
            note: body.note,
            category: body.category,
            occurred_at: body.occurred_at
        }
    })

    return await prisma.transaction.findUnique({
        where: {id: transaction_id}
    })

}

export async function deleteTransaction(user_id, transaction_id) {
    await prisma.transaction.deleteMany({
        where: {
            id: transaction_id,
            user_id: user_id
        }
    })
}

export async function getTransaction(user_id, transaction_id) {
    return await prisma.transaction.findFirst({
        where: {id: transaction_id, user_id: user_id}
    })
}

export async function getTransactions(user_id, query) {
    const where =
        {
            user_id: user_id,
            ...(query.min_amount || query.max_amount
                ? {
                    amount: {
                        ...(query.min_amount && {gte: query.min_amount}),
                        ...(query.max_amount && {lte: query.max_amount})
                    }
                } : {}
                ),
                ...(query.account_id && {account_id: query.account_id}),
                ...(query.from || query.to 
                    ? {
                        occurred_at: {
                            ...(query.from && {gte: query.from}),
                            ...(query.to && {lt: query.to})
                        }
                    } : {}
                ),
                ...(query.note && {note: {
                    contains: query.note,
                    mode: "insensitive"
                }})
            }

    const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
            where: where,
            orderBy: {occurred_at: "desc"},
            skip: (query.page - 1) * query.limit,
            take: query.limit,
            include: {
                account: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        currency: true,
                    },
                },
            },
        }),
        prisma.transaction.count({where})
    ])

    const totalPages = Math.ceil(total / query.limit)

  return {
    data: transactions,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1
    }
  }
}

export async function getSummaries(user_id, query) {

    const where = {
        user_id: user_id,
        account_id: {in: query.account_ids},
        ...(query.from || query.to) ? {
            occurred_at: {
                ...(query.from && {gte: query.from}),
                ...(query.to && {lt: query.to})
            }
        } : {}
    }

    const all = await prisma.transaction.aggregate({
        where: where,
        _count: {
            _all: true
        },
        _sum: {
            amount: true
        }
    })

    const expense = await prisma.transaction.aggregate({
        where: {...where, amount: {lt: 0}},
        _sum: {amount: true}
    })

    const income = await prisma.transaction.aggregate({
        where: {...where, amount: {gt: 0}},
        _sum: {amount: true}
    })

    const count = all._count._all
    const net = all._sum.amount

    const totalExpense = Math.abs(expense._sum.amount)
    const totalIncome = Math.abs(income._sum.amount)

    const incomeByCategory = await prisma.transaction.groupBy({
        by: ["category"],
        where: {...where, amount: {gt: 0}},
        _sum: {amount: true},
        _count: {_all: true}
    })

    const expenseByCategory = await prisma.transaction.groupBy({
        by: ["category"],
        where: {...where, amount: {lt: 0}},
        _sum: {amount: true},
        _count: {_all: true}
    })

    const categoryMap = {}
    for (const row of incomeByCategory) {
        const income = Math.abs(row._sum.amount)
        categoryMap[row.category] = {
            category: row.category,
            income: income,
            expense: 0,
            count: row._count._all,
            percent: totalIncome !== 0 ? income / totalIncome : 0
        }
    }

    for (const row of expenseByCategory) {
        const expense = Math.abs(row._sum.amount)
        if (!categoryMap[row.category]) {
            categoryMap[row.category] = {
                category: row.category,
                expense: expense,
                income: 0,
                count: 0,
                percent: totalExpense !== 0 ? expense / totalExpense : 0
            }
        }
        categoryMap[row.category].count += row._count._all
    }

    const by_category = Object.values(categoryMap)

    return {
        count: count,
        net: net,
        total_income: totalIncome,
        total_expense: totalExpense,
        by_category: by_category
    }
}