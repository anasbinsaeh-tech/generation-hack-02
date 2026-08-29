export type RankName = "Potential" | "Bronze" | "Silver" | "Gold" | "Diamond";

export type Rubric = Record<string, number>;

export type Skill = {
  id: string;
  name: string;
  category: "hard" | "soft";
  confidence: number;
  reason: string;
  xp: number;
  evidenceCount: number;
  aiMissions: number;
  realMissions: number;
  employerConfirmations: number;
};

export type Evidence = {
  id: string;
  skillId: string;
  title: string;
  score: number;
  rubric: Rubric;
  strengths: string[];
  improvements: string[];
  answer: string;
  createdAt: string;
  type: "AI-Assessed" | "Real-world" | "Employer Confirmed";
};

export type Mission = {
  title: string;
  scenario: string;
  difficulty: string;
  deliverables: string[];
  skills_assessed: string[];
  xp_reward: number;
};

export type Assessment = {
  overall_score: number;
  rubric: Rubric;
  strengths: string[];
  improvements: string[];
  evidence_xp: number;
};

export const XP_PER_LEVEL = 300;

const TIERS: RankName[] = ["Bronze", "Silver", "Gold", "Diamond"];
const ROMAN = ["I", "II", "III"];

export type RankInfo = {
  rank: RankName;
  level: string;
  label: string;
  xpInLevel: number;
  xpForLevel: number;
  nextLabel: string;
  verified: boolean;
};

export function getRank(skill: Pick<Skill, "xp" | "evidenceCount">): RankInfo {
  if (skill.evidenceCount === 0) {
    return {
      rank: "Potential",
      level: "",
      label: "Potential",
      xpInLevel: 0,
      xpForLevel: XP_PER_LEVEL,
      nextLabel: "Bronze I",
      verified: false,
    };
  }
  const levelIndex = Math.min(11, Math.floor(skill.xp / XP_PER_LEVEL));
  const tier = TIERS[Math.floor(levelIndex / 3)]!;
  const roman = ROMAN[levelIndex % 3]!;
  const nextIndex = Math.min(11, levelIndex + 1);
  const nextTier = TIERS[Math.floor(nextIndex / 3)]!;
  const nextRoman = ROMAN[nextIndex % 3]!;
  return {
    rank: tier,
    level: roman,
    label: `${tier} ${roman}`,
    xpInLevel: skill.xp - levelIndex * XP_PER_LEVEL,
    xpForLevel: XP_PER_LEVEL,
    nextLabel: `${nextTier} ${nextRoman}`,
    verified: tier === "Gold" || tier === "Diamond",
  };
}

export const RANK_STYLES: Record<RankName, { text: string; ring: string; bg: string }> = {
  Potential: {
    text: "text-muted-foreground",
    ring: "ring-black/10",
    bg: "bg-black/5",
  },
  Bronze: { text: "text-[#9A5B2B]", ring: "ring-[#9A5B2B]/25", bg: "bg-[#9A5B2B]/8" },
  Silver: { text: "text-[#5B6472]", ring: "ring-[#5B6472]/25", bg: "bg-[#5B6472]/8" },
  Gold: { text: "text-[#A9760F]", ring: "ring-[#A9760F]/25", bg: "bg-[#A9760F]/8" },
  Diamond: { text: "text-[#0E7490]", ring: "ring-[#0E7490]/25", bg: "bg-[#0E7490]/8" },
};

export function slugify(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (base) return base;
  // Non-Latin names (e.g. Thai) would become an empty slug — fall back to a
  // stable hash so every skill still gets a usable, deterministic id.
  let h = 0;
  for (const ch of name.trim()) h = (h * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  return `skill-${h.toString(36)}`;
}
