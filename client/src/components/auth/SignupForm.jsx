import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginSignupImage from '../../assets/images/login-signup.png';
import { useAuth } from '../../context/AuthContext';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // Navigate to home page after successful signup
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Full-page background image */}
      <img 
        src={loginSignupImage}
        alt="ThermoAQ Signup Background"
        className="fixed inset-0 w-full h-full object-cover z-0"
        style={{filter: 'blur(2px) brightness(0.85)'}}
      />
      {/* Overlay for readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-black/50 z-0" />
      {/* ThermoAQ Heading */}
      <div className="relative z-20 w-full flex justify-center pt-8 pb-2">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">ThermoAQ</h1>
      </div>
      {/* Centered content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full h-full gap-12 px-4">
        {/* Welcome Card */}
        <div className="max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-blue-200/50 text-center flex flex-col items-center">
          <h1 className="text-4xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent drop-shadow">Welcome</h1>
          <p className="text-lg mb-8 leading-relaxed font-medium text-gray-800">
            Discover <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">ThermoAQ</span> – your trusted partner for real-time heat wave and air quality alerts across India.<br/>
            Sign up to access personalized, district-level risk warnings and empower your community with environmental awareness.
          </p>
          <p className="text-base mb-6 text-gray-700">Already have an account?</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
        {/* Signup Form Card */}
        <div className="w-full max-w-md bg-gray-900/85 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up to your account</h2>
          <div className="w-full">
            {error && (
              <div className="p-3 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border-0 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Username"
                  required
                />
              </div>
              {/* Email Input */}
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border-0 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Email"
                  required
                />
              </div>
              {/* Password Input */}
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 bg-gray-700 border-0 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Confirm Password Input */}
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 bg-gray-700 border-0 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-all text-sm shadow-lg"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
