import { notFound } from "next/navigation";

import { getCause, listCauses } from "@/lib/structure";
import { FundraiserPage } from "@/components/fundraiser/fundraiser-page";

export function generateStaticParams() {
  return listCauses().map((c) => ({ id: c.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getCause(id)) notFound();
  return <FundraiserPage id={id} />;
}
