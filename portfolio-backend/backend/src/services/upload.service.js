const cloudinary = require('../config/cloudinary');

/**
 * Uploads a buffer (from multer memory storage) to Cloudinary via its
 * upload_stream API, so files never touch disk on the server.
 */
function uploadBuffer(buffer, { folder, resourceType = 'image' }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function uploadImage(buffer, folder = 'portfolio/images') {
  const result = await uploadBuffer(buffer, { folder, resourceType: 'image' });
  return { url: result.secure_url, publicId: result.public_id };
}

async function uploadDocument(buffer, originalName = 'resume.pdf', folder = 'portfolio/resumes') {
  // Cloudinary "raw" resources don't auto-append a file extension the way
  // image resources do — without baking the extension into the public_id,
  // the delivered URL has no .pdf suffix and some browsers/OSes fail to
  // recognize or preview the downloaded file correctly. Sanitizing the
  // original filename and using it as the public_id fixes that.
  const safeBase = originalName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .slice(0, 60);
  const publicId = `${folder}/${Date.now()}-${safeBase || 'resume'}.pdf`;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, resource_type: 'raw' },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    stream.end(buffer);
  });

  return { url: getRawAttachmentUrl(result.public_id), publicId: result.public_id };
}

/**
 * Cloudinary blocks *inline* delivery of raw PDF/ZIP resources by default
 * (an anti-phishing safeguard) — requesting the plain secure_url returns an
 * HTML "not allowed" response instead of the file, which the browser's PDF
 * viewer then fails to parse ("Failed to load PDF document"). Requesting
 * the resource with the `attachment` delivery flag forces a download
 * response instead, which Cloudinary does allow. Built from the publicId
 * rather than a stored URL so it also fixes resumes uploaded before this
 * fix, with no re-upload needed.
 */
function getRawAttachmentUrl(publicId) {
  if (!publicId) return null;
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    type: 'upload',
    secure: true,
    flags: 'attachment',
  });
}

async function destroy(publicId, resourceType = 'image') {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Cloudinary] failed to delete asset:', err.message);
  }
}

module.exports = { uploadImage, uploadDocument, destroy, getRawAttachmentUrl };
