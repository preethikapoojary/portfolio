const express = require('express');
const asyncHandler = require('./asyncHandler');
const ApiResponse = require('./ApiResponse');
const ApiError = require('./ApiError');
const activityLogService = require('../services/activityLog.service');

/**
 * buildCrudRouter(Model, options) generates a full admin CRUD router:
 *   GET    /              list (pagination + search + arbitrary filters)
 *   GET    /:id           read one
 *   POST   /               create
 *   PUT    /:id            update
 *   DELETE /:id            delete
 *   PATCH  /reorder        bulk reorder: [{ id, order }, ...]
 *   PATCH  /:id/visibility toggle isVisible
 *
 * This one factory is why adding a brand-new future module (e.g. "Speaking
 * Engagements") is mostly configuration: one model file + one call to this
 * factory + one dashboard page reusing the shared DataTable/ReorderableList/
 * SearchBar components — not hand-written CRUD + hand-written activity logging.
 *
 * options:
 *   resourceName        {String}   human-readable name for activity log descriptions, e.g. "Project"
 *   searchableFields     {String[]} fields eligible for the `search` query param (regex match)
 *   hasOrder             {Boolean}  whether this model supports /reorder (default true)
 *   hasVisibility        {Boolean}  whether this model supports isVisible toggling (default true)
 *   populate              {String|Object} optional mongoose populate spec applied to list/get
 *   getDescription(doc, action) => String  optional custom activity-log description builder
 */
function buildCrudRouter(Model, options = {}) {
  const {
    resourceName = Model.modelName,
    searchableFields = [],
    hasOrder = true,
    hasVisibility = true,
    populate = null,
    getDescription = null,
  } = options;

  const router = express.Router();

  function describe(doc, action) {
    if (getDescription) return getDescription(doc, action);
    const label = doc?.title || doc?.name || doc?.label || doc?._id;
    return `${action[0]}${action.slice(1).toLowerCase()}d ${resourceName.toLowerCase()} "${label}"`;
  }

  function logActivity(req, { action, doc, description }) {
    activityLogService.record({
      adminId: req.admin?._id,
      action,
      resource: resourceName,
      resourceId: doc?._id || null,
      description: description || describe(doc, action),
    });
  }

  // ---- LIST (with pagination + search + generic filters) ----
  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Number(req.query.limit) || 20);
      const query = {};

      // Generic filters: any query param matching a top-level schema path
      // (except reserved ones) is applied as an equality filter. This lets
      // e.g. ?categoryId=... or ?status=... work for any module without
      // per-module filter code.
      const reserved = new Set(['page', 'limit', 'search', 'sort']);
      Object.entries(req.query).forEach(([key, value]) => {
        if (!reserved.has(key) && Model.schema.path(key)) {
          query[key] = value;
        }
      });

      if (req.query.search && searchableFields.length) {
        const regex = new RegExp(req.query.search, 'i');
        query.$or = searchableFields.map((field) => ({ [field]: regex }));
      }

      const sort = hasOrder ? { order: 1 } : { createdAt: -1 };

      let cursor = Model.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
      if (populate) cursor = cursor.populate(populate);

      const [items, total] = await Promise.all([cursor, Model.countDocuments(query)]);

      new ApiResponse(200, items, `${resourceName} list fetched`, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }).send(res);
    })
  );

  // ---- GET ONE ----
  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      let cursor = Model.findById(req.params.id);
      if (populate) cursor = cursor.populate(populate);
      const doc = await cursor;
      if (!doc) throw ApiError.notFound(`${resourceName} not found`);
      new ApiResponse(200, doc).send(res);
    })
  );

  // ---- CREATE ----
  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const doc = await Model.create(req.body);
      logActivity(req, { action: 'CREATE', doc });
      new ApiResponse(201, doc, `${resourceName} created`).send(res);
    })
  );

  // ---- UPDATE ----
  router.put(
    '/:id',
    asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) throw ApiError.notFound(`${resourceName} not found`);
      logActivity(req, { action: 'UPDATE', doc });
      new ApiResponse(200, doc, `${resourceName} updated`).send(res);
    })
  );

  // ---- DELETE ----
  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw ApiError.notFound(`${resourceName} not found`);
      logActivity(req, { action: 'DELETE', doc });
      new ApiResponse(200, doc, `${resourceName} deleted`).send(res);
    })
  );

  // ---- REORDER (bulk) ----
  if (hasOrder) {
    router.patch(
      '/reorder',
      asyncHandler(async (req, res) => {
        const items = req.body.items; // [{ id, order }, ...]
        if (!Array.isArray(items) || items.length === 0) {
          throw ApiError.badRequest('items must be a non-empty array of { id, order }');
        }
        await Promise.all(
          items.map(({ id, order }) => Model.updateOne({ _id: id }, { $set: { order } }))
        );
        logActivity(req, {
          action: 'REORDER',
          doc: null,
          description: `Reordered ${items.length} ${resourceName.toLowerCase()} item(s)`,
        });
        new ApiResponse(200, null, `${resourceName} reordered`).send(res);
      })
    );
  }

  // ---- TOGGLE VISIBILITY ----
  if (hasVisibility) {
    router.patch(
      '/:id/visibility',
      asyncHandler(async (req, res) => {
        const doc = await Model.findById(req.params.id);
        if (!doc) throw ApiError.notFound(`${resourceName} not found`);
        doc.isVisible = !doc.isVisible;
        await doc.save();
        logActivity(req, {
          action: 'UPDATE',
          doc,
          description: `${doc.isVisible ? 'Showed' : 'Hid'} ${resourceName.toLowerCase()} "${
            doc.title || doc.name || doc._id
          }"`,
        });
        new ApiResponse(200, doc, `${resourceName} visibility toggled`).send(res);
      })
    );
  }

  return router;
}

module.exports = buildCrudRouter;
