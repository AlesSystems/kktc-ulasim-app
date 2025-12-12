'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/src/lib/supabaseClient';

// Next.js'de Leaflet ikonlarının yüklenmeme sorununu düzelt
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface MapProps {
  startCoords?: [number, number] | null;
  endCoords?: [number, number] | null;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function MapUpdater({ routeCoordinates, onMapReady }: { routeCoordinates: [number, number][] | null, onMapReady: (map: L.Map) => void }) {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routeCoordinates, map]);

  return null;
}

export default function Map({ startCoords = null, endCoords = null }: MapProps) {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][] | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [findingLocation, setFindingLocation] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    async function fetchStops() {
      try {
        const { data, error } = await supabase
          .from('stops')
          .select('id, name, latitude, longitude');

        if (error) {
          console.error('Error fetching stops:', error);
        } else {
          setStops(data || []);
        }
      } catch (error) {
        console.error('Error fetching stops:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStops();
  }, []);

  useEffect(() => {
    async function fetchRoute() {
      if (!startCoords || !endCoords) {
        setRouteCoordinates(null);
        return;
      }

      try {
        const startLon = startCoords[1];
        const startLat = startCoords[0];
        const endLon = endCoords[1];
        const endLat = endCoords[0];

        const url = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes[0] && data.routes[0].geometry) {
          const coordinates: [number, number][] = data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
          );
          setRouteCoordinates(coordinates);
        } else {
          setRouteCoordinates(null);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        setRouteCoordinates(null);
      }
    }

    fetchRoute();
  }, [startCoords, endCoords]);

  const handleFindMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum servislerini desteklemiyor.');
      return;
    }

    setFindingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        // Find nearest stop
        if (stops.length > 0) {
          let nearestStop = stops[0];
          let minDistance = haversineDistance(latitude, longitude, stops[0].latitude, stops[0].longitude);

          stops.forEach((stop) => {
            const distance = haversineDistance(latitude, longitude, stop.latitude, stop.longitude);
            if (distance < minDistance) {
              minDistance = distance;
              nearestStop = stop;
            }
          });

          // Fly to bounds that include both user location and nearest stop
          if (mapInstance) {
            const bounds = L.latLngBounds([
              [latitude, longitude],
              [nearestStop.latitude, nearestStop.longitude]
            ]);
            mapInstance.flyToBounds(bounds, { padding: [100, 100], duration: 1.5 });
          }
        } else if (mapInstance) {
          // Just center on user location if no stops
          mapInstance.flyTo([latitude, longitude], 15, { duration: 1.5 });
        }

        setFindingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Konum alınamadı. Lütfen konum izinlerinizi kontrol edin.');
        setFindingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-solid border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">Harita Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={[35.1856, 33.3823]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stops.map((stop) => (
          <Marker key={stop.id} position={[stop.latitude, stop.longitude]}>
            <Popup>{stop.name}</Popup>
          </Marker>
        ))}
        {userLocation && (
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={50}
            pathOptions={{ 
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.4
            }}
          >
            <Popup>Konumunuz</Popup>
          </Circle>
        )}
        {routeCoordinates && (
          <Polyline 
            positions={routeCoordinates} 
            color="#3b82f6" 
            weight={4} 
            opacity={0.7}
          />
        )}
        <MapUpdater routeCoordinates={routeCoordinates} onMapReady={setMapInstance} />
      </MapContainer>
      
      {/* Find My Location Button */}
      <button
        onClick={handleFindMyLocation}
        disabled={findingLocation}
        className="absolute bottom-24 right-4 md:bottom-8 md:right-8 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 p-3 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 z-[2000] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ring-1 ring-zinc-200 dark:ring-zinc-700"
        title="Konumumu Bul"
      >
        {findingLocation ? (
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}
