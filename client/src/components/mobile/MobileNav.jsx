import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📈' },
    { path: '/heatwave', label: 'Heat Wave Map', icon: '🔥' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/health-advisory', label: 'Health Advisory', icon: '💊' },
    { path: '/health-assessment', label: 'Health Check', icon: '🩺' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Bottom Sheet */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out"
            style={{ maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-slate-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Navigation</h2>
              <p className="text-sm text-gray-400">Quick access to all features</p>
            </div>

            {/* Menu Items */}
            <div className="overflow-y-auto px-4 py-6 space-y-2" style={{ maxHeight: 'calc(80vh - 120px)' }}>
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-white transition-all duration-200 active:scale-95"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
