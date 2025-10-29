import { ChevronDown, MapPin, User } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">ThermoAQ</h1>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Dashboard</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-[#1e2430] px-4 py-2 rounded-lg hover:bg-[#252d3d] transition-colors">
            <MapPin className="w-4 h-4" />
            <span>Mumbai, Maharashtra</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 bg-[#1e2430] px-4 py-2 rounded-lg hover:bg-[#252d3d] transition-colors">
            <span>Login</span>
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <User className="w-4 h-4" />
            <span>SignUp</span>
          </button>
        </div>
      </div>
    </header>
  );
}