/**
 * Forzeo Logo Component
 */
import React from "react";

interface ForzeoLogoProps {
  className?: string;
  isDark?: boolean;
}

export const ForzeoLogo: React.FC<ForzeoLogoProps> = ({ className = "", isDark = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
        <span className="text-white font-bold text-lg">F</span>
      </div>
      <span className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
        Forzeo
      </span>
    </div>
  );
};
