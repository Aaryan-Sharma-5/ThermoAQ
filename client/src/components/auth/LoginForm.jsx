import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signinImage from '../../assets/images/Signin_Signup.png';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Add actual login API call here
      console.log('Login attempt:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to dashboard or home after successful login
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign in to your account</h2>
          
          {/* Form Container */}
          <div className="bg-gray-600 rounded-2xl p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-gray-300">
                  Remember me, recommended for login only
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Background Image with Content */}
      <div 
        className="w-1/2 bg-cover bg-center bg-no-repeat flex items-center justify-center p-8"
        style={{
          backgroundImage: `url(${signinImage})`
        }}
      >
        <div className="text-center text-black max-w-md">
          <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
          
          <p className="text-lg mb-8 leading-relaxed">
            Medislot provides an easy-to-use online platform for seamless medical 
            appointment scheduling. We offer patients the ability to quickly book, 
            reschedule, or cancel appointments, while enabling doctors to manage 
            their availability and view appointments in real time.
          </p>
          
          <p className="text-lg mb-6">Don't have an account? Sign Up!</p>
          
          <button
            onClick={() => navigate('/signup')}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
