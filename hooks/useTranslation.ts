"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { usePlan } from "@/contexts/PlanContext";
import { TranslatorPrompt } from "@/utils/prompt-traduction";

interface TranslationResult {
  arabic: string;
  phonetic: string;
}

export function useTranslation() {
  const [result, setResult] = useState<TranslationResult | null>(null);
  const { incrementTranslations, translationsUsed, translationsLimit, isPremium } = usePlan();

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY_FOR_TRANSLATION;
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
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "system",
              content:TranslatorPrompt
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

