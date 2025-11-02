import { Mail, MapPin, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportDownload } from '../components/features/ReportDownload';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute -bottom-16 left-8">
              <Avatar name={user.name} size="xl" />
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                <p className="text-slate-400">Member since {new Date().toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="text-slate-300">{user.email}</p>
                  )}
                </div>

                {/* Username */}
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <UserIcon className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Username</h3>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="text-slate-300">{user.name}</p>
                  )}
                </div>

                {/* Location */}
                <div className="bg-slate-700/50 rounded-lg p-6 md:col-span-2">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Location Preferences</h3>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue="Mumbai, Maharashtra"
                      placeholder="Enter your city"
                      className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="text-slate-300">Mumbai, Maharashtra</p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      // TODO: Save profile changes
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {/* Account Actions */}
              <div className="border-t border-slate-700 pt-6 mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full px-6 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors text-left border border-red-600/20"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-slate-400 text-sm mb-2">Locations Saved</h4>
            <p className="text-3xl font-bold text-white">3</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-slate-400 text-sm mb-2">Alerts Received</h4>
            <p className="text-3xl font-bold text-white">12</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-slate-400 text-sm mb-2">Days Active</h4>
            <p className="text-3xl font-bold text-white">45</p>
          </div>
        </div>

        {/* Report Download Section */}
        <div className="mt-8">
          <ReportDownload />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
