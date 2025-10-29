
export function WeatherInsights() {
  return (
    <div
      className="bg-[#1e2430] rounded-2xl p-8 relative overflow-hidden"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-3">Weather Insights</h2>
        <p className="text-gray-200 mb-6 max-w-md">
          Get detailed forecasts and weather analytics for better planning
        </p>
        <button className="bg-[#fb923c] hover:bg-[#f97316] text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}