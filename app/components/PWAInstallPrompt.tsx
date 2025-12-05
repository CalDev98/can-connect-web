"use client";

import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if user already dismissed
    const dismissed = sessionStorage.getItem("pwa-prompt-dismissed") === "true";
    console.log("PWA Install Prompt - Previously dismissed:", dismissed);

    if (dismissed) {
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    console.log("PWA Install Prompt - iOS detected:", iOS);
    console.log("PWA Install Prompt - User Agent:", navigator.userAgent);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    console.log("PWA Install Prompt - Standalone mode:", standalone);

    if (standalone) {
      console.log("PWA Install Prompt - Already installed, not showing prompt");
      return;
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registered:", registration);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }

    // For iOS, show prompt after delay since there's no beforeinstallprompt
    if (iOS) {
      console.log("PWA Install Prompt - iOS detected, will show prompt in 3 seconds");
      setTimeout(() => {
        console.log("PWA Install Prompt - Showing iOS prompt now");
        setShowPrompt(true);
      }, 3000);
    }

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("PWA Install Prompt - beforeinstallprompt event received");
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Don't show if already installed
  if (isStandalone || !showPrompt) {
    return null;
  }

  // iOS Safari - Show manual instructions
  if (isIOS && !deferredPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Installer CAN Connect</h3>
              <p className="text-sm text-gray-600 mb-3">
                Pour installer l&apos;application sur votre iPhone :
              </p>
              <ol className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600">1.</span>
                  <span>Appuyez sur <Share className="w-4 h-4 inline text-blue-600" /> (Partager)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600">2.</span>
                  <span>Sélectionnez &quot;Sur l&apos;écran d&apos;accueil&quot;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600">3.</span>
                  <span>Appuyez sur &quot;Ajouter&quot;</span>
                </li>
              </ol>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="w-full mt-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
          >
            Compris
          </button>
        </div>
      </div>
    );
  }

  // Android/Chrome - Show install button
  if (deferredPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Installer CAN Connect</h3>
              <p className="text-sm text-gray-600">
                Installez l&apos;application pour un accès rapide et une meilleure expérience.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Installer
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

