import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Order ${id} | Honda Dealership`,
  };
}

export default async function OrderDetailPage({ params }: PageProps) {
  redirect("/orders");
}