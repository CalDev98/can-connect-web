"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PlanContextType {
  isPremium: boolean;
  messagesUsed: number;
  translationsUsed: number;
  messagesLimit: number;
  translationsLimit: number;
  upgradeToPremium: () => void;
  incrementMessages: () => boolean;
  incrementTranslations: () => boolean;
  resetDailyLimits: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const FREE_MESSAGES_LIMIT = 10;
const FREE_TRANSLATIONS_LIMIT = 15;
const PREMIUM_PRICE = 9.99;

export function PlanProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [translationsUsed, setTranslationsUsed] = useState(0);
  const [lastResetDate, setLastResetDate] = useState<string>("");

  useEffect(() => {
    // Load from localStorage
    const premium = localStorage.getItem("isPremium") === "true";
    const messages = parseInt(localStorage.getItem("messagesUsed") || "0", 10);
    const translations = parseInt(
      localStorage.getItem("translationsUsed") || "0",
      10
    );
    const lastReset = localStorage.getItem("lastResetDate") || "";

    setIsPremium(premium);
    setMessagesUsed(messages);
    setTranslationsUsed(translations);
    setLastResetDate(lastReset);

    // Reset daily limits if it's a new day
    const today = new Date().toDateString();
    if (lastReset !== today) {
      setMessagesUsed(0);
      setTranslationsUsed(0);
      setLastResetDate(today);
      localStorage.setItem("messagesUsed", "0");
      localStorage.setItem("translationsUsed", "0");
      localStorage.setItem("lastResetDate", today);
    }
  }, []);

  const upgradeToPremium = () => {
    // In a real app, this would process payment
    // For now, we'll simulate it
    setIsPremium(true);
    localStorage.setItem("isPremium", "true");
    // Reset limits
    setMessagesUsed(0);
    setTranslationsUsed(0);
    localStorage.setItem("messagesUsed", "0");
    localStorage.setItem("translationsUsed", "0");
  };

  const incrementMessages = (): boolean => {
    if (isPremium) return true;

    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      setMessagesUsed(0);
      setTranslationsUsed(0);
      setLastResetDate(today);
      localStorage.setItem("messagesUsed", "0");
      localStorage.setItem("translationsUsed", "0");
      localStorage.setItem("lastResetDate", today);
    }

    if (messagesUsed >= FREE_MESSAGES_LIMIT) {
      return false;
    }

    const newCount = messagesUsed + 1;
    setMessagesUsed(newCount);
    localStorage.setItem("messagesUsed", newCount.toString());
    return true;
  };

  const incrementTranslations = (): boolean => {
    if (isPremium) return true;

    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      setMessagesUsed(0);
      setTranslationsUsed(0);
      setLastResetDate(today);
      localStorage.setItem("messagesUsed", "0");
      localStorage.setItem("translationsUsed", "0");
      localStorage.setItem("lastResetDate", today);
    }

    if (translationsUsed >= FREE_TRANSLATIONS_LIMIT) {
      return false;
    }

    const newCount = translationsUsed + 1;
    setTranslationsUsed(newCount);
    localStorage.setItem("translationsUsed", newCount.toString());
    return true;
  };

  const resetDailyLimits = () => {
    const today = new Date().toDateString();
    setMessagesUsed(0);
    setTranslationsUsed(0);
    setLastResetDate(today);
    localStorage.setItem("messagesUsed", "0");
    localStorage.setItem("translationsUsed", "0");
    localStorage.setItem("lastResetDate", today);
  };

  return (
    <PlanContext.Provider
      value={{
        isPremium,
        messagesUsed,
        translationsUsed,
        messagesLimit: isPremium ? Infinity : FREE_MESSAGES_LIMIT,
        translationsLimit: isPremium ? Infinity : FREE_TRANSLATIONS_LIMIT,
        upgradeToPremium,
        incrementMessages,
        incrementTranslations,
        resetDailyLimits,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}

export { PREMIUM_PRICE };

