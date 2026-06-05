import { BRAND } from "@/lib/data";

/** Hairline footer: brand + tagline. */
export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="foot-inner">
        <span className="foot-brand">{BRAND.name}</span>
        <span className="foot-tag">{BRAND.tagline}</span>
      </div>
    </footer>
  );
}
