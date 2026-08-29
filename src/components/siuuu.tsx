import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BadgeCheck, Menu, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { getRank, RANK_STYLES, type Skill } from "@/lib/siuuu-types";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <span className="bg-signal flex size-7 items-center justify-center rounded-lg">
        <Sparkles className="size-4 text-signal-foreground" />
      </span>
      <span className="text-lg font-extrabold tracking-tight">
        Skill<span className="text-signal">leveling</span>
      </span>
    </Link>
  );
}

const NAV = [
  { to: "/dashboard", key: "nav.dashboard" },
  { to: "/opportunities", key: "nav.opportunities" },
  { to: "/employer", key: "nav.employerDemo" },
] as const;

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useT();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border p-0.5 text-xs font-semibold",
        className,
      )}
    >
      {(["en", "th"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "rounded-md px-2.5 py-1 transition-colors",
            lang === l
              ? "bg-signal text-signal-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l === "en" ? "EN" : "ไทย"}
        </button>
      ))}
    </div>
  );
}

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-black/5 sm:hidden"
          >
            <Menu className="size-5" />
          </button>
          <Logo />
        </div>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "hidden sm:inline-flex",
                "rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                pathname.startsWith(item.to) && "bg-black/5 text-foreground",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <LangToggle className="ml-2 hidden sm:inline-flex" />
        </nav>
      </div>

    </header>

    {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300 sm:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background shadow-xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-border/70 px-4">
            <Logo />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-black/5 hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground",
                  pathname.startsWith(item.to) && "bg-black/5 text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-border/70 p-4">
            <LangToggle />
          </div>
        </aside>
      </div>
    </>
  );
}

export function Panel({
  className,
  children,
  glow,
  style,
}: {
  className?: string;
  children: React.ReactNode;
  glow?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "glass rounded-2xl border border-border p-5",
        glow && "glow",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function RankBadge({
  rank,
  label,
  className,
}: {
  rank: keyof typeof RANK_STYLES;
  label: string;
  className?: string;
}) {
  const s = RANK_STYLES[rank];
  const verified = rank === "Gold" || rank === "Diamond";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        s.text,
        s.ring,
        s.bg,
        className,
      )}
    >
      {label}
      {verified && <BadgeCheck className="size-3.5" />}
    </span>
  );
}

export function XPBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-black/8", className)}>
      <div
        className="bg-signal h-full rounded-full transition-[width] duration-1000 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function SkillCard({ skill, href }: { skill: Skill; href?: boolean }) {
  const rank = getRank(skill);
  const { t } = useT();
  const inner = (
    <Panel className="h-full transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{skill.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("common.skillSuffix", {
              category: skill.category === "hard" ? t("common.hard") : t("common.soft"),
            })}
          </p>
        </div>
        <RankBadge rank={rank.rank} label={rank.label} />
      </div>
      {skill.evidenceCount === 0 ? (
        <p className="mt-4 text-xs text-muted-foreground">{t("common.notProven")}</p>
      ) : (
        <div className="mt-4 space-y-1.5">
          <XPBar value={rank.xpInLevel} max={rank.xpForLevel} />
          <p className="text-xs text-muted-foreground">
            {skill.xp} {t("common.evidenceXp")} ·{" "}
            {t("common.xpTo", { xp: rank.xpForLevel - rank.xpInLevel, rank: rank.nextLabel })}
          </p>
        </div>
      )}
    </Panel>
  );
  if (!href) return inner;
  return (
    <Link to="/skills/$skillId" params={{ skillId: skill.id }} className="block">
      {inner}
    </Link>
  );
}
