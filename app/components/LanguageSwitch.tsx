"use client";

import { useState } from "react";

interface Language {
  code: string;
  name: string;
}

interface LanguageSwitchProps {
  languages: Language[];
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
}

export default function LanguageSwitch({
  languages,
  selectedLang,
  setSelectedLang,
}: LanguageSwitchProps) {
  return (
    <div className="relative flex w-full rounded-full bg-gray-200 p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setSelectedLang(lang.code)}
          className={`relative z-10 flex-1 rounded-full py-2 text-center text-sm font-medium transition-colors ${selectedLang === lang.code ? "text-white" : "text-gray-600"
            }`}
        >
          {lang.name}
        </button>
      ))}
      <div
        className="absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(25%-4px)] rounded-full bg-red-900 transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(${languages.findIndex((l) => l.code === selectedLang) * 100
            }%)`,
        }}
      />
    </div>
  );
}
