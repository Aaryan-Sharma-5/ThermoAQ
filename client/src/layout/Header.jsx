import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  ChevronDown,
  LogIn,
  UserPlus,
  LogOut,
  User,
} from "lucide-react";
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
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b bg-black/20 backdrop-blur-sm border-white/10">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-12 h-12">
              <img
                src="/favicon_io/android-chrome-192x192.png"
                alt="ThermoAQ Logo"
                className="w-8 h-8"
              />
            </div>
            <span className="text-xl font-semibold text-white">ThermoAQ</span>
          </div>

          <nav className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="font-medium text-white transition-colors hover:text-blue-400"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="font-medium text-white transition-colors hover:text-blue-400"
            >
              Dashboard
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={cityDropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors border rounded-lg bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
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
              <div className="absolute z-20 w-64 mt-2 border rounded-lg shadow-xl top-full bg-slate-800/95 backdrop-blur-sm border-white/20">
                <div className="overflow-y-auto max-h-60">
                  {indianCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-white transition-colors border-b hover:bg-white/10 border-white/10 last:border-b-0"
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
                className="flex items-center px-4 py-2 space-x-3 transition-colors border rounded-lg bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
              >
                <Avatar name={user.name} size="sm" />
                <span className="font-medium text-white">{user.name}</span>
                <ChevronDown
                  size={16}
                  className={`text-white transition-transform ${
                    isUserDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 z-20 w-48 mt-2 border rounded-lg shadow-xl top-full bg-slate-800/95 backdrop-blur-sm border-white/20">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 space-x-2 text-left text-white transition-colors hover:bg-white/10"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <hr className="my-1 border-white/20" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 space-x-2 text-left text-red-400 transition-colors hover:bg-red-500/10"
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
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <LogIn size={18} />
                <span className="font-medium">Login</span>
              </button>
              <button
                onClick={handleSignUpClick}
                className="flex items-center px-4 py-2 space-x-2 font-medium transition-colors bg-white rounded-lg text-slate-900 hover:bg-gray-100"
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
