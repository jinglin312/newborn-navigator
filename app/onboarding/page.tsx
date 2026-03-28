"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Baby, Heart, ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation, useLanguage } from "@/app/lib/LanguageContext";

type ShoppingInputs = {
  budget: string;
  livingSpace: string;
  parentingStyle: string;
  workSituation: string;
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

type StrollerInputs = {
  livingSituation: string;
  storageConstraints: string;
  physicalConsiderations: string;
  primaryUse: string;
};

const STEPS = ["mode", "shopping", "health", "stroller", "review"];

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
    workSituation: "",
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
  const [stroller, setStroller] = useState<StrollerInputs>({
    livingSituation: "",
    storageConstraints: "",
    physicalConsiderations: "",
    primaryUse: "",
  });
  const [includeStroller, setIncludeStroller] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeSteps =
    mode === "shopping"
      ? ["mode", "shopping", ...(includeStroller ? ["stroller"] : []), "review"]
      : mode === "health"
      ? ["mode", "health", "review"]
      : ["mode", "shopping", ...(includeStroller ? ["stroller"] : []), "health", "review"];

  const currentKey = activeSteps[step];

  async function handleSubmit() {
    setLoading(true);
    const payload = {
      mode,
      language,
      shopping: mode !== "health" ? shopping : null,
      health: mode !== "shopping" ? health : null,
      stroller: includeStroller ? stroller : null,
    };
    const res = await fetch("/api/personalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log("API Response:", {
      status: res.status,
      mode: data.mode,
      shoppingLength: data.shoppingResult?.length,
      healthLength: data.healthResult?.length,
      hasError: !!data.error,
    });
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
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-rose-600 hover:text-rose-700 transition-colors">
          <Baby className="w-6 h-6" />
          {t("common.appName")}
        </Link>
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
              {mode === "shopping" || mode === "both" ? (
                <div className="mt-8 p-4 border-2 border-blue-200 bg-blue-50 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeStroller}
                      onChange={(e) => setIncludeStroller(e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Add personalized stroller guide (optional) 🚼
                    </span>
                  </label>
                </div>
              ) : null}
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
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("onboarding.shoppingStyleLabel")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "minimalist", label: t("onboarding.shoppingStyleMinimalist"), emoji: "🧘" },
                      { value: "practical", label: t("onboarding.shoppingStylePractical"), emoji: "🔧" },
                      { value: "gadget_lover", label: t("onboarding.shoppingStyleGadgetLover"), emoji: "⚡" },
                      { value: "balanced", label: t("onboarding.shoppingStyleBalance"), emoji: "⚖️" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setShopping({ ...shopping, parentingStyle: option.value })}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          shopping.parentingStyle === option.value
                            ? "border-rose-400 bg-rose-50 text-gray-900 font-medium"
                            : "border-gray-200 bg-white text-gray-700 hover:border-rose-200"
                        }`}
                      >
                        <div className="text-lg mb-1">{option.emoji}</div>
                        <div className="text-sm">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("onboarding.shoppingWorkLabel")}
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: "stay_at_home", label: t("onboarding.shoppingWorkStayHome"), emoji: "🏡" },
                      { value: "work_part_time", label: t("onboarding.shoppingWorkPartTime"), emoji: "⏰" },
                      { value: "work_full_time", label: t("onboarding.shoppingWorkFullTime"), emoji: "💼" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setShopping({ ...shopping, workSituation: option.value })}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          shopping.workSituation === option.value
                            ? "border-rose-400 bg-rose-50 text-gray-900 font-medium"
                            : "border-gray-200 bg-white text-gray-700 hover:border-rose-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{option.emoji}</span>
                          <span className="text-sm">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("onboarding.shoppingPersonalLabel")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "budget", label: t("onboarding.shoppingPersonalBudget"), emoji: "💰" },
                      { value: "trendy", label: t("onboarding.shoppingPersonalTrend"), emoji: "✨" },
                      { value: "classic", label: t("onboarding.shoppingPersonalClassic"), emoji: "🎩" },
                      { value: "eco", label: t("onboarding.shoppingPersonalEco"), emoji: "🌿" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setShopping({ ...shopping, personalStyle: option.value })}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          shopping.personalStyle === option.value
                            ? "border-rose-400 bg-rose-50 text-gray-900 font-medium"
                            : "border-gray-200 bg-white text-gray-700 hover:border-rose-200"
                        }`}
                      >
                        <div className="text-lg mb-1">{option.emoji}</div>
                        <div className="text-sm">{option.label}</div>
                      </button>
                    ))}
                  </div>
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

          {/* STEP: stroller */}
          {currentKey === "stroller" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("onboarding.strollerTitle")}
              </h2>
              <p className="text-gray-500 mb-8">Help us find the perfect stroller for your lifestyle.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("onboarding.strollerLivingLabel")}
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "urban_transit", label: t("onboarding.strollerUrbanTransit"), emoji: "🚇" },
                      { value: "urban_car", label: t("onboarding.strollerUrbanCar"), emoji: "🚗" },
                      { value: "suburban", label: t("onboarding.strollerSuburban"), emoji: "🏘️" },
                      { value: "rural", label: t("onboarding.strollerRural"), emoji: "🌳" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStroller({ ...stroller, livingSituation: option.value })}
                        className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-2 ${
                          stroller.livingSituation === option.value
                            ? "border-blue-400 bg-blue-50 text-gray-900 font-medium"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-200"
                        }`}
                      >
                        <span className="text-lg">{option.emoji}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("onboarding.strollerStorageLabel")}
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "no_car", label: t("onboarding.strollerNocar"), emoji: "🚶" },
                      { value: "small_trunk", label: t("onboarding.strollerSmallTrunk"), emoji: "🚙" },
                      { value: "large_suv", label: t("onboarding.strollerLargeSuv"), emoji: "🚐" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStroller({ ...stroller, storageConstraints: option.value })}
                        className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-2 ${
                          stroller.storageConstraints === option.value
                            ? "border-blue-400 bg-blue-50 text-gray-900 font-medium"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-200"
                        }`}
                      >
                        <span className="text-lg">{option.emoji}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("onboarding.strollerPhysicalLabel")}
                  </label>
                  <select
                    value={stroller.physicalConsiderations}
                    onChange={(e) => setStroller({ ...stroller, physicalConsiderations: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select any that apply</option>
                    <option value="none">{t("onboarding.strollerPhysicalNone")}</option>
                    <option value="back_issues">{t("onboarding.strollerBackIssues")}</option>
                    <option value="joint_issues">{t("onboarding.strollerJointIssues")}</option>
                    <option value="short_stature">{t("onboarding.strollerShortStature")}</option>
                    <option value="multiple">{t("onboarding.strollerMultiple")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("onboarding.strollerPrimaryUseLabel")}
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "daily_walks", label: t("onboarding.strollerDailyWalks"), emoji: "🚶" },
                      { value: "occasional_travel", label: t("onboarding.strollerOccasionalTravel"), emoji: "✈️" },
                      { value: "jogging", label: t("onboarding.strollerJogging"), emoji: "🏃" },
                      { value: "mixed", label: t("onboarding.strollerMixed"), emoji: "🔄" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStroller({ ...stroller, primaryUse: option.value })}
                        className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-2 ${
                          stroller.primaryUse === option.value
                            ? "border-blue-400 bg-blue-50 text-gray-900 font-medium"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-200"
                        }`}
                      >
                        <span className="text-lg">{option.emoji}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
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
