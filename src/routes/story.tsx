import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileUp, FolderUp, Sparkles } from "lucide-react";
import { useState } from "react";

import { Panel, TopNav } from "@/components/siuuu";
import { demoStory, fallbackSkills } from "@/lib/ai-fallback";
import { useT } from "@/lib/i18n";
import { discoverSkills } from "@/lib/ai.functions";
import { useSiuuu } from "@/lib/siuuu-store";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Tell your story — Skilleveling" },
      {
        name: "description",
        content: "Describe projects, coursework, internships and side work. Skilleveling finds the skills hidden inside.",
      },
      { property: "og:title", content: "Tell your story — Skilleveling" },
      { property: "og:description", content: "Don't tell us what job you want. Tell us what you've done." },
    ],
  }),
  component: StoryPage,
});

const STAGES = ["story.stage1", "story.stage2", "story.stage3", "story.stage4"] as const;

function StoryPage() {
  const navigate = useNavigate();
  const { story, setStory, setSkills } = useSiuuu();
  const { t, lang } = useT();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);

  async function run() {
    const text = story.trim() || demoStory(lang);
    setStory(text);
    setLoading(true);
    const timer = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 900);
    try {
      if (import.meta.env.BASE_URL !== "/") {
        setSkills(fallbackSkills(lang));
      } else {
        const res = await discoverSkills({ data: { story: text, lang } });
        setSkills(res.skills);
      }
    } catch {
      setSkills(fallbackSkills(lang));
    } finally {
      clearInterval(timer);
      setLoading(false);
      navigate({ to: "/discover" });
    }
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <h1 className="animate-rise text-4xl font-extrabold tracking-tight">
          {t("story.title1")}
          <br />
          <span className="text-foreground">{t("story.title2")}</span>
        </h1>
        <p className="mt-3 text-muted-foreground">{t("story.sub")}</p>

        <Panel className="mt-8" glow={loading}>
          {loading ? (
            <div className="relative flex flex-col items-center justify-center gap-6 overflow-hidden py-16 text-center">
              <div className="absolute top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[100px] animate-pulse" />

              <div className="relative z-10 size-16">
                <div className="absolute inset-0 rounded-full border-4 border-signal/20" />
                <div className="absolute inset-0 rounded-full border-4 border-signal border-t-transparent animate-spin" />
                <div className="absolute inset-0 rounded-full border-4 border-signal/40 border-b-transparent animate-spin-reverse" />
              </div>

              <div className="relative z-10 space-y-1">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {t("story.analysisStage")}
                </p>
                <p className="text-2xl font-semibold tracking-tight">
                  {t(STAGES[stage]!)}
                </p>
              </div>

              <div className="relative z-10 h-2.5 w-64 overflow-hidden rounded-full bg-muted">
                <div className="gradient-shimmer absolute inset-0 w-3/4 rounded-full" />
              </div>

              <p className="relative z-10 max-w-xs text-sm italic text-muted-foreground">
                {t("story.note")}
              </p>
            </div>
          ) : (
            <>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={10}
                placeholder={t("story.placeholder")}
                className="w-full resize-none rounded-xl border border-border bg-black/[0.03] p-4 text-sm leading-relaxed outline-none focus:border-primary/60"
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-black/5">
                  <FileUp className="size-4" /> {t("story.uploadResume")}
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-black/5">
                  <FolderUp className="size-4" /> {t("story.uploadPortfolio")}
                </button>
                <button
                  onClick={() => setStory(demoStory(lang))}
                  className="ml-auto text-xs text-signal hover:underline"
                >
                  {t("story.useDemo")}
                </button>
              </div>
              <button
                onClick={run}
                className="bg-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.01]"
              >
                <Sparkles className="size-4" /> {t("story.discover")}
              </button>
            </>
          )}
        </Panel>
      </main>
    </div>
  );
}

