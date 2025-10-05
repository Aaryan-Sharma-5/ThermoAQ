import landingPageImage from "../assets/images/landingPage.png";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";

const HomePage = () => {
  return (
    <>
      <div>
        <section className="relative h-screen overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${landingPageImage})`,
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <Header />
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 pt-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight">
                ThermoAQ
              </h1>

              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-12">
                India's live district-level danger map—combining IMD heat-wave
                alerts with real-time air-quality data to deliver instant,
                life-saving risk warnings.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                  View Live Map
                </button>
                <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Intelligent Environmental Monitoring
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Advanced AI-powered analytics and real-time data processing to
                protect communities across India
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">
                  Heat Wave Prediction
                </h3>
                <p className="text-gray-300 mb-4">
                  AI-powered algorithms analyze IMD data to predict heat waves
                  72 hours in advance with 95% accuracy.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• District-level precision mapping</li>
                  <li>• Temperature trend analysis</li>
                  <li>• Risk severity classification</li>
                </ul>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse delay-300"></div>
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">
                  AQI Analytics
                </h3>
                <p className="text-gray-300 mb-4">
                  Real-time processing of SAFAR network data with pollutant
                  source identification and health impact assessment.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• PM2.5, PM10, O3, CO monitoring</li>
                  <li>• Health advisory generation</li>
                  <li>• Pollution source tracking</li>
                </ul>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-orange-500 rounded-full animate-pulse delay-500"></div>
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">
                  Emergency Alerts
                </h3>
                <p className="text-gray-300 mb-4">
                  Automated alert system with SMS, email, and app notifications
                  for critical environmental conditions.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Multi-channel notifications</li>
                  <li>• Vulnerable population targeting</li>
                  <li>• Emergency service integration</li>
                </ul>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse delay-700"></div>
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">
                  Geospatial Mapping
                </h3>
                <p className="text-gray-300 mb-4">
                  Advanced GIS integration with satellite data for comprehensive
                  environmental risk visualization.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Interactive heat maps</li>
                  <li>• Satellite imagery overlay</li>
                  <li>• Population density analysis</li>
                </ul>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-full animate-pulse delay-900"></div>
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">
                  Predictive Analytics
                </h3>
                <p className="text-gray-300 mb-4">
                  Machine learning models for trend analysis and environmental
                  condition forecasting.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• 7-day weather forecasting</li>
                  <li>• Seasonal trend analysis</li>
                  <li>• Climate change impact modeling</li>
                </ul>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full animate-pulse delay-1100"></div>
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">
                  Data Integration
                </h3>
                <p className="text-gray-300 mb-4">
                  Seamless integration with multiple data sources for
                  comprehensive environmental monitoring.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• IMD weather data</li>
                  <li>• SAFAR AQI network</li>
                  <li>• Satellite imagery feeds</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                  700+
                </div>
                <div className="text-gray-300 text-sm">Districts Monitored</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                  24/7
                </div>
                <div className="text-gray-300 text-sm">Real-time Updates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-400 mb-2">
                  95%
                </div>
                <div className="text-gray-300 text-sm">Prediction Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                  1M+
                </div>
                <div className="text-gray-300 text-sm">Lives Protected</div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
