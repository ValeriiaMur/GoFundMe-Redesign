import { notFound } from "next/navigation";

import { COMMUNITIES } from "@/lib/data";
import { communityByHandle } from "@/lib/structure";
import { CommunityPage } from "@/components/community/community-page";

export function generateStaticParams() {
  return Object.values(COMMUNITIES).map((c) => ({ handle: c.handle }));
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const community = communityByHandle(handle);
  if (!community) notFound();
  return <CommunityPage id={community.id} />;
}
