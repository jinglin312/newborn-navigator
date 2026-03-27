"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Baby, ShoppingCart, Heart, RefreshCw, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import LanguageSelector from "@/app/components/LanguageSelector";
import { useTranslation } from "@/app/lib/LanguageContext";

type ResultData = {
  mode: string;
  shoppingResult: string;
  healthResult: string;
  error?: string;
};

export default function ResultsPage() {
  const t = useTranslation();
  const [data, setData] = useState<ResultData | null>(null);
  const [activeTab, setActiveTab] = useState<"shopping" | "health">("shopping");

  useEffect(() => {
    const stored = sessionStorage.getItem("babywise_result");
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log("Result data:", {
        mode: parsed.mode,
        shoppingLength: parsed.shoppingResult?.length,
        healthLength: parsed.healthResult?.length,
        hasShopping: !!parsed.shoppingResult,
        hasHealth: !!parsed.healthResult,
      });
      setData(parsed);
      if (parsed.mode === "health") setActiveTab("health");
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t("results.noResults")}</p>
          <Link href="/onboarding" className="text-rose-500 hover:underline">
            {t("results.tryAgain")}
          </Link>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{data.error}</p>
          <Link href="/onboarding" className="text-rose-500 hover:underline">
            {t("results.tryAgain")}
          </Link>
        </div>
      </div>
    );
  }

  const showBoth = data.mode === "both";

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header */}
      <div className="px-6 py-4 max-w-4xl mx-auto flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-rose-600 hover:text-rose-700 transition-colors">
          <Baby className="w-6 h-6" />
          {t("common.appName")}
        </Link>
        <div className="flex gap-3 items-center">
          <LanguageSelector />
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="w-4 h-4" /> {t("results.startOver")}
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" /> {t("results.home")}
          </Link>
        </div>
      </div>

      <div className="px-6 pb-16 max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("results.title")}
          </h1>
          <p className="text-gray-500">
            {t("results.subtitle")}
          </p>
        </div>

        {/* Tabs (only if both) */}
        {showBoth && (
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-2xl max-w-sm mx-auto">
            <button
              onClick={() => setActiveTab("shopping")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "shopping"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ShoppingCart className="w-4 h-4" /> {t("results.tabShopping")}
            </button>
            <button
              onClick={() => setActiveTab("health")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "health"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Heart className="w-4 h-4" /> {t("results.tabHealth")}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {(data.mode === "shopping" || (showBoth && activeTab === "shopping")) &&
            data.shoppingResult && (
              <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3 prose-li:text-gray-600 prose-p:text-gray-600">
                <ReactMarkdown>{data.shoppingResult}</ReactMarkdown>
              </div>
            )}

          {(data.mode === "health" || (showBoth && activeTab === "health")) &&
            data.healthResult && (
              <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3 prose-li:text-gray-600 prose-p:text-gray-600">
                <ReactMarkdown>{data.healthResult}</ReactMarkdown>
              </div>
            )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 max-w-2xl mx-auto">
            {t("results.disclaimer")}
          </p>
        </div>

        {/* Re-generate CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> {t("results.updateProfile")}
          </Link>
        </div>
      </div>
    </div>
  );
}
