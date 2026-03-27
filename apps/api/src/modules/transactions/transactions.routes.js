import {Router} from "express"

import * as transactionsController from "./transactions.controller.js"

import {validateBody, validateParams, validateQuery} from "../../middleware/validate.js"

import {createTransactionBodySchema,
    transactionParamsSchema,
    putTransactionBodySchema,
    getTransactionsQuerySchema,
    getTransactionsSummariesQuerySchema,
    quickAddTransactionBodySchema
} from "./transactions.schema.js"

import {asyncHandler} from "../../utils/asyncHandler.js"

import { requireAuth } from "../../middleware/requireAuth.js"

const router = Router()

router.get("/", requireAuth, validateQuery(getTransactionsQuerySchema), asyncHandler(transactionsController.getTransactions))
router.post("/", requireAuth, validateBody(createTransactionBodySchema), asyncHandler(transactionsController.createTransaction))
router.get("/summary", requireAuth, validateQuery(getTransactionsSummariesQuerySchema), asyncHandler(transactionsController.getSummaries))

router.get("/ai_insights", requireAuth, validateQuery(getTransactionsSummariesQuerySchema), asyncHandler(transactionsController.getInsights))

router.post("/quick_add", requireAuth, validateBody(quickAddTransactionBodySchema), asyncHandler(transactionsController.quickAddTransaction))

router.get("/:id", requireAuth, validateParams(transactionParamsSchema), asyncHandler(transactionsController.getTransaction))
router.put("/:id", requireAuth, validateParams(transactionParamsSchema), validateBody(putTransactionBodySchema), asyncHandler(transactionsController.putTransaction))
router.delete("/:id", requireAuth, validateParams(transactionParamsSchema), asyncHandler(transactionsController.deleteTransaction))

export default router