import {prisma} from "../../utils/prisma.js"

import { getResponse } from "../../openai/general.js"

import {ALLOWED_CATEGORIES} from "../../static/categories.js"

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

export async function getInsights(user_id, query) {
    const summary = await getSummaries(user_id, query)

    const where = {
        user_id: user_id,
        account_id: { in: query.account_ids },
        ...((query.from || query.to)
            ? {
                occurred_at: {
                    ...(query.from && { gte: query.from }),
                    ...(query.to && { lt: query.to })
                }
            }
            : {})
    }

    const topExpenses = await prisma.transaction.findMany({
        where: {
            ...where,
            amount: { lt: 0 }
        },
        orderBy: {
            amount: "asc" // most negative first
        },
        take: 5,
        select: {
            amount: true,
            note: true,
            category: true,
            occurred_at: true
        }
    })

    const topIncomes = await prisma.transaction.findMany({
        where: {
            ...where,
            amount: { gt: 0 }
        },
        orderBy: {
            amount: "desc"
        },
        take: 5,
        select: {
            amount: true,
            note: true,
            category: true,
            occurred_at: true
        }
    })

    const noteGroups = await prisma.transaction.groupBy({
        by: ["note"],
        where: {
            ...where,
            note: {
                not: null
            }
        },
        _count: {
            _all: true
        },
        _sum: {
            amount: true
        },
        orderBy: {
            _count: {
                note: "desc"
            }
        },
        take: 5
    })

    const payload = {
        count: summary.count,
        net: summary.net ?? 0,
        total_income: summary.total_income ?? 0,
        total_expense: summary.total_expense ?? 0,
        by_category: summary.by_category,
        top_expenses: topExpenses.map((tx) => ({
            note: tx.note ?? "No note",
            category: tx.category,
            amount: Math.abs(Number(tx.amount)),
            occurred_at: tx.occurred_at
        })),
        top_incomes: topIncomes.map((tx) => ({
            note: tx.note ?? "No note",
            category: tx.category,
            amount: Number(tx.amount),
            occurred_at: tx.occurred_at
        })),
        frequent_notes: noteGroups.map((row) => ({
            note: row.note ?? "No note",
            count: row._count._all,
            net_amount: Number(row._sum.amount ?? 0)
        }))
    }

    const prompt = `
        You are an assistant for a personal finance app.

        Given the summarized transaction data below, generate user-friendly insights.

        Rules:
        - Be concise and specific.
        - Focus on spending patterns, category concentration, recurring merchants/notes, and notable large transactions.
        - Do not give financial advice.
        - Do not invent facts.
        - Keep the tone helpful and clear.
        - Amount is in cents so convert them to dollars
        - Return ONLY valid JSON in this format:

        {
        "headline": "string",
        "insights": [
            "string",
            "string",
            "string"
        ]
        }

        Data:
        ${JSON.stringify(payload, null, 2)}
    `

    const response = await getResponse(prompt)

    return JSON.parse(response.output_text)
}

async function inferCategoryFromNote(note) {
    if (!note.trim()) return "OTHER"

    const prompt = `
        You are classifying a personal finance transaction.

        Choose the MOST appropriate category.

        Allowed categories:
        ${ALLOWED_CATEGORIES.join("\n")}

        Guidelines:
        - Use EATING_OUT for restaurants, cafes
        - Use GROCERIES for supermarkets
        - Use SUBSCRIPTION for recurring services
        - Use TRANSPORT for Uber, gas, transit
        - Use TRANSFER for moving money between own accounts
        - Use INVESTMENT for buying assets
        - Use INVESTMENT_INCOME for dividends/interest
        - If unclear, use OTHER

        Return ONLY JSON:
        { "category": "CATEGORY_NAME" }

        Transaction note:
        ${JSON.stringify(note)}
    `

    const res = await getResponse(prompt)
    
    try {
        const parsed = JSON.parse(res.output_text)
        return parsed.category || "OTHER"
    } catch {
        return "OTHER"
    }
}

export async function quickAddTransaction(user_id, body) {
    await userAccountMatch(user_id, body.account_id)

    let category = "OTHER"
    try {
        category = await inferCategoryFromNote(body.note)
    } catch {
        category = "OTHER"
    }

    return await prisma.transaction.create({
        data: {
            user_id: user_id,
            account_id: body.account_id,
            amount: body.amount,
            category: category,
            note: body.note,
            occurred_at: new Date()
        }
    })
}