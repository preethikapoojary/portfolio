const buildCrudRouter = require('../../utils/crudFactory');
const CodingProfile = require('../../models/CodingProfile');

module.exports = buildCrudRouter(CodingProfile, {
  resourceName: 'CodingProfile',
  searchableFields: ['platform', 'username'],
});
