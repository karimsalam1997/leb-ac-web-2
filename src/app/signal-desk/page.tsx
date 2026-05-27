import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { SignalDeskDashboard } from "@/components/signal-desk/signal-desk-dashboard";
import { buildPageMetadata } from "@/lib/seo";
import { getSignalDeskData } from "@/lib/signal-desk";

export const metadata: Metadata = buildPageMetadata({
  title: "Signal Desk",
  description:
    "A review-first Lebanon and Levant signal desk from Lebanese Academic, mapping source claims, confidence, and political-economy analysis.",
  path: "/signal-desk",
  image: "/brand/la-primary-lockup.png",
});

export default function SignalDeskPage() {
  const data = getSignalDeskData();

  return (
    <SiteShell activePath="/signal-desk">
      <SignalDeskDashboard {...data} />
    </SiteShell>
  );
}
