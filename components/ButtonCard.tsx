import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ButtonCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color?: "blue" | "gold";
}

export function ButtonCard({
  title,
  description,
  href,
  icon: Icon,
  color = "blue",
}: ButtonCardProps) {
  const colorClasses = {
    blue: "bg-moroccan-blue hover:bg-blue-700 text-white",
    gold: "bg-moroccan-gold hover:bg-yellow-500 text-white",
  };

  return (
    <Link href={href}>
      <div
        className={`${colorClasses[color]} rounded-lg p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Icon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm opacity-90">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

