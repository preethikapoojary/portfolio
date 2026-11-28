import sharp from "sharp";

export async function processUploadedFile(
  file: File,
  folder: string
): Promise<{ buffer: Buffer; ext: string; contentType: string }> {
  const rawBuffer = Buffer.from(await file.arrayBuffer());
  const mime = (file.type || "").toLowerCase();
  const originalExt = (file.name.split(".").pop() || "bin").toLowerCase();

  // Only transform raster images (leave PDFs, SVGs, and other binaries untouched)
  if (!mime.startsWith("image/") || mime === "image/svg+xml" || originalExt === "svg") {
    return {
      buffer: rawBuffer,
      ext: originalExt,
      contentType: file.type || "application/octet-stream",
    };
  }

  const isCertificate = /certificate/i.test(folder);
  if (isCertificate) {
    const buffer = await sharp(rawBuffer).rotate().png({ compressionLevel: 9 }).toBuffer();
    return { buffer, ext: "png", contentType: "image/png" };
  }

  const buffer = await sharp(rawBuffer).rotate().webp({ quality: 88 }).toBuffer();
  return { buffer, ext: "webp", contentType: "image/webp" };
}
