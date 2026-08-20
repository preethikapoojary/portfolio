function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Ensures a slug is unique for a given Mongoose model by appending
 * -2, -3, ... if needed. Used on create/update of Project & BlogPost.
 */
async function uniqueSlug(Model, baseText, excludeId = null) {
  const base = slugify(baseText);
  let slug = base;
  let counter = 2;

  /* eslint-disable no-await-in-loop */
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Model.findOne(query).select('_id').lean();
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
  /* eslint-enable no-await-in-loop */
}

module.exports = { slugify, uniqueSlug };
