"use client";

import Link from "next/link";
import { Baby, Heart, ShoppingCart, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import LanguageSelector from "./components/LanguageSelector";
import { useTranslation } from "./lib/LanguageContext";

export default function Home() {
  const t = useTranslation();

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl text-rose-600">
          <Baby className="w-6 h-6" />
          <span>{t("common.appName")}</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link
            href="/onboarding"
            className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors"
          >
            {t("onboarding.nextButton")} →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          AI-Powered Personalization
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          {t("landing.heroTitle")}
          <br />
          <span className="text-rose-500">Start Getting What Matters.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          {t("landing.heroSubtitle")}
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors shadow-lg shadow-rose-200"
        >
          {t("landing.heroCTA")}
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-sm text-gray-400 mt-4">Free to try · No credit card required</p>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-rose-100">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-5">
              <ShoppingCart className="w-6 h-6 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t("landing.feature1Title")}
            </h2>
            <p className="text-gray-500 mb-6">{t("landing.feature1Desc")}</p>
            <ul className="space-y-3">
              {[
                "Budget-optimized priority list",
                "Apartment vs. house-specific picks",
                "Skip list: overrated & time-wasting items",
                "Best value alternatives to expensive gear",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-5">
              <Heart className="w-6 h-6 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t("landing.feature2Title")}
            </h2>
            <p className="text-gray-500 mb-6">{t("landing.feature2Desc")}</p>
            <ul className="space-y-3">
              {[
                "Trimester-specific nutrition & activity",
                "Condition-aware recommendations",
                "Postpartum recovery guidance",
                "Red flags to watch for",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="px-6 py-16 max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-10">What new parents say</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote: t("landing.testimonial1Text"),
              author: t("landing.testimonial1Author"),
            },
            {
              quote: t("landing.testimonial2Text"),
              author: t("landing.testimonial2Author"),
            },
            {
              quote: "We live in a 600 sq ft apartment. The space-aware shopping list was a game changer.",
              author: "James & Lily T.",
            },
          ].map((item) => (
            <div key={item.author} className="bg-gray-50 rounded-2xl p-6 text-left">
              <p className="text-gray-600 text-sm italic mb-4">&ldquo;{item.quote}&rdquo;</p>
              <p className="text-gray-900 text-sm font-semibold">{item.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="bg-rose-500 rounded-3xl max-w-3xl mx-auto px-8 py-14 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to cut through the noise?</h2>
          <p className="text-rose-100 mb-8 text-lg">
            Takes 3 minutes. Get a personalized guide for your exact situation.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-white text-rose-600 font-bold px-8 py-4 rounded-full text-lg hover:bg-rose-50 transition-colors"
          >
            Start Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-400 py-8 border-t border-gray-100">
        <p>{t("common.appName")} · AI-powered guidance for new parents</p>
        <p className="mt-1 text-xs">{t("landing.disclaimer")}</p>
      </footer>
    </main>
  );
}
