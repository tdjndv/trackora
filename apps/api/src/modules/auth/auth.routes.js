import {Router} from "express"

import {validateBody} from "../../middleware/validate.js"

import {signInBodySchema, signUpBodySchema} from "./auth.schema.js"

import {asyncHandler} from "../../utils/asyncHandler.js"

import { requireAuth } from "../../middleware/requireAuth.js"

import * as authController from "./auth.controller.js"

const router = Router()
router.post("/signup", validateBody(signUpBodySchema), asyncHandler(authController.signUp))
router.post("/signin", validateBody(signInBodySchema), asyncHandler(authController.signIn))
router.post("/signout", authController.clearCookie)

router.get("/me", requireAuth, asyncHandler(authController.me))

export default router
