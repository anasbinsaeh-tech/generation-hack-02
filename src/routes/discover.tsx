import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Quote } from "lucide-react";

import { Panel, RankBadge, TopNav } from "@/components/siuuu";

import { useT } from "@/lib/i18n";
import { useSiuuu } from "@/lib/siuuu-store";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "AI Skill Discovery — Skilleveling" },
      {
        name: "description",
        content: "See the potential skills Skilleveling found inside your experiences — hypotheses waiting to be proven.",
      },
      { property: "og:title", content: "AI Skill Discovery — Skilleveling" },
      { property: "og:description", content: "We found potential you may not have noticed." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { skills } = useSiuuu();
  const { t } = useT();

  if (skills.length === 0) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <main className="mx-auto max-w-2xl px-5 py-24 text-center">
          <h1 className="text-2xl font-bold">{t("discover.empty.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("discover.empty.sub")}</p>
          <Link to="/story" className="bg-primary mt-6 inline-block rounded-xl px-6 py-3 font-semibold text-primary-foreground">
            {t("nav.tellStory")}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-5xl px-5 py-14">
        <p className="text-xs tracking-widest text-signal uppercase">{t("discover.eyebrow")}</p>
        <h1 className="animate-rise mt-2 text-4xl font-extrabold tracking-tight">
          {t("discover.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("discover.sub")}</p>

        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <Panel
              key={s.id}
              className="animate-pop flex h-full flex-col"
              style={{ animationDelay: `${i * 110}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{s.name}</h3>
                <RankBadge rank="Potential" label="Potential" />
              </div>
              <div className="mt-4 rounded-xl border border-border bg-black/[0.03] p-3">
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{t("discover.detectedFrom")}</p>
                <p className="mt-1 flex gap-2 text-sm">
                  <Quote className="mt-0.5 size-3.5 shrink-0 text-signal" />
                  <span>“{s.reason}”</span>
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("discover.status")}</span>
                <span>{t("discover.signal", { n: Math.round(s.confidence * 100) })}</span>
              </div>
              <div className="mt-auto" />
              <Link
                to="/skills/$skillId"
                params={{ skillId: s.id }}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-primary/20"
              >
                {t("discover.prove")} <ArrowRight className="size-4" />
              </Link>
            </Panel>
          ))}
        </div>

        <div className="mt-10">
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            {t("discover.skip")}
          </Link>
        </div>
      </main>
    </div>
  );
}
