"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./translations/en.json";
import zh from "./translations/zh.json";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations: Record<Language, any> = { en, zh };

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((current, part) => current?.[part], obj);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Detect browser language on first load
    const stored = localStorage.getItem("babywise_language") as Language | null;

    if (stored) {
      setLanguageState(stored);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "zh") {
        setLanguageState("zh");
      } else {
        setLanguageState("en");
      }
    }

    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("babywise_language", lang);
  };

  const t = (key: string, defaultValue?: string): string => {
    const value = getNestedValue(translations[language], key);
    return value || defaultValue || key;
  };

  // Don't render children until we've detected language to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context.t;
}
