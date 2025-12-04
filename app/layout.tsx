import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { ServiceWorkerRegistration } from "./components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CAN Connect - Your Personal Guide to CAN 2025 in Morocco",
  description: "AI Assistant, Translation, Stadium Locator, and Emergency Services for CAN 2025 visitors",
  keywords: ["can 2025", "can connect", "can 2025 maroc", "can 2025 morocco", "can maroc"],
  openGraph: {
    title: "CAN Connect - Your Personal Guide to CAN 2025 in Morocco",
    description: "AI Assistant, Translation, Stadium Locator, and Emergency Services for CAN 2025 visitors",
    images: [
      {
        url: "/images/can-connect.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CAN Connect - Your Personal Guide to CAN 2025 in Morocco",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>

        <Providers>
          {/* Google tag (gtag.js) */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-QQ0HEBTF05"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date());

            gtag('config', 'G-QQ0HEBTF05');
          </script>
          {children}
          <ServiceWorkerRegistration />
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}

