import { ChevronDownIcon, MapPinIcon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Header({ location, setLocation }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  
  const locations = [
    'Mumbai, Maharashtra',
    'Delhi, Delhi',
    'Kolkata, West Bengal',
    'Bangalore, Karnataka',
    'Chennai, Tamil Nadu',
    'Hyderabad, Telangana',
    'Pune, Maharashtra',
    'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan',
    'Surat, Gujarat'
  ]

  return (
    <header className="bg-black border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <nav>
          <button
            onClick={() => navigate('/')}
            className="text-white font-medium hover:text-yellow-400 transition-colors"
          >
            ← Home
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
            >
              <MapPinIcon className="w-4 h-4" />
              <span className="text-sm">{location}</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {isOpen && (
              <div className="absolute top-full right-0 mt-2 bg-slate-800 rounded-lg shadow-xl overflow-hidden z-50 min-w-[240px] border border-slate-600">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocation(loc)
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors text-white border-b border-slate-700 last:border-b-0"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors">
            <UserIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}