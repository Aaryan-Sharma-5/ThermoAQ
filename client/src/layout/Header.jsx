import { useState } from "react";
import { MapPin, ChevronDown, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const indianCities = [
  "Mumbai, Maharashtra",
  "Delhi, Delhi",
  "Bangalore, Karnataka",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
];

export const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Select City");
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <>
      <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <img
              src="/favicon_io/android-chrome-192x192.png"
              alt="ThermoAQ Logo"
              className="w-8 h-8"
            />
          </div>
          <span className="text-white text-xl font-semibold">Home</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors"
            >
              <MapPin size={18} className="text-blue-400" />
              <span className="text-sm font-medium">{selectedCity}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-20">
                <div className="max-h-60 overflow-y-auto">
                  {indianCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleLoginClick}
            className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogIn size={18} />
            <span className="font-medium">Login</span>
          </button>
          <button 
            onClick={handleSignUpClick}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-slate-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            <UserPlus size={18} />
            <span>SignUp</span>
          </button>
        </div>
      </div>
    </>
  );
};
