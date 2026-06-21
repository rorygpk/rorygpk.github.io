import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Navigation, MapPin, Search, Car, Train, Bike, Footprints } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY !== '<your_maps_api_key>';

export const GoogleMapsWidget: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'search' | 'route'>('search');
  
  // Search State
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Route State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelMode, setTravelMode] = useState('d'); // d: drive, w: walk, r: transit, b: bike
  const [useRouting, setUseRouting] = useState(false);

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
          // If we are in search mode and have no query, we show location
          if (activeTab === 'search' && !searchQuery) {
            setSearchQuery(`${position.coords.latitude},${position.coords.longitude}`);
            setSearchInput('My Location');
          }
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setUseRouting(false);
    }
  };

  const handleRouteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.trim() && destination.trim()) {
      setUseRouting(true);
    }
  };

  const clearRouting = () => {
    setUseRouting(false);
    setOrigin('');
    setDestination('');
  };

  // If no API key, use the simplified embed version that works for search
  if (!hasValidKey) {
    let mapUrl = '';
    
    if (activeTab === 'route' && useRouting && origin && destination) {
       mapUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&dirflg=${travelMode}&output=embed`;
    } else if (activeTab === 'search' && searchQuery) {
       mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&z=15&output=embed`;
    } else if (location) {
       mapUrl = `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;
    } else {
       mapUrl = "https://maps.google.com/maps?q=Beijing&output=embed";
    }

    return (
      <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900 flex flex-col">
        <div className="bg-blue-900/40 border-b border-blue-500/20 px-3 py-1.5 flex items-center justify-between gap-2 text-[10px] text-blue-400 font-bold tracking-widest shrink-0">
           <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 blur-[1px] animate-pulse"></span>
             GLOBAL NAVIGATION SATELLITE SYSTEM
           </div>
           <button 
                onClick={requestLocation}
                disabled={isLocating}
                className="px-2 py-1 flex items-center gap-1 rounded bg-blue-900/50 hover:bg-blue-600/50 text-blue-300 transition border border-blue-500/30"
            >
                <MapPin className="w-3 h-3" />
                {isLocating ? "Locating..." : "My Location"}
            </button>
        </div>
        
        {/* Navigation / Search Controller */}
        <div className="bg-slate-800 border-b border-white/10 p-3 shrink-0 flex flex-col gap-3">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('search')} 
              className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-2 transition ${activeTab === 'search' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
            >
              <Search className="w-3.5 h-3.5" /> Place Search
            </button>
            <button 
              onClick={() => setActiveTab('route')} 
              className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-2 transition ${activeTab === 'route' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
            >
              <Navigation className="w-3.5 h-3.5" /> Directions & Routing
            </button>
          </div>

          {activeTab === 'search' ? (
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search for a place (e.g. Eiffel Tower)..." 
                value={searchInput} 
                onChange={e => setSearchInput(e.target.value)} 
                className="flex-grow bg-slate-900 border border-white/10 rounded px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 text-sm"
              />
              <button type="submit" className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition text-sm flex items-center gap-2">
                Search
              </button>
            </form>
          ) : (
            <form onSubmit={handleRouteSearch} className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-2 items-center text-sm">
                <div className="flex-grow flex items-center w-full relative">
                   <div className="absolute left-2 w-2 h-2 rounded-full border-2 border-emerald-500 bg-transparent"></div>
                   <input 
                     type="text" 
                     placeholder="Origin (e.g. New York)" 
                     value={origin} 
                     onChange={e => setOrigin(e.target.value)} 
                     className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1.5 pl-6 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                   />
                </div>
                <div className="flex-grow flex items-center w-full relative">
                   <div className="absolute left-2 w-2 h-2 rounded-full border-2 border-rose-500 bg-transparent"></div>
                   <input 
                     type="text" 
                     placeholder="Destination (e.g. Boston)" 
                     value={destination} 
                     onChange={e => setDestination(e.target.value)} 
                     className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1.5 pl-6 text-white placeholder-slate-500 outline-none focus:border-rose-500"
                   />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex gap-1 bg-slate-900 p-1 rounded border border-white/5 w-full sm:w-auto overflow-x-auto shrink-0 scrollbar-hide">
                  <button type="button" onClick={() => setTravelMode('d')} className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition ${travelMode === 'd' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Car className="w-3.5 h-3.5"/> Drive</button>
                  <button type="button" onClick={() => setTravelMode('r')} className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition ${travelMode === 'r' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Train className="w-3.5 h-3.5"/> Transit</button>
                  <button type="button" onClick={() => setTravelMode('w')} className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition ${travelMode === 'w' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Footprints className="w-3.5 h-3.5"/> Walk</button>
                  <button type="button" onClick={() => setTravelMode('b')} className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition ${travelMode === 'b' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Bike className="w-3.5 h-3.5"/> Bike</button>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {useRouting && (
                    <button type="button" onClick={clearRouting} className="flex-1 sm:flex-none px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold transition text-sm">
                      Clear
                    </button>
                  )}
                  <button type="submit" className="flex-1 sm:flex-none px-6 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold transition text-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <Navigation className="w-4 h-4" /> Go
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <iframe
          className="flex-grow w-full bg-white"
          style={{ border: 0 }}
          src={mapUrl}
          allowFullScreen
          title="GPKOS Global Map (No-API Mode)"
        ></iframe>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
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

