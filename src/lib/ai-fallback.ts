import type { Assessment, Mission } from "./siuuu-types";

export type Lang = "en" | "th";

export const DEMO_STORY = `For my final-year education research project I designed a survey about student study habits, collected around 400 responses across three faculties, cleaned the messy data in Excel, built pivot tables and charts, and presented the findings to my professor. I also tutored part-time and ran the logistics for our faculty's open day.`;

export const DEMO_STORY_TH = `โปรเจกต์วิจัยปีสุดท้ายของคณะครุศาสตร์ ฉันออกแบบแบบสอบถามเรื่องพฤติกรรมการเรียนของนักศึกษา เก็บข้อมูลได้ราว 400 ชุดจาก 3 คณะ ทำความสะอาดข้อมูลที่กระจัดกระจายใน Excel สร้าง pivot table และกราฟ แล้วนำเสนอผลให้อาจารย์ที่ปรึกษา นอกจากนี้ยังสอนพิเศษพาร์ทไทม์ และดูแลงานจัดการทั้งหมดของงานเปิดบ้านคณะ`;

export function demoStory(lang: Lang) {
  return lang === "th" ? DEMO_STORY_TH : DEMO_STORY;
}

export type DiscoveredSkill = {
  name: string;
  confidence: number;
  reason: string;
  category: "hard" | "soft";
};

export const FALLBACK_SKILLS: DiscoveredSkill[] = [
  {
    name: "Data Analysis",
    confidence: 0.82,
    reason: "Analyzed 400 survey responses",
    category: "hard",
  },
  {
    name: "Research",
    confidence: 0.78,
    reason: "Designed and ran a university research study",
    category: "hard",
  },
  {
    name: "Excel",
    confidence: 0.74,
    reason: "Cleaned data and built pivot tables in Excel",
    category: "hard",
  },
  {
    name: "Problem Solving",
    confidence: 0.66,
    reason: "Turned messy raw data into usable findings",
    category: "soft",
  },
  {
    name: "Communication",
    confidence: 0.71,
    reason: "Presented findings to a professor",
    category: "soft",
  },
];

export const FALLBACK_SKILLS_TH: DiscoveredSkill[] = [
  {
    name: "การวิเคราะห์ข้อมูล",
    confidence: 0.82,
    reason: "วิเคราะห์แบบสอบถาม 400 ชุด",
    category: "hard",
  },
  {
    name: "การวิจัย",
    confidence: 0.78,
    reason: "ออกแบบและดำเนินงานวิจัยระดับมหาวิทยาลัย",
    category: "hard",
  },
  {
    name: "Excel",
    confidence: 0.74,
    reason: "ทำความสะอาดข้อมูลและสร้าง pivot table ใน Excel",
    category: "hard",
  },
  {
    name: "การแก้ปัญหา",
    confidence: 0.66,
    reason: "เปลี่ยนข้อมูลดิบที่กระจัดกระจายให้ใช้งานได้จริง",
    category: "soft",
  },
  {
    name: "การสื่อสาร",
    confidence: 0.71,
    reason: "นำเสนอผลการวิจัยให้อาจารย์ที่ปรึกษา",
    category: "soft",
  },
];

export function fallbackSkills(lang: Lang) {
  return lang === "th" ? FALLBACK_SKILLS_TH : FALLBACK_SKILLS;
}

export function fallbackMission(skillName: string, lang: Lang = "en"): Mission {
  const isData = /data|ข้อมูล/i.test(skillName);
  if (lang === "th") {
    if (isData) {
      return {
        title: "ทำไมยอดขายถึงลดลง?",
        scenario:
          "บริษัทอีคอมเมิร์ซแห่งหนึ่งมียอดขายลดลง 15% ในไตรมาสที่ผ่านมา คุณได้รับข้อมูลผลประกอบการรายเดือนแบบย่อ ผู้บริหารอยากเข้าใจว่าเกิดอะไรขึ้น และควรทำอะไรต่อ",
        difficulty: "ระดับเริ่มต้น",
        deliverables: [
          "ระบุรูปแบบสำคัญในข้อมูล 2-3 ข้อ",
          "อธิบายสาเหตุที่เป็นไปได้",
          "เสนอข้อแนะนำที่จับต้องได้ 3 ข้อ",
        ],
        skills_assessed: ["การวิเคราะห์ข้อมูล", "การแก้ปัญหา", "การสื่อสาร"],
        xp_reward: 120,
      };
    }
    return {
      title: `แสดง${skillName}ในสถานการณ์จริง`,
      scenario: `ทีมเล็กๆ ทีมหนึ่งต้องการความช่วยเหลือจากคุณ คุณจะได้รับสถานการณ์จริงที่ยุ่งเหยิง ซึ่ง${skillName}คือปัจจัยชี้ขาด ลงมือทำแบบเดียวกับที่ทำในงานจริง — กระบวนการคิดสำคัญไม่แพ้คำตอบ`,
      difficulty: "ระดับเริ่มต้น",
      deliverables: [
        "อธิบายว่าคุณจะเข้าหาสถานการณ์นี้อย่างไร",
        "แสดงเหตุผลทีละขั้น",
        "เสนอสิ่งที่ควรทำต่อไปอย่างเป็นรูปธรรม",
      ],
      skills_assessed: [skillName, "การแก้ปัญหา", "การสื่อสาร"],
      xp_reward: 120,
    };
  }
  if (isData) {
    return {
      title: "Why are sales declining?",
      scenario:
        "An e-commerce company has experienced a 15% decline in sales over the last quarter. You are handed a simplified extract of their monthly performance data. Leadership wants to understand what happened — and what to do about it.",
      difficulty: "Beginner",
      deliverables: [
        "Identify 2-3 important patterns in the data",
        "Explain the possible causes behind them",
        "Provide 3 concrete recommendations",
      ],
      skills_assessed: ["Data Analysis", "Problem Solving", "Communication"],
      xp_reward: 120,
    };
  }
  return {
    title: `Demonstrate ${skillName} in a real scenario`,
    scenario: `A small team needs your help. You'll be given a realistic, messy situation where ${skillName} is the deciding factor. Work through it the way you would on the job — your process matters as much as your answer.`,
    difficulty: "Beginner",
    deliverables: [
      "Describe how you'd approach the situation",
      "Show your reasoning step by step",
      "Recommend a concrete next action",
    ],
    skills_assessed: [skillName, "Problem Solving", "Communication"],
    xp_reward: 120,
  };
}

export function fallbackAssessment(answerLength: number, lang: Lang = "en"): Assessment {
  const base = Math.max(64, Math.min(88, 62 + Math.round(answerLength / 40)));
  return {
    overall_score: base,
    rubric: {
      data_interpretation: Math.min(95, base + 4),
      analytical_reasoning: Math.min(95, base + 2),
      accuracy: Math.min(95, base + 6),
      communication: Math.max(55, base - 4),
      recommendation_quality: Math.max(55, base - 2),
    },
    strengths:
      lang === "th"
        ? [
            "ระบุรูปแบบหลักของยอดขายได้ถูกต้อง",
            "เชื่อมโยงหลักฐานเข้ากับข้อเสนอแนะได้ตรงจุด",
            "โครงสร้างการเขียนชัดเจน อ่านง่าย",
          ]
        : [
            "Identified the main sales pattern correctly",
            "Connected evidence directly to recommendations",
            "Clear, readable structure",
          ],
    improvements:
      lang === "th"
        ? ["ลองพิจารณาคำอธิบายทางเลือกอื่นก่อนสรุป", "ทำให้ข้อเสนอแนะวัดผลได้มากขึ้น"]
        : [
            "Consider alternative explanations before concluding",
            "Make recommendations more measurable",
          ],
    evidence_xp: 120,
  };
}

const XAI_URL = "https://api.x.ai/v1/chat/completions";

export function langInstruction(lang: Lang) {
  return lang === "th"
    ? " Write every string value in the JSON in natural Thai."
    : " Write every string value in the JSON in English.";
}

export async function callGrok(system: string, user: string): Promise<unknown | null> {
  const key = process.env["XAI_API_KEY"];
  if (!key) return null;
  try {
    const res = await fetch(XAI_URL, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "grok-4-fast",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) return null;
    return JSON.parse(content);
  } catch {
    return null;
  }
}
