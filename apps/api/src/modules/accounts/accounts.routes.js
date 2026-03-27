import {Router} from "express"

import * as accountsController from "./accounts.controller.js"

import {validateBody, validateParams, validateQuery} from "../../middleware/validate.js"

import { asyncHandler } from "../../utils/asyncHandler.js"

import { requireAuth } from "../../middleware/requireAuth.js"

import
    {createAccountBodySchema,
        getAccountParamsSchema,
        putAccountBodySchema,
        getAccountsQuerySchema,
        changeDefaultBodySchema
    } from "./accounts.schema.js"

const router = Router()

router.get("/", requireAuth, validateQuery(getAccountsQuerySchema), asyncHandler(accountsController.getAccounts))
router.post("/", requireAuth, validateBody(createAccountBodySchema), asyncHandler(accountsController.addAccount))

router.get("/default", requireAuth, asyncHandler(accountsController.getDefault))
router.post("/default", requireAuth, validateBody(changeDefaultBodySchema), asyncHandler(accountsController.changeDefault))

router.get("/:id", requireAuth, validateParams(getAccountParamsSchema), asyncHandler(accountsController.getAccount))
router.put("/:id", requireAuth, validateParams(getAccountParamsSchema), validateBody(putAccountBodySchema), asyncHandler(accountsController.putAccount))
router.delete("/:id", requireAuth, validateParams(getAccountParamsSchema), asyncHandler(accountsController.deleteAccount))

export default router