import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY !== '<your_maps_api_key>';

export const GoogleMapsWidget: React.FC = () => {
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);

  const [isLocating, setIsLocating] = React.useState(false);

  const requestLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        () => {
          console.error("Geolocation failed");
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  // If no API key, use the simplified embed version that works for search
  if (!hasValidKey) {
    const mapUrl = location
      ? `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`
      : "https://maps.google.com/maps?q=Beijing&output=embed";

    return (
      <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900 flex flex-col">
        <div className="p-2 flex justify-between items-center text-[10px] text-white/50 bg-slate-950 font-mono">
            <span>{location ? `LOCATED: ${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}` : "STATIC MAP"}</span>
            <button 
                onClick={requestLocation}
                disabled={isLocating}
                className="px-2 py-1 rounded bg-emerald-900/50 hover:bg-emerald-600/50 text-emerald-300 transition"
            >
                {isLocating ? "定位中..." : "手动定位"}
            </button>
        </div>
        <iframe
          className="flex-grow w-full"
          style={{ border: 0 }}
          src={mapUrl}
          allowFullScreen
          title="GPKOS Global Map (No-API Mode)"
        ></iframe>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat: 37.42, lng: -122.08 }}
          defaultZoom={12}
          mapId="FATSHAN_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          <AdvancedMarker position={{ lat: 37.42, lng: -122.08 }}>
            <Pin background="#ef4444" glyphColor="#fff" borderColor="#b91c1c" />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
};
