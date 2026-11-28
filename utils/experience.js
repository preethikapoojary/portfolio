export function getExperienceCoverMedia(exp) {
  if (exp?.coverImage?.url) return exp.coverImage;
  const att = exp?.attachments?.find((a) => a?.url);
  if (att) return att;
  if (exp?.certificate?.url) return exp.certificate;
  if (exp?.proofFile?.url) return exp.proofFile;
  return null;
}

export function getExperienceCoverUrl(exp) {
  return getExperienceCoverMedia(exp)?.url || '';
}
