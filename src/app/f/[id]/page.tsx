import { notFound } from "next/navigation";

import { FUNDRAISERS } from "@/lib/data";
import { FundraiserPage } from "@/components/fundraiser/fundraiser-page";

export function generateStaticParams() {
  return Object.keys(FUNDRAISERS).map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!FUNDRAISERS[id]) notFound();
  return <FundraiserPage id={id} />;
}
