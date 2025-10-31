import { Moon, Sunrise, Sunset } from 'lucide-react';
import { useMemo } from 'react';

export function SunMoonTimeline({ sunrise = '06:00', sunset = '18:00', currentTime = new Date() }) {
  const timelineData = useMemo(() => {
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const sunriseTime = parseTime(sunrise);
    const sunsetTime = parseTime(sunset);
    const now = currentTime;

    // Calculate positions (0-100%)
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(now);
    dayEnd.setHours(23, 59, 59, 999);

    const totalMinutes = 24 * 60;
    const sunrisePos = (sunriseTime.getHours() * 60 + sunriseTime.getMinutes()) / totalMinutes * 100;
    const sunsetPos = (sunsetTime.getHours() * 60 + sunsetTime.getMinutes()) / totalMinutes * 100;
    const currentPos = (now.getHours() * 60 + now.getMinutes()) / totalMinutes * 100;

    const isDaytime = currentPos >= sunrisePos && currentPos <= sunsetPos;
    
    // Calculate daylight duration
    const daylightMs = sunsetTime - sunriseTime;
    const daylightHours = Math.floor(daylightMs / (1000 * 60 * 60));
    const daylightMinutes = Math.floor((daylightMs % (1000 * 60 * 60)) / (1000 * 60));

    // Moon phase calculation (simplified - actual phase would need API)
    const dayOfMonth = now.getDate();
    const moonPhase = (dayOfMonth % 29.5) / 29.5;
    let phaseName = '';
    let moonIcon = '🌑';
    
    if (moonPhase < 0.125) { phaseName = 'New Moon'; moonIcon = '🌑'; }
    else if (moonPhase < 0.25) { phaseName = 'Waxing Crescent'; moonIcon = '🌒'; }
    else if (moonPhase < 0.375) { phaseName = 'First Quarter'; moonIcon = '🌓'; }
    else if (moonPhase < 0.5) { phaseName = 'Waxing Gibbous'; moonIcon = '🌔'; }
    else if (moonPhase < 0.625) { phaseName = 'Full Moon'; moonIcon = '🌕'; }
    else if (moonPhase < 0.75) { phaseName = 'Waning Gibbous'; moonIcon = '🌖'; }
    else if (moonPhase < 0.875) { phaseName = 'Last Quarter'; moonIcon = '🌗'; }
    else { phaseName = 'Waning Crescent'; moonIcon = '🌘'; }

    return {
      sunrisePos,
      sunsetPos,
      currentPos,
      isDaytime,
      daylightHours,
      daylightMinutes,
      phaseName,
      moonIcon
    };
  }, [sunrise, sunset, currentTime]);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`bg-gradient-to-br p-3 rounded-xl ${
            timelineData.isDaytime 
              ? 'from-yellow-500 to-orange-500' 
              : 'from-indigo-500 to-purple-500'
          }`}>
            {timelineData.isDaytime ? (
              <Sunrise className="w-6 h-6 text-white" />
            ) : (
              <Moon className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Sun & Moon</h3>
            <p className="text-sm text-gray-400">
              {timelineData.isDaytime ? 'Daytime' : 'Nighttime'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl">{timelineData.moonIcon}</div>
          <p className="text-xs text-gray-400 mt-1">{timelineData.phaseName}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mb-8">
        {/* Time labels */}
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>12 AM</span>
        </div>

        {/* Main timeline bar */}
        <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
          {/* Daylight portion */}
          <div
            className="absolute h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"
            style={{
              left: `${timelineData.sunrisePos}%`,
              width: `${timelineData.sunsetPos - timelineData.sunrisePos}%`
            }}
          ></div>

          {/* Current time indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-white shadow-lg transition-all duration-1000"
            style={{ left: `${timelineData.currentPos}%` }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
              Now
            </div>
          </div>
        </div>

        {/* Sunrise marker */}
        <div
          className="absolute -top-6 transform -translate-x-1/2"
          style={{ left: `${timelineData.sunrisePos}%` }}
        >
          <Sunrise className="w-5 h-5 text-yellow-400" />
        </div>

        {/* Sunset marker */}
        <div
          className="absolute -top-6 transform -translate-x-1/2"
          style={{ left: `${timelineData.sunsetPos}%` }}
        >
          <Sunset className="w-5 h-5 text-orange-400" />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sunrise className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Sunrise</span>
          </div>
          <p className="text-2xl font-bold text-white">{sunrise}</p>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sunset className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-400">Sunset</span>
          </div>
          <p className="text-2xl font-bold text-white">{sunset}</p>
        </div>
      </div>

      {/* Daylight duration */}
      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-yellow-400">Daylight Duration:</span>{' '}
          {timelineData.daylightHours}h {timelineData.daylightMinutes}m
        </p>
      </div>
    </div>
  );
}
