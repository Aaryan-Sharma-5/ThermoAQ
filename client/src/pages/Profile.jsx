import { Mail, MapPin, User as UserIcon, Calendar, FileText, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportDownload } from '../components/features/ReportDownload';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { authAPI } from '../utils/api';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getUserProfile();
      setProfileData(response.user);
      setFormData({
        name: response.user.name || '',
        email: response.user.email || '',
        location: response.user.preferences?.defaultLocation || 'Mumbai, Maharashtra'
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await authAPI.updateUserProfile({
        name: formData.name,
        email: formData.email
      });
      
      // Update preferences if location changed
      if (formData.location !== profileData?.preferences?.defaultLocation) {
        await authAPI.updateUserPreferences({
          ...profileData.preferences,
          defaultLocation: formData.location
        });
      }
      
      // Refresh profile data
      await fetchProfileData();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-white">Loading profile...</div>
      </div>
    );
  }

  const memberSince = profileData?.createdAt 
    ? new Date(profileData.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date().toLocaleDateString();

  const locationsSaved = profileData?.monitoredLocations?.length || 0;
  const alertsReceived = profileData?.alerts?.length || 0;
  const healthReportsCount = profileData?.healthReports?.length || 0;
  const daysSinceMember = profileData?.createdAt 
    ? Math.floor((new Date() - new Date(profileData.createdAt)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{profileData?.name || user.name}</h1>
                <p className="text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member since {memberSince}
                </p>
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
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="text-gray-300">{profileData?.email || user.email}</p>
                  )}
                </div>

                {/* Username */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <UserIcon className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Username</h3>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="text-gray-300">{profileData?.name || user.name}</p>
                  )}
                </div>

                {/* Location */}
                <div className="bg-gray-800/50 rounded-lg p-6 md:col-span-2 border border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Default Location</h3>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="text-gray-300">{profileData?.preferences?.defaultLocation || 'Mumbai, Maharashtra'}</p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: profileData?.name || '',
                        email: profileData?.email || '',
                        location: profileData?.preferences?.defaultLocation || 'Mumbai, Maharashtra'
                      });
                    }}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {/* Account Actions */}
              <div className="border-t border-gray-700 pt-6 mt-8">
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
