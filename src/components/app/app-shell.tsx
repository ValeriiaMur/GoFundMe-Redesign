import { type ReactNode } from "react";

import { Header } from "@/components/app/header";

/** Persistent chrome that survives client navigation: the shared header. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app">
      <Header />
      <div className="scroller">{children}</div>
    </div>
  );
}
