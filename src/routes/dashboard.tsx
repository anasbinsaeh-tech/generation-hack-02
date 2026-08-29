import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye } from "lucide-react";

import { Panel, SkillCard, TopNav, XPBar } from "@/components/siuuu";
import { useT } from "@/lib/i18n";
import { useSiuuu } from "@/lib/siuuu-store";
import { getRank } from "@/lib/siuuu-types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Skill profile — Skilleveling" },
      { name: "description", content: "Your evidence profile: skill ranks, evidence XP and the next milestone." },
      { property: "og:title", content: "Skill profile — Skilleveling" },
      { property: "og:description", content: "Your evidence is getting stronger." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { skills, evidence } = useSiuuu();
  const { t } = useT();

  if (skills.length === 0) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <main className="mx-auto max-w-2xl px-5 py-24 text-center">
          <h1 className="text-2xl font-bold">{t("dash.empty.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("dash.empty.sub")}</p>
          <Link to="/story" className="bg-primary mt-6 inline-block rounded-xl px-6 py-3 font-semibold text-primary-foreground">
            {t("nav.tellStory")}
          </Link>
        </main>
      </div>
    );
  }

  const primary = [...skills].sort((a, b) => b.xp - a.xp)[0]!;
  const primaryRank = getRank(primary);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="animate-rise">
            <p className="text-sm text-muted-foreground">{t("dash.welcome")}</p>
            <h1 className="mt-1 text-4xl font-extrabold tracking-tight">
              {t("dash.title1")} <span className="text-foreground">{t("dash.title2")}</span>
            </h1>
          </div>
          <Link
            to="/preview-growth"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-black/5"
          >
            <Eye className="size-4" /> {t("dash.previewGrowth")}
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <SkillCard key={s.id} skill={s} href />
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{primary.name}</h2>
              <span className="text-sm text-muted-foreground">{primaryRank.label}</span>
            </div>
            <XPBar value={primaryRank.xpInLevel} max={primaryRank.xpForLevel} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              {primary.xp} {t("common.evidenceXp")} ·{" "}
              {t("common.xpTo", {
                xp: primaryRank.xpForLevel - primaryRank.xpInLevel,
                rank: primaryRank.nextLabel,
              })}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label={t("dash.stat.evidence")} value={primary.evidenceCount} />
              <Stat label={t("dash.stat.ai")} value={primary.aiMissions} />
              <Stat label={t("dash.stat.real")} value={primary.realMissions} />
              <Stat label={t("dash.stat.employer")} value={primary.employerConfirmations} />
            </div>
            <div className="mt-5 rounded-xl border border-border bg-black/[0.03] p-4">
              <p className="text-xs tracking-widest text-muted-foreground uppercase">{t("dash.nextMilestone")}</p>
              <p className="mt-1 font-semibold">{primaryRank.nextLabel}</p>
              <p className="text-sm text-muted-foreground">
                {t("dash.nextMilestoneNote")}
              </p>
            </div>
          </Panel>

          <Panel glow>
            <p className="text-xs tracking-widest text-muted-foreground uppercase">{t("dash.recommended")}</p>
            <h3 className="mt-2 text-lg font-bold">{t("dash.recommendedTitle")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("dash.recommendedBody", { skill: primary.name })}
            </p>
            <div className="mt-4 flex gap-2 text-xs">
              <span className="rounded-lg border border-border px-2.5 py-1">{t("dash.intermediate")}</span>
              <span className="rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 text-signal">
                {t("dash.xpReward")}
              </span>
            </div>
            <Link
              to="/mission/$skillId"
              params={{ skillId: primary.id }}
              className="bg-primary mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {t("dash.startMission")} <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/opportunities"
              className="mt-4 block text-sm text-muted-foreground hover:text-foreground"
            >
              {t("dash.seeOpps")}
            </Link>
          </Panel>
        </div>

        {evidence.length > 0 && (
          <Panel className="mt-6">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">{t("dash.locker")}</p>
            <div className="mt-3 space-y-2">
              {evidence.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-black/[0.03] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {t("dash.evidenceNo", { id: e.id.replace("EV-", ""), title: e.title })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {e.type} · {new Date(e.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-signal">{e.score} / 100</span>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-black/[0.03] p-3">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
