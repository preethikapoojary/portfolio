const buildCrudRouter = require('../../utils/crudFactory');
const Experience = require('../../models/Experience');

module.exports = buildCrudRouter(Experience, {
  resourceName: 'Experience',
  searchableFields: ['company', 'role'],
});
