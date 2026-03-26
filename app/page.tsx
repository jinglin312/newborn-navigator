import Link from "next/link";
import { Baby, Heart, ShoppingCart, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl text-rose-600">
          <Baby className="w-6 h-6" />
          <span>BabyWise</span>
        </div>
        <Link
          href="/onboarding"
          className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors"
        >
          Get Started →
        </Link>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          AI-Powered Personalization
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Stop Buying What You{" "}
          <span className="text-rose-500">Don&apos;t Need.</span>
          <br />
          Start Getting What Matters.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Personalized newborn shopping lists and health guidance — tailored to your
          budget, lifestyle, living space, and pregnancy stage. No fluff, no generic checklists.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors shadow-lg shadow-rose-200"
        >
          Build My Personalized Guide
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Smart Shopping Guide</h2>
            <p className="text-gray-500 mb-6">
              Tell us your budget, living space, parenting style, and time constraints.
              We&apos;ll show you exactly what to buy, what to skip, and what to borrow.
            </p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Personalized Health Tips</h2>
            <p className="text-gray-500 mb-6">
              Share your pregnancy stage, health conditions, and symptoms.
              Get relevant, evidence-based guidance — not generic advice.
            </p>
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
              quote: "Saved me from buying a $300 wipe warmer. Worth every penny.",
              author: "Sarah M., first-time mom",
            },
            {
              quote: "The health tips matched my gestational diabetes situation. Finally, advice that fit me.",
              author: "Priya K., 32 weeks",
            },
            {
              quote: "We live in a 600 sq ft apartment. The space-aware shopping list was a game changer.",
              author: "James & Lily T.",
            },
          ].map((t) => (
            <div key={t.author} className="bg-gray-50 rounded-2xl p-6 text-left">
              <p className="text-gray-600 text-sm italic mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-gray-900 text-sm font-semibold">{t.author}</p>
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
        <p>BabyWise · AI-powered guidance for new parents</p>
        <p className="mt-1 text-xs">
          Health tips are for informational purposes only. Always consult your healthcare provider.
        </p>
      </footer>
    </main>
  );
}
