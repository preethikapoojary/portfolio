const buildCrudRouter = require('../../utils/crudFactory');
const Certificate = require('../../models/Certificate');

module.exports = buildCrudRouter(Certificate, {
  resourceName: 'Certificate',
  searchableFields: ['title', 'issuer'],
});
