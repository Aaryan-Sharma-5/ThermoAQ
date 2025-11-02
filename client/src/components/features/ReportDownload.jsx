import { Download, FileText, Loader } from 'lucide-react';
import { useState } from 'react';
import { authAPI } from '../../utils/api';

export function ReportDownload() {
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState('comprehensive');

  const generatePDFReport = async () => {
    setGenerating(true);
    try {
      // Fetch all necessary data
      const [profile, history, alerts] = await Promise.all([
        authAPI.getUserProfile(),
        authAPI.getAQIHistory(),
        authAPI.getAlerts()
      ]);

      const user = profile.user;
      const monitoredLocations = user.monitoredLocations || [];
      const aqiHistory = history.history || [];
      const userAlerts = alerts.alerts || [];

      // Create report content
      let reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ThermoAQ Environmental Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
    }
    .header {
      border-bottom: 4px solid #3B82F6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1E40AF;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .header .subtitle {
      color: #6B7280;
      font-size: 16px;
    }
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .section-title {
      color: #1F2937;
      font-size: 24px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #E5E7EB;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-item {
      background: #F9FAFB;
      padding: 15px;
      border-radius: 8px;
      border-left: 3px solid #3B82F6;
    }
    .info-label {
      color: #6B7280;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .info-value {
      color: #1F2937;
      font-size: 16px;
      font-weight: 500;
    }
    .aqi-card {
      background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
      color: white;
      padding: 25px;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .aqi-value {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .table th {
      background: #F3F4F6;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #D1D5DB;
    }
    .table td {
      padding: 12px;
      border-bottom: 1px solid #E5E7EB;
    }
    .table tr:hover {
      background: #F9FAFB;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-green { background: #D1FAE5; color: #065F46; }
    .badge-yellow { background: #FEF3C7; color: #92400E; }
    .badge-orange { background: #FED7AA; color: #9A3412; }
    .badge-red { background: #FEE2E2; color: #991B1B; }
    .badge-purple { background: #EDE9FE; color: #5B21B6; }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #E5E7EB;
      text-align: center;
      color: #6B7280;
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .stat-box {
      background: #F9FAFB;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #3B82F6;
      margin-bottom: 5px;
    }
    .stat-label {
      color: #6B7280;
      font-size: 14px;
    }
    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌍 ThermoAQ Environmental Report</h1>
    <div class="subtitle">
      Generated on ${new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">👤 User Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Name</div>
        <div class="info-value">${user.name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${user.email}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Member Since</div>
        <div class="info-value">${new Date(user.createdAt).toLocaleDateString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Alert Threshold</div>
        <div class="info-value">AQI ${user.preferences?.aqiAlertThreshold || 150}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">📊 Overview Statistics</h2>
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-value">${monitoredLocations.length}</div>
        <div class="stat-label">Monitored Locations</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${aqiHistory.length}</div>
        <div class="stat-label">History Records</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${userAlerts.filter(a => !a.isRead).length}</div>
        <div class="stat-label">Active Alerts</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${user.preferences?.healthConditions?.length || 0}</div>
        <div class="stat-label">Health Conditions</div>
      </div>
    </div>
  </div>`;

      // Monitored Locations
      if (monitoredLocations.length > 0) {
        reportHTML += `
  <div class="section">
    <h2 class="section-title">📍 Monitored Locations</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Location</th>
          <th>Added Date</th>
          <th>Alerts</th>
        </tr>
      </thead>
      <tbody>
        ${monitoredLocations.map(loc => `
          <tr>
            <td>${loc.name}</td>
            <td>${new Date(loc.addedAt).toLocaleDateString()}</td>
            <td>${loc.alertEnabled ? '✅ Enabled' : '❌ Disabled'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
      }

      // AQI History
      if (aqiHistory.length > 0) {
        const avgAQI = Math.round(aqiHistory.reduce((sum, h) => sum + h.aqi, 0) / aqiHistory.length);
        const maxAQI = Math.max(...aqiHistory.map(h => h.aqi));
        const minAQI = Math.min(...aqiHistory.map(h => h.aqi));

        const getAQIBadge = (aqi) => {
          if (aqi <= 50) return 'badge-green';
          if (aqi <= 100) return 'badge-yellow';
          if (aqi <= 150) return 'badge-orange';
          if (aqi <= 200) return 'badge-red';
          return 'badge-purple';
        };

        reportHTML += `
  <div class="section">
    <h2 class="section-title">📈 Air Quality History</h2>
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-value">${avgAQI}</div>
        <div class="stat-label">Average AQI</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${maxAQI}</div>
        <div class="stat-label">Maximum AQI</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${minAQI}</div>
        <div class="stat-label">Minimum AQI</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${aqiHistory.length}</div>
        <div class="stat-label">Total Records</div>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Location</th>
          <th>AQI</th>
          <th>Date & Time</th>
        </tr>
      </thead>
      <tbody>
        ${aqiHistory.slice(0, 20).map(record => `
          <tr>
            <td>${record.location}</td>
            <td><span class="badge ${getAQIBadge(record.aqi)}">${record.aqi}</span></td>
            <td>${new Date(record.timestamp).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ${aqiHistory.length > 20 ? `<p style="margin-top: 10px; color: #6B7280; font-size: 14px;">Showing 20 most recent records out of ${aqiHistory.length} total</p>` : ''}
  </div>`;
      }

      // Active Alerts
      if (userAlerts.length > 0) {
        reportHTML += `
  <div class="section">
    <h2 class="section-title">🔔 Recent Alerts</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Location</th>
          <th>AQI</th>
          <th>Message</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${userAlerts.slice(0, 15).map(alert => `
          <tr>
            <td>${alert.location}</td>
            <td><span class="badge badge-red">${alert.aqi}</span></td>
            <td>${alert.message}</td>
            <td>${new Date(alert.createdAt).toLocaleDateString()}</td>
            <td>${alert.isRead ? '✅ Read' : '📩 Unread'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
      }

      // Health Conditions & Recommendations
      if (user.preferences?.healthConditions?.length > 0) {
        reportHTML += `
  <div class="section">
    <h2 class="section-title">💊 Health Profile</h2>
    <div class="info-item">
      <div class="info-label">Declared Health Conditions</div>
      <div class="info-value">${user.preferences.healthConditions.join(', ')}</div>
    </div>
    <div style="margin-top: 20px; padding: 15px; background: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 8px;">
      <p style="color: #92400E;"><strong>⚠️ Important:</strong> Please consult with your healthcare provider for personalized medical advice. This report is for informational purposes only.</p>
    </div>
  </div>`;
      }

      reportHTML += `
  <div class="footer">
    <p><strong>ThermoAQ</strong> - Advanced Environmental Monitoring System</p>
    <p>This report contains ${aqiHistory.length} historical records and ${userAlerts.length} alerts</p>
    <p style="margin-top: 10px; font-size: 12px;">
      Data sources: WeatherAPI, Real-time AQI Monitoring, User Activity Logs
    </p>
  </div>
</body>
</html>`;

      // Create and download the file
      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ThermoAQ-Report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Also offer to print (which can save as PDF)
      setTimeout(() => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(reportHTML);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }, 500);

    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const generateCSVReport = async () => {
    setGenerating(true);
    try {
      const history = await authAPI.getAQIHistory();
      const aqiHistory = history.history || [];
      
      // Create CSV content
      let csvContent = 'Location,AQI,Date,Time\n';
      
      aqiHistory.forEach(record => {
        const date = new Date(record.timestamp);
        csvContent += `"${record.location}",${record.aqi},"${date.toLocaleDateString()}","${date.toLocaleTimeString()}"\n`;
      });

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ThermoAQ-Data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Failed to generate CSV. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (reportType === 'comprehensive') {
      generatePDFReport();
    } else {
      generateCSVReport();
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Download Report</h2>
          <p className="text-sm text-slate-400 mt-1">
            Export your environmental data and insights
          </p>
        </div>
        <FileText className="w-8 h-8 text-blue-400" />
      </div>

      {/* Report Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Report Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setReportType('comprehensive')}
            className={`p-4 rounded-lg border transition-all ${
              reportType === 'comprehensive'
                ? 'bg-blue-500/20 border-blue-500/50 text-white'
                : 'bg-slate-700/30 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5" />
              <span className="font-semibold">Comprehensive Report</span>
            </div>
            <p className="text-xs text-slate-400">
              Full HTML report with charts, stats, and recommendations (Print to PDF)
            </p>
          </button>

          <button
            onClick={() => setReportType('csv')}
            className={`p-4 rounded-lg border transition-all ${
              reportType === 'csv'
                ? 'bg-blue-500/20 border-blue-500/50 text-white'
                : 'bg-slate-700/30 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-5 h-5" />
              <span className="font-semibold">CSV Data Export</span>
            </div>
            <p className="text-xs text-slate-400">
              Raw data in CSV format for Excel or other analysis tools
            </p>
          </button>
        </div>
      </div>

      {/* Report Contents Info */}
      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-white/10">
        <h3 className="text-sm font-semibold text-white mb-2">Report Includes:</h3>
        <ul className="space-y-1 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>User profile and preferences</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>All monitored locations with alert settings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Complete AQI history with trends analysis</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Active and historical alerts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Health conditions and recommendations</span>
          </li>
        </ul>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={generating}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all ${
          generating
            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {generating ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Generating Report...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download {reportType === 'comprehensive' ? 'Full Report' : 'CSV Data'}</span>
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 text-center mt-3">
        {reportType === 'comprehensive' 
          ? 'Report will open in a new window. Use your browser\'s print function to save as PDF.'
          : 'CSV file will be downloaded to your default downloads folder.'
        }
      </p>
    </div>
  );
}
