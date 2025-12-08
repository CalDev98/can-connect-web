"use client";

import { useState } from "react";
import { Apple, ShieldCheck, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

const providers = [
  {
    id: "google" as const,
    label: "Continuer avec Google",
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
      >
        <title>Google</title>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  // {
  //   id: "apple" as const,
  //   label: "Continuer avec Apple",
  //   icon: <Apple className="w-5 h-5" />,
  // },
];

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (provider: "google" | "apple") => {
    if (!supabase) {
      setError("Configuration Supabase manquante.");
      return;
    }

    setError(null);
    setLoadingProvider(provider);
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/` : undefined;

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <Link href="/" className="absolute top-0 left-0 z-20 p-4 text-white md:text-gray-800">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      {/* Visual Panel */}
      <div className="relative w-full md:w-1/2 h-64 md:h-screen bg-green-800 flex items-center justify-center p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/60"></div>
        {/* Stadium Light Effect */}
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/10 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-moroccan-gold/10 rounded-full filter blur-3xl opacity-50"></div>

        <div className="relative z-10 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            CANConnect
          </h1>
          <p className="text-lg md:text-xl text-green-200 max-w-sm">
            Votre passeport pour une expérience CAN inoubliable.
          </p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Accès au compte</h2>
            <p className="mt-2 text-gray-600">
              Connectez-vous pour retrouver votre compte Premium.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <p><span className="font-medium">Erreur:</span> {error}</p>
            </div>
          )}

          <div className="space-y-4">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleLogin(provider.id)}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-moroccan-blue"
              >
                {provider.icon}
                {loadingProvider === provider.id
                  ? "Connexion en cours..."
                  : provider.label}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                <span className="font-semibold">Pas encore de compte ?</span> La
                création d&apos;un compte est l&apos;étape pour passer Premium et
                sauvegarder vos avantages.
              </span>
            </p>
          </div>

          <p className="text-center text-xs text-gray-500">
            En continuant, vous acceptez nos{" "}
            <a href="#" className="font-medium hover:underline">
              conditions d&apos;utilisation
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}


