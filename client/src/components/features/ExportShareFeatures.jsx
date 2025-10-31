import { Download, Facebook, FileDown, Linkedin, Share2, Twitter } from 'lucide-react';
import { useState } from 'react';

export function ExportShareFeatures({ weatherData, aqiData, locationName }) {
  const [isExporting, setIsExporting] = useState(false);

  // Export as CSV
  const exportAsCSV = () => {
    const csvData = [
      ['ThermoAQ Weather Report'],
      ['Location', locationName],
      ['Date', new Date().toLocaleString()],
      [''],
      ['Weather Information'],
      ['Temperature', `${weatherData?.temperature || 'N/A'}°C`],
      ['Feels Like', `${weatherData?.feelsLike || 'N/A'}°C`],
      ['Condition', weatherData?.condition || 'N/A'],
      ['Humidity', `${weatherData?.humidity || 'N/A'}%`],
      ['Wind Speed', `${weatherData?.windSpeed || 'N/A'} km/h`],
      ['UV Index', weatherData?.uvIndex || 'N/A'],
      [''],
      ['Air Quality Information'],
      ['AQI', aqiData?.aqi || 'N/A'],
      ['PM2.5', `${aqiData?.pollutants?.pm25 || 'N/A'} μg/m³`],
      ['PM10', `${aqiData?.pollutants?.pm10 || 'N/A'} μg/m³`],
      ['O3', `${aqiData?.pollutants?.o3 || 'N/A'} μg/m³`],
      ['NO2', `${aqiData?.pollutants?.no2 || 'N/A'} μg/m³`],
      ['SO2', `${aqiData?.pollutants?.so2 || 'N/A'} μg/m³`],
      ['CO', `${aqiData?.pollutants?.co || 'N/A'} μg/m³`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ThermoAQ_${locationName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as PDF (simplified - using print)
  const exportAsPDF = () => {
    setIsExporting(true);
    
    // Create a printable version
    const reportContent = `
      <html>
        <head>
          <title>ThermoAQ Weather Report - ${locationName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
            h2 { color: #475569; margin-top: 30px; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .info-item { background: #f1f5f9; padding: 15px; border-radius: 8px; }
            .label { font-weight: bold; color: #64748b; font-size: 12px; }
            .value { font-size: 24px; color: #1e293b; margin-top: 5px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #cbd5e1; text-align: center; color: #64748b; }
          </style>
        </head>
        <body>
          <h1>🌡️ ThermoAQ Weather Report</h1>
          <p><strong>Location:</strong> ${locationName}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          
          <h2>Weather Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Temperature</div>
              <div class="value">${weatherData?.temperature || 'N/A'}°C</div>
            </div>
            <div class="info-item">
              <div class="label">Feels Like</div>
              <div class="value">${weatherData?.feelsLike || 'N/A'}°C</div>
            </div>
            <div class="info-item">
              <div class="label">Condition</div>
              <div class="value">${weatherData?.condition || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="label">Humidity</div>
              <div class="value">${weatherData?.humidity || 'N/A'}%</div>
            </div>
            <div class="info-item">
              <div class="label">Wind Speed</div>
              <div class="value">${weatherData?.windSpeed || 'N/A'} km/h</div>
            </div>
            <div class="info-item">
              <div class="label">UV Index</div>
              <div class="value">${weatherData?.uvIndex || 'N/A'}</div>
            </div>
          </div>
          
          <h2>Air Quality Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">AQI</div>
              <div class="value">${aqiData?.aqi || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="label">PM2.5</div>
              <div class="value">${aqiData?.pollutants?.pm25 || 'N/A'} μg/m³</div>
            </div>
            <div class="info-item">
              <div class="label">PM10</div>
              <div class="value">${aqiData?.pollutants?.pm10 || 'N/A'} μg/m³</div>
            </div>
            <div class="info-item">
              <div class="label">Ozone (O₃)</div>
              <div class="value">${aqiData?.pollutants?.o3 || 'N/A'} μg/m³</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Generated by ThermoAQ - Environmental Intelligence Platform</p>
            <p>Data updated: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      setIsExporting(false);
    }, 250);
  };

  // Share to social media
  const shareToSocial = (platform) => {
    const text = `Current weather in ${locationName}: ${weatherData?.temperature}°C, ${weatherData?.condition}. AQI: ${aqiData?.aqi}`;
    const url = window.location.href;

    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        // Use Web Share API if available
        if (navigator.share) {
          navigator.share({
            title: `Weather in ${locationName}`,
            text: text,
            url: url
          }).catch(err => console.error('Error sharing:', err));
          return;
        }
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-xl">
          <Share2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Export & Share</h3>
          <p className="text-sm text-gray-400">Download reports or share on social media</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-400" />
            Export Reports
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={exportAsPDF}
              disabled={isExporting}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FileDown className="w-5 h-5" />
              <span className="font-semibold">PDF</span>
            </button>

            <button
              onClick={exportAsCSV}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FileDown className="w-5 h-5" />
              <span className="font-semibold">CSV</span>
            </button>
          </div>
        </div>

        {/* Social Share */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-green-400" />
            Share on Social Media
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => shareToSocial('twitter')}
              className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-4 py-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Twitter className="w-6 h-6" />
              <span className="text-xs font-semibold">Twitter</span>
            </button>

            <button
              onClick={() => shareToSocial('facebook')}
              className="bg-[#4267B2] hover:bg-[#365899] text-white px-4 py-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Facebook className="w-6 h-6" />
              <span className="text-xs font-semibold">Facebook</span>
            </button>

            <button
              onClick={() => shareToSocial('linkedin')}
              className="bg-[#0077B5] hover:bg-[#006399] text-white px-4 py-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Linkedin className="w-6 h-6" />
              <span className="text-xs font-semibold">LinkedIn</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-300">
          💡 Exported reports include complete weather and air quality data for {locationName}
        </p>
      </div>
    </div>
  );
}
