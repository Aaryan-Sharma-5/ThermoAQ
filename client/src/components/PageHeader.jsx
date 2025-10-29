import { ArrowLeftIcon, ChevronDownIcon, RefreshCwIcon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function PageHeader({ title, selectedLocation = 'Mumbai, Maharashtra', onLocationChange, onRefresh }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const locations = [
    'Mumbai, Maharashtra',
    'Delhi, Delhi',
    'Bangalore, Karnataka',
    'Chennai, Tamil Nadu',
    'Kolkata, West Bengal',
    'Hyderabad, Telangana',
    'Pune, Maharashtra',
    'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan',
    'Lucknow, Uttar Pradesh',
    'Kanpur, Uttar Pradesh',
    'Nagpur, Maharashtra',
    'Indore, Madhya Pradesh',
    'Thane, Maharashtra',
    'Bhopal, Madhya Pradesh',
    'Visakhapatnam, Andhra Pradesh',
    'Patna, Bihar',
    'Vadodara, Gujarat',
    'Ludhiana, Punjab',
    'Surat, Gujarat'
  ]

  const handleLocationSelect = (location) => {
    setIsDropdownOpen(false)
    if (onLocationChange) {
      onLocationChange(location)
    }
  }

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  const handleHomeNavigation = () => {
    console.log('Navigating to home page...')
    navigate('/')
  }

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Back button and home link */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleHomeNavigation}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">ThermoAQ Home</span>
          </button>
        </div>

        {/* Center - Page title */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>

        {/* Right side - Location dropdown, refresh, and user */}
        <div className="flex items-center gap-4">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-800 rounded-lg"
            title="Refresh data"
          >
            <RefreshCwIcon className="w-5 h-5" />
          </button>

          {/* Location dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors min-w-[200px]"
            >
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm flex-1 text-left">{selectedLocation}</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-slate-800 rounded-lg shadow-xl overflow-hidden z-50 min-w-[280px] max-h-64 overflow-y-auto border border-slate-600">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors text-white border-b border-slate-700 last:border-b-0"
                  >
                    <div className="font-medium">{location.split(',')[0]}</div>
                    <div className="text-xs text-slate-400">{location.split(',')[1]}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User icon */}
          <button className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-colors">
            <UserIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </header>
  )
}