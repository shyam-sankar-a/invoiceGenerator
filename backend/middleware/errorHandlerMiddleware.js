const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message
    });
}

const notFound = (req, res, next) => {
    const error = new Error(`Invalid path. Your request cannot be processed. Please check the path; ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export { errorHandler, notFound }