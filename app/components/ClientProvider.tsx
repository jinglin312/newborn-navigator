"use client";

import { LanguageProvider } from "@/app/lib/LanguageContext";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
