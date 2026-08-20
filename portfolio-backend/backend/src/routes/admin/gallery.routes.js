const buildCrudRouter = require('../../utils/crudFactory');
const GalleryImage = require('../../models/GalleryImage');

module.exports = buildCrudRouter(GalleryImage, {
  resourceName: 'GalleryImage',
  searchableFields: ['caption', 'category'],
});
