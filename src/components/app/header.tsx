"use client";

import Image from "next/image";

import { PROFILES } from "@/lib/data";
import { Avatar } from "@/components/shared/avatar";
import { useSite } from "@/components/app/site-provider";

const ME = PROFILES.janahan;

/** Fixed top chrome, reused on every page: the GoFundMe logo dead-center,
 *  profile + Start on the right. No text menu — the logo is the way home. */
export function Header() {
  const { goHome, goProfile } = useSite();

  return (
    <header className="hdr">
      <span className="hdr-spacer" aria-hidden />

      <button className="hdr-logo" aria-label="GoFundMe home" onClick={goHome}>
        <Image src="/hero/gofundme-logo.png" alt="GoFundMe" width={121} height={46} priority />
      </button>
      <div className="hdr-right">
        <button
          className="hdr-me"
          aria-label={`Your profile — ${ME.name}`}
          onClick={() => goProfile(ME.handle)}
        >
          <Avatar person={ME} size={32} ring />
        </button>
      </div>
    </header>
  );
}
