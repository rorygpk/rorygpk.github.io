import React, { useState } from 'react';
import { Navigation, MapPin, Search, Car, Train, Bike, Footprints, Sparkles, Globe } from 'lucide-react';

export const GoogleMapsWidget: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'search' | 'route'>('search');
  const [mapEngine, setMapEngine] = useState<'google' | 'osm' | 'amap'>('google');
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number }>({ lat: 39.9042, lng: 116.4074 });
  
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
          const latVal = position.coords.latitude;
          const lngVal = position.coords.longitude;
          setLocation({ lat: latVal, lng: lngVal });
          setMapCoords({ lat: latVal, lng: lngVal });
          setIsLocating(false);
          // If we are in search mode and have no query, we show location
          if (activeTab === 'search' && !searchQuery) {
            setSearchQuery(`${latVal},${lngVal}`);
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

  const [placeIntro, setPlaceIntro] = useState<string | null>(null);
  const [isFetchingIntro, setIsFetchingIntro] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const trimmedQuery = searchInput.trim();
      setSearchQuery(trimmedQuery);
      setUseRouting(false);
      setPlaceIntro(null);
      setIsFetchingIntro(true);
      
      // Coordinate lookup via OpenStreetMap Nominatim for fallback/OSM centering
      try {
        const resCoords = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmedQuery)}`);
        const dataCoords = await resCoords.json();
        if (dataCoords && dataCoords.length > 0) {
          setMapCoords({
            lat: parseFloat(dataCoords[0].lat),
            lng: parseFloat(dataCoords[0].lon)
          });
        }
      } catch (err) {
        console.error("OSM Geocoding failed", err);
      }

      try {
        const query = encodeURIComponent(trimmedQuery);
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`);
        const data = await response.json();
        if (data && data.extract) {
           setPlaceIntro(data.extract);
        } else {
           setPlaceIntro("No detailed introduction available for this specific location.");
        }
      } catch (err) {
        setPlaceIntro("Could not load introduction data.");
      } finally {
        setIsFetchingIntro(false);
      }
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

  let mapUrl = '';
  if (mapEngine === 'google') {
    if (activeTab === 'route' && useRouting && origin && destination) {
       mapUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&dirflg=${travelMode}&output=embed`;
    } else if (activeTab === 'search' && searchQuery) {
       mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&z=15&output=embed`;
    } else if (location) {
       mapUrl = `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;
    } else {
       mapUrl = "https://maps.google.com/maps?q=Beijing&output=embed";
    }
  } else if (mapEngine === 'osm') {
    const { lat, lng } = mapCoords;
    const delta = 0.015;
    mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`;
  } else if (mapEngine === 'amap') {
    if (searchQuery) {
      mapUrl = `https://m.amap.com/search/mapview/keywords=${encodeURIComponent(searchQuery)}`;
    } else if (location) {
      mapUrl = `https://m.amap.com/navigation/index/saddr=My%20Location&daddr=${location.lat},${location.lng}`;
    } else {
      mapUrl = `https://m.amap.com/search/mapview/keywords=%E5%8C%97%E4%BA%AC`;
    }
  }

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900 flex flex-col">
      {/* GNSS Header */}
      <div className="bg-blue-900/40 border-b border-blue-500/20 px-3 py-1.5 flex items-center justify-between gap-2 text-[10px] text-blue-400 font-bold tracking-widest shrink-0">
         <div className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-blue-500 blur-[1px] animate-pulse"></span>
           GLOBAL NAVIGATION SATELLITE SYSTEM (GNSS)
         </div>
         <button 
              onClick={requestLocation}
              disabled={isLocating}
              className="px-2 py-1 flex items-center gap-1 rounded bg-blue-900/50 hover:bg-blue-600/50 text-blue-300 transition border border-blue-500/30 text-[9px]"
          >
              <MapPin className="w-3 h-3" />
              {isLocating ? "Locating..." : "My Location"}
          </button>
      </div>

      {/* Network Engine Switcher Bar */}
      <div className="bg-slate-950 border-b border-white/5 px-3 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          Map Provider Switch (地图服务器切换):
        </span>
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-white/10 text-[9px] font-bold w-full sm:w-auto">
          <button
            onClick={() => setMapEngine('google')}
            className={`flex-1 sm:flex-none px-2.5 py-1 rounded transition-all ${mapEngine === 'google' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Google Maps (Requires VPN)
          </button>
          <button
            onClick={() => setMapEngine('osm')}
            className={`flex-1 sm:flex-none px-2.5 py-1 rounded transition-all ${mapEngine === 'osm' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            OpenStreetMap (No VPN)
          </button>
          <button
            onClick={() => setMapEngine('amap')}
            className={`flex-1 sm:flex-none px-2.5 py-1 rounded transition-all ${mapEngine === 'amap' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            高德地图 (Domestic Fast)
          </button>
        </div>
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

      {activeTab === 'search' && (isFetchingIntro || placeIntro) && (
        <div className="bg-slate-800 border-b border-white/10 p-3 shrink-0 flex flex-col gap-1 text-sm animate-fade-in relative shadow-md z-10">
          <h4 className="text-white font-bold flex items-center gap-2">
             <Sparkles className="w-4 h-4 text-amber-400" />
             About {searchQuery || "this place"}
          </h4>
          {isFetchingIntro ? (
             <div className="text-slate-400 text-xs py-2 animate-pulse">Loading location context from Wikipedia nodes...</div>
          ) : (
             <div className="text-slate-300 text-xs leading-relaxed max-h-32 overflow-y-auto pr-2 scrollbar-hide">
               {placeIntro}
             </div>
          )}
        </div>
      )}

      {/* Primary Map Display */}
      <iframe
        className="flex-grow w-full bg-slate-900"
        style={{ border: 0 }}
        src={mapUrl}
        allowFullScreen
        title="GPKOS Global Map Node"
      ></iframe>
    </div>
  );
};
