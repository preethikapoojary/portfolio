/**
 * Returns inline CSS transform styles for non-destructively cropped media
 * (`media.crop = { tx, ty, zoom, aspect }`) so the original file stays intact
 * in storage while only the cropped region is displayed inside an overflow-hidden container.
 */
export function getCroppedImageStyle(media) {
  const crop = media?.crop;
  if (!crop) return undefined;
  const tx = Number(crop.tx || 0);
  const ty = Number(crop.ty || 0);
  const zoom = Number(crop.zoom || 1);
  if (!tx && !ty && zoom === 1) return undefined;
  return {
    transform: `translate(${tx}%, ${ty}%) scale(${zoom})`,
    transformOrigin: 'center center',
  };
}
