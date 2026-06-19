import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY !== '<your_maps_api_key>';

export const GoogleMapsWidget: React.FC = () => {
  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Google Maps API Key Required</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          To enable integrated mapping, please add your Google Maps API key to the project secrets.
        </p>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-left text-xs space-y-2">
          <p><strong>Step 1:</strong> <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Get an API Key</a></p>
          <p><strong>Step 2:</strong> Add secret <code>GOOGLE_MAPS_PLATFORM_KEY</code> in Settings → Secrets.</p>
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
