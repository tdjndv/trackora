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
        setRecentBodySchema
    } from "./accounts.schema.js"

const router = Router()

router.get("/", requireAuth, validateQuery(getAccountsQuerySchema), asyncHandler(accountsController.getAccounts))
router.post("/", requireAuth, validateBody(createAccountBodySchema), asyncHandler(accountsController.addAccount))

router.get("/recent", requireAuth, asyncHandler(accountsController.getRecent))
router.put("/recent", requireAuth, validateBody(setRecentBodySchema), asyncHandler(accountsController.setRecent))

router.get("/:id", requireAuth, validateParams(getAccountParamsSchema), asyncHandler(accountsController.getAccount))
router.put("/:id", requireAuth, validateParams(getAccountParamsSchema), validateBody(putAccountBodySchema), asyncHandler(accountsController.putAccount))
router.delete("/:id", requireAuth, validateParams(getAccountParamsSchema), asyncHandler(accountsController.deleteAccount))

export default router