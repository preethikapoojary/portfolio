import TestimonialDetail from '@/components/public/pages/TestimonialDetail';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TestimonialDetail slug={slug} />;
}
