import { notFound } from "next/navigation";

import { getProfile, listProfiles } from "@/lib/structure";
import { ProfilePage } from "@/components/profile/profile-page";

export function generateStaticParams() {
  return listProfiles().map((p) => ({ handle: p.handle }));
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!getProfile(handle)) notFound();
  return <ProfilePage handle={handle} />;
}
