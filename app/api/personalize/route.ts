import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const translations = {
  en: {
    essentials: "🛒 Must-Have Essentials (prioritized for their budget & space)",
    skipList: "⚠️ Skip List — Overrated & Unnecessary",
    alternatives: "💡 Smart Alternatives & Money Savers",
    timing: "⏱️ Timing Guide",
    nutrition: "🥗 Nutrition & Supplements",
    movement: "🏃 Movement & Exercise",
    sleep: "😴 Sleep & Rest",
    provider: "⚕️ What to Discuss with Your Provider",
    warnings: "🚨 Warning Signs to Watch For",
    postpartum: "💪 Postpartum / Baby Care Tips",
  },
  zh: {
    essentials: "🛒 必备必需品（根据预算和空间优先级）",
    skipList: "⚠️ 跳过列表 — 被过度营销但不值得购买的产品",
    alternatives: "💡 聪明的替代方案和省钱方法",
    timing: "⏱️ 购买时间指南",
    nutrition: "🥗 营养与补充剂",
    movement: "🏃 运动与锻炼",
    sleep: "😴 睡眠与休息",
    provider: "⚕️ 与你的医疗提供者讨论的内容",
    warnings: "🚨 需要关注的警告信号",
    postpartum: "💪 产后/婴儿护理提示",
  },
};

function buildShoppingPrompt(shopping: Record<string, string>, language: string = "en"): string {
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

  const t = translations[language as keyof typeof translations] || translations.en;

  const prompt =
    language === "zh"
      ? `
购物资料:
- 预算: ${budgetMap[shopping.budget] || shopping.budget}
- 生活空间: ${spaceMap[shopping.livingSpace] || shopping.livingSpace}
- 育儿风格: ${shopping.parentingStyle?.replace(/_/g, " ")}
- 时间约束: ${shopping.timeConstraint?.replace(/_/g, " ")}
- 个人风格: ${shopping.personalStyle?.replace(/_/g, " ")}
- 购买时机: ${shopping.babyAgeTarget?.replace(/_/g, " ")}

生成一份个性化新生儿购物指南，具有以下确切部分：

## ${t.essentials}
列出 8-10 项物品，包括估计费用和为什么这些物品对他们的具体情况至关重要的单行理由。

## ${t.skipList}
列出 6-8 项通常被营销但根据他们的预算/空间/风格不值得购买的物品，并为每项提供简短的理由。

## ${t.alternatives}
3-5 个具体的替代方案或策略来拉伸他们的预算（例如，"租一个 Snoo 而不是购买"）。

## ${t.timing}
根据他们的阶段，何时购买每个类别（现在购买什么 vs. 等待）。

对他们的输入要具体。住在工作室公寓的家庭应该得到与住在大房子里的家庭完全不同的建议。预算为 $500 的家庭不应该被告知购买 $400 的摇篮。
`
      : `
Shopping profile:
- Budget: ${budgetMap[shopping.budget] || shopping.budget}
- Living space: ${spaceMap[shopping.livingSpace] || shopping.livingSpace}
- Parenting style: ${shopping.parentingStyle?.replace(/_/g, " ")}
- Time constraints: ${shopping.timeConstraint?.replace(/_/g, " ")}
- Personal style: ${shopping.personalStyle?.replace(/_/g, " ")}
- Purchase timing: ${shopping.babyAgeTarget?.replace(/_/g, " ")}

Generate a personalized newborn shopping guide with these EXACT sections:

## ${t.essentials}
List 8–10 items with estimated cost and a one-line reason why it's essential for THEIR specific situation.

## ${t.skipList}
List 6–8 items that are commonly marketed but NOT worth buying given their budget/space/style, with a brief reason for each.

## ${t.alternatives}
3–5 specific swaps or strategies to stretch their budget (e.g., "Rent a Snoo instead of buying").

## ${t.timing}
When to buy each category given their stage (what to get now vs. wait on).

Be specific to their inputs. A family in a studio apartment should get very different advice than one in a large house. A $500 budget family should not be told to buy a $400 bassinet.
`;

  return prompt;
}

function buildHealthPrompt(health: Record<string, string>, language: string = "en"): string {
  const stageMap: Record<string, string> = {
    trying: language === "zh" ? "尝试怀孕" : "trying to conceive",
    t1: language === "zh" ? "第一孕期（第1-12周）" : "first trimester (weeks 1–12)",
    t2: language === "zh" ? "第二孕期（第13-27周）" : "second trimester (weeks 13–27)",
    t3: language === "zh" ? "第三孕期（第28-40周）" : "third trimester (weeks 28–40)",
    postpartum_early: language === "zh" ? "早期产后（0-6周）" : "early postpartum (0–6 weeks)",
    postpartum_late: language === "zh" ? "晚期产后（6周至1年）" : "later postpartum (6 weeks to 1 year)",
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const prompt =
    language === "zh"
      ? `
健康资料:
- 妊娠阶段: ${stageMap[health.pregnancyStage] || health.pregnancyStage}
- 年龄: ${health.age?.replace(/_/g, " ")}
- 健康状况: ${health.healthConditions || "未报告"}
- 当前症状: ${health.symptoms || "未报告"}
- 医疗历史: ${health.medicalHistory || "未报告"}

生成个性化健康提示，具有以下确切部分：

## ${t.nutrition}
与他们的阶段和情况相关的特定饮食建议。如果他们患有妊娠糖尿病，请解决这个问题。如果是产后，请解决恢复营养。

## ${t.movement}
针对他们特定阶段和任何情况的安全活动建议。具体说明要避免的事情。

## ${t.sleep}
针对他们当前阶段和症状的实用建议。

## ${t.provider}
3-5 个具体问题或主题，他们应该在下次就诊时提出，基于他们的情况和症状。

## ${t.warnings}
与他们的特定阶段和情况相关的红旗，需要立即就医。

## ${t.postpartum}
${health.pregnancyStage?.includes("postpartum") || health.pregnancyStage === "t3" ? "与他们恢复情况相关的具体新生儿护理提示。" : "产后期间期望的简要预览。"}

始终包括免责声明，说明这仅供参考，不能替代专业医疗建议。将每一部分量身定制到他们的特定输入—通用建议是不可接受的。
`
      : `
Health profile:
- Pregnancy stage: ${stageMap[health.pregnancyStage] || health.pregnancyStage}
- Age: ${health.age?.replace(/_/g, " ")}
- Health conditions: ${health.healthConditions || "none reported"}
- Current symptoms: ${health.symptoms || "none reported"}
- Medical history: ${health.medicalHistory || "none reported"}

Generate personalized health tips with these EXACT sections:

## ${t.nutrition}
Specific dietary recommendations relevant to their stage and conditions. If they have gestational diabetes, address that. If postpartum, address recovery nutrition.

## ${t.movement}
Safe activity recommendations for their specific stage and any conditions. Be specific about what to avoid.

## ${t.sleep}
Practical tips for their current stage and symptoms.

## ${t.provider}
3–5 specific questions or topics they should raise at their next appointment, based on their conditions and symptoms.

## ${t.warnings}
Red flags relevant to their specific stage and conditions that warrant immediate medical attention.

## ${t.postpartum}
${health.pregnancyStage?.includes("postpartum") || health.pregnancyStage === "t3" ? "Specific newborn care tips relevant to their recovery situation." : "Brief preview of what to expect in the postpartum period."}

Always include a disclaimer that this is informational and not a substitute for professional medical advice. Tailor EVERY section to their specific inputs — generic advice is not acceptable.
`;

  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, language = "en", shopping, health } = body;

    const systemPrompt =
      language === "zh"
        ? `你是BabyWise，一名为新手父母和准父母服务的专家AI助手。你提供实用、具体和个性化的指导。你总是根据用户的具体情况调整建议——从不提供一成不变的通用回答。用干净的Markdown格式响应。使用表情符号作为段落标题。态度要温暖但直接。`
        : `You are BabyWise, an expert AI assistant for new and expecting parents.
You provide practical, specific, and personalized guidance.
You always tailor advice to the user's specific situation — never give generic one-size-fits-all responses.
Format your response in clean Markdown. Use emoji section headers. Be warm but direct.`;

    let userPrompt = "";

    if (mode === "both") {
      userPrompt =
        buildShoppingPrompt(shopping, language) +
        "\n---\n" +
        buildHealthPrompt(health, language);
    } else if (mode === "shopping") {
      userPrompt = buildShoppingPrompt(shopping, language);
    } else {
      userPrompt = buildHealthPrompt(health, language);
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
