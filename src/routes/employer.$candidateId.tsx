import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, FileText, MessageSquarePlus } from "lucide-react";
import { useState } from "react";

import { Panel, RankBadge, XPBar } from "@/components/siuuu";
import { useT } from "@/lib/i18n";
import { useSiuuu } from "@/lib/siuuu-store";
import { getRank } from "@/lib/siuuu-types";

export const Route = createFileRoute("/employer/$candidateId")({
  component: CandidateProfile,
});

const DEMO_EVIDENCE = {
  id: "EV-001",
  title: "Sales Analysis Challenge",
  score: 82,
  type: "AI-Assessed" as const,
  rubric: {
    data_interpretation: 86,
    analytical_reasoning: 84,
    accuracy: 88,
    communication: 78,
    recommendation_quality: 80,
  },
  strengths: ["Identified the main sales pattern correctly", "Connected evidence to recommendations"],
  improvements: ["Consider alternative explanations"],
  answer:
    "Findings:\n1. Visits grew 10% while orders fell 23% — this is a conversion problem, not a traffic problem.\n2. Return rate tripled from 3.1% to 7.1%, suggesting product or expectation mismatch.\n3. AOV slid from $48 to $43, so discounting is masking the drop.\n\nReasoning:\nRising traffic with falling orders points to on-site friction or product quality, not acquisition. The return-rate curve tracks the order decline with a one-month lag.\n\nRecommendations:\n1. Audit the top 10 returned SKUs and pull them from paid campaigns within 2 weeks.\n2. Run a checkout funnel analysis; target +0.5pp conversion.\n3. Replace blanket discounts with bundle offers to protect AOV.",
  createdAt: new Date().toISOString(),
};

function CandidateProfile() {
  const { skills, evidence } = useSiuuu();
  const [showWork, setShowWork] = useState(false);
  const [invited, setInvited] = useState(false);
  const { t } = useT();

  const primary = skills.length
    ? [...skills].sort((a, b) => b.xp - a.xp)[0]!
    : { id: "data-analysis", name: "Data Analysis", xp: 120, evidenceCount: 1, aiMissions: 1 };
  const rank = getRank(primary);
  const item = evidence.find((e) => e.skillId === primary.id) ?? DEMO_EVIDENCE;
  const others = skills.length ? skills.filter((s) => s.id !== primary.id) : [];

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary flex size-14 items-center justify-center rounded-2xl text-xl font-bold text-primary-foreground">
            N
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Nan</h1>
            <p className="text-sm text-muted-foreground">{t("emp.candidateMeta")}</p>
          </div>
        </div>
        <button
          onClick={() => setInvited(true)}
          className="bg-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <MessageSquarePlus className="size-4" /> {invited ? t("emp.invited") : t("emp.invite")}
        </button>
      </div>

      <Panel className="mt-6 border-red-500/25 bg-red-500/5">
        <p className="flex items-start gap-2 text-sm text-red-600">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          {t("emp.warning")}
        </p>
      </Panel>

      <Panel className="mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{primary.name}</h2>
          <RankBadge rank={rank.rank} label={rank.label} />
        </div>
        <XPBar value={rank.xpInLevel} max={rank.xpForLevel} className="mt-3" />
        <p className="mt-2 text-xs text-muted-foreground">
          {t("emp.evidenceCount", { n: primary.evidenceCount })}
        </p>

        <div className="mt-5 rounded-xl border border-border bg-black/[0.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">
                {t("dash.evidenceNo", {
                  id: String(item.id).replace("EV-", ""),
                  title: item.title,
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("emp.evidenceMeta", {
                  type: item.type,
                  score: item.score,
                  date: new Date(item.createdAt).toLocaleDateString(),
                })}
              </p>
            </div>
            <button
              onClick={() => setShowWork((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-black/5"
            >
              <FileText className="size-4" /> {showWork ? t("emp.hideEvidence") : t("emp.viewEvidence")}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {Object.entries(item.rubric).map(([k, v]) => (
              <div key={k}>
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{k.replace(/_/g, " ")}</span>
                  <span className="font-semibold text-signal">{v}</span>
                </div>
                <XPBar value={v as number} max={100} className="mt-1.5" />
              </div>
            ))}
          </div>

          {showWork && (
            <div className="animate-rise mt-4 rounded-xl border border-border bg-black/40 p-4">
              <p className="text-xs tracking-widest text-muted-foreground uppercase">{t("emp.submission")}</p>
              <pre className="mt-2 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
                {item.answer}
              </pre>
            </div>
          )}
        </div>
      </Panel>

      {others.length > 0 && (
        <Panel className="mt-4">
          <p className="text-xs tracking-widest text-muted-foreground uppercase">{t("emp.otherSkills")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.map((s) => {
              const r = getRank(s);
              return (
                <span key={s.id} className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1 text-xs">
                  {s.name} <RankBadge rank={r.rank} label={r.label} />
                </span>
              );
            })}
          </div>
        </Panel>
      )}
    </main>
  );
}
