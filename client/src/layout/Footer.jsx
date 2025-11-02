import React from "react";
import { Github, Mail, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <div className="relative bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 border-t border-white/10">
      <div className="relative z-10">
        <div className="border-t border-white/10 bg-slate-950/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-300 text-lg">
                <span>© 2025 ThermoAQ. Made with</span>
                <Heart
                  size={20}
                  className="text-red-500 fill-current animate-pulse"
                />
                <span>for India's safety.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
