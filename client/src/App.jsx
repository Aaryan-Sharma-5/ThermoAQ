import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AdvancedFeatures } from "./pages/AdvancedFeatures";
import Dashboard from "./pages/Dashboard";
import DistrictAnalytics from "./pages/DistrictAnalytics";
import HealthAdvisory from "./pages/HealthAdvisory";
import HeatWaveMap from "./pages/HeatWaveMap";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/heatwave" element={<HeatWaveMap />} />
            <Route path="/analytics" element={<DistrictAnalytics />} />
            <Route path="/health-advisory" element={<HealthAdvisory />} />
            <Route path="/advanced" element={
              <ProtectedRoute>
                <AdvancedFeatures />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
