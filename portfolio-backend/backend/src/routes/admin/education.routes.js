const buildCrudRouter = require('../../utils/crudFactory');
const Education = require('../../models/Education');

module.exports = buildCrudRouter(Education, {
  resourceName: 'Education',
  searchableFields: ['institution', 'degree', 'fieldOfStudy'],
});
