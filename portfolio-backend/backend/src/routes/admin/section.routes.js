const buildCrudRouter = require('../../utils/crudFactory');
const Section = require('../../models/Section');

// First real usage of the factory pattern: Section needs order + visibility
// but not search or create/delete (its rows are fixed to the known section
// keys), so we compose the factory's router with those two routes disabled
// via the model's own constraints rather than adding factory-level flags for
// a one-off case. In practice `create`/`delete` are simply not exposed by
// the frontend for this module — the routes exist but the dashboard UI for
// Sections only calls reorder + visibility + update.
module.exports = buildCrudRouter(Section, {
  resourceName: 'Section',
  hasOrder: true,
  hasVisibility: true,
  getDescription: (doc, action) => `${action} section "${doc?.label}"`,
});
