import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

function buildShoppingPrompt(shopping: Record<string, string>): string {
  const budgetMap: Record<string, string> = {
    under_500: "under $500",
    "500_1000": "$500–$1,000",
    "1000_2000": "$1,000–$2,000",
    "2000_3500": "$2,000–$3,500",
    over_3500: "over $3,500",
  };
  const spaceMap: Record<string, string> = {
    studio: "studio/small apartment under 600 sq ft",
    apartment: "standard apartment 600–1,200 sq ft",
    house_small: "small house 1,200–2,000 sq ft",
    house_large: "large house over 2,000 sq ft",
  };

  return `
Shopping profile:
- Budget: ${budgetMap[shopping.budget] || shopping.budget}
- Living space: ${spaceMap[shopping.livingSpace] || shopping.livingSpace}
- Parenting style: ${shopping.parentingStyle?.replace(/_/g, " ")}
- Time constraints: ${shopping.timeConstraint?.replace(/_/g, " ")}
- Personal style: ${shopping.personalStyle?.replace(/_/g, " ")}
- Purchase timing: ${shopping.babyAgeTarget?.replace(/_/g, " ")}

Generate a personalized newborn shopping guide with these EXACT sections:

## 🛒 Must-Have Essentials (prioritized for their budget & space)
List 8–10 items with estimated cost and a one-line reason why it's essential for THEIR specific situation.

## ⚠️ Skip List — Overrated & Unnecessary
List 6–8 items that are commonly marketed but NOT worth buying given their budget/space/style, with a brief reason for each.

## 💡 Smart Alternatives & Money Savers
3–5 specific swaps or strategies to stretch their budget (e.g., "Rent a Snoo instead of buying").

## ⏱️ Timing Guide
When to buy each category given their stage (what to get now vs. wait on).

Be specific to their inputs. A family in a studio apartment should get very different advice than one in a large house. A $500 budget family should not be told to buy a $400 bassinet.
`;
}

function buildHealthPrompt(health: Record<string, string>): string {
  const stageMap: Record<string, string> = {
    trying: "trying to conceive",
    t1: "first trimester (weeks 1–12)",
    t2: "second trimester (weeks 13–27)",
    t3: "third trimester (weeks 28–40)",
    postpartum_early: "early postpartum (0–6 weeks)",
    postpartum_late: "later postpartum (6 weeks to 1 year)",
  };

  return `
Health profile:
- Pregnancy stage: ${stageMap[health.pregnancyStage] || health.pregnancyStage}
- Age: ${health.age?.replace(/_/g, " ")}
- Health conditions: ${health.healthConditions || "none reported"}
- Current symptoms: ${health.symptoms || "none reported"}
- Medical history: ${health.medicalHistory || "none reported"}

Generate personalized health tips with these EXACT sections:

## 🥗 Nutrition & Supplements
Specific dietary recommendations relevant to their stage and conditions. If they have gestational diabetes, address that. If postpartum, address recovery nutrition.

## 🏃 Movement & Exercise
Safe activity recommendations for their specific stage and any conditions. Be specific about what to avoid.

## 😴 Sleep & Rest
Practical tips for their current stage and symptoms.

## ⚕️ What to Discuss with Your Provider
3–5 specific questions or topics they should raise at their next appointment, based on their conditions and symptoms.

## 🚨 Warning Signs to Watch For
Red flags relevant to their specific stage and conditions that warrant immediate medical attention.

## 💪 Postpartum / Baby Care Tips
${health.pregnancyStage?.includes("postpartum") || health.pregnancyStage === "t3" ? "Specific newborn care tips relevant to their recovery situation." : "Brief preview of what to expect in the postpartum period."}

Always include a disclaimer that this is informational and not a substitute for professional medical advice. Tailor EVERY section to their specific inputs — generic advice is not acceptable.
`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, shopping, health } = body;

    const systemPrompt = `You are BabyWise, an expert AI assistant for new and expecting parents.
You provide practical, specific, and personalized guidance.
You always tailor advice to the user's specific situation — never give generic one-size-fits-all responses.
Format your response in clean Markdown. Use emoji section headers. Be warm but direct.`;

    let userPrompt = "";

    if (mode === "both") {
      userPrompt =
        buildShoppingPrompt(shopping) +
        "\n---\n" +
        buildHealthPrompt(health);
    } else if (mode === "shopping") {
      userPrompt = buildShoppingPrompt(shopping);
    } else {
      userPrompt = buildHealthPrompt(health);
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = message.content[0];
    const text = content.type === "text" ? content.text : "";

    // Split shopping and health sections if both
    let shoppingResult = "";
    let healthResult = "";

    if (mode === "both") {
      const parts = text.split("---");
      shoppingResult = parts[0]?.trim() || text;
      healthResult = parts[1]?.trim() || "";
    } else if (mode === "shopping") {
      shoppingResult = text;
    } else {
      healthResult = text;
    }

    return NextResponse.json({
      mode,
      shoppingResult,
      healthResult,
      inputs: { shopping, health },
    });
  } catch (error) {
    console.error("Personalize API error:", error);
    return NextResponse.json(
      { error: "Failed to generate guide. Please try again." },
      { status: 500 }
    );
  }
}
