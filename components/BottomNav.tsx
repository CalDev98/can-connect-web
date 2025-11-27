import { Home, Languages, Phone } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNav = () => {
    const { t, language } = useLanguage();
    return (
        <>
            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-around py-2">
                        <Link
                            href="/"
                            className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
                        >
                            <Home className="w-5 h-5 text-green-800" />
                            <span className="text-xs font-medium text-green-800">{t("home")}</span>
                        </Link>
                        <Link
                            href="/translate"
                            className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
                        >
                            <Languages className="w-5 h-5 text-gray-600" />
                            <span className="text-xs font-medium text-gray-600">{t("nav.translation")}</span>
                        </Link>
                        <Link
                            href="/emergency"
                            className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
                        >
                            <Phone className="w-5 h-5 text-gray-600" />
                            <span className="text-xs font-medium text-gray-600">{t("nav.emergency")}</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default BottomNav;
