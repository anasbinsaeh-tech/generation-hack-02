import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, Sparkles, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Panel, RankBadge, TopNav, XPBar } from "@/components/siuuu";
import { assessSubmission, generateMission } from "@/lib/ai.functions";
import { useT } from "@/lib/i18n";
import { useSiuuu } from "@/lib/siuuu-store";
import { getRank, type Assessment, type Mission } from "@/lib/siuuu-types";

export const Route = createFileRoute("/mission/$skillId")({
  head: () => ({
    meta: [
      { title: "AI Micro Mission — Skilleveling" },
      { name: "description", content: "Prove a skill through a realistic AI-generated micro challenge on Skilleveling." },
      { property: "og:title", content: "AI Micro Mission — Skilleveling" },
      { property: "og:description", content: "Analyzing your work — not your resume." },
    ],
  }),
  component: MissionPage,
});

const SALES_DATA = [
  { month: "Jan", visits: 82_000, orders: 3_120, aov: 48, revenue: 149_760, returns: "3.1%" },
  { month: "Feb", visits: 79_500, orders: 3_040, aov: 47, revenue: 142_880, returns: "3.4%" },
  { month: "Mar", visits: 84_200, orders: 2_910, aov: 46, revenue: 133_860, returns: "4.2%" },
  { month: "Apr", visits: 86_100, orders: 2_640, aov: 45, revenue: 118_800, returns: "5.6%" },
  { month: "May", visits: 88_400, orders: 2_480, aov: 44, revenue: 109_120, returns: "6.3%" },
  { month: "Jun", visits: 90_100, orders: 2_390, aov: 43, revenue: 102_770, returns: "7.1%" },
];

type Stage = "brief" | "work" | "assessing" | "result" | "rankup";

function MissionPage() {
  const { skillId } = Route.useParams();
  const navigate = useNavigate();
  const { getSkill, addEvidence } = useSiuuu();
  const { t, lang } = useT();
  const skill = getSkill(skillId);

  const [mission, setMission] = useState<Mission | null>(null);
  const [stage, setStage] = useState<Stage>("brief");
  const [answer, setAnswer] = useState("");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [transition, setTransition] = useState({ from: "Potential", to: "Bronze I" });

  useEffect(() => {
    if (!skill) return;
    let alive = true;
    generateMission({ data: { skill: skill.name, lang } }).then((res) => {
      if (alive) setMission(res.mission);
    });
    return () => {
      alive = false;
    };
  }, [skill?.name, lang]);

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

  async function submit() {
    if (!mission || !skill) return;
    setStage("assessing");
    const res = await assessSubmission({
      data: { skill: skill.name, missionTitle: mission.title, answer, lang },
    });
    setAssessment(res.assessment);
    setStage("result");
  }

  function commitEvidence() {
    if (!mission || !assessment) return;
    const t = addEvidence({ skillId: skill!.id, mission, assessment, answer });
    setTransition(t);
    setStage("rankup");
  }

  const rank = getRank(skill);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-5xl px-5 py-12">
        {!mission && (
          <Panel className="flex flex-col items-center gap-3 py-16">
            <Loader2 className="size-6 animate-spin text-signal" />
            <p className="text-sm text-muted-foreground">
              {t("mission.generating", { skill: skill.name })}
            </p>
          </Panel>
        )}

        {mission && stage === "brief" && (
          <div className="animate-rise">
            <p className="text-xs tracking-widest text-signal uppercase">{t("mission.eyebrow")}</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{mission.title}</h1>
            <Panel className="mt-6">
              <p className="text-sm leading-relaxed text-muted-foreground">{mission.scenario}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs tracking-widest text-muted-foreground uppercase">{t("mission.yourTask")}</p>
                  <ol className="mt-2 space-y-1.5 text-sm">
                    {mission.deliverables.map((d, i) => (
                      <li key={d} className="flex gap-2">
                        <span className="text-signal">{i + 1}.</span> {d}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="space-y-3">
                  <Row label={t("mission.difficulty")} value={mission.difficulty} />
                  <Row
                    label={t("mission.skillsAssessed")}
                    value={mission.skills_assessed.join(", ")}
                  />
                  <Row
                    label={t("mission.reward")}
                    value={t("mission.rewardValue", { xp: mission.xp_reward })}
                  />
                </div>
              </div>
              <button
                onClick={() => setStage("work")}
                className="bg-primary mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-primary-foreground"
              >
                <Target className="size-4" /> {t("mission.start")}
              </button>
            </Panel>
          </div>
        )}

        {mission && stage === "work" && (
          <div className="grid min-w-0 gap-4 lg:grid-cols-[340px_1fr]">
            <Panel className="min-w-0 h-fit lg:sticky lg:top-20">
              <p className="text-xs tracking-widest text-muted-foreground uppercase">{t("mission.brief")}</p>
              <h2 className="mt-2 text-lg font-bold">{mission.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mission.scenario}</p>
              <ol className="mt-4 space-y-1.5 text-sm">
                {mission.deliverables.map((d, i) => (
                  <li key={d} className="flex gap-2">
                    <span className="text-signal">{i + 1}.</span> {d}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-muted-foreground">
                {t("mission.rewardLine", {
                  xp: mission.xp_reward,
                  difficulty: mission.difficulty,
                })}
              </p>
            </Panel>

            <div className="min-w-0 space-y-4">
              <Panel>
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-signal" />
                  <p className="text-sm font-semibold">{t("mission.dataset")}</p>
                </div>
                <div className="mt-3 max-w-full overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-muted-foreground uppercase">
                      <tr>
                        {(
                          [
                            "mission.th.month",
                            "mission.th.visits",
                            "mission.th.orders",
                            "mission.th.aov",
                            "mission.th.revenue",
                            "mission.th.returns",
                          ] as const
                        ).map((h) => (
                          <th key={h} className="px-2 py-2 font-medium">
                            {t(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SALES_DATA.map((r) => (
                        <tr key={r.month} className="border-t border-border">
                          <td className="px-2 py-2 font-medium">{r.month}</td>
                          <td className="px-2 py-2">{r.visits.toLocaleString()}</td>
                          <td className="px-2 py-2">{r.orders.toLocaleString()}</td>
                          <td className="px-2 py-2">${r.aov}</td>
                          <td className="px-2 py-2">${r.revenue.toLocaleString()}</td>
                          <td className="px-2 py-2">{r.returns}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <Panel>
                <p className="text-sm font-semibold">{t("mission.yourAnswer")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("mission.answerHint")}</p>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={14}
                  placeholder={t("mission.answerPlaceholder")}
                  className="mt-3 w-full resize-none rounded-xl border border-border bg-black/[0.03] p-4 font-mono text-sm leading-relaxed outline-none focus:border-primary/60"
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {t("mission.chars", { n: answer.trim().length })}
                  </span>
                  <button
                    disabled={answer.trim().length < 20}
                    onClick={submit}
                    className="bg-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-primary-foreground disabled:opacity-40"
                  >
                    {t("mission.submit")} <ArrowRight className="size-4" />
                  </button>
                </div>
              </Panel>
            </div>
          </div>
        )}

        {stage === "assessing" && (
          <Panel glow className="flex flex-col items-center gap-4 py-24 text-center">
            <Loader2 className="size-8 animate-spin text-signal" />
            <p className="text-xl font-bold">{t("mission.assessing")}</p>
            <div className="shimmer-bar h-1.5 w-72 rounded-full" />
            <p className="text-xs text-muted-foreground">{t("mission.assessingSub")}</p>
          </Panel>
        )}

        {stage === "result" && assessment && mission && (
          <div className="animate-rise space-y-4">
            <div>
              <p className="text-xs tracking-widest text-signal uppercase">{t("mission.complete")}</p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
                {t("mission.overall")}{" "}
                <span className="text-foreground">
                  {t("common.score", { score: assessment.overall_score })}
                </span>
              </h1>
            </div>

            <Panel>
              <div className="space-y-4">
                {Object.entries(assessment.rubric).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{k.replace(/_/g, " ")}</span>
                      <span className="font-semibold text-signal">{v}</span>
                    </div>
                    <XPBar value={v} max={100} className="mt-1.5" />
                  </div>
                ))}
              </div>
            </Panel>

            <div className="grid gap-4 md:grid-cols-2">
              <Panel>
                <p className="text-sm font-semibold text-emerald-400">{t("mission.strengths")}</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {assessment.strengths.map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </Panel>
              <Panel>
                <p className="text-sm font-semibold text-amber-400">{t("mission.improvements")}</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {assessment.improvements.map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </Panel>
            </div>

            <Panel glow>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">{t("mission.artifact")}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">
                    {t("dash.evidenceNo", { id: "001", title: mission.title })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("mission.artifactMeta", {
                      score: assessment.overall_score,
                      date: new Date().toLocaleDateString(),
                    })}
                  </p>
                </div>
                <button
                  onClick={commitEvidence}
                  className="bg-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-primary-foreground"
                >
                  <Sparkles className="size-4" /> {t("mission.addEvidence")}
                </button>
              </div>
            </Panel>
          </div>
        )}

        {stage === "rankup" && assessment && (
          <div className="animate-pop flex flex-col items-center py-16 text-center">
            <div
              className="pointer-events-none absolute top-40 size-[520px] rounded-full opacity-40 blur-[130px]"
              style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 65%)" }}
            />
            <p className="relative text-xs tracking-[0.35em] text-signal uppercase">{t("mission.rankUp")}</p>
            <h1 className="relative mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{skill.name}</h1>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              <RankBadge rank="Potential" label={transition.from} className="text-base" />
              <span className="text-2xl text-muted-foreground">↓</span>
              <RankBadge rank={rank.rank} label={transition.to} className="animate-pop text-base" />
            </div>
            <p className="relative mt-6 max-w-md text-muted-foreground">
              {t("mission.rankUpNote")}
            </p>
            <p className="relative mt-2 text-lg font-bold text-signal">
              {t("mission.rewardValue", { xp: assessment.evidence_xp })}
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate({ to: "/dashboard" })}
                className="bg-primary rounded-xl px-6 py-3 font-semibold text-primary-foreground"
              >
                {t("mission.viewProfile")}
              </button>
              <Link
                to="/discover"
                className="rounded-xl border border-border px-6 py-3 font-medium hover:bg-black/5"
              >
                {t("mission.nextMission")}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-black/[0.03] px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
