import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Compass, FileStack, Radar } from "lucide-react";

import { LangToggle, Logo, Panel, RankBadge } from "@/components/siuuu";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skilleveling — Prove your skills with evidence, not a degree" },
      {
        name: "description",
        content:
          "Discover hidden skills in your past experiences, prove them through AI micro challenges, build evidence and get matched with opportunities.",
      },
      { property: "og:title", content: "Skilleveling — Evidence beats resumes" },
      {
        property: "og:description",
        content: "Turn what you've done into real skill evidence and let opportunities discover you.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { icon: Compass, key: "landing.step1" },
  { icon: BadgeCheck, key: "landing.step2" },
  { icon: FileStack, key: "landing.step3" },
  { icon: Radar, key: "landing.step4" },
] as const;

const FLOW = [
  { key: "landing.flow.potential", rank: "Potential" as const },
  { key: "landing.flow.mission", rank: null },
  { key: "landing.flow.bronze", rank: "Bronze" as const },
  { key: "landing.flow.build", rank: null },
  { key: "landing.flow.silver", rank: "Silver" as const },
  { key: "landing.flow.unlocked", rank: null },
] as const;

function Landing() {
  const { t } = useT();
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <div className="flex items-center gap-2">
          <LangToggle />
          <Link
            to="/employer"
            className="hidden rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            {t("nav.employerDemo")}
          </Link>
          <Link
            to="/story"
            className="bg-signal hidden rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap text-signal-foreground sm:inline-flex"
          >
            {t("nav.tellStory")}
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 pt-14 pb-20">
        <div
          className="pointer-events-none absolute top-[-260px] left-1/2 size-[620px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[130px]"
          style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 65%)" }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-signal" />
              {t("landing.badge")}
            </span>
            <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              {t("landing.hero.title1")}{" "}
              <span className="text-foreground">{t("landing.hero.title2")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {t("landing.hero.sub")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/story"
                className="bg-signal glow inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-signal-foreground transition-transform hover:scale-[1.02]"
              >
                {t("landing.hero.cta")} <ArrowRight className="size-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center rounded-xl border border-border px-6 py-3 font-medium text-foreground hover:bg-black/5"
              >
                {t("landing.hero.how")}
              </a>
            </div>
            <p className="mt-8 text-sm text-muted-foreground italic">
              {t("landing.hero.quote")}
            </p>
          </div>

          <Panel glow className="animate-floaty">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">
              {t("landing.journey")}
            </p>
            <div className="mt-4 space-y-2.5">
              {FLOW.map((step, i) => (
                <div
                  key={step.key}
                  className="animate-rise flex items-center justify-between rounded-xl border border-border bg-black/3 px-4 py-3"
                  style={{ animationDelay: `${i * 140}ms` }}
                >
                  <span className="text-sm font-medium">{t(step.key)}</span>
                  {step.rank ? (
                    <RankBadge rank={step.rank} label={step.rank} />
                  ) : (
                    <ArrowRight className="size-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Panel key={s.key} className="animate-rise">
              <div
                className="bg-signal flex size-9 items-center justify-center rounded-lg"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <s.icon className="size-4 text-white" />
              </div>
              <h3 className="mt-4 font-semibold">
                {i + 1}. {t(`${s.key}.title` as never)}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t(`${s.key}.body` as never)}</p>
            </Panel>
          ))}
        </div>
      </section>
    </div>
  );
}
