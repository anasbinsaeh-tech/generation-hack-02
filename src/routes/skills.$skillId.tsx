import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

import { Panel, RankBadge, TopNav, XPBar } from "@/components/siuuu";
import { useT } from "@/lib/i18n";
import { useSiuuu } from "@/lib/siuuu-store";
import { getRank, RANK_STYLES } from "@/lib/siuuu-types";

export const Route = createFileRoute("/skills/$skillId")({
  head: () => ({
    meta: [
      { title: "Skill detail — Skilleveling" },
      { name: "description", content: "Track a single skill's rank, evidence and next milestone on Skilleveling." },
      { property: "og:title", content: "Skill detail — Skilleveling" },
      { property: "og:description", content: "Rank represents evidence strength, not task count." },
    ],
  }),
  component: SkillDetail,
});

const ROADMAP = [
  "Potential",
  "Bronze I", "Bronze II", "Bronze III",
  "Silver I", "Silver II", "Silver III",
  "Gold I", "Gold II", "Gold III",
  "Diamond I", "Diamond II", "Diamond III",
];

function SkillDetail() {
  const { skillId } = Route.useParams();
  const { getSkill, evidence } = useSiuuu();
  const { t } = useT();
  const skill = getSkill(skillId);

  if (!skill) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <main className="mx-auto max-w-2xl px-5 py-24 text-center">
          <h1 className="text-2xl font-bold">{t("skill.notFound")}</h1>
          <Link to="/story" className="bg-primary mt-6 inline-block rounded-xl px-6 py-3 font-semibold text-primary-foreground">
            {t("skill.startStory")}
          </Link>
        </main>
      </div>
    );
  }

  const rank = getRank(skill);
  const items = evidence.filter((e) => e.skillId === skill.id);
  const reachedIndex = ROADMAP.indexOf(rank.label) >= 0 ? ROADMAP.indexOf(rank.label) : 0;

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-4xl px-5 py-12">
        <div className="animate-rise flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight">{skill.name}</h1>
          <RankBadge rank={rank.rank} label={rank.label} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("skill.detectedFrom", { reason: skill.reason })}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Panel>
            <p className="text-xs text-muted-foreground">{t("skill.currentRank")}</p>
            <p className={`mt-1 text-2xl font-bold ${RANK_STYLES[rank.rank].text}`}>{rank.label}</p>
          </Panel>
          <Panel>
            <p className="text-xs text-muted-foreground">{t("common.evidence")}</p>
            <p className="mt-1 text-2xl font-bold">{skill.evidenceCount}</p>
          </Panel>
          <Panel>
            <p className="text-xs text-muted-foreground">{t("skill.next")}</p>
            <p className="mt-1 text-2xl font-bold">{rank.nextLabel}</p>
          </Panel>
        </div>

        <Panel className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{t("common.evidenceXp")}</span>
            <span className="text-muted-foreground">
              {rank.xpInLevel} / {rank.xpForLevel}
            </span>
          </div>
          <XPBar value={rank.xpInLevel} max={rank.xpForLevel} className="mt-2" />
          <p className="mt-3 text-sm text-muted-foreground">
            {skill.evidenceCount === 0
              ? t("skill.firstMission")
              : t("skill.againContext", { rank: rank.nextLabel })}
          </p>
          <Link
            to="/mission/$skillId"
            params={{ skillId: skill.id }}
            className="bg-primary mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            {t("skill.prove")} <ArrowRight className="size-4" />
          </Link>
        </Panel>

        <Panel className="mt-4">
          <p className="text-xs tracking-widest text-muted-foreground uppercase">{t("skill.roadmap")}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {ROADMAP.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs ${
                    i <= reachedIndex
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {i <= reachedIndex ? (
                    <CheckCircle2 className="size-3.5 text-signal" />
                  ) : (
                    <Circle className="size-3.5" />
                  )}
                  {step}
                </span>
                {i < ROADMAP.length - 1 && <span className="text-muted-foreground">→</span>}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("skill.roadmapNote")}
          </p>
        </Panel>

        {items.length > 0 && (
          <Panel className="mt-4">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">{t("common.evidence")}</p>
            <div className="mt-3 space-y-2">
              {items.map((e) => (
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
