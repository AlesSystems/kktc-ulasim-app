'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

export default function Map() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="h-screen w-full">
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
      </MapContainer>
    </div>
  );
}
