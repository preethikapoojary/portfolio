import CertificateDetail from '@/components/public/pages/CertificateDetail';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CertificateDetail slug={slug} />;
}
