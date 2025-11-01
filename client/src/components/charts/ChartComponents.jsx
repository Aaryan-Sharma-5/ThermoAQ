import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Enhanced AQI Trend Chart Component with beautiful gradients and animations
export const AQITrendChart = ({ data, className = "" }) => {
  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'AQI Level',
        data: data.map(item => item.aqi),
        borderColor: '#3B82F6',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
          gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0.1)');
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: data.map(item => item.color || '#F59E0B'),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderWidth: 4,
        segment: {
          borderColor: (ctx) => {
            const value = ctx.p1.parsed.y;
            if (value <= 50) return '#10B981';
            if (value <= 100) return '#F59E0B';
            if (value <= 150) return '#F97316';
            return '#EF4444';
          },
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#F8FAFC',
        bodyColor: '#E2E8F0',
        borderColor: '#64748B',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          title: (context) => {
            const dataPoint = data[context[0].dataIndex];
            return `${dataPoint.date}`;
          },
          label: (context) => {
            const dataPoint = data[context.dataIndex];
            return [
              `AQI: ${context.parsed.y}`,
              `Level: ${dataPoint.level || 'Unknown'}`,
              `Air Quality: ${dataPoint.level === 'Good' ? '😊 Excellent' : 
                              dataPoint.level === 'Moderate' ? '😐 Acceptable' : 
                              dataPoint.level?.includes('Unhealthy') ? '😷 Concerning' : '⚠️ Alert'}`
            ];
          },
          labelColor: (context) => ({
            borderColor: data[context.dataIndex]?.color || '#F59E0B',
            backgroundColor: data[context.dataIndex]?.color || '#F59E0B',
          }),
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
          maxRotation: 0,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(71, 85, 105, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
          callback: function(value) {
            if (value === 0) return 'Good (0)';
            if (value === 50) return 'Moderate (50)';
            if (value === 100) return 'USG (100)';
            if (value === 150) return 'Unhealthy (150)';
            if (value === 200) return 'V.Unhealthy (200)';
            return value;
          },
        },
        border: {
          display: false,
        },
        min: 0,
        max: 200,
      },
    },
  };

  return (
    <div className={`${className}`}>
      <Line data={chartData} options={options} />
    </div>
  );
};

// Enhanced AQI Circular Chart with beautiful gradients and glow effects
export const AQICircularChart = ({ aqi, level, className = "" }) => {
  const percentage = Math.min((aqi / 200) * 100, 100);
  
  // Get AQI level info for styling
  const getAQIInfo = (aqiValue) => {
    if (aqiValue <= 50) return { 
      color: '#10B981', 
      gradient: ['#10B981', '#34D399'], 
      emoji: '😊',
      glow: 'rgba(16, 185, 129, 0.4)'
    };
    if (aqiValue <= 100) return { 
      color: '#F59E0B', 
      gradient: ['#F59E0B', '#FBBF24'], 
      emoji: '😐',
      glow: 'rgba(245, 158, 11, 0.4)'
    };
    if (aqiValue <= 150) return { 
      color: '#F97316', 
      gradient: ['#F97316', '#FB923C'], 
      emoji: '😷',
      glow: 'rgba(249, 115, 22, 0.4)'
    };
    return { 
      color: '#EF4444', 
      gradient: ['#EF4444', '#F87171'], 
      emoji: '😨',
      glow: 'rgba(239, 68, 68, 0.4)'
    };
  };

  const aqiInfo = getAQIInfo(aqi);
  
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: (context) => {
          if (context.dataIndex === 0) {
            const ctx = context.chart.ctx;
            const gradient = ctx.createConicGradient(0, 150, 150);
            gradient.addColorStop(0, aqiInfo.gradient[0]);
            gradient.addColorStop(0.5, aqiInfo.gradient[1]);
            gradient.addColorStop(1, aqiInfo.gradient[0]);
            return gradient;
          }
          return 'rgba(71, 85, 105, 0.2)';
        },
        borderWidth: 0,
        cutout: '78%',
        borderRadius: [8, 0],
        spacing: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      duration: 2000,
      easing: 'easeInOutCubic',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className="absolute inset-0 rounded-full blur-md opacity-60"
        style={{ 
          background: `radial-gradient(circle, ${aqiInfo.glow} 0%, transparent 70%)`,
        }}
      />
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <div 
          className="text-2xl font-black mb-1 drop-shadow-lg"
          style={{ color: aqiInfo.color }}
        >
          {aqi}
        </div>
        <div className="text-xs text-gray-300 font-medium tracking-wider uppercase">
          {level}
        </div>
        <div className="text-lg mt-1">{aqiInfo.emoji}</div>
      </div>
      
      {/* Animated ring indicator */}
      <div 
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          border: `2px solid ${aqiInfo.color}`,
          opacity: 0.3,
        }}
      />
    </div>
  );
};

// Enhanced Pollutant Bars with accurate WHO/EPA standards and beautiful animations
export const PollutantBars = ({ pollutants, className = "" }) => {
  // WHO/EPA accurate thresholds for different pollutants
  const pollutantData = [
    { 
      name: 'PM2.5', 
      value: pollutants.pm25, 
      unit: 'μg/m³', 
      max: 75, // WHO annual guideline: 5, 24h: 15, EPA: 35
      thresholds: [15, 35, 75],
      icon: '🔍',
      description: 'Fine particles'
    },
    { 
      name: 'PM10', 
      value: pollutants.pm10, 
      unit: 'μg/m³', 
      max: 150, // WHO annual: 15, 24h: 45, EPA: 150
      thresholds: [45, 100, 150],
      icon: '💨',
      description: 'Coarse particles'
    },
    { 
      name: 'CO', 
      value: pollutants.co, 
      unit: 'mg/m³', 
      max: 30, // WHO 8h: 10mg/m³, converted from ppb
      thresholds: [10, 20, 30],
      icon: '⚠️',
      description: 'Carbon monoxide'
    },
    { 
      name: 'SO₂', 
      value: pollutants.so2, 
      unit: 'μg/m³', 
      max: 500, // WHO 24h guideline: 40μg/m³
      thresholds: [40, 125, 500],
      icon: '🏭',
      description: 'Sulfur dioxide'
    },
    { 
      name: 'NO₂', 
      value: pollutants.no2, 
      unit: 'μg/m³', 
      max: 200, // WHO annual: 10, 24h: 25μg/m³
      thresholds: [25, 100, 200],
      icon: '🚗',
      description: 'Nitrogen dioxide'
    },
    { 
      name: 'O₃', 
      value: pollutants.o3, 
      unit: 'μg/m³', 
      max: 240, // WHO 8h peak season: 60μg/m³
      thresholds: [60, 120, 240],
      icon: '☀️',
      description: 'Ground-level ozone'
    },
  ];

  const getColorAndLevel = (value, thresholds) => {
    if (value <= thresholds[0]) return { 
      color: '#10B981', 
      level: 'Good', 
      gradient: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
      glow: 'rgba(16, 185, 129, 0.3)'
    };
    if (value <= thresholds[1]) return { 
      color: '#F59E0B', 
      level: 'Moderate', 
      gradient: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
      glow: 'rgba(245, 158, 11, 0.3)'
    };
    if (value <= thresholds[2]) return { 
      color: '#F97316', 
      level: 'Unhealthy', 
      gradient: 'linear-gradient(90deg, #F97316 0%, #FB923C 100%)',
      glow: 'rgba(249, 115, 22, 0.3)'
    };
    return { 
      color: '#EF4444', 
      level: 'Hazardous', 
      gradient: 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)',
      glow: 'rgba(239, 68, 68, 0.3)'
    };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {pollutantData.map((item, index) => {
        const colorInfo = getColorAndLevel(item.value, item.thresholds);
        const percentage = Math.min((item.value / item.max) * 100, 100);
        
        return (
          <div key={item.name} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-200 text-sm font-medium">{item.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span 
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ 
                    backgroundColor: colorInfo.glow, 
                    color: colorInfo.color,
                    border: `1px solid ${colorInfo.color}`
                  }}
                >
                  {colorInfo.level}
                </span>
                <span className="text-white text-sm font-bold">
                  {item.value}
                </span>
                <span className="text-gray-400 text-xs">{item.unit}</span>
              </div>
            </div>
            
            <div className="relative">
              {/* Background track */}
              <div className="w-full bg-slate-700/50 rounded-full h-3 backdrop-blur-sm">
                {/* Animated progress bar */}
                <div
                  className="h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{
                    width: `${percentage}%`,
                    background: colorInfo.gradient,
                    boxShadow: `0 0 10px ${colorInfo.glow}`,
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  {/* Shimmer effect */}
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                </div>
                
                {/* Threshold markers */}
                {item.thresholds.map((threshold, thresholdIndex) => (
                  <div
                    key={thresholdIndex}
                    className="absolute top-0 h-3 w-0.5 bg-gray-300 opacity-60"
                    style={{
                      left: `${(threshold / item.max) * 100}%`,
                    }}
                    title={`${threshold} ${item.unit}`}
                  />
                ))}
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                {item.description}: {item.value} {item.unit}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Add shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

// Weather Chart Component for 7-day forecast
export const WeatherForecastChart = ({ forecastData, className = "" }) => {
  if (!forecastData?.daily) return null;

  const chartData = {
    labels: forecastData.daily.map(day => day.day),
    datasets: [
      {
        label: 'High Temp',
        data: forecastData.daily.map(day => day.high),
        borderColor: '#F97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 2,
        fill: '+1',
      },
      {
        label: 'Low Temp',
        data: forecastData.daily.map(day => day.low),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: 'origin',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 10,
          },
          callback: function(value) {
            return value + '°C';
          },
        },
      },
    },
  };

  return (
    <div className={`${className}`}>
      <Line data={chartData} options={options} />
    </div>
  );
};