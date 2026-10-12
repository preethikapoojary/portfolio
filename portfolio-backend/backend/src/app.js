const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { env } = require('./config/env');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const ApiError = require('./utils/ApiError');

const app = express();
app.set('trust proxy', 1);
// Security headers on every response.
app.use(helmet());

// CORS: whitelist only the known public site + admin dashboard origins.
// Supports comma-separated strings so multiple Vercel preview/production domains can be listed.
const allowedOrigins = [
  ...(env.clientUrl ? env.clientUrl.split(',').map((u) => u.trim()) : []),
  ...(env.adminUrl ? env.adminUrl.split(',').map((u) => u.trim()) : []),
];

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : [env.clientUrl, env.adminUrl],
    credentials: true, // required so the refresh-token cookie is sent/received
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Ensure MongoDB Atlas is connected before processing API requests (essential for serverless invocations)
app.use(async (req, res, next) => {
  if (req.path === '/' || req.path === '/health') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

if (!env.isProduction) {
  app.use(morgan('dev'));
}

app.get(['/', '/api'], (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio backend is running'
  });
});

app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    env: env.nodeEnv
  });
});

app.use(['/api/v1', '/v1'], routes);

// Unknown route → 404 via the same ApiError shape as everything else.
app.use((req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
});

// Must be registered last.
app.use(errorMiddleware);

module.exports = app;
