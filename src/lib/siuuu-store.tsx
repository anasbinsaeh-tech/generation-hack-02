import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { Assessment, Evidence, Mission, Skill } from "./siuuu-types";
import { getRank, slugify } from "./siuuu-types";

type State = {
  story: string;
  skills: Skill[];
  evidence: Evidence[];
  lastRankUp: { skillId: string; from: string; to: string; xp: number } | null;
  introduced: string[];
};

const EMPTY: State = {
  story: "",
  skills: [],
  evidence: [],
  lastRankUp: null,
  introduced: [],
};

const KEY = "siuuu-state-v1";

type Ctx = State & {
  setStory: (s: string) => void;
  setSkills: (
    s: { name: string; confidence: number; reason: string; category: "hard" | "soft" }[],
  ) => void;
  addEvidence: (args: {
    skillId: string;
    mission: Mission;
    assessment: Assessment;
    answer: string;
  }) => { from: string; to: string };
  clearRankUp: () => void;
  allowIntroduction: (id: string) => void;
  reset: () => void;
  getSkill: (id: string) => Skill | undefined;
};

const StoreContext = createContext<Ctx | null>(null);

export function SiuuuProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const loaded = { ...EMPTY, ...(JSON.parse(raw) as State) };
        // Repair skills saved with an empty id (Thai names slugified to "").
        const idMap = new Map<string, string>();
        loaded.skills = loaded.skills.map((sk) => {
          if (sk.id) return sk;
          const id = slugify(sk.name);
          idMap.set(sk.id, id);
          return { ...sk, id };
        });
        loaded.evidence = loaded.evidence.map((ev) =>
          idMap.has(ev.skillId) ? { ...ev, skillId: idMap.get(ev.skillId)! } : ev,
        );
        setState(loaded);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const setStory = useCallback((story: string) => setState((s) => ({ ...s, story })), []);

  const setSkills = useCallback<Ctx["setSkills"]>((discovered) => {
    setState((s) => ({
      ...s,
      skills: discovered.map((d) => {
        const id = slugify(d.name);
        const existing = s.skills.find((x) => x.id === id);
        return (
          existing ?? {
            id,
            name: d.name,
            category: d.category,
            confidence: d.confidence,
            reason: d.reason,
            xp: 0,
            evidenceCount: 0,
            aiMissions: 0,
            realMissions: 0,
            employerConfirmations: 0,
          }
        );
      }),
    }));
  }, []);

  const addEvidence = useCallback<Ctx["addEvidence"]>(
    ({ skillId, mission, assessment, answer }) => {
      let transition = { from: "Potential", to: "Bronze I" };
      setState((s) => {
        const skills = s.skills.map((sk) => {
          if (sk.id !== skillId) return sk;
          return {
            ...sk,
            xp: sk.xp + assessment.evidence_xp,
            evidenceCount: sk.evidenceCount + 1,
            aiMissions: sk.aiMissions + 1,
          };
        });
        const before = s.skills.find((x) => x.id === skillId);
        const after = skills.find((x) => x.id === skillId);
        if (before && after) {
          transition = { from: getRank(before).label, to: getRank(after).label };
        }
        const evidence: Evidence = {
          id: `EV-${String(s.evidence.length + 1).padStart(3, "0")}`,
          skillId,
          title: mission.title,
          score: assessment.overall_score,
          rubric: assessment.rubric,
          strengths: assessment.strengths,
          improvements: assessment.improvements,
          answer,
          createdAt: new Date().toISOString(),
          type: "AI-Assessed",
        };
        return {
          ...s,
          skills,
          evidence: [...s.evidence, evidence],
          lastRankUp: { skillId, ...transition, xp: assessment.evidence_xp },
        };
      });
      return transition;
    },
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      setStory,
      setSkills,
      addEvidence,
      clearRankUp: () => setState((s) => ({ ...s, lastRankUp: null })),
      allowIntroduction: (id) =>
        setState((s) => ({
          ...s,
          introduced: s.introduced.includes(id) ? s.introduced : [...s.introduced, id],
        })),
      reset: () => setState(EMPTY),
      getSkill: (id) => state.skills.find((s) => s.id === id),
    }),
    [state, setStory, setSkills, addEvidence],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useSiuuu() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useSiuuu must be used inside SiuuuProvider");
  return ctx;
}
