import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { Panel, RankBadge, TopNav, XPBar } from "@/components/siuuu";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/preview-growth")({
  head: () => ({
    meta: [
      { title: "Future Profile Preview — Skilleveling" },
      { name: "description", content: "A demo-only look at what a Gold-ranked, verified evidence profile looks like." },
      { property: "og:title", content: "Future Profile Preview — Skilleveling" },
      { property: "og:description", content: "Gold is where a skill can be described as Verified." },
    ],
  }),
  component: PreviewGrowth,
});

const CRITERIA = ["grow.c1", "grow.c2", "grow.c3", "grow.c4"] as const;

function PreviewGrowth() {
  const { t } = useT();
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
          {t("grow.badge")}
        </span>
        <h1 className="animate-rise mt-4 text-4xl font-extrabold tracking-tight">
          {t("grow.title1")} <span className="text-foreground">{t("grow.title2")}</span>
        </h1>

        <Panel glow className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold">Data Analysis</h2>
            <RankBadge rank="Gold" label="Gold I" />
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-400/30">
              {t("grow.verified")}
            </span>
          </div>
          <XPBar value={180} max={300} className="mt-4" />
          <p className="mt-2 text-xs text-muted-foreground">{t("grow.xpLine")}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              [t("grow.stat.evidence"), 8],
              [t("grow.stat.ai"), 4],
              [t("grow.stat.cross"), 2],
              [t("grow.stat.partner"), 1],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-xl border border-border bg-black/[0.03] p-3">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            {CRITERIA.map((c) => (
              <p key={c} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-emerald-400" /> {t(c)}
              </p>
            ))}
            <p className="flex items-center gap-2 text-sm">
              <Check className="size-4 text-emerald-400" /> {t("grow.c5")}
            </p>
          </div>
        </Panel>

        <Link to="/dashboard" className="mt-8 inline-block text-sm text-muted-foreground hover:text-foreground">
          {t("grow.back")}
        </Link>
      </main>
    </div>
  );
}
