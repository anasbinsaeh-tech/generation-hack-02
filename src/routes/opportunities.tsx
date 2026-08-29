import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Info, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Panel, TopNav } from "@/components/siuuu";
import { useT } from "@/lib/i18n";
import { useSiuuu } from "@/lib/siuuu-store";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — Skilleveling" },
      {
        name: "description",
        content: "Roles matched to your evidence, not your degree. See exactly why each match happened.",
      },
      { property: "og:title", content: "Opportunities — Skilleveling" },
      { property: "og:description", content: "Opportunities where your evidence matters." },
    ],
  }),
  component: Opportunities,
});

const OPPORTUNITIES = [
  {
    id: "junior-ba",
    titleKey: "opps.1.title",
    companyKey: "opps.1.company",
    match: 91,
    skills: ["Data Analysis", "Research", "Excel"],
    degreeKey: "opps.1.degree",
    whyKeys: ["opps.1.why1", "opps.1.why2", "opps.1.why3"],
  },
  {
    id: "insights-assoc",
    titleKey: "opps.2.title",
    companyKey: "opps.2.company",
    match: 84,
    skills: ["Research", "Communication", "Data Analysis"],
    degreeKey: "opps.2.degree",
    whyKeys: ["opps.2.why1", "opps.2.why2"],
  },
] as const;

function Opportunities() {
  const { introduced, allowIntroduction } = useSiuuu();
  const [open, setOpen] = useState<string | null>(null);
  const { t } = useT();

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-4xl px-5 py-12">
        <h1 className="animate-rise text-4xl font-extrabold tracking-tight">
          {t("opps.title1")} <span className="text-foreground">{t("opps.title2")}</span>
        </h1>
        <p className="mt-3 text-muted-foreground">{t("opps.sub")}</p>

        <div className="mt-8 space-y-4">
          {OPPORTUNITIES.map((o, i) => (
            <Panel key={o.id} className="animate-rise" style={{ animationDelay: `${i * 120}ms` }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{t(o.titleKey)}</h2>
                  <p className="text-sm text-muted-foreground">{t(o.companyKey)}</p>
                </div>
                <div className="text-right">
                  <p className="text-signal text-3xl font-extrabold">{o.match}%</p>
                  <p className="text-xs text-muted-foreground">{t("opps.match")}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {o.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid gap-3 rounded-xl border border-border bg-black/[0.03] p-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                    {t("opps.degreeRequested")}
                  </p>
                  <p className="text-sm">{t(o.degreeKey)}</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{t("opps.yourDegree")}</p>
                  <p className="text-sm">{t("opps.yourDegreeValue")}</p>
                </div>
                <p className="text-sm text-muted-foreground sm:col-span-2">
                  {t("opps.degreeNote")}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setOpen(open === o.id ? null : o.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-black/5"
                >
                  <Info className="size-4" /> {t("opps.why")}
                </button>
                {introduced.includes(o.id) ? (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400">
                    <Check className="size-4" /> {t("opps.introduced")}
                  </span>
                ) : (
                  <button
                    onClick={() => allowIntroduction(o.id)}
                    className="bg-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    <ShieldCheck className="size-4" /> {t("opps.allow")}
                  </button>
                )}
                <span className="text-xs text-muted-foreground">
                  {t("opps.consent")}
                </span>
              </div>

              {open === o.id && (
                <div className="animate-rise mt-4 rounded-xl border border-border bg-black/[0.03] p-4">
                  <p className="text-xs tracking-widest text-muted-foreground uppercase">
                    {t("opps.behind")}
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {o.whyKeys.map((w) => (
                      <li key={w}>• {t(w)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Panel>
          ))}
        </div>

        <Link to="/employer" className="mt-8 inline-block text-sm text-muted-foreground hover:text-foreground">
          {t("opps.employerLink")}
        </Link>
      </main>
    </div>
  );
}
