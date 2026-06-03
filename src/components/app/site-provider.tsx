"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  ACTIVITY,
  COMMUNITIES,
  FUNDRAISERS,
  PROFILES,
  type Activity,
} from "@/lib/data";
import { crossedMilestone } from "@/lib/progress";
import { Celebration } from "@/components/shared/celebration";
import { Toast, type ToastData } from "@/components/shared/toast";
import { DonateModal } from "@/components/shared/donate-modal";
import { LanternModal } from "@/components/shared/lantern-modal";

export interface LanternTarget {
  kind: "fundraiser" | "community" | "person";
  id: string;
}

export interface SiteContextValue {
  raisedById: Record<string, number>;
  lanternsById: Record<string, number>;
  followedById: Record<string, boolean>;
  joined: boolean;
  followingPerson: boolean;
  feed: Activity[];
  raisedFor: (id: string) => number;
  lanternsFor: (id: string) => number;
  openDonate: (id: string) => void;
  openLantern: (target: LanternTarget) => void;
  follow: (id: string) => void;
  join: () => void;
  followPerson: () => void;
  goFundraiser: (id: string) => void;
  goCommunity: () => void;
  goProfile: (handle: string) => void;
  goNode: (node: { id: string; kind: "fundraiser" | "community" }) => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within <SiteProvider>");
  return ctx;
}

const PROFILE = PROFILES.janahan;

export function SiteProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const uid = useRef(1000);

  const [raisedById, setRaised] = useState<Record<string, number>>({
    alerts: FUNDRAISERS.alerts.raised,
    shelter: FUNDRAISERS.shelter.raised,
    replant: FUNDRAISERS.replant.raised,
  });
  const [lanternsById, setLanterns] = useState<Record<string, number>>({
    alerts: FUNDRAISERS.alerts.lanterns,
    shelter: FUNDRAISERS.shelter.lanterns,
    replant: FUNDRAISERS.replant.lanterns,
    watch: COMMUNITIES.watch.lanterns,
  });
  const [followedById, setFollowed] = useState<Record<string, boolean>>({});
  const [joined, setJoined] = useState(false);
  const [followingPerson, setFollowingPerson] = useState(false);
  const [feed, setFeed] = useState<Activity[]>(ACTIVITY);

  const [donateTarget, setDonateTarget] = useState<string | null>(null);
  const [lanternTarget, setLanternTarget] = useState<LanternTarget | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [cel, setCel] = useState<{ fire: number | null; accent: number }>({ fire: null, accent: 52 });

  const showToast = useCallback((text: string) => {
    const id = "t" + ++uid.current;
    setToast({ id, text });
    setTimeout(() => setToast((cur) => (cur && cur.id === id ? null : cur)), 3200);
  }, []);

  const prepend = useCallback((item: Omit<Activity, "id" | "at">) => {
    setFeed((f) => [{ id: "f" + ++uid.current, at: "just now", ...item }, ...f].slice(0, 40));
  }, []);

  const doDonate = useCallback(
    (id: string, amount: number, msg: string) => {
      const f = FUNDRAISERS[id];
      const before = raisedById[id] ?? f.raised;
      const after = before + amount;
      setRaised((r) => ({ ...r, [id]: after }));
      setLanterns((l) => ({ ...l, [id]: (l[id] ?? f.lanterns) + 1 }));
      prepend({ who: PROFILE, type: "donate", amount, msg, target: id });
      setCel({ fire: Date.now(), accent: f.accent });
      setDonateTarget(null);
      const crossed = crossedMilestone(f.milestones, before, after);
      showToast(
        crossed
          ? `✦ Milestone reached: ${crossed.label}!`
          : `Your light is planted. ${f.worldName} just grew.`,
      );
    },
    [prepend, raisedById, showToast],
  );

  const doLantern = useCallback(
    (target: LanternTarget, msg: string) => {
      const id = target.kind === "fundraiser" ? target.id : "watch";
      setLanterns((l) => ({ ...l, [id]: (l[id] || 0) + 1 }));
      prepend({ who: PROFILE, type: "lantern", msg, target: id });
      setLanternTarget(null);
      setCel({ fire: Date.now(), accent: 88 });
      showToast("Lantern released. Link copied to share.");
    },
    [prepend, showToast],
  );

  const goFundraiser = useCallback((id: string) => router.push(`/cause/${id}`), [router]);
  const goCommunity = useCallback(() => router.push(`/`), [router]);
  const goProfile = useCallback((handle: string) => router.push(`/u/${handle}`), [router]);

  const value: SiteContextValue = useMemo(
    () => ({
      raisedById,
      lanternsById,
      followedById,
      joined,
      followingPerson,
      feed,
      raisedFor: (id) => raisedById[id] ?? FUNDRAISERS[id]?.raised ?? 0,
      lanternsFor: (id) => lanternsById[id] ?? FUNDRAISERS[id]?.lanterns ?? 0,
      openDonate: (id) => setDonateTarget(id),
      openLantern: (t) => setLanternTarget(t),
      follow: (id) => {
        setFollowed((s) => ({ ...s, [id]: !s[id] }));
        showToast(followedById[id] ? "You stopped watching." : "You're keeping watch. We'll send you updates.");
      },
      join: () => {
        setJoined((j) => !j);
        showToast(joined ? "You left the watch." : "Welcome to the watch. 12,481 strong.");
      },
      followPerson: () => {
        setFollowingPerson((v) => !v);
        showToast(followingPerson ? "Unfollowed." : "Following Janahan. You'll see their lights.");
      },
      goFundraiser,
      goCommunity,
      goProfile,
      goNode: (n) => (n.kind === "community" ? goCommunity() : goFundraiser(n.id)),
    }),
    [
      raisedById,
      lanternsById,
      followedById,
      joined,
      followingPerson,
      feed,
      showToast,
      goFundraiser,
      goCommunity,
      goProfile,
    ],
  );

  return (
    <SiteContext.Provider value={value}>
      {children}
      <Celebration fire={cel.fire} accent={cel.accent} />
      {donateTarget && (
        <DonateModal
          fundraiser={FUNDRAISERS[donateTarget]}
          onClose={() => setDonateTarget(null)}
          onConfirm={(a, m) => doDonate(donateTarget, a, m)}
        />
      )}
      {lanternTarget && (
        <LanternModal onClose={() => setLanternTarget(null)} onConfirm={(m) => doLantern(lanternTarget, m)} />
      )}
      <Toast toast={toast} />
    </SiteContext.Provider>
  );
}
