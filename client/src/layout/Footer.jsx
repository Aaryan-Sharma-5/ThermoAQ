import React from "react";
import { Github, Mail, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <div className="relative bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 border-t border-white/10">
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-8">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img
                    src="/favicon_io/android-chrome-192x192.png"
                    alt="ThermoAQ Logo"
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-3xl font-bold text-white">ThermoAQ</h3>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                India's most comprehensive real-time environmental monitoring
                platform, combining heat-wave alerts with air quality data to
                protect communities across the nation.
              </p>

              <div className="flex justify-center md:justify-start space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Github size={24} />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Mail size={24} />
                </a>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="text-2xl font-bold text-white mb-8">
                Quick Links
              </h4>
              <div className="space-y-4">
                <a
                  href="#"
                  className="block text-gray-300 hover:text-blue-400 transition-colors text-lg font-medium"
                >
                  Live Heat Map
                </a>
                <a
                  href="#"
                  className="block text-gray-300 hover:text-green-400 transition-colors text-lg font-medium"
                >
                  AQI Dashboard
                </a>
                <a
                  href="#"
                  className="block text-gray-300 hover:text-red-400 transition-colors text-lg font-medium"
                >
                  Emergency Alerts
                </a>
                <a
                  href="#"
                  className="block text-gray-300 hover:text-purple-400 transition-colors text-lg font-medium"
                >
                  API Access
                </a>
              </div>
            </div>
          </div>
        </div>

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
