const buildCrudRouter = require('../../utils/crudFactory');
const Achievement = require('../../models/Achievement');

module.exports = buildCrudRouter(Achievement, {
  resourceName: 'Achievement',
  searchableFields: ['title', 'description'],
});
