import { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/ui/Avatar";

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
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Select City");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const cityDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate('/');
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
          <div className="relative" ref={cityDropdownRef}>
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
          {user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Avatar name={user.name} size="sm" />
                <span className="text-white font-medium">{user.name}</span>
                <ChevronDown
                  size={16}
                  className={`text-white transition-transform ${
                    isUserDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-20">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <hr className="border-white/20 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </>
  );
};
