const { env } = require('../config/env');
const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  let error = err;

  // Normalize known Mongoose errors into ApiError so the client always
  // gets the same response shape regardless of what threw.
  if (err.name === 'ValidationError') {
    error = ApiError.badRequest('Validation failed', err.errors);
  } else if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid value for ${err.path}`);
  } else if (err.code === 11000) {
    error = ApiError.conflict('Duplicate value violates a unique constraint');
  } else if (!(err instanceof ApiError)) {
    // Unexpected/programming error — never leak internals in production.
    // eslint-disable-next-line no-console
    console.error('[UNHANDLED ERROR]', err);
    error = ApiError.internal(env.isProduction ? 'Something went wrong' : err.message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
    ...(!env.isProduction && err.stack ? { stack: err.stack } : {}),
  });
}

module.exports = errorMiddleware;
