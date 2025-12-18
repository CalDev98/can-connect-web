"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface PlanContextType {
  isPremium: boolean;
  user: User | null;
  isLoading: boolean;
  messagesUsed: number;
  translationsUsed: number;
  messagesLimit: number;
  translationsLimit: number;
  upgradeToPremium: () => Promise<void>;
  incrementMessages: () => boolean;
  incrementTranslations: () => boolean;
  resetDailyLimits: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const FREE_MESSAGES_LIMIT = 10;
const FREE_TRANSLATIONS_LIMIT = 15;
const PREMIUM_PRICE = 59.99;

export function PlanProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [translationsUsed, setTranslationsUsed] = useState(0);
  const [lastResetDate, setLastResetDate] = useState<string>("");

  useEffect(() => {
    // Load usage data from localStorage
    const messages = parseInt(localStorage.getItem("messagesUsed") || "0", 10);
    const translations = parseInt(
      localStorage.getItem("translationsUsed") || "0",
      10
    );
    const lastReset = localStorage.getItem("lastResetDate") || "";

    setMessagesUsed(messages);
    setTranslationsUsed(translations);
    setLastResetDate(lastReset);

    // Reset daily limits if it's a new day
    const today = new Date().toDateString();
    if (lastReset !== today) {
      resetDailyLimits();
    }

    // Check for user and fetch profile
    const fetchProfile = async (user: User) => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setIsPremium(false);
      } else {
        setIsPremium(data?.plan === "premium");
      }
    };

    // Check for initial session
    supabase?.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user);
      }
      setIsLoading(false);
    });

    const { data: authListener } = supabase?.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setIsLoading(false);
        if (currentUser) {
          fetchProfile(currentUser);
        } else {
          setIsPremium(false);
        }
      }
    ) ?? { data: { subscription: null } };

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const resetDailyLimits = () => {
    const today = new Date().toDateString();
    setMessagesUsed(0);
    setTranslationsUsed(0);
    setLastResetDate(today);
    localStorage.setItem("messagesUsed", "0");
    localStorage.setItem("translationsUsed", "0");
    localStorage.setItem("lastResetDate", today);
  };

  const upgradeToPremium = async () => {
    if (!supabase || !user) {
      console.error("Supabase client not available or user not logged in.");
      return;
    }
    // In a real app, this would process payment
    const { error } = await supabase
      .from("profiles")
      .update({ plan: "premium" })
      .eq("id", user.id);

    if (error) {
      console.error("Error upgrading to premium:", error);
    } else {
      setIsPremium(true);
      // Reset limits
      setMessagesUsed(0);
      setTranslationsUsed(0);
      localStorage.setItem("messagesUsed", "0");
      localStorage.setItem("translationsUsed", "0");
    }
  };

  const incrementMessages = (): boolean => {
    if (isPremium) return true;

    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      resetDailyLimits();
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
      resetDailyLimits();
    }

    if (translationsUsed >= FREE_TRANSLATIONS_LIMIT) {
      return false;
    }

    const newCount = translationsUsed + 1;
    setTranslationsUsed(newCount);
    localStorage.setItem("translationsUsed", newCount.toString());
    return true;
  };

  return (
    <PlanContext.Provider
      value={{
        isPremium,
        user,
        isLoading,
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

