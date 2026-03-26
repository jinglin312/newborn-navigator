"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Baby, Heart, ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";
import LanguageSelector from "@/app/components/LanguageSelector";
import { useTranslation, useLanguage } from "@/app/lib/LanguageContext";

type ShoppingInputs = {
  budget: string;
  livingSpace: string;
  parentingStyle: string;
  timeConstraint: string;
  personalStyle: string;
  techPreference: string;
  babyAgeTarget: string;
};

type HealthInputs = {
  pregnancyStage: string;
  age: string;
  healthConditions: string;
  symptoms: string;
  medicalHistory: string;
};

const STEPS = ["mode", "shopping", "health", "review"];

export default function OnboardingPage() {
  const router = useRouter();
  const t = useTranslation();
  const { language } = useLanguage();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"both" | "shopping" | "health">("both");
  const [shopping, setShopping] = useState<ShoppingInputs>({
    budget: "",
    livingSpace: "",
    parentingStyle: "",
    timeConstraint: "",
    personalStyle: "",
    techPreference: "",
    babyAgeTarget: "",
  });
  const [health, setHealth] = useState<HealthInputs>({
    pregnancyStage: "",
    age: "",
    healthConditions: "",
    symptoms: "",
    medicalHistory: "",
  });
  const [loading, setLoading] = useState(false);

  const activeSteps =
    mode === "shopping"
      ? ["mode", "shopping", "review"]
      : mode === "health"
      ? ["mode", "health", "review"]
      : STEPS;

  const currentKey = activeSteps[step];

  async function handleSubmit() {
    setLoading(true);
    const payload = {
      mode,
      language,
      shopping: mode !== "health" ? shopping : null,
      health: mode !== "shopping" ? health : null,
    };
    const res = await fetch("/api/personalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    sessionStorage.setItem("babywise_result", JSON.stringify(data));
    router.push("/results");
  }

  function next() {
    if (step < activeSteps.length - 1) setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-xl text-rose-600">
          <Baby className="w-6 h-6" />
          {t("common.appName")}
        </div>
        <LanguageSelector />
      </div>

      {/* Progress */}
      <div className="px-6 mb-8">
        <div className="max-w-xl mx-auto">
          <div className="flex gap-2">
            {activeSteps.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-rose-400" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {t("onboarding.progressLabel", `Step ${step + 1} of ${activeSteps.length}`)
              .replace("{{step}}", String(step + 1))
              .replace("{{total}}", String(activeSteps.length))}
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 px-6 pb-12">
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {/* STEP: mode */}
          {currentKey === "mode" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("onboarding.modeTitle")}
              </h2>
              <p className="text-gray-500 mb-8">{t("onboarding.modeDescription")}</p>
              <div className="space-y-4">
                {[
                  {
                    key: "both",
                    icon: <Baby className="w-6 h-6 text-rose-500" />,
                    label: t("onboarding.modeBoth"),
                    desc: "Complete newborn preparation guide",
                    color: "border-rose-400 bg-rose-50",
                  },
                  {
                    key: "shopping",
                    icon: <ShoppingCart className="w-6 h-6 text-orange-500" />,
                    label: t("onboarding.modeShopping"),
                    desc: "Personalized gear & product recommendations",
                    color: "border-orange-400 bg-orange-50",
                  },
                  {
                    key: "health",
                    icon: <Heart className="w-6 h-6 text-purple-500" />,
                    label: t("onboarding.modeHealth"),
                    desc: "Pregnancy & newborn care guidance",
                    color: "border-purple-400 bg-purple-50",
                  },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setMode(opt.key as typeof mode)}
                    className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      mode === opt.key
                        ? opt.color
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="mt-0.5">{opt.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{opt.label}</p>
                      <p className="text-sm text-gray-500">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: shopping */}
          {currentKey === "shopping" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("onboarding.shoppingTitle")}
              </h2>
              <p className="text-gray-500 mb-8">Help us understand your situation so we can cut the noise.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.shoppingBudgetLabel")}
                  </label>
                  <select
                    value={shopping.budget}
                    onChange={(e) => setShopping({ ...shopping, budget: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select budget range</option>
                    <option value="under_500">{t("onboarding.shoppingBudgetUnder500")}</option>
                    <option value="500_1000">{t("onboarding.shoppingBudget500_1000")}</option>
                    <option value="1000_2000">{t("onboarding.shoppingBudget1000_2000")}</option>
                    <option value="2000_3500">{t("onboarding.shoppingBudget2000_3500")}</option>
                    <option value="over_3500">{t("onboarding.shoppingBudgetOver3500")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.shoppingSpaceLabel")}
                  </label>
                  <select
                    value={shopping.livingSpace}
                    onChange={(e) => setShopping({ ...shopping, livingSpace: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select your space</option>
                    <option value="studio">{t("onboarding.shoppingSpaceStudio")}</option>
                    <option value="apartment">{t("onboarding.shoppingSpaceApartment")}</option>
                    <option value="house_small">{t("onboarding.shoppingSpaceHouseSmall")}</option>
                    <option value="house_large">{t("onboarding.shoppingSpaceHouseLarge")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.shoppingStyleLabel")}
                  </label>
                  <select
                    value={shopping.parentingStyle}
                    onChange={(e) => setShopping({ ...shopping, parentingStyle: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select style</option>
                    <option value="minimalist">{t("onboarding.shoppingStyleMinimalist")}</option>
                    <option value="practical">{t("onboarding.shoppingStylePractical")}</option>
                    <option value="gadget_lover">{t("onboarding.shoppingStyleGadgetLover")}</option>
                    <option value="balanced">{t("onboarding.shoppingStyleBalance")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.shoppingTimeLabel")}
                  </label>
                  <select
                    value={shopping.timeConstraint}
                    onChange={(e) => setShopping({ ...shopping, timeConstraint: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select situation</option>
                    <option value="hurried">{t("onboarding.shoppingTimeHurried")}</option>
                    <option value="moderate">{t("onboarding.shoppingTimeModerate")}</option>
                    <option value="plenty">{t("onboarding.shoppingTimePlenty")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.shoppingPersonalLabel")}
                  </label>
                  <select
                    value={shopping.personalStyle}
                    onChange={(e) => setShopping({ ...shopping, personalStyle: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select preference</option>
                    <option value="budget">{t("onboarding.shoppingPersonalBudget")}</option>
                    <option value="trendy">{t("onboarding.shoppingPersonalTrend")}</option>
                    <option value="classic">{t("onboarding.shoppingPersonalClassic")}</option>
                    <option value="eco">{t("onboarding.shoppingPersonalEco")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.shoppingTechLabel")}
                  </label>
                  <select
                    value={shopping.techPreference}
                    onChange={(e) => setShopping({ ...shopping, techPreference: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select preference</option>
                    <option value="love_tech">{t("onboarding.shoppingTechLover")}</option>
                    <option value="some_tech">{t("onboarding.shoppingTechSome")}</option>
                    <option value="minimal_tech">{t("onboarding.shoppingTechMinimal")}</option>
                    <option value="unsure">{t("onboarding.shoppingTechUnsure")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.shoppingBabyAgeLabel")}
                  </label>
                  <select
                    value={shopping.babyAgeTarget}
                    onChange={(e) => setShopping({ ...shopping, babyAgeTarget: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select stage</option>
                    <option value="now">{t("onboarding.shoppingBabyAgeNow")}</option>
                    <option value="1_3months">{t("onboarding.shoppingBabyAge1_3months")}</option>
                    <option value="3_6months">{t("onboarding.shoppingBabyAge3_6months")}</option>
                    <option value="6plus">{t("onboarding.shoppingBabyAge6plus")}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP: health */}
          {currentKey === "health" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("onboarding.healthTitle")}
              </h2>
              <p className="text-gray-500 mb-2">
                The more you share, the more relevant your tips will be.
              </p>
              <p className="text-xs text-purple-600 bg-purple-50 rounded-xl px-4 py-2 mb-8">
                🔒 Your information is used only to personalize your results and is not stored.
              </p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.healthStageLabel")}
                  </label>
                  <select
                    value={health.pregnancyStage}
                    onChange={(e) => setHealth({ ...health, pregnancyStage: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">Select stage</option>
                    <option value="trying">{t("onboarding.healthStageTrying")}</option>
                    <option value="t1">{t("onboarding.healthStageT1")}</option>
                    <option value="t2">{t("onboarding.healthStageT2")}</option>
                    <option value="t3">{t("onboarding.healthStageT3")}</option>
                    <option value="postpartum_early">{t("onboarding.healthStagePostpartumEarly")}</option>
                    <option value="postpartum_late">{t("onboarding.healthStagePostpartumLate")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.healthAgeLabel")}
                  </label>
                  <select
                    value={health.age}
                    onChange={(e) => setHealth({ ...health, age: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">Select range</option>
                    <option value="under_20">{t("onboarding.healthAgeUnder20")}</option>
                    <option value="20_25">{t("onboarding.healthAge20_25")}</option>
                    <option value="25_30">{t("onboarding.healthAge25_30")}</option>
                    <option value="30_35">{t("onboarding.healthAge30_35")}</option>
                    <option value="35plus">{t("onboarding.healthAge35plus")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.healthConditionsLabel")}
                  </label>
                  <textarea
                    value={health.healthConditions}
                    onChange={(e) => setHealth({ ...health, healthConditions: e.target.value })}
                    placeholder={t("onboarding.healthConditionsPlaceholder")}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.healthSymptomsLabel")}
                  </label>
                  <textarea
                    value={health.symptoms}
                    onChange={(e) => setHealth({ ...health, symptoms: e.target.value })}
                    placeholder={t("onboarding.healthSymptomsPlaceholder")}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("onboarding.healthHistoryLabel")}
                  </label>
                  <textarea
                    value={health.medicalHistory}
                    onChange={(e) => setHealth({ ...health, medicalHistory: e.target.value })}
                    placeholder={t("onboarding.healthHistoryPlaceholder")}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP: review */}
          {currentKey === "review" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("onboarding.reviewTitle")}
              </h2>
              <p className="text-gray-500 mb-8">{t("onboarding.reviewDescription")}</p>
              <div className="space-y-3 mb-8">
                {mode !== "health" && (
                  <div className="bg-rose-50 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-rose-700 mb-2 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> {t("onboarding.reviewBudget")}
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {shopping.budget && <li>Budget: {shopping.budget.replace(/_/g, " ")}</li>}
                      {shopping.livingSpace && <li>Space: {shopping.livingSpace.replace(/_/g, " ")}</li>}
                      {shopping.parentingStyle && <li>Style: {shopping.parentingStyle.replace(/_/g, " ")}</li>}
                    </ul>
                  </div>
                )}
                {mode !== "shopping" && (
                  <div className="bg-purple-50 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4" /> {t("onboarding.reviewPregnancyStage")}
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {health.pregnancyStage && <li>Stage: {health.pregnancyStage.replace(/_/g, " ")}</li>}
                      {health.age && <li>Age: {health.age.replace(/_/g, " ")}</li>}
                      {health.healthConditions && <li>Conditions: {health.healthConditions}</li>}
                    </ul>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400">
                ⚕️ Health tips are informational only. Always consult your OB/GYN or midwife.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 0 ? (
              <button
                onClick={back}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {t("onboarding.backButton")}
              </button>
            ) : (
              <div />
            )}

            {currentKey !== "review" ? (
              <button
                onClick={next}
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
              >
                {t("onboarding.nextButton")} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
              >
                {loading ? t("onboarding.generating") : t("onboarding.reviewButton")}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
