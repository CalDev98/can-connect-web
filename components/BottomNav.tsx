import { Home, Languages, Phone, UserIcon } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext";
import { usePlan } from "@/contexts/PlanContext";

const BottomNav = ({ activeTab }: { activeTab: string }) => {
    const { t, language } = useLanguage();
    const { user } = usePlan();
    return (
        <>
            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-2 left-2 right-2 bg-white border-t border-gray-200 rounded-xl shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-evenly py-2">
                        <Link
                            href="/"
                            className={activeTab === "home" ? "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors" : "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors"}
                        >
                            <Home className={activeTab === "home" ? "w-5 h-5 text-red-900" : "w-5 h-5 text-gray-600"} />
                            <span className={`${activeTab === "home" ? "text-red-900" : "text-gray-600"} text-xs font-medium`}>{t("nav.home")}</span>
                        </Link>
                        <Link
                            href="/translate"
                            className={activeTab === "translate" ? "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors" : "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors"}
                        >
                            <Languages className={activeTab === "translate" ? "w-5 h-5 text-red-900" : "w-5 h-5 text-gray-600"} />
                            <span className={`${activeTab === "translate" ? "text-red-900" : "text-gray-600"} text-xs font-medium`}>{t("nav.translation")}</span>
                        </Link>
                        <Link
                            href="/emergency"
                            className={activeTab === "emergency" ? "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors" : "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors"}
                        >
                            <Phone className={activeTab === "emergency" ? "w-5 h-5 text-red-900" : "w-5 h-5 text-gray-600"} />
                            <span className={`${activeTab === "emergency" ? "text-red-900" : "text-gray-600"} text-xs font-medium`}>{t("nav.emergency")}</span>
                        </Link>
                        <Link
                            href={user ? "/settings" : "/login"}
                            className={activeTab === "login" ? "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors" : "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors"}
                        >
                            <UserIcon className={activeTab === "login" ? "w-5 h-5 text-red-900" : "w-5 h-5 text-gray-600"} />
                            <span className={`${activeTab === "login" ? "text-red-900" : "text-gray-600"} text-xs font-medium`}>{t("nav.login")}</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default BottomNav;
