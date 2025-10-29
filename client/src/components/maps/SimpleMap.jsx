import { useEffect, useRef } from 'react';

// Simple Map Component without external dependencies for debugging
export const SimpleAQIMap = ({ aqiData = [], selectedCity, onCitySelect, className = "" }) => {
  const mapRef = useRef(null);

  // Default city data if none provided
  const defaultCities = [
    { city: 'Mumbai', aqi: 64, coordinates: [19.0760, 72.8777] },
    { city: 'Delhi', aqi: 156, coordinates: [28.6139, 77.2090] },
    { city: 'Bangalore', aqi: 78, coordinates: [12.9716, 77.5946] },
    { city: 'Chennai', aqi: 89, coordinates: [13.0827, 80.2707] },
    { city: 'Kolkata', aqi: 124, coordinates: [22.5726, 88.3639] },
    { city: 'Hyderabad', aqi: 95, coordinates: [17.3850, 78.4867] }
  ];

  const cityData = aqiData.length > 0 ? aqiData : defaultCities;

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#10B981'; // Green
    if (aqi <= 100) return '#F59E0B'; // Yellow
    if (aqi <= 150) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  useEffect(() => {
    // Simple SVG-based map visualization
    if (mapRef.current) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', '0 0 400 300');
      svg.style.background = '#374151'; // Gray background
      
      // Add city markers
      cityData.forEach((city, index) => {
        const x = 50 + (index % 3) * 120;
        const y = 80 + Math.floor(index / 3) * 80;
        
        // Create marker circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '25');
        circle.setAttribute('fill', getAQIColor(city.aqi));
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('stroke-width', '2');
        circle.style.cursor = 'pointer';
        
        // Add AQI value text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y - 35);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = city.aqi;
        
        // Add city name text
        const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        nameText.setAttribute('x', x);
        nameText.setAttribute('y', y + 45);
        nameText.setAttribute('text-anchor', 'middle');
        nameText.setAttribute('fill', '#ffffff');
        nameText.setAttribute('font-size', '10');
        nameText.textContent = city.city;
        
        // Add click handler
        circle.addEventListener('click', () => {
          if (onCitySelect) {
            onCitySelect(city.city);
          }
        });
        
        // Highlight selected city
        if (selectedCity && city.city.toLowerCase() === selectedCity.toLowerCase()) {
          circle.setAttribute('stroke-width', '4');
          circle.setAttribute('stroke', '#60A5FA');
        }
        
        svg.appendChild(circle);
        svg.appendChild(text);
        svg.appendChild(nameText);
      });
      
      // Clear and add the new map
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(svg);
    }
  }, [cityData, selectedCity, onCitySelect]);

  return (
    <div className={`w-full h-full ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default SimpleAQIMap;