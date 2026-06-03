import { notFound } from "next/navigation";

import { PROFILES } from "@/lib/data";
import { ProfilePage } from "@/components/profile/profile-page";

export function generateStaticParams() {
  return Object.keys(PROFILES).map((handle) => ({ handle }));
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!PROFILES[handle]) notFound();
  return <ProfilePage handle={handle} />;
}
