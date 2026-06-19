import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY !== '<your_maps_api_key>';

export const GoogleMapsWidget: React.FC = () => {
  // If no API key, use the simplified embed version that works for search
  if (!hasValidKey) {
    return (
      <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
          src="https://maps.google.com/maps?q=Beijing&output=embed"
          allowFullScreen
          title="GPKOS Global Map (No-API Mode)"
        ></iframe>
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black text-cyan-400 uppercase tracking-widest animate-pulse">
           Live Satellite Relay Active
        </div>
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
