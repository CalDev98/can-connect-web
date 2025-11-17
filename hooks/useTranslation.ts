"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { usePlan } from "@/contexts/PlanContext";

interface TranslationResult {
  arabic: string;
  phonetic: string;
}

export function useTranslation() {
  const [result, setResult] = useState<TranslationResult | null>(null);
  const { incrementTranslations, translationsUsed, translationsLimit, isPremium } = usePlan();

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error("OpenRouter API key not configured");
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "Translate the text into Moroccan Darija. Provide the translation in both Arabic script and Latin phonetic writing. Format your response as JSON with 'arabic' and 'phonetic' fields. Example: {\"arabic\": \"كيفاش\", \"phonetic\": \"Kifach\"}",
            },
            {
              role: "user",
              content: text,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to translate");
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";

      try {
        const parsed = JSON.parse(content);
        return {
          arabic: parsed.arabic || content,
          phonetic: parsed.phonetic || content,
        };
      } catch {
        // If not JSON, try to extract from text
        return {
          arabic: content,
          phonetic: content,
        };
      }
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const translate = (text: string) => {
    if (!text.trim()) return;
    if (incrementTranslations()) {
      mutation.mutate(text);
    }
  };

  const canTranslate = () => {
    return isPremium || translationsUsed < translationsLimit;
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-MA";
      window.speechSynthesis.speak(utterance);
    }
  };

  return {
    result,
    translate,
    speak,
    isLoading: mutation.isPending,
    error: mutation.error,
    translationsUsed,
    translationsLimit,
    isPremium,
    canTranslate,
  };
}

