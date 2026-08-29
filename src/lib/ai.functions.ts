import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  callGrok,
  fallbackAssessment,
  fallbackMission,
  fallbackSkills,
  langInstruction,
  type DiscoveredSkill,
} from "./ai-fallback";
import type { Assessment, Mission } from "./siuuu-types";

const langSchema = z.enum(["en", "th"]).default("en");

export const discoverSkills = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ story: z.string().min(1), lang: langSchema }).parse(data),
  )
  .handler(async ({ data }): Promise<{ skills: DiscoveredSkill[]; source: "ai" | "demo" }> => {
    const result = (await callGrok(
      "You are a career skill discovery engine. From a student's story, extract exactly 5 POTENTIAL skills (never claim they are proven). Return strict JSON: {\"skills\":[{\"name\":string,\"confidence\":number 0-1,\"reason\":string quoting the evidence from the story,\"category\":\"hard\"|\"soft\"}]}" +
        langInstruction(data.lang),
      data.story,
    )) as { skills?: DiscoveredSkill[] } | null;
    if (result?.skills?.length) {
      return { skills: result.skills.slice(0, 5), source: "ai" };
    }
    return { skills: fallbackSkills(data.lang), source: "demo" };
  });

export const generateMission = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({ skill: z.string().min(1), difficulty: z.string().optional(), lang: langSchema })
      .parse(data),
  )
  .handler(async ({ data }): Promise<{ mission: Mission; source: "ai" | "demo" }> => {
    const result = (await callGrok(
      'You design realistic workplace micro-challenges that let a candidate PROVE a skill. Return strict JSON: {"title":string,"scenario":string,"difficulty":string,"deliverables":string[],"skills_assessed":string[],"xp_reward":number}' +
        langInstruction(data.lang),
      `Skill: ${data.skill}. Difficulty: ${data.difficulty ?? "Beginner"}. Make it doable in 15 minutes in a text editor.`,
    )) as Mission | null;
    if (result?.title && result?.scenario) {
      return { mission: { ...fallbackMission(data.skill, data.lang), ...result }, source: "ai" };
    }
    return { mission: fallbackMission(data.skill, data.lang), source: "demo" };
  });

export const assessSubmission = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        skill: z.string(),
        missionTitle: z.string(),
        answer: z.string().min(1),
        lang: langSchema,
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<{ assessment: Assessment; source: "ai" | "demo" }> => {
    const result = (await callGrok(
      'You are an evidence assessor. Judge only the work submitted, never the person. Return strict JSON: {"overall_score":number 0-100,"rubric":{"data_interpretation":number,"analytical_reasoning":number,"accuracy":number,"communication":number,"recommendation_quality":number},"strengths":string[],"improvements":string[],"evidence_xp":number}' +
        langInstruction(data.lang),
      `Skill: ${data.skill}\nMission: ${data.missionTitle}\n\nSubmission:\n${data.answer}`,
    )) as Assessment | null;
    if (typeof result?.overall_score === "number" && result.rubric) {
      return {
        assessment: { ...fallbackAssessment(data.answer.length, data.lang), ...result },
        source: "ai",
      };
    }
    return { assessment: fallbackAssessment(data.answer.length, data.lang), source: "demo" };
  });
