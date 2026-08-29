import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { Panel, RankBadge } from "@/components/siuuu";
import { useT } from "@/lib/i18n";
import { useSiuuu } from "@/lib/siuuu-store";
import { getRank } from "@/lib/siuuu-types";

export const Route = createFileRoute("/employer/")({
  component: TalentRadar,
});

function TalentRadar() {
  const { skills } = useSiuuu();
  const { t } = useT();
  const shown = skills.length
    ? skills.slice(0, 3)
    : [
        { id: "data-analysis", name: "Data Analysis", xp: 120, evidenceCount: 1 },
        { id: "research", name: "Research", xp: 0, evidenceCount: 0 },
        { id: "excel", name: "Excel", xp: 0, evidenceCount: 0 },
      ];

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">{t("emp.radarTitle")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("emp.radarSub")}</p>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          defaultValue="Junior Business Analyst"
          className="w-full bg-transparent text-sm outline-none"
          aria-label={t("emp.searchLabel")}
        />
        <span className="text-xs text-muted-foreground">{t("emp.candidateCount")}</span>
      </div>

      <Link to="/employer/$candidateId" params={{ candidateId: "nan" }} className="mt-6 block">
        <Panel className="transition-transform hover:-translate-y-0.5 hover:border-primary/40">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary flex size-12 items-center justify-center rounded-xl text-lg font-bold text-primary-foreground">
                N
              </div>
              <div>
                <h2 className="text-lg font-bold">Nan</h2>
                <p className="text-sm text-muted-foreground">{t("emp.candidateRole")}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-signal text-2xl font-extrabold">91%</p>
              <p className="text-xs text-muted-foreground">{t("emp.match")}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {shown.map((s) => {
              const r = getRank(s);
              return (
                <span key={s.id} className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1 text-xs">
                  {s.name}
                  <RankBadge rank={r.rank} label={r.label} />
                </span>
              );
            })}
          </div>
        </Panel>
      </Link>
    </main>
  );
}
