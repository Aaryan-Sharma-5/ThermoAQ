import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Working Leaflet Map Component
export const LeafletAQIMap = ({ aqiData = [], selectedCity, onCitySelect, className = "" }) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

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

  const createSimpleAQIMarker = (aqi, city) => {
    const color = getAQIColor(aqi);
    return L.divIcon({
      className: 'custom-aqi-marker',
      html: `
        <div style="
          background: ${color};
          color: ${aqi > 100 ? '#ffffff' : '#000000'};
          border: 3px solid #ffffff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        ">
          <div>${aqi}</div>
          <div style="font-size: 8px;">${city.slice(0,3)}</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current) {
      // Initialize the map
      leafletMapRef.current = L.map(mapRef.current, {
        center: [20.5937, 78.9629], // Center of India
        zoom: 5,
        zoomControl: true,
      });

      // Add tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current);
    }

    // Clear existing markers
    if (leafletMapRef.current) {
      leafletMapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          leafletMapRef.current.removeLayer(layer);
        }
      });

      // Add new markers
      cityData.forEach((cityInfo) => {
        const marker = L.marker(cityInfo.coordinates, {
          icon: createSimpleAQIMarker(cityInfo.aqi, cityInfo.city)
        }).addTo(leafletMapRef.current);

        // Add popup
        marker.bindPopup(`
          <div style="text-align: center; padding: 10px;">
            <h3 style="margin: 0 0 5px 0; font-weight: bold;">${cityInfo.city}</h3>
            <p style="margin: 0; color: ${getAQIColor(cityInfo.aqi)};">
              AQI: <strong>${cityInfo.aqi}</strong>
            </p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
              ${cityInfo.aqi <= 50 ? 'Good' : 
                cityInfo.aqi <= 100 ? 'Moderate' : 
                cityInfo.aqi <= 150 ? 'Unhealthy for Sensitive Groups' : 'Unhealthy'}
            </p>
          </div>
        `);

        // Add click handler
        marker.on('click', () => {
          if (onCitySelect) {
            onCitySelect(cityInfo.city);
          }
        });

        // Highlight selected city
        if (selectedCity && cityInfo.city.toLowerCase() === selectedCity.toLowerCase()) {
          marker.openPopup();
        }
      });
    }

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [cityData, selectedCity, onCitySelect]);

  return (
    <div className={`w-full h-full ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default LeafletAQIMap;