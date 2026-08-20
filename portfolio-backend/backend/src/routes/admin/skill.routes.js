const buildCrudRouter = require('../../utils/crudFactory');
const Skill = require('../../models/Skill');

module.exports = buildCrudRouter(Skill, {
  resourceName: 'Skill',
  searchableFields: ['name', 'category'],
});
