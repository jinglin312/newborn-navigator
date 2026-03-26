"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Baby, Heart, ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";

type ShoppingInputs = {
  budget: string;
  livingSpace: string;
  parentingStyle: string;
  timeConstraint: string;
  personalStyle: string;
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
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"both" | "shopping" | "health">("both");
  const [shopping, setShopping] = useState<ShoppingInputs>({
    budget: "",
    livingSpace: "",
    parentingStyle: "",
    timeConstraint: "",
    personalStyle: "",
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
      shopping: mode !== "health" ? shopping : null,
      health: mode !== "shopping" ? health : null,
    };
    const res = await fetch("/api/personalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    // Store result and navigate
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
      <div className="flex items-center gap-2 font-bold text-xl text-rose-600 px-6 py-4">
        <Baby className="w-6 h-6" />
        BabyWise
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
            Step {step + 1} of {activeSteps.length}
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
                What do you need help with?
              </h2>
              <p className="text-gray-500 mb-8">
                Choose one or get both — a shopping guide and health tips.
              </p>
              <div className="space-y-4">
                {[
                  {
                    key: "both",
                    icon: <Baby className="w-6 h-6 text-rose-500" />,
                    label: "Both — Shopping & Health",
                    desc: "Complete newborn preparation guide",
                    color: "border-rose-400 bg-rose-50",
                  },
                  {
                    key: "shopping",
                    icon: <ShoppingCart className="w-6 h-6 text-orange-500" />,
                    label: "Shopping Guide Only",
                    desc: "Personalized gear & product recommendations",
                    color: "border-orange-400 bg-orange-50",
                  },
                  {
                    key: "health",
                    icon: <Heart className="w-6 h-6 text-purple-500" />,
                    label: "Health Tips Only",
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
                Your Shopping Profile
              </h2>
              <p className="text-gray-500 mb-8">
                Help us understand your situation so we can cut the noise.
              </p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Total budget for newborn gear
                  </label>
                  <select
                    value={shopping.budget}
                    onChange={(e) => setShopping({ ...shopping, budget: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select budget range</option>
                    <option value="under_500">Under $500</option>
                    <option value="500_1000">$500 – $1,000</option>
                    <option value="1000_2000">$1,000 – $2,000</option>
                    <option value="2000_3500">$2,000 – $3,500</option>
                    <option value="over_3500">Over $3,500</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Living space
                  </label>
                  <select
                    value={shopping.livingSpace}
                    onChange={(e) => setShopping({ ...shopping, livingSpace: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select your space</option>
                    <option value="studio">Studio / small apartment (&lt;600 sq ft)</option>
                    <option value="apartment">Standard apartment (600–1,200 sq ft)</option>
                    <option value="house_small">Small house (1,200–2,000 sq ft)</option>
                    <option value="house_large">Large house (2,000+ sq ft)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Parenting style
                  </label>
                  <select
                    value={shopping.parentingStyle}
                    onChange={(e) => setShopping({ ...shopping, parentingStyle: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select style</option>
                    <option value="attachment">Attachment / babywearing focused</option>
                    <option value="independent">Independent sleep / schedule focused</option>
                    <option value="balanced">Balanced / flexible</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your time constraints
                  </label>
                  <select
                    value={shopping.timeConstraint}
                    onChange={(e) => setShopping({ ...shopping, timeConstraint: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select situation</option>
                    <option value="sahp">Stay-at-home parent</option>
                    <option value="part_time">Part-time work / flexible hours</option>
                    <option value="full_time">Both parents working full-time</option>
                    <option value="single">Single parent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Personal style / aesthetic
                  </label>
                  <select
                    value={shopping.personalStyle}
                    onChange={(e) => setShopping({ ...shopping, personalStyle: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select preference</option>
                    <option value="minimal">Minimal / Scandinavian</option>
                    <option value="colorful">Fun & colorful</option>
                    <option value="practical">Purely practical — looks don&apos;t matter</option>
                    <option value="premium">Premium / high-end brands</option>
                    <option value="eco">Eco-friendly / sustainable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Baby&apos;s expected age at purchase (how far along are you?)
                  </label>
                  <select
                    value={shopping.babyAgeTarget}
                    onChange={(e) => setShopping({ ...shopping, babyAgeTarget: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select stage</option>
                    <option value="1st_trimester">1st trimester — plenty of time</option>
                    <option value="2nd_trimester">2nd trimester — planning ahead</option>
                    <option value="3rd_trimester">3rd trimester — buying now</option>
                    <option value="already_born">Baby is already here</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP: health */}
          {currentKey === "health" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Health Profile
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
                    Pregnancy stage
                  </label>
                  <select
                    value={health.pregnancyStage}
                    onChange={(e) => setHealth({ ...health, pregnancyStage: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">Select stage</option>
                    <option value="trying">Trying to conceive</option>
                    <option value="t1">1st trimester (weeks 1–12)</option>
                    <option value="t2">2nd trimester (weeks 13–27)</option>
                    <option value="t3">3rd trimester (weeks 28–40)</option>
                    <option value="postpartum_early">Postpartum (0–6 weeks)</option>
                    <option value="postpartum_late">Postpartum (6 weeks – 1 year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your age
                  </label>
                  <select
                    value={health.age}
                    onChange={(e) => setHealth({ ...health, age: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">Select range</option>
                    <option value="under_25">Under 25</option>
                    <option value="25_30">25–30</option>
                    <option value="31_35">31–35</option>
                    <option value="36_40">36–40</option>
                    <option value="over_40">Over 40</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Any health conditions? (select all that apply)
                  </label>
                  <textarea
                    value={health.healthConditions}
                    onChange={(e) => setHealth({ ...health, healthConditions: e.target.value })}
                    placeholder="e.g. gestational diabetes, hypertension, thyroid issues, anemia, none"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Current symptoms or concerns
                  </label>
                  <textarea
                    value={health.symptoms}
                    onChange={(e) => setHealth({ ...health, symptoms: e.target.value })}
                    placeholder="e.g. nausea, fatigue, back pain, swelling, trouble sleeping, none"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Relevant medical history
                  </label>
                  <textarea
                    value={health.medicalHistory}
                    onChange={(e) => setHealth({ ...health, medicalHistory: e.target.value })}
                    placeholder="e.g. previous miscarriage, C-section history, fertility treatments, none"
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
                Ready to generate your guide?
              </h2>
              <p className="text-gray-500 mb-8">
                We&apos;ll analyze your inputs and create a personalized guide in seconds.
              </p>
              <div className="space-y-3 mb-8">
                {mode !== "health" && (
                  <div className="bg-rose-50 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-rose-700 mb-2 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Shopping Profile
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
                      <Heart className="w-4 h-4" /> Health Profile
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
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {currentKey !== "review" ? (
              <button
                onClick={next}
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
              >
                {loading ? "Generating…" : "Generate My Guide"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
