import {
    ChevronDown,
    LogIn,
    LogOut,
    MapPin,
    Menu,
    User,
    UserPlus,
    X,
    RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/ui/Avatar";
import { useAuth } from "../context/AuthContext";

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
  "Kanpur, Uttar Pradesh",
  "Nagpur, Maharashtra",
  "Indore, Madhya Pradesh",
  "Thane, Maharashtra",
  "Bhopal, Madhya Pradesh",
  "Visakhapatnam, Andhra Pradesh",
  "Patna, Bihar",
  "Vadodara, Gujarat",
  "Ludhiana, Punjab",
  "Surat, Gujarat",
];

export const Header = ({ onLocationChange, onRefresh }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Mumbai, Maharashtra");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const cityDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Request user location when logged in
  useEffect(() => {
    if (user) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
              // Reverse geocoding to get city name
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              
              const city = data.address.city || data.address.town || data.address.village || 'Mumbai';
              const state = data.address.state || 'Maharashtra';
              const detectedCity = `${city}, ${state}`;
              
              // Update selected city with detected location
              setSelectedCity(detectedCity);
              if (onLocationChange) {
                // Pass the detected city along with coordinates for nearby cities detection
                onLocationChange(detectedCity, { latitude, longitude });
              }
            } catch (err) {
              console.error('Reverse geocoding failed:', err);
              // Stay at default Mumbai
            }
          },
          (err) => {
            console.error('Geolocation error:', err);
            // Stay at default Mumbai if permission denied or error
          }
        );
      }
    } else {
      // Reset to Mumbai when logged out
      setSelectedCity("Mumbai, Maharashtra");
      if (onLocationChange) {
        onLocationChange("Mumbai, Maharashtra");
      }
    }
  }, [user, onLocationChange]);

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
      <div className="relative z-50 flex items-center justify-between px-4 py-4 border-b lg:px-6 bg-black/20 backdrop-blur-sm border-white/10">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12">
            <img
              src="/favicon_io/android-chrome-192x192.png"
              alt="ThermoAQ Logo"
              className="w-6 h-6 lg:w-8 lg:h-8"
            />
          </div>
          <span className="text-lg font-semibold text-white lg:text-xl">ThermoAQ</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="items-center hidden ml-8 space-x-6 lg:flex">
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
          <button
            onClick={() => navigate("/heatwave")}
            className="font-medium text-white transition-colors hover:text-blue-400"
          >
            Heat Wave
          </button>
          <button
            onClick={() => navigate("/analytics")}
            className="font-medium text-white transition-colors hover:text-blue-400"
          >
            Analytics
          </button>
          <button
            onClick={() => navigate("/health-advisory")}
            className="font-medium text-white transition-colors hover:text-blue-400"
          >
            Health Advisory
          </button>
          <button
            onClick={() => {
              if (user) {
                navigate("/advanced");
              } else {
                navigate("/login");
              }
            }}
            className="font-medium text-white transition-colors hover:text-blue-400"
          >
            Advanced
          </button>
        </nav>

        {/* Desktop Right Section */}
        <div className="items-center hidden space-x-4 lg:flex">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
              title="Refresh data"
            >
              <RefreshCw size={18} />
            </button>
          )}

          {/* City Dropdown - Only show when logged in */}
          {user && (
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
                <div className="absolute z-[60] w-64 mt-2 border rounded-lg shadow-xl top-full bg-slate-800/95 backdrop-blur-sm border-white/20">
                  <div className="overflow-y-auto max-h-60">
                    {indianCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsDropdownOpen(false);
                          if (onLocationChange) {
                            onLocationChange(city);
                          }
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
          )}

          {/* User Section */}
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
                <div className="absolute right-0 z-[60] w-48 mt-2 border rounded-lg shadow-xl top-full bg-slate-800/95 backdrop-blur-sm border-white/20">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white transition-colors rounded-lg lg:hidden hover:bg-white/10"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 z-40 border-b lg:hidden bg-slate-900/95 backdrop-blur-md border-white/10">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  navigate("/");
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 font-medium text-left text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 font-medium text-left text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate("/heatwave");
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 font-medium text-left text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Heat Wave
              </button>
              <button
                onClick={() => {
                  navigate("/analytics");
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 font-medium text-left text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Analytics
              </button>
              <button
                onClick={() => {
                  navigate("/health-advisory");
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 font-medium text-left text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Health Advisory
              </button>
              <button
                onClick={() => {
                  if (user) {
                    navigate("/advanced");
                  } else {
                    navigate("/login");
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 font-medium text-left text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Advanced
              </button>
            </nav>

            {/* Mobile City Selector - Only show when logged in */}
            {user && (
              <div className="pt-2 border-t border-white/10">
                {/* Refresh Button for Mobile */}
                {onRefresh && (
                  <button
                    onClick={() => {
                      onRefresh();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 mb-3 space-x-2 text-white transition-colors border rounded-lg border-white/20 hover:bg-white/10"
                  >
                    <RefreshCw size={18} />
                    <span className="font-medium">Refresh Data</span>
                  </button>
                )}

                <div className="relative" ref={cityDropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 text-white transition-colors border rounded-lg bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin size={18} className="text-blue-400" />
                      <span className="text-sm font-medium">{selectedCity}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="z-[60] w-full mt-2 border rounded-lg shadow-xl bg-slate-800/95 backdrop-blur-sm border-white/20">
                      <div className="overflow-y-auto max-h-60">
                        {indianCities.map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              setSelectedCity(city);
                              setIsDropdownOpen(false);
                              setIsMobileMenuOpen(false);
                              if (onLocationChange) {
                                onLocationChange(city);
                              }
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
            )}

            {/* Mobile User Section */}
            <div className="pt-2 border-t border-white/10">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center px-4 py-3 space-x-3 border rounded-lg bg-white/10 backdrop-blur-sm border-white/20">
                    <Avatar name={user.name} size="sm" />
                    <span className="font-medium text-white">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 space-x-2 text-left text-white transition-colors rounded-lg hover:bg-white/10"
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 space-x-2 text-left text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleLoginClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-white transition-colors border rounded-lg border-white/20 hover:bg-white/10"
                  >
                    <LogIn size={18} />
                    <span className="font-medium">Login</span>
                  </button>
                  <button
                    onClick={() => {
                      handleSignUpClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium transition-colors bg-white rounded-lg text-slate-900 hover:bg-gray-100"
                  >
                    <UserPlus size={18} />
                    <span>SignUp</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
