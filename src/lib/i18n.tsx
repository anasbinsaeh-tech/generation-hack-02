import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { TRANSLATIONS, type Lang, type TKey } from "./translations";

const KEY = "siuuu-lang";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
};

function translate(lang: Lang, key: TKey, vars?: Record<string, string | number>) {
  const dict = TRANSLATIONS[lang] as Record<string, string>;
  let out = dict[key] ?? (TRANSLATIONS.en as Record<string, string>)[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replaceAll(`{${k}}`, String(v));
    }
  }
  return out;
}

const FALLBACK: Ctx = {
  lang: "en",
  setLang: () => {},
  t: (key, vars) => translate("en", key, vars),
};

const LanguageContext = createContext<Ctx>(FALLBACK);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "th" || saved === "en") setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback<Ctx["t"]>(
    (key, vars) => translate(lang, key, vars),
    [lang],
  );

  const value = useMemo<Ctx>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useT() {
  return useContext(LanguageContext);
}
