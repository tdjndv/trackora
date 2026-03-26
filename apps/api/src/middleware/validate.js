export function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            const first = result.error.issues[0]
            return res.status(400).json({
                message: first.message ?? "Body validation error",
                issues: result.error.issues
            })
        }
        req.validated = req.validated || {}
        req.validated.body = result.data
        return next()
    }
}

export function validateParams(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.params)

        if (!result.success) {
            return res.status(400).json({
                message: "Params validation error",
                issues: result.error.issues
            })
        }
        req.validated = req.validated || {}
        req.validated.params = result.data
        return next()
    }
}

export function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query)

        if (!result.success) {
            return res.status(400).json({
                message: "Query validation error",
                issues: result.error.issues
            })
        }
        req.validated = req.validated || {}
        req.validated.query = result.data
        return next()
    }
}