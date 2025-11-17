"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { usePlan } from "@/contexts/PlanContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function useAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { incrementMessages, messagesUsed, messagesLimit, isPremium } = usePlan();

  const mutation = useMutation({
    mutationFn: async (userMessage: string) => {
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
                "You are a helpful Moroccan travel guide for CAN 2025 visitors. Answer clearly and concisely. Provide practical advice about food, places to visit, transportation, cultural tips, and match information.",
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: "user",
              content: userMessage,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";
    },
    onSuccess: (assistantMessage, userMessage) => {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage, timestamp: new Date() },
        { role: "assistant", content: assistantMessage, timestamp: new Date() },
      ]);
    },
  });

  const sendMessage = (message: string) => {
    if (incrementMessages()) {
      mutation.mutate(message);
    }
  };

  const canSendMessage = () => {
    return isPremium || messagesUsed < messagesLimit;
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    sendMessage,
    isLoading: mutation.isPending,
    error: mutation.error,
    clearMessages,
    messagesUsed,
    messagesLimit,
    isPremium,
    canSendMessage,
  };
}

