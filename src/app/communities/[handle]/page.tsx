import { notFound } from "next/navigation";

import { communityByHandle, listCommunities } from "@/lib/structure";
import { CommunityPage } from "@/components/community/community-page";

export function generateStaticParams() {
  return listCommunities().map((c) => ({ handle: c.handle }));
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const community = communityByHandle(handle);
  if (!community) notFound();
  return <CommunityPage id={community.id} />;
}
