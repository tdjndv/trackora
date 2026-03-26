export function notFound(req, res) {
    res.status(404).json({
        ok: false,
        message: "Page not found"
    })
}

export function generalError(error, req, res, next) {
    const status = Number(error.status || 500)
    const message = error.message || "Internal server error"

    res.status(status).json({
        message: message
    })
}