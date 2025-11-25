"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Check, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const steps = [
    { id: 1, title: "Compte" },
    { id: 2, title: "Paiement" },
    { id: 3, title: "Confirmation" },
];

export default function SignupPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const { t } = useLanguage();

    // Check for session on mount
    useEffect(() => {
        const client = supabase;
        if (!client) return;

        const checkSession = async () => {
            const { data: { session } } = await client.auth.getSession();
            if (session) {
                setCurrentStep(2);
            }
        };

        checkSession();

        const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setCurrentStep(2);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Step 1: Auth Logic
    const handleAuth = async (provider: "google" | "apple") => {
        if (!supabase) {
            setError("Configuration Supabase manquante.");
            return;
        }
        setError(null);
        setLoading(true);

        const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/signup` : undefined;

        const { error: signInError } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo,
            },
        });

        if (signInError) {
            setError(signInError.message);
            setLoading(false);
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (!supabase) {
            setError("Configuration Supabase manquante.");
            return;
        }

        setError(null);
        setMessage(null);
        setLoading(true);

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            setError(signUpError.message);
        } else {
            setMessage("Inscription réussie ! Veuillez vérifier votre e-mail pour confirmer votre compte.");
            // Reset form
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }
        setLoading(false);
    };

    // Step 2: Payment Logic (Mock)
    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setCurrentStep(3);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/offres" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-900" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">Premium Signup</span>
                    </div>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 max-w-lg">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${currentStep >= step.id
                                    ? "bg-moroccan-gold text-white"
                                    : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {currentStep > step.id ? <Check className="w-6 h-6" /> : step.id}
                            </div>
                            <span className={`text-xs font-medium ${currentStep >= step.id ? "text-moroccan-gold" : "text-gray-500"}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900">Créer un compte</h2>
                                <p className="text-gray-600 mt-2">Pour sécuriser votre abonnement Premium</p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                                    {error}
                                </div>
                            )}

                             {message && (
                                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleEmailSignUp} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-moroccan-gold focus:border-transparent outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-moroccan-gold focus:border-transparent outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirmer le mot de passe"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-moroccan-gold focus:border-transparent outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-moroccan-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Création...
                                        </>
                                    ) : (
                                        "Créer un compte"
                                    )}
                                </button>
                            </form>

                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative bg-white px-4 text-sm text-gray-500">
                                    OU
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => handleAuth("google")}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 border border-gray-300 p-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                                    Continuer avec Google
                                </button>
                                <button
                                    onClick={() => handleAuth("apple")}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 border border-gray-300 p-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-1.54 1.81.09 3.17 1.06 4.04 2.27-3.6 1.76-2.99 6.27.66 7.75-.62 1.65-1.49 3.26-2.92 4.75h-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    Continuer avec Apple
                                </button>
                            </div>

                            {/* Dev bypass for testing without auth callback */}
                            <div className="pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setCurrentStep(2)}
                                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                                >
                                    (Dev) Skip Auth
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900">Paiement sécurisé</h2>
                                <p className="text-gray-600 mt-2">Finalisez votre abonnement</p>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire de la carte</label>
                                    <input type="text" required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-moroccan-gold focus:border-transparent outline-none" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="text" required className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-moroccan-gold focus:border-transparent outline-none" placeholder="0000 0000 0000 0000" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
                                        <input type="text" required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-moroccan-gold focus:border-transparent outline-none" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                        <input type="text" required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-moroccan-gold focus:border-transparent outline-none" placeholder="123" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-moroccan-gold text-white py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 mt-4"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Traitement...
                                        </>
                                    ) : (
                                        "Payer 49.99 DH"
                                    )}
                                </button>
                            </form>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                Paiement sécurisé par Stripe (Mock)
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="text-center space-y-6 py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Check className="w-10 h-10 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Félicitations !</h2>
                                <p className="text-gray-600 mt-2">Vous êtes maintenant membre Premium.</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
                                Un email de confirmation a été envoyé à votre adresse.
                            </div>
                            <button
                                onClick={() => router.push("/")}
                                className="w-full bg-moroccan-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Retour à l'accueil
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
