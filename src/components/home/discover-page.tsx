import { LanternHero } from "@/components/home/lantern-hero";
import { ValueProps } from "@/components/home/value-props";
import { Atlas } from "@/components/home/atlas";
import { SiteFooter } from "@/components/home/site-footer";

/** The home page (design handoff "Hero Redesign"): the lantern scroll hero,
 *  then the dawn dissolves into value props and the atlas bento. */
export function DiscoverPage() {
  return (
    <div className="page page-discover">
      <LanternHero />
      <div className="home-sections">
        <ValueProps />
        <Atlas />
        <SiteFooter />
      </div>
    </div>
  );
}
