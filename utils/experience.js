export function getExperienceCoverUrl(exp) {
  return (
    exp?.coverImage?.url ||
    exp?.attachments?.find((a) => a?.url)?.url ||
    exp?.certificate?.url ||
    exp?.proofFile?.url ||
    ''
  );
}
