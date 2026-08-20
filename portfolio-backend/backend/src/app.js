const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { env } = require('./config/env');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const ApiError = require('./utils/ApiError');

const app = express();

// Security headers on every response.
app.use(helmet());

// CORS: whitelist only the known public site + admin dashboard origins —
// never '*'. Origins come from env vars so attaching a custom domain later
// is a config change, not a code change (architecture §12).
app.use(
  cors({
    origin: [env.clientUrl, env.adminUrl],
    credentials: true, // required so the refresh-token cookie is sent/received
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (!env.isProduction) {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => res.json({ status: 'ok', env: env.nodeEnv }));

app.use('/api/v1', routes);

// Unknown route → 404 via the same ApiError shape as everything else.
app.use((req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
});

// Must be registered last.
app.use(errorMiddleware);

module.exports = app;
