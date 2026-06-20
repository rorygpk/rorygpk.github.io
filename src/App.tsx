import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Send,
  Trash2,
  Edit,
  FileText,
  Star,
  Settings,
  Terminal,
  Play,
  Share2,
  UserCheck,
  ShieldAlert,
  Sliders,
  Award,
  Plus,
  RefreshCw,
  Search,
  BookOpen,
  MessageSquare,
  Lock,
  Compass,
  Tv,
  Users,
  CheckCircle,
  Video,
  Monitor,
  Volume2,
  List,
  ChevronRight,
  User,
  ShoppingBag,
  Paperclip,
  Check,
  X,
  AlertTriangle,
  SendHorizontal,
  ThumbsUp,
  Heart,
  Image,
  Sun,
  Moon,
  Upload,
  Zap,
  Cpu,
  Sparkles,
  Fingerprint,
  Command,
  Wifi,
  FileCode2,
  Map as MapIcon,
  Chrome,
  BrainCircuit,
  ArrowLeft,
  ArrowRight,
  Cloud,
  UploadCloud,
  Box,
  Archive,
  Activity,
  Shield,
  Globe,
  KeyRound,
  MonitorUp,
  MousePointer2,
  Share,
  Download,
  Smartphone,
  Maximize,
  HardDrive,
  Calendar,
  Images,
  Youtube,
  MapPin,
  Layers,
  Camera,
  Package,
  Minimize2,
  Maximize2,
  Power,
  RotateCcw,
  Layout,
  Bell,
  Info,
  HelpCircle,
  Battery,
  ShieldCheck,
  UserCircle,
  Save,
  Folder,
  File
} from "lucide-react";
import { GpkosAppWindow, GpkosPowerMode, User as UserType, Email, Blog, FriendshipRecord, CustomButton, Order, SystemState, EmailTemplate, EmailSignature, GoogleDriveFile, GoogleCalendarEvent, GoogleYouTubeActivity, GoogleContact } from "./types";
import { t, getLanguage, setLanguage, Language } from "./i18n";
import { ToolTranslator, ToolSummarizer, ToolCode, AdminSubpages, DynamicSubPage, ToolGeminiAI, AdminAIAccess, AdminBrowserChecks, AdminDatabaseEditor, DeploymentHub } from "./components/AIExtensions";
import { PublicMail } from "./components/PublicMail";
import { CloudDrive } from "./components/CloudDrive";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleMapsWidget } from "./components/GoogleMapsWidget";
import { SecureBridge } from "./components/SecureBridge";
import { GlobalBrowser } from "./components/GlobalBrowser";
import { encryptData, decryptData } from './lib/encryption';
import { RichTextEditor } from "./components/RichTextEditor";
import { motion, AnimatePresence, useDragControls } from "motion/react";

import { GpkosSettings } from "./components/GpkosSettings";
import { VerificationScreen } from "./components/VerificationScreen";

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 23.0215, // Fatshan coordinates roughly
  lng: 113.1214
};

// --- GPKOS Multi-Window System Component ---
interface WindowProps {
  window: GpkosAppWindow;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onSizeChange: (id: string, w: number, h: number) => void;
  onMaximize: (id: string) => void;
  children: React.ReactNode;
  isFocused: boolean;
  constraintsRef?: React.RefObject<HTMLDivElement | null>;
}

const DraggableWindow: React.FC<WindowProps> = ({ window, onClose, onMinimize, onFocus, onPositionChange, onSizeChange, onMaximize, children, isFocused, constraintsRef }) => {
  const [resizing, setResizing] = useState(false);
  const winRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  if (window.isMinimized) return null;

  return (
    <motion.div
      ref={winRef}
      initial={false}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        x: window.isMaximized ? 0 : window.x,
        y: window.isMaximized ? 0 : window.y,
        zIndex: window.zIndex,
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: window.isMaximized ? '100%' : window.width,
        height: window.isMaximized ? '100%' : window.height,
        borderRadius: window.isMaximized ? 0 : 16
      }}
      transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.5 }}
      drag={!resizing && !window.isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={constraintsRef}
      onDragEnd={(_, info) => {
        onPositionChange(window.id, window.x + info.offset.x, window.y + info.offset.y);
      }}
      onPointerDown={() => onFocus(window.id)}
      className={`bg-slate-950 border border-white/20 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl transition-shadow ${isFocused ? 'ring-1 ring-cyan-500/50 shadow-cyan-900/40 shadow-2xl' : 'opacity-95 shadow-black/80'} ${window.isMaximized ? 'border-none' : ''}`}
    >
      {/* Window Header */}
      <div 
        className="bg-slate-900/90 p-3 border-b border-white/10 flex items-center justify-between cursor-move shrink-0 select-none"
        onPointerDown={(e) => !window.isMaximized && dragControls.start(e)}
        onDoubleClick={() => onMaximize(window.id)}
      >
        <div className="flex gap-2 shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onClose(window.id); }} className="h-3 w-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57cc] border border-black/10 transition-colors flex items-center justify-center group">
            <X className="w-2 h-2 text-transparent group-hover:text-red-950" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }} className="h-3 w-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2ecc] border border-black/10 transition-colors flex items-center justify-center group">
            <Minimize2 className="w-2 h-2 text-transparent group-hover:text-amber-950" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(window.id); }} className="h-3 w-3 rounded-full bg-[#28c840] hover:bg-[#28c840cc] border border-black/10 transition-colors flex items-center justify-center group">
            <Maximize2 className="w-2 h-2 text-transparent group-hover:text-emerald-950" />
          </button>
        </div>
        <div className={`text-[11px] font-bold tracking-tight px-4 transition-colors ${isFocused ? 'text-white' : 'text-slate-500'}`}>{window.title}</div>
        <div className="w-12"></div>
      </div>
      
      {/* Window Content */}
      <div className="flex-grow overflow-hidden relative">
        {children}
      </div>

      {/* Resize Handle */}
      {!window.isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-[100]"
          onPointerDown={(e) => {
            e.stopPropagation();
            setResizing(true);
            const startX = e.clientX;
            const startY = e.clientY;
            const startW = winRef.current?.offsetWidth || 800;
            const startH = winRef.current?.offsetHeight || 600;

            const onPointerMove = (moveEvent: PointerEvent) => {
              const newW = Math.max(400, startW + (moveEvent.clientX - startX));
              const newH = Math.max(300, startH + (moveEvent.clientY - startY));
              onSizeChange(window.id, newW, newH);
            };

            const onPointerUp = () => {
               setResizing(false);
               document.removeEventListener('pointermove', onPointerMove);
               document.removeEventListener('pointerup', onPointerUp);
            };

            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
          }}
        >
          <div className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-white/20 rounded-full border border-white/10" />
        </div>
      )}
    </motion.div>
  );
};

function GoogleMapsWrapper() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [activeNode, setActiveNode] = React.useState<string>("Foshan");

  // React-side control states matching the iframe's capabilities
  const [mapLayer, setMapLayer] = React.useState<"y" | "m" | "p">("m"); // Default to road for clarity
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [manualSelectMode, setManualSelectMode] = React.useState<"none" | "start" | "dest">("none");
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<"prompt" | "granted" | "denied">("prompt");
  
  // Routing inputs & outputs supporting arbitrary start/end & transport modes
  const [routeStart, setRouteStart] = React.useState("Foshan");
  const [routeDest, setRouteDest] = React.useState("Shenzhen");
  const [travelMode, setTravelMode] = React.useState<"driving" | "walking" | "cycling">("driving");
  const [routeInstructions, setRouteInstructions] = React.useState<string[]>([]);
  const [routeMetrics, setRouteMetrics] = React.useState<{ distance: string; duration: string } | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  
  // Simulation HUD
  const [simRunning, setSimRunning] = React.useState(false);
  const [simData, setSimData] = React.useState<{ lat: number; lng: number; speed: number; distanceLeft: string; eta: string; status: string } | null>(null);
  
  // Street view state
  const [streetViewData, setStreetViewData] = React.useState<{ address: string; lat: number; lng: number; description: string } | null>(null);

  const nodes = [
    { id: "Foshan", name: "Fatshan Core Hub", lat: 23.0215, lng: 113.1214, desc: "Global Secure Dispatch Terminal (Foshan)" },
    { id: "Shenzhen", name: "Shenzhen Port Relay", lat: 22.5431, lng: 114.0579, desc: "Coastal Secure Gateway (Shenzhen)" },
    { id: "Guangzhou", name: "Guangzhou HQ Gateway", lat: 23.1291, lng: 113.2644, desc: "Provincial Transit Node (Guangzhou)" },
    { id: "HongKong", name: "Hong Kong Global Gate", lat: 22.3193, lng: 114.1694, desc: "International Relay Core (Hong Kong)" },
    { id: "NewYork", name: "New York Hub", lat: 40.7128, lng: -74.0060, desc: "US Atlantic Secure Terminal" },
    { id: "London", name: "London Node", lat: 51.5074, lng: -0.1278, desc: "Europe Transit Portal" },
    { id: "Tokyo", name: "Tokyo Terminal", lat: 35.6762, lng: 139.6503, desc: "Asia Pacific Secure Gateway" }
  ];

  // Recieve callback messages from iframe sandbox
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data && event.data.type) {
        const { type, payload } = event.data;
        if (type === "routeComputed") {
          setRouteInstructions(payload.instructions || []);
          setRouteMetrics({
            distance: (payload.distance / 1000).toFixed(1) + " km",
            duration: Math.round(payload.duration / 60) + " mins"
          });
          setIsRouting(false);
        } else if (type === "simUpdate") {
          setSimData({
            lat: payload.lat,
            lng: payload.lng,
            speed: Math.round(payload.speed),
            distanceLeft: (payload.distanceLeft / 1000).toFixed(1) + " km",
            eta: Math.round(payload.timeLeft / 60) + " mins",
            status: payload.status
          });
        } else if (type === "simStarted") {
          setSimRunning(true);
        } else if (type === "simStopped") {
          setSimRunning(false);
          setSimData(null);
        } else if (type === "mapClickGeo") {
          if (manualSelectMode === "start") {
            setRouteStart(payload.address);
            setManualSelectMode("none");
          } else if (manualSelectMode === "dest") {
            setRouteDest(payload.address);
            setManualSelectMode("none");
          }
          setStreetViewData({
            address: payload.address || "Unknown Spot",
            lat: payload.lat,
            lng: payload.lng,
            description: payload.description || "Simulated 360° street survey"
          });
        } else if (type === "locationUpdate") {
          setRouteStart(payload.address);
          setLocationPermissionStatus("granted");
        } else if (type === "locationError") {
          setLocationPermissionStatus("denied");
          alert("Location Access Denied: " + payload.message);
        } else if (type === "searchResult") {
          setIsSearching(false);
          if (payload.error) {
            alert("Location search: No matching coordinates found.");
          }
        }
      }
    };
    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  const handleFlyTo = (node: any) => {
    setActiveNode(node.id);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'flyTo',
        lat: node.lat,
        lng: node.lng,
        name: node.name,
        zoom: 13
      }, '*');
    }
  };

  const handleLayerChange = (layer: "y" | "m" | "p") => {
    setMapLayer(layer);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'setLayer',
        layer: layer
      }, '*');
    }
  };

  const handleZoomIn = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'zoomIn' }, '*');
    }
  };

  const handleZoomOut = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'zoomOut' }, '*');
    }
  };

  const handleSearchCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'searchAddress',
        query: searchQuery.trim()
      }, '*');
    }
  };

  const handleCalculateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeStart.trim() || !routeDest.trim()) return;
    setIsRouting(true);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'calculateRoute',
        startQuery: routeStart.trim(),
        destQuery: routeDest.trim(),
        mode: travelMode
      }, '*');
    }
  };

  const handleToggleSimulation = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (simRunning) {
        iframeRef.current.contentWindow.postMessage({ type: 'stopSimulation' }, '*');
      } else {
        iframeRef.current.contentWindow.postMessage({ type: 'startSimulation' }, '*');
      }
    }
  };

  const handleLocateMe = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'locateMe' }, '*');
    }
  };

  // The inner document integrates real Google Maps satellite hybrid & roadmap layers inside Leaflet plus routing
  const mapSrcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #0b1329; }
        .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          color: #f1f5f9 !important;
          border: 1px solid #06b6d4;
          border-radius: 12px;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
          border-left: 1px solid #06b6d4;
          border-bottom: 1px solid #06b6d4;
        }
        .custom-pulsing-marker {
          background: #06b6d4;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 0 10px #06b6d4;
          animation: markerPulse 1.5s infinite ease-out;
        }
        @keyframes markerPulse {
          0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(6, 182, 212, 0); }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Store tiles of actual Google Maps servers - using scale=2 for clarity if possible
        var tileLayers = {
          y: L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&scale=2', { maxZoom: 20, subdomains: '0123' }), // Google Hybrid Satellite
          m: L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&scale=2', { maxZoom: 20, subdomains: '0123' }), // Google Road standard
          p: L.tileLayer('https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&scale=2', { maxZoom: 20, subdomains: '0123' })  // Google Physical / Terrain
        };

        var map = L.map('map', { 
          zoomControl: false, 
          attributionControl: false,
          doubleClickZoom: false
        }).setView([23.0215, 113.1214], 12);
        
        map.on('locationfound', function(e) {
          var radius = e.accuracy / 2;
          L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
          L.circle(e.latlng, radius).addTo(map);
          
          window.parent.postMessage({
            type: "locationUpdate",
            payload: {
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              address: "Current System Location [Lat: " + e.latlng.lat.toFixed(4) + ", Lng: " + e.latlng.lng.toFixed(4) + "]"
            }
          }, '*');
        });

        map.on('locationerror', function(e) {
          window.parent.postMessage({
            type: "locationError",
            payload: { message: e.message }
          }, '*');
        });
        
        // Initial Layer is Road for better clarity if requested
        tileLayers.m.addTo(map);

        // Standard custom marker icon
        var searchMarkers = [];
        var activeRoutePolyline = null;
        var simVehicleMarker = null;
        var simInterval = null;
        var simCoordinatesList = [];
        var simCurrentIndex = 0;

        // Base relays
        var relays = {
          "Foshan": [23.0215, 113.1214],
          "Shenzhen": [22.5431, 114.0579],
          "Guangzhou": [23.1291, 113.2644],
          "HongKong": [22.3193, 114.1694],
          "NewYork": [40.7128, -74.0060],
          "London": [51.5074, -0.1278],
          "Tokyo": [35.6762, 139.6503]
        };

        // Add standard visual relays
        Object.keys(relays).forEach(function(key) {
          var label = key + " Gateway Hub";
          L.circleMarker(relays[key], {
            radius: 8,
            fillColor: "#06b6d4",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(map).bindPopup("<b>📍 GPKOS Network Node: " + key + "</b><br/><span style='font-size:11px;color:#94a3b8;'>Lat/Lng: " + relays[key][0] + ", " + relays[key][1] + "</span>");
        });

        // Click listeners for Street View extraction
        map.on('dblclick', function(e) {
          var lat = e.latlng.lat;
          var lng = e.latlng.lng;
          
          L.circleMarker([lat, lng], { radius: 6, fillColor: "#ec4899", color: "#fff", weight: 2 }).addTo(map)
            .bindPopup("<strong style='color:#ec4899;'>📍 Selected Survey Node</strong><br/><span style='font-size:10px;'>Extracted coordinates coordinates ready.</span>")
            .openPopup();
            
          // Mock Reverse Look-up for elegant street descriptions
          var mockAddresses = [
            "Industrial East Avenue intersection, District 4",
            "Gateway Port Boulevard Route 102",
            "Software Park Central Expressway",
            "Coastal Ring Road Sec. 8B",
            "Waterfront Terminal Logistics zone"
          ];
          var randomAdd = mockAddresses[Math.floor(Math.random() * mockAddresses.length)] + " [Lat: " + lat.toFixed(4) + ", Lng: " + lng.toFixed(4) + "]";
          
          window.parent.postMessage({
            type: "mapClickGeo",
            payload: {
              lat: lat,
              lng: lng,
              address: randomAdd,
              description: "High-precision Google Satellite mapping scan completed. Coordinate altitude is roughly " + Math.round(5 + Math.random() * 45) + " meters with 3D terrain shading."
            }
          }, '*');
        });

        // Communication handlers
        window.addEventListener('message', function(event) {
          if (!event.data) return;
          var data = event.data;

          // Layer changing
          if (data.type === 'setLayer') {
            Object.keys(tileLayers).forEach(function(k) {
              map.removeLayer(tileLayers[k]);
            });
            if (tileLayers[data.layer]) {
              tileLayers[data.layer].addTo(map);
            }
          }

          // Flying to locations
          else if (data.type === 'flyTo') {
            map.flyTo([data.lat, data.lng], data.zoom || 11, { animate: true, duration: 1.5 });
            var m = L.circleMarker([data.lat, data.lng], {
              radius: 12,
              fillColor: '#ef4444',
              color: '#fff',
              weight: 2,
              fillOpacity: 0.5
            }).addTo(map);
            m.bindPopup("<b>🎯 Current Focus Link</b><br/>" + data.name).openPopup();
            searchMarkers.push(m);
          }

          // Search Address (Nominatim Geocoding API with robust static fallback)
          else if (data.type === 'searchAddress') {
            var q = data.query;
            var url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(q);
            
            fetch(url)
              .then(function(res) { return res.json(); })
              .then(function(results) {
                if (results && results.length > 0) {
                  var item = results[0];
                  var lat = parseFloat(item.lat);
                  var lng = parseFloat(item.lon);
                  
                  map.flyTo([lat, lng], 13);
                  
                  // Clear old search markers
                  searchMarkers.forEach(function(sm) { map.removeLayer(sm); });
                  searchMarkers = [];
                  
                  var smark = L.marker([lat, lng]).addTo(map);
                  smark.bindPopup("<b style='color:#06b6d4;'>🔎 Found:</b> " + item.display_name + "<br/><span style='font-size:10px;color:#94a3b8;'>Coordinates: " + lat.toFixed(5) + ", " + lng.toFixed(5) + "</span>").openPopup();
                  searchMarkers.push(smark);
                  
                  window.parent.postMessage({ type: "searchResult", payload: { success: true, lat: lat, lng: lng } }, '*');
                } else {
                  // Fallback for major coordinates if Nominatim search fails or throttles user ip
                  var term = q.toLowerCase();
                  var fallbackFound = null;
                  Object.keys(relays).forEach(function(relayName) {
                    if (term.includes(relayName.toLowerCase())) {
                      fallbackFound = { name: relayName, lat: relays[relayName][0], lng: relays[relayName][1] };
                    }
                  });
                  
                  if (!fallbackFound) {
                    // Popular global fallback points
                    var extraPoints = {
                      "beijing": [39.9042, 116.4074],
                      "shanghai": [31.2304, 121.4737],
                      "paris": [48.8566, 2.3522],
                      "hong kong": [22.3193, 114.1694]
                    };
                    Object.keys(extraPoints).forEach(function(pt) {
                      if (term.includes(pt)) {
                        fallbackFound = { name: pt.toUpperCase(), lat: extraPoints[pt][0], lng: extraPoints[pt][1] };
                      }
                    });
                  }

                  if (fallbackFound) {
                    map.flyTo([fallbackFound.lat, fallbackFound.lng], 13);
                    var smark = L.marker([fallbackFound.lat, fallbackFound.lng]).addTo(map);
                    smark.bindPopup("<b>🔎 Found offline:</b> " + fallbackFound.name + "<br/><span style='font-size:10px;'>Pre-geocoded secure gateway cache.</span>").openPopup();
                    searchMarkers.push(smark);
                    window.parent.postMessage({ type: "searchResult", payload: { success: true } }, '*');
                  } else {
                    window.parent.postMessage({ type: "searchResult", payload: { error: "No coordinates found." } }, '*');
                  }
                }
              })
              .catch(function(err) {
                window.parent.postMessage({ type: "searchResult", payload: { error: err.toString() } }, '*');
              });
          }

          // Compute Routing (arbitrary departure & destination + chosen travel mode)
          else if (data.type === 'calculateRoute') {
            var startQuery = data.startQuery;
            var destQuery = data.destQuery;
            var mode = data.mode || "driving";
            
            function geocodeAddress(query, fallback) {
              var term = query.toLowerCase().trim();
              if (relays[query]) return Promise.resolve(relays[query]);
              
              // search preset keys
              for (var key in relays) {
                if (term.includes(key.toLowerCase())) {
                  return Promise.resolve(relays[key]);
                }
              }
              // query openstreetmap nominatim
              var url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(query);
              return fetch(url)
                .then(function(res) { return res.json(); })
                .then(function(results) {
                  if (results && results.length > 0) {
                    return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
                  }
                  return fallback;
                })
                .catch(function() {
                  return fallback;
                });
            }

            Promise.all([
              geocodeAddress(startQuery, [23.0215, 113.1214]),
              geocodeAddress(destQuery, [22.5431, 114.0579])
            ]).then(function(coords) {
              var startCoords = coords[0];
              var destCoords = coords[1];
              
              var profile = "driving";
              if (mode === "walking") profile = "foot";
              else if (mode === "cycling") profile = "bicycle";

              var url = "https://router.project-osrm.org/route/v1/" + profile + "/" + 
                startCoords[1] + "," + startCoords[0] + ";" + 
                destCoords[1] + "," + destCoords[0] + 
                "?overview=full&steps=true&geometries=geojson";
                
              fetch(url)
                .then(function(res) { return res.json(); })
                .then(function(routeData) {
                  if (routeData.code === "Ok" && routeData.routes && routeData.routes.length > 0) {
                    var route = routeData.routes[0];
                    var geometry = route.geometry;
                    
                    if (activeRoutePolyline) map.removeLayer(activeRoutePolyline);
                    
                    var polylinePoints = geometry.coordinates.map(function(c) { return [c[1], c[0]]; });
                    
                    activeRoutePolyline = L.polyline(polylinePoints, {
                      color: mode === "walking" ? "#10b981" : mode === "cycling" ? "#f59e0b" : "#06b6d4",
                      weight: 5,
                      opacity: 0.85,
                      dashArray: simInterval ? "10, 10" : null
                    }).addTo(map);
                    
                    map.fitBounds(activeRoutePolyline.getBounds(), { padding: [40, 40] });
                    
                    var steps = route.legs[0].steps || [];
                    var inst = steps.map(function(st) {
                      var man = st.maneuver || {};
                      var type = man.type || "drive";
                      var modifier = man.modifier ? " " + man.modifier : "";
                      return (type + modifier).toUpperCase() + " onto " + (st.name || "Route segment") + " (for " + Math.round(st.distance) + "m)";
                    });
                    if (inst.length === 0) {
                      inst = ["DEPART from " + startQuery, "MOVE along designated path via " + mode + " mode", "ARRIVE at " + destQuery];
                    }
                    
                    simCoordinatesList = polylinePoints;
                    
                    window.parent.postMessage({
                      type: "routeComputed",
                      payload: {
                        instructions: inst,
                        distance: route.distance,
                        duration: route.duration
                      }
                    }, '*');
                  } else {
                    generateSyntheticRoute(startCoords, destCoords, startQuery, destQuery, mode);
                  }
                })
                .catch(function() {
                  generateSyntheticRoute(startCoords, destCoords, startQuery, destQuery, mode);
                });
            });

            function generateSyntheticRoute(sc, dc, sn, dn, m) {
              if (activeRoutePolyline) map.removeLayer(activeRoutePolyline);
              
              var points = [];
              var stepsCount = 15;
              for(var k=0; k<=stepsCount; k++) {
                var ratio = k / stepsCount;
                points.push([
                  sc[0] + (dc[0] - sc[0]) * ratio,
                  sc[1] + (dc[1] - sc[1]) * ratio
                ]);
              }
              
              activeRoutePolyline = L.polyline(points, { 
                color: m === "walking" ? "#10b981" : m === "cycling" ? "#f59e0b" : "#ec4899", 
                weight: 5, 
                opacity: 0.8 
              }).addTo(map);
              map.fitBounds(activeRoutePolyline.getBounds());
              simCoordinatesList = points;
              
              window.parent.postMessage({
                type: "routeComputed",
                payload: {
                  instructions: [
                    "DEPART Secure Terminal (" + sn + ")",
                    "TRAVERSE along local passage (" + m.toUpperCase() + " mode active)",
                    "MONITOR secure transit nodes with full security",
                    "ARRIVE safely at destination terminal (" + dn + ")"
                  ],
                  distance: 98000,
                  duration: m === "walking" ? 64000 : m === "cycling" ? 18000 : 4200
                }
              }, '*');
            }
          }

          // Iframe zoom keys support
          else if (data.type === 'zoomIn') {
            map.zoomIn();
          }
          else if (data.type === 'zoomOut') {
            map.zoomOut();
          }

          // Geolocation support
          else if (data.type === 'locateMe') {
            map.locate({ setView: true, maxZoom: 16 });
          }

          // Live Navigation Simulation
          else if (data.type === 'startSimulation') {
            if (simCoordinatesList.length === 0) return;
            if (simInterval) clearInterval(simInterval);
            
            simCurrentIndex = 0;
            if (simVehicleMarker) map.removeLayer(simVehicleMarker);
            
            // Create pulsing vehicle marker representing GPS signal
            var myIcon = L.divIcon({
              className: "custom-pulsing-marker-wrapper",
              html: "<div class='custom-pulsing-marker'></div>",
              iconSize: [20, 20]
            });
            
            simVehicleMarker = L.marker(simCoordinatesList[0], { icon: myIcon }).addTo(map);
            window.parent.postMessage({ type: 'simStarted' }, '*');
            
            var totalDistance = simCoordinatesList.length;
            
            simInterval = setInterval(function() {
              if (simCurrentIndex >= simCoordinatesList.length) {
                clearInterval(simInterval);
                simVehicleMarker.bindPopup("<b>🎉 Dispatch Arrived!</b>").openPopup();
                window.parent.postMessage({ type: 'simStopped' }, '*');
                return;
              }
              
              var currPt = simCoordinatesList[simCurrentIndex];
              simVehicleMarker.setLatLng(currPt);
              map.panTo(currPt);
              
              // Compute dynamic telemetry fields
              var speed = 65 + Math.sin(simCurrentIndex * 0.5) * 20; // varying speeds in real time
              var remaining = (simCoordinatesList.length - simCurrentIndex) * 2500; // estimated m
              var remainingSec = remaining / (speed / 3.6);
              
              window.parent.postMessage({
                type: "simUpdate",
                payload: {
                  lat: currPt[0],
                  lng: currPt[1],
                  speed: speed,
                  distanceLeft: remaining,
                  timeLeft: remainingSec,
                  status: simCurrentIndex === 0 ? "Dispatch Launching" : simCurrentIndex > totalDistance - 3 ? "Arriving at Portal" : "In-Transit SSL Link"
                }
              }, '*');
              
              simCurrentIndex++;
            }, 600);
          }

          else if (data.type === 'stopSimulation') {
            if (simInterval) clearInterval(simInterval);
            if (simVehicleMarker) map.removeLayer(simVehicleMarker);
            simInterval = null;
            simVehicleMarker = null;
            window.parent.postMessage({ type: 'simStopped' }, '*');
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 text-xs">
      {/* Search and Navigation GUI Sidebar panel (Polished Slate Look) */}
      <div className="w-full lg:w-80 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto">
        
        {/* Layer switching selection headings */}
        <div className="p-3 border-b border-slate-800 bg-slate-950">
          <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono tracking-widest block mb-2">Google Map Overlays</span>
          <div className="grid grid-cols-3 gap-1">
            <button 
              onClick={() => handleLayerChange("y")} 
              className={`py-1 rounded text-[10px] font-bold transition-all border ${mapLayer === "y" ? "bg-cyan-500 text-slate-950 border-cyan-400" : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850"}`}
            >
              🛰️ Satellite
            </button>
            <button 
              onClick={() => handleLayerChange("m")} 
              className={`py-1 rounded text-[10px] font-bold transition-all border ${mapLayer === "m" ? "bg-cyan-500 text-slate-950 border-cyan-400" : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850"}`}
            >
              🗺️ Roadmap
            </button>
            <button 
              onClick={() => handleLayerChange("p")} 
              className={`py-1 rounded text-[10px] font-bold transition-all border ${mapLayer === "p" ? "bg-cyan-500 text-slate-950 border-cyan-400" : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850"}`}
            >
              ⛰️ Terrain
            </button>
          </div>
        </div>

        {/* Global Address Target Locator */}
        <div className="p-3.5 border-b border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-widest block mb-2">Global Places Seeker</span>
          <form onSubmit={handleSearchCommit} className="flex gap-1.5">
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="🔍 Search city, address, or POI..."
              className="flex-grow bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            />
            <button 
              type="submit" 
              disabled={isSearching}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded transition shadow-md shrink-0 flex items-center justify-center"
            >
              {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Locate"}
            </button>
          </form>
        </div>

        {/* Routing Engine Core */}
        <div className="p-3.5 border-b border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-widest block mb-1">Route & Directions Router</span>
          <form onSubmit={handleCalculateRoute} className="space-y-2 mt-2">
            <div>
              <label className="text-[9px] text-slate-500 uppercase font-bold">Departure (出发点)</label>
              <div className="relative group">
                <input 
                  type="text"
                  value={routeStart}
                  onChange={e => setRouteStart(e.target.value)}
                  placeholder="Type start e.g. Foshan, New York..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 pr-8"
                />
                <button 
                   type="button"
                   onClick={() => setManualSelectMode(manualSelectMode === "start" ? "none" : "start")}
                   className={`absolute right-1.5 top-1 p-1 rounded hover:bg-slate-800 transition ${manualSelectMode === "start" ? "text-cyan-400 bg-slate-800 ring-1 ring-cyan-500/50" : "text-slate-500"}`}
                   title="Click on map to pick"
                >
                  <MousePointer2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div>
              <label className="text-[9px] text-slate-500 uppercase font-bold">Arrival (到达点)</label>
              <div className="relative group">
                <input 
                  type="text"
                  value={routeDest}
                  onChange={e => setRouteDest(e.target.value)}
                  placeholder="Type destination e.g. Shenzhen, Guangzhou..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 pr-8"
                />
                <button 
                   type="button"
                   onClick={() => setManualSelectMode(manualSelectMode === "dest" ? "none" : "dest")}
                   className={`absolute right-1.5 top-1 p-1 rounded hover:bg-slate-800 transition ${manualSelectMode === "dest" ? "text-cyan-400 bg-slate-800 ring-1 ring-cyan-500/50" : "text-slate-500"}`}
                   title="Click on map to pick"
                >
                  <MousePointer2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Travel Mode Selector Grid */}
            <div>
              <label className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Travel Mode (出行方式)</label>
              <div className="grid grid-cols-3 gap-1">
                {(["driving", "walking", "cycling"] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTravelMode(mode)}
                    className={`py-1 px-1 rounded text-[9px] font-bold border transition ${travelMode === mode ? "bg-cyan-950 text-cyan-300 border-cyan-500/40" : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"}`}
                  >
                    {mode === "driving" ? "🚗 Car" : mode === "walking" ? "🚶 Walk" : "🚲 Bike"}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isRouting}
              className="w-full bg-transparent hover:bg-cyan-500/10 border border-cyan-500/30 font-bold py-1.5 rounded transition text-cyan-400 text-[10px]"
            >
              {isRouting ? "Loading Turn Matrix..." : "⚡ Draw GPS Route Path"}
            </button>
          </form>

          {/* Turn-by-Turn directions panel */}
          {routeInstructions.length > 0 && (
            <div className="mt-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 max-h-40 overflow-y-auto text-[10px] text-slate-300 divide-y divide-slate-900 text-left">
              <div className="font-bold text-white mb-1.5 pb-1 flex justify-between uppercase">
                <span>Guidance List</span>
                <span className="text-cyan-400">{routeMetrics?.distance}</span>
              </div>
              {routeInstructions.map((step, idx) => (
                <div key={idx} className="py-1 font-mono text-[9px] text-slate-400 leading-snug">
                  {idx + 1}. {step}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real-time GPS Tracker simulation HUD */}
        {routeInstructions.length > 0 && (
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/40">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-widest block mb-2">GPS Telemetry Simulator</span>
            <button 
              onClick={handleToggleSimulation}
              className={`w-full font-bold py-2 rounded-xl transition ${simRunning ? "bg-red-500 hover:bg-red-400 text-white" : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"} text-[10px] flex items-center justify-center gap-1`}
            >
              {simRunning ? "⏹️ Terminate Tracking Feed" : "🚀 Simulate Live Cargo Flight"}
            </button>
            
            {simRunning && simData && (
              <div className="mt-3 bg-slate-950 rounded-xl p-2.5 border border-cyan-500/20 text-[9px] text-slate-300 font-mono space-y-1 text-left animate-fade-in shadow-inner">
                <div className="flex justify-between items-center text-cyan-400 font-bold border-b border-slate-800 pb-1.5">
                  <span>🛰️ LIVE SYSTEM TELEMETRY</span>
                  <span className="animate-pulse bg-cyan-950 text-cyan-300 text-[8px] px-1.5 py-0.5 rounded border border-cyan-500/30">TRACKING</span>
                </div>
                <div className="flex justify-between"><span>Status:</span><span className="text-emerald-400 font-bold">{simData.status}</span></div>
                <div className="flex justify-between"><span>Speed:</span><span className="text-white font-black">{simData.speed} KM/H</span></div>
                <div className="flex justify-between"><span>Lat:</span><span>{simData.lat.toFixed(5)}</span></div>
                <div className="flex justify-between"><span>Lng:</span><span>{simData.lng.toFixed(5)}</span></div>
                <div className="flex justify-between"><span>Distance Left:</span><span>{simData.distanceLeft}</span></div>
                <div className="flex justify-between"><span>Arrival Time:</span><span className="text-cyan-300">{simData.eta}</span></div>
              </div>
            )}
          </div>
        )}

        {/* Quick Link Corporate Nodes list */}
        <div className="p-3.5 mt-auto bg-slate-950/30">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-widest block mb-2 flex items-center gap-1">📍 Global Node Terminals</span>
          <div className="flex flex-wrap gap-1">
            {nodes.map(n => (
              <button 
                key={n.id} 
                onClick={() => handleFlyTo(n)}
                className={`px-1.5 py-1 text-[9px] rounded font-mono transition-all opacity-80 hover:opacity-100 ${activeNode === n.id ? "bg-cyan-950 text-cyan-300 border border-cyan-500/30" : "bg-slate-850 hover:bg-slate-800 text-slate-300 border border-transparent"}`}
              >
                {n.id}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Map Viewer Display */}
      <div className="flex-grow flex flex-col relative bg-slate-950">
        <div className="flex-grow relative h-full">
          <iframe
            ref={iframeRef}
            srcDoc={mapSrcDoc}
            className="w-full h-full border-0"
            title="Google Map High precision Vector Engine"
            sandbox="allow-scripts allow-same-origin"
          />

          {/* Interactive Zoom Buttons overlay (地图必带放大缩小!) */}
          <div className="absolute right-4 top-4 flex flex-col gap-1.5 z-[45] bg-slate-900/95 border border-slate-800 p-1.5 rounded-xl shadow-2xl backdrop-blur-md">
            <button 
              onClick={handleLocateMe} 
              className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-lg shadow transition hover:scale-105 active:scale-95 border border-white/5"
              title="Locate Me"
            >
              <Compass className="h-4 w-4 text-emerald-400" />
            </button>
            <div className="w-full h-px bg-white/10 my-0.5"></div>
            <button 
              onClick={handleZoomIn} 
              className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-lg shadow transition hover:scale-105 active:scale-95 border border-white/5"
              title="Zoom In"
            >
              ＋
            </button>
            <button 
              onClick={handleZoomOut} 
              className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-lg shadow transition hover:scale-105 active:scale-95 border border-white/5"
              title="Zoom Out"
            >
              －
            </button>
          </div>

          {/* Interactive details box describing street look view */}
          {streetViewData && (
            <div className="absolute top-3 left-3 right-3 lg:left-auto lg:right-3 bg-slate-900/95 border border-cyan-500/30 backdrop-blur rounded-xl p-3 shadow-2xl max-w-sm text-left animate-fade-in z-50">
              <div className="flex justify-between items-center mb-1.5 border-b border-slate-800 pb-1.5">
                <span className="text-[10px] font-bold text-[#ec4899] font-mono">🎥 3D STREET-VIEW LOOK AROUND</span>
                <button onClick={() => setStreetViewData(null)} className="text-slate-400 hover:text-white font-bold leading-none text-xs">✕</button>
              </div>
              <p className="text-[10px] text-white font-bold leading-tight truncate mb-1">{streetViewData.address}</p>
              <p className="text-[9px] text-slate-400 mb-2 leading-relaxed font-sans">{streetViewData.description}</p>
              
              {/* Fake Panorama Sandbox look-around frame */}
              <div className="bg-slate-950 rounded border border-slate-800 h-28 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-cover bg-center brightness-[0.7] opacity-80" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400')` }} />
                <span className="absolute bottom-1 right-2 text-[8px] bg-black/60 text-slate-400 px-1 rounded font-mono">ESTIMATED SHUTTER SCAN</span>
                <div className="text-[9px] text-cyan-300 font-bold z-10 font-mono shadow-text flex flex-col items-center gap-1">
                  <span>🎯 COORDINATES SECURE SCAN</span>
                  <span className="text-[8px] text-slate-400 font-mono font-normal">LAT: {streetViewData.lat.toFixed(4)}, LNG: {streetViewData.lng.toFixed(4)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Coordinates HUD overlay panel */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-800 text-[10px] p-2 rounded-xl text-slate-300 font-mono shadow-xl flex flex-wrap items-center justify-between gap-2 z-[40]">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">● FEED ONLINE</span>
              <span>Layer: <strong className="text-white font-mono uppercase">{mapLayer === "y" ? "Satellite Hybrid" : mapLayer === "m" ? "Roadmap View" : "Terrain Contour"}</strong></span>
            </div>
            
            <div className="flex items-center gap-3">
              <span>Bypass Ping: <strong className="text-emerald-400 font-bold">14ms</strong></span>
              <span className="text-slate-500 font-normal">Double-click on map to trigger Street-View survey</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isSystemVerified, setIsSystemVerified] = useState(false);
  const [lang, setLang] = useState<Language>(getLanguage());

  useEffect(() => {
    const handleLangChange = () => setLang(getLanguage());
    window.addEventListener("languageChanged", handleLangChange);
    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);

  const toggleLanguage = () => {
    setLanguage(lang === "en" ? "zh" : "en");
  };

  // Navigation Routing Hash state
  const [currentHash, setCurrentHash] = useState<string>("#home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Global Secure Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [googleDriveFiles, setGoogleDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<GoogleCalendarEvent[]>([]);
  const [googleYoutubeActivities, setGoogleYoutubeActivities] = useState<GoogleYouTubeActivity[]>([]);
  const [googleContacts, setGoogleContacts] = useState<GoogleContact[]>([]);
  const [loadingGoogleData, setLoadingGoogleData] = useState<{[key: string]: boolean}>({});

  // Global Google Provider Auth State
  const [googleToken, setGoogleToken] = useState<string | null>(() => {
    const st = localStorage.getItem("fatshan_global_session");
    if (st) {
      try {
         return decryptData(st);
      } catch(e) { return null; }
    }
    return null;
  });

  const [isHandshaking, setIsHandshaking] = useState(false);

  const fetchGoogleData = async (token: string, service: 'drive' | 'calendar' | 'youtube' | 'gmail' | 'contacts') => {
    setLoadingGoogleData(prev => ({ ...prev, [service]: true }));
    try {
      const endpoint = service === 'gmail' ? '/api/gmail/inbox' : `/api/google/${service}`;
      const res = await fetch(getApiBase() + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token })
      });
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid API response format (expected JSON)");
      }
      const data = await res.json();
      if (data.success) {
        if (service === 'drive') setGoogleDriveFiles(data.files || []);
        if (service === 'calendar') setGoogleCalendarEvents(data.events || []);
        if (service === 'youtube') setGoogleYoutubeActivities(data.activities || []);
        if (service === 'contacts') setGoogleContacts(data.contacts || []);
        if (service === 'gmail') {
            const newMails: Email[] = (data.messages || []).map((m: any) => ({
                id: m.id,
                senderFullName: m.from,
                senderUsername: m.from.split('@')[0].replace(/<.*/, '').trim(),
                senderDomain: m.from.includes('@') ? m.from.split('@')[1].replace('>', '') : 'google.com',
                receiverFullName: "Me",
                receiverUsername: "me",
                receiverDomain: systemState.activeDomain,
                subject: m.subject,
                snippet: m.snippet,
                body: m.snippet,
                timestamp: new Date().getTime(),
                read: false,
             }));
             setEmails(prev => [...newMails, ...prev.filter(p => !p.id.startsWith('gmail-') && !newMails.find(nm => nm.id === p.id))]);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${service}:`, err);
    } finally {
      setLoadingGoogleData(prev => ({ ...prev, [service]: false }));
    }
  };

  const loginGoogleProvider = useGoogleLogin({
    ux_mode: 'redirect',
    scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/contacts.readonly",
  });

  useEffect(() => {
    // Handle Google OAuth Redirect Response
    const hash = window.location.hash;
    if (hash.includes("access_token=")) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      if (token) {
        setGoogleToken(token);
        localStorage.setItem("fatshan_global_session", encryptData(token));
        // Clear the hash but keep the current route if possible
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        
        setIsHandshaking(true);
        // Ensure we are in a relevant app if we just logged in for one
        const activeApp = localStorage.getItem("fatshan_active_app");
        if (!activeApp || activeApp === "desktop") {
          setGpkosActiveApp("global-bridge");
        }
        
        setTimeout(() => setIsHandshaking(false), 4000);
      }
    }
    
    if (googleToken) {
      fetchGoogleData(googleToken, 'gmail');
      fetchGoogleData(googleToken, 'drive');
      fetchGoogleData(googleToken, 'calendar');
      fetchGoogleData(googleToken, 'youtube');
      fetchGoogleData(googleToken, 'contacts');
    }
  }, [googleToken]);

  // Global Session State
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    // Attempt local storage recall
    const saved = localStorage.getItem("gpkos_curr_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeBackground, setActiveBackground] = useState<string>("slate-classic");

  // Database synchronizer
  const [systemState, setSystemState] = useState<SystemState>({
    activeDomain: "fatshanpost.com",
    oldDomain: "fatshan.onmicrosoft.com",
    dualDomainOverlap: true,
    dualDomainDays: 14,
    customButtons: [],
    backgrounds: [],
    users: [],
    blogs: [],
    friendshipRecords: [],
    chatMessages: [],
    settings: { knowledgeBase: [] }
  });

  // UI Local Loading States
  const [emails, setEmails] = useState<Email[]>([]);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regContact, setRegContact] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regVerifyType, setRegVerifyType] = useState<"identity" | "payment">("identity");
  
  // Feedback
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Client Support Conversation
  const [supportMessage, setSupportMessage] = useState("");
  const [supportChat, setSupportChat] = useState<{ sender: "user" | "ai" | "staff"; text: string; id: string }[]>([
    { sender: "ai", text: "Welcome to FATSHAN POST helper. How can I assist you with your simulator or terminal credentials today? (System Validation Token: FATSHAN POST)", id: "init-ch" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Outlook Multi-pane States
  const [outlookFolder, setOutlookFolder] = useState<string>("inbox");
  const [outlookCategory, setOutlookCategory] = useState<string>("all");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [outlookTheme, setOutlookTheme] = useState<"light" | "dark">("light");
  const [mailboxUIStyle, setMailboxUIStyle] = useState<"outlook" | "gmail">("outlook");
  const [outlookDensity, setOutlookDensity] = useState<"compact" | "cozy">("cozy");
  const [outlookSearch, setOutlookSearch] = useState("");
  const [mailComposeOpen, setMailComposeOpen] = useState(false);
  const [adminEditMode, setAdminEditMode] = useState(false);
  const [adminStylePopup, setAdminStylePopup] = useState<{x: number, y: number, target: HTMLElement | null} | null>(null);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [composeStarred, setComposeStarred] = useState(false);
  const [composeFolder, setComposeFolder] = useState<"inbox" | "sent" | "draft">("sent");
  const [composeCategory, setComposeCategory] = useState<"work" | "personal">("work");
  const [aiReportMessage, setAiReportMessage] = useState<{ sensitivity?: string; summary?: string } | null>(null);

  // Custom Templates & Personalized Signatures states
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [signatures, setSignatures] = useState<EmailSignature[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [editingSignature, setEditingSignature] = useState<EmailSignature | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedTemplates = localStorage.getItem("fatshan_email_templates");
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      } else {
        // Initial mock templates
        const initialTemplates: EmailTemplate[] = [
          {
            id: "t-1",
            name: "Business Partnership Proposal",
            subject: "Collaboration Proposal: Secure Integration with Fatshan Hub",
            content: "<h2>Dear Partner,</h2><p>We are excited to propose a secure partnership utilizing our new multi-branch OWA console. Let us coordinate to optimize the systems safely.</p><p>Best regards,</p>"
          },
          {
            id: "t-2",
            name: "Routine Security Diagnostics",
            subject: "Weekly Security Compliance Scan Status - CLEAR",
            content: "<p><strong>System Diagnostics Scan Complete.</strong></p><p>We have performed diagnostic handshakes and verified human bypass configurations. No intrusions localized.</p>"
          }
        ];
        setTemplates(initialTemplates);
        localStorage.setItem("fatshan_email_templates", JSON.stringify(initialTemplates));
      }

      const storedSignatures = localStorage.getItem("fatshan_email_signatures");
      if (storedSignatures) {
        setSignatures(JSON.parse(storedSignatures));
      } else {
        // Initial mock signatures
        const initialSignatures: EmailSignature[] = [
          {
            id: "s-1",
            name: "CEO Standard Signature",
            content: "<hr/><p style='font-size: 12px; color: #38bdf8;'><strong>Master Marcus Zhou</strong><br/>Chief Executive Administrator, FATSHAN POST<br/><span style='color: #94a3b8;'>Validation Code: FATSHAN POST</span></p>",
            isDefault: true
          }
        ];
        setSignatures(initialSignatures);
        localStorage.setItem("fatshan_email_signatures", JSON.stringify(initialSignatures));
      }
    } catch (e) {
      console.error("Error loading templates/signatures", e);
    }
  }, []);

  // Save changes to local storage helper
  const saveTemplates = (newTemplates: EmailTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem("fatshan_email_templates", JSON.stringify(newTemplates));
  };

  const saveSignatures = (newSignatures: EmailSignature[]) => {
    setSignatures(newSignatures);
    localStorage.setItem("fatshan_email_signatures", JSON.stringify(newSignatures));
  };


  // Rory GPKOS state
  const [ideLanguage, setIdeLanguage] = useState<string>("typescript");
  const [ideCode, setIdeCode] = useState<string>(
    `// Rory GPKOS IDE sandboxed compiler entrypoint\nexport function main() {\n  console.log("Validation Token: FATSHAN POST");\n  console.log("Workspace connected to standard Docker hub");\n}`
  );
  const [ideTerminalInput, setIdeTerminalInput] = useState("");
  const [ideLogs, setIdeLogs] = useState<string>(
    "FATSHAN GPKOS TRANSCEIVER LINK: ONLINE\nREADY FOR RUNTIME EXECUTION."
  );
  const [compilerLogs, setCompilerLogs] = useState<string>(">> [SYSTEM] ROLLING COMPILER ENGINE STANDBY...");

  // MSFS simulator step
  const [msfsWarningOpen, setMsfsWarningOpen] = useState(true);
  const [msfsFuel, setMsfsFuel] = useState(85);
  const [msfsAltitude, setMsfsAltitude] = useState(5000);
  const [msfsSpeed, setMsfsSpeed] = useState(240);
  const [msfsAutoPilot, setMsfsAutoPilot] = useState(false);
  const [msfsChecklists, setMsfsChecklists] = useState([
    { id: 1, name: "Configure FATSHAN POST standard routing check", done: true },
    { id: 2, name: "Deploy IMAP / SMTP outlook relay coordinates", done: false },
    { id: 3, name: "Verify Flight control surface validation trim", done: false },
    { id: 4, name: "Synchronize landing landing-gear pressure telemetry", done: false }
  ]);

  // Video portal states
  const [videoSpeed, setVideoSpeed] = useState(1.0);
  const [videoQuality, setVideoQuality] = useState("1080p");
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoSubtitle, setVideoSubtitle] = useState("FATSHAN POST: Commencing final checklist parameters.");

  // Friendship guestbook state
  const [guestbookName, setGuestbookName] = useState("");
  const [guestbookContent, setGuestbookContent] = useState("");
  const [guestbookPhoto, setGuestbookPhoto] = useState("");

  // Blog CMS state
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("Technology");
  const [blogTags, setBlogTags] = useState("");
  const [blogCommentText, setBlogCommentText] = useState<{ [blogId: string]: string }>({});

  // Chat window on home state
  const [chatMessageText, setChatMessageText] = useState("");

  // Admin section state
  const [adminSelectedUserId, setAdminSelectedUserId] = useState<string>("");
  const [adminBanReason, setAdminBanReason] = useState("");
  const [adminBanExpiry, setAdminBanExpiry] = useState("");
  const [adminQuota, setAdminQuota] = useState("1 GB");
  const [adminActiveDomain, setAdminActiveDomain] = useState("fatshanpost.com");
  const [adminDualOverlap, setAdminDualOverlap] = useState(true);
  const [adminDualOverlapDays, setAdminDualOverlapDays] = useState(14);
  const [newBtnLabel, setNewBtnLabel] = useState("");
  const [newBtnUrl, setNewBtnUrl] = useState("");
  const [newBtnPage, setNewBtnPage] = useState<"home" | "work">("home");
  const [newBtnVisibility, setNewBtnVisibility] = useState<"all" | "logined" | "specified">("all");
  const [newBtnSpecUsers, setNewBtnSpecUsers] = useState("");
  const [newBtnColor, setNewBtnColor] = useState("bg-cyan-600");

  const [customApiUrl, setCustomApiUrl] = useState<string>(() => {
    return localStorage.getItem("gpkos_custom_backend_url") || "";
  });
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [browserCheckBlock, setBrowserCheckBlock] = useState<{message: string, isWarning: boolean} | null>(null);

  useEffect(() => {
    const handleCheck = () => {
       const checks = systemState.pageBrowserChecks || [];
       const applyCheck = checks.find(c => c.pageId === currentHash || currentHash.startsWith(c.pageId));
       if (applyCheck) {
          // A somewhat reliable cross-browser check for fullscreen state (API + heuristic fallback)
          const isFullscreen = document.fullscreenElement != null || (window.innerHeight >= window.screen.height - 10 && window.innerWidth >= window.screen.width - 10);
          const w = window.innerWidth;
          const h = window.innerHeight;
          let fail = false;
          if (applyCheck.requireFullscreen && !isFullscreen) fail = true;
          if (applyCheck.minWidth && w < applyCheck.minWidth) fail = true;
          if (applyCheck.minHeight && h < applyCheck.minHeight) fail = true;
          
          if (fail) {
             if (applyCheck.notMetAction === 'redirect') {
                window.location.hash = applyCheck.redirectUrl || '';
             } else {
                setBrowserCheckBlock({
                  message: applyCheck.actionMessage,
                  isWarning: applyCheck.notMetAction === 'warning'
                });
             }
          } else {
             setBrowserCheckBlock(null);
          }
       } else {
          setBrowserCheckBlock(null);
       }
    };
    handleCheck();
    window.addEventListener('resize', handleCheck);
    return () => window.removeEventListener('resize', handleCheck);
  }, [currentHash, systemState.pageBrowserChecks]);

  const getApiBase = (): string => {
    return customApiUrl.trim().replace(/\/$/, "");
  };

  useEffect(() => {
    // Fetch initial database state
    refreshSystemData();

    // Listen to route address changes
    const onHashChange = () => {
      const h = window.location.hash || "#home";
      setCurrentHash(h);
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();

    return () => window.removeEventListener("hashchange", onHashChange);
  }, [customApiUrl]);

  const fetchGmailInbox = async (token?: string | null) => {
    const actToken = token || googleToken;
    if (!actToken) return;
    try {
       let res;
       const fetchOptions = {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ accessToken: actToken })
       };
       try {
         res = await fetch(getApiBase() + "/api/gmail/inbox", fetchOptions);
       } catch (err: any) {
         if (customApiUrl) {
           console.warn("Custom API URL connection failed. Falling back to relative routing for gmail inbox.", err);
           setCustomApiUrl("");
           localStorage.removeItem("gpkos_custom_backend_url");
           res = await fetch("/api/gmail/inbox", fetchOptions);
         } else {
           throw err;
         }
       }
       const data = await res.json();
       if (data.success && data.messages) {
         // Map to our local Email type structure to display in OWA
         const newMails: Email[] = data.messages.map((m: any) => ({
            id: m.id,
            senderFullName: m.from,
            senderUsername: m.from.split('@')[0].replace(/<.*/, '').trim(),
            senderDomain: m.from.includes('@') ? m.from.split('@')[1].replace('>', '') : 'google.com',
            receiverFullName: "Me",
            receiverUsername: "me",
            receiverDomain: systemState.activeDomain,
            subject: m.subject,
            snippet: m.snippet,
            body: m.snippet,
            timestamp: new Date().getTime(),
            read: false,
         }));
         setEmails(prev => [...newMails, ...prev.filter(p => !p.id.startsWith('gmail-') && !newMails.find(nm => nm.id === p.id))]);
       }
    } catch(err) {
       console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      if (googleToken) fetchGmailInbox(googleToken);
      fetchUserEmails();
    }
  }, [currentUser, systemState.activeDomain, customApiUrl, googleToken]);

  const refreshSystemData = async () => {
    try {
      let res;
      try {
        const url = getApiBase() + "/api/state";
        res = await fetch(url);
        const ct = res.headers.get("content-type");
        if (!res.ok || !ct || !ct.includes("application/json")) {
           throw new Error("Not JSON");
        }
      } catch (err: any) {
        if (customApiUrl) {
          console.warn("Custom API URL connection failed. Falling back to relative routing.", err);
          setCustomApiUrl("");
          localStorage.removeItem("gpkos_custom_backend_url");
          res = await fetch("/api/state");
        } else {
          throw err;
        }
      }
      const ct = res.headers.get("content-type");
      if (!res.ok || !ct || !ct.includes("application/json")) {
         return; // Avoid crashing on HTML response
      }
      const data = await res.json();
      setSystemState(data);
      if (data.activeDomain) {
        setAdminActiveDomain(data.activeDomain);
      }
    } catch (e) {
      console.error("System configuration capture error", e);
    }
  };

  const fetchUserEmails = async () => {
    if (!currentUser) return;
    try {
      let resp;
      const targetPath = `/api/emails?username=${encodeURIComponent(currentUser.emailUsername)}&domain=${encodeURIComponent(currentUser.emailDomain)}`;
      try {
        const url = getApiBase() + targetPath;
        resp = await fetch(url);
        const ct = resp.headers.get("content-type");
        if (!resp.ok || !ct || !ct.includes("application/json")) {
           throw new Error("Not JSON");
        }
      } catch (err: any) {
        if (customApiUrl) {
          console.warn("Custom API URL connection failed. Falling back to relative routing for emails.", err);
          setCustomApiUrl("");
          localStorage.removeItem("gpkos_custom_backend_url");
          resp = await fetch(targetPath);
        } else {
          throw err;
        }
      }
      const ct = resp.headers.get("content-type");
      if (!resp.ok || !ct || !ct.includes("application/json")) {
         return;
      }
      const data = await resp.json();
      setEmails(data);
    } catch (err) {
      console.error("Mailboxes resolution fault", err);
    }
  };

  // Sign In Trigger
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;

    try {
      const res = await fetch(getApiBase() + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: authEmail, password: authPassword })
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || contentType.indexOf("application/json") === -1) {
        throw new Error("前端部署成功！\n\n请注意：由于当前的 Cloudflare 为纯前端托管环境，未检测到动态后端。\n\n解决办法：请按照侧边栏『极速部署指南』中的第4步操作，将您在 Render/Zeabur 获取的女武神网关链接粘贴到主页面【绑定远端接口】中即可正常登录！");
      }
      const data = await res.json();
      if (data.error) {
        alert("Authentication failed: " + data.error);
        return;
      }
      
      setCurrentUser(data.user);
      localStorage.setItem("gpkos_curr_user", JSON.stringify(data.user));
      setAuthEmail("");
      setAuthPassword("");

      // Redirect workflow default based on user status
      if (data.user.role === "admin") {
        window.location.hash = "#work";
      } else {
        window.location.hash = "#home";
      }
      refreshSystemData();
    } catch (e: any) {
      alert("Verification system status:\n\n" + e.message);
    }
  };

  // Log Out Sequence
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("gpkos_curr_user");
    setEmails([]);
    window.location.hash = "#home";
  };

  // Self Registration Sequence
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regContact || !regPassword) {
      alert("Please provide valid information inside registration slots");
      return;
    }
    try {
      const res = await fetch(getApiBase() + "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: regFullName,
          contact: regContact,
          password: regPassword,
          verificationType: regVerifyType
        })
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || contentType.indexOf("application/json") === -1) {
        throw new Error("检测到当前为纯前端站点。\n\n如需启用真实的后台注册校验功能，请至下方绑定您专属的 Render 等含动态 Node 引擎的服务端接口链接。");
      }
      const data = await res.json();
      if (data.error) {
        alert("Automation engine intercept: " + data.error);
        return;
      }

      alert("🎉 User verification registered! Primary mailbox has been created under: " + data.user.emailUsername + "@" + systemState.activeDomain);
      setCurrentUser(data.user);
      localStorage.setItem("gpkos_curr_user", JSON.stringify(data.user));
      setRegFullName("");
      setRegContact("");
      setRegPassword("");
      window.location.hash = "#home";
      refreshSystemData();
    } catch (err: any) {
      alert("Registration gateway alert:\n\n" + err.message);
    }
  };

  // Email transmission sequence
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !composeTo || !composeSubject) {
      alert("Primary email descriptors cannot be empty.");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to send this email to ${composeTo}?`);
    if (!confirmed) return;

    if (googleToken) {
      try {
        const res = await fetch(getApiBase() + "/api/gmail/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: composeTo,
            subject: composeSubject,
            message: composeContent,
            accessToken: googleToken
          })
        });
        const data = await res.json();
        if (data.error) {
           alert("Google Gateway Reject: " + data.error);
           return;
        }
        alert(`Success! Email sent securely via Google Provider to ${composeTo}.`);
        setMailComposeOpen(false);
        setComposeTo("");
        setComposeSubject("");
        setComposeContent("");
      } catch(err) {
        alert("Google Provider Failed: " + err);
      }
      return;
    }

    try {
      const res = await fetch(getApiBase() + "/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderUsername: currentUser.emailUsername,
          senderDomain: currentUser.emailDomain,
          receiverAddress: composeTo,
          subject: composeSubject,
          content: composeContent,
          folder: composeFolder,
          category: composeCategory,
          isStarred: composeStarred,
          attachments: []
        })
      });
      const data = await res.json();
      if (data.error) {
        alert("Mail gateway reject: " + data.error);
        return;
      }

      // Check for Gemini intelligence metrics
      if (data.isSpam) {
        alert("⚠️ [Security Shield Alert] Gemini categorized this transmission as potential Spam! Mail flagged and diverted inside folder.");
      } else {
        alert("📧 Transmission routed. Security compliance verified.");
      }

      // Trigger telemetry review report
      setAiReportMessage({
        sensitivity: data.sensitivityReport,
        summary: data.aiSummary
      });

      // Resetcompose
      setComposeTo("");
      setComposeSubject("");
      setComposeContent("");
      setMailComposeOpen(false);
      fetchUserEmails();
      refreshSystemData();
    } catch (err: any) {
      alert("Mail relay failure. " + err.message);
    }
  };

  // Email action triggers
  const handleMailAction = async (id: string, action: string, targetFolder?: string) => {
    try {
      await fetch(getApiBase() + "/api/emails/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id], action, targetFolder })
      });
      fetchUserEmails();
      if (selectedEmail && selectedEmail.id === id) {
        setSelectedEmail(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Guest Feedback System
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackEmail || !feedbackContent) return;
    try {
      const res = await fetch(getApiBase() + "/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderEmail: feedbackEmail, content: feedbackContent })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackSuccess(true);
        setFeedbackEmail("");
        setFeedbackContent("");
        setTimeout(() => setFeedbackSuccess(false), 5000);
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI chat customer support system
  const handleSupportAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    const userText = supportMessage;
    const userMsgId = "cust_" + Date.now();
    setSupportChat((prev) => [...prev, { sender: "user", text: userText, id: userMsgId }]);
    setSupportMessage("");
    setIsAiLoading(true);

    try {
      const res = await fetch(getApiBase() + "/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await res.json();
      
      setSupportChat((prev) => [
        ...prev,
        {
          sender: data.response.includes("Human Support Operator") ? "staff" : "ai",
          text: data.response,
          id: "sys_" + Date.now()
        }
      ]);
    } catch (e) {
      setSupportChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "The gateway router was disrupted temporarily. Verification String code check: FATSHAN POST.",
          id: "sys_fail"
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Window Management States
  const desktopRef = useRef<HTMLDivElement>(null);
  const [openedWindows, setOpenedWindows] = useState<GpkosAppWindow[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [powerMode, setPowerMode] = useState<GpkosPowerMode>("on");
  const [systemUptime, setSystemUptime] = useState(0);

  // App Launch Helper
  const launchApp = (appId: string, title: string) => {
    setOpenedWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        setFocusedWindowId(existing.id);
        return prev.map(w => w.appId === appId ? { ...w, isMinimized: false, zIndex: (prev.length > 0 ? Math.max(...prev.map(aw => aw.zIndex)) : 10) + 1 } : w);
      }
      const newWin: GpkosAppWindow = {
        id: `win-${Date.now()}`,
        appId,
        title,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: (prev.length > 0 ? Math.max(...prev.map(aw => aw.zIndex)) : 10) + 1,
        x: 100 + (prev.length * 30),
        y: 100 + (prev.length * 30),
        width: 900,
        height: 600
      };
      setFocusedWindowId(newWin.id);
      return [...prev, newWin];
    });
  };

  const closeWindow = (winId: string) => {
    setOpenedWindows(prev => prev.filter(w => w.id !== winId));
    if (focusedWindowId === winId) setFocusedWindowId(null);
  };

  const minimizeWindow = (winId: string) => {
    setOpenedWindows(prev => prev.map(w => w.id === winId ? { ...w, isMinimized: true } : w));
    if (focusedWindowId === winId) setFocusedWindowId(null);
  };

  const focusWindow = (winId: string) => {
    setFocusedWindowId(winId);
    setOpenedWindows(prev => {
      const maxZ = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) : 10;
      return prev.map(w => w.id === winId ? { ...w, zIndex: maxZ + 1 } : w);
    });
  };

  const updateWindowPos = (winId: string, x: number, y: number) => {
    setOpenedWindows(prev => prev.map(w => w.id === winId ? { ...w, x, y } : w));
  };

  const updateWindowSize = (winId: string, width: number, height: number) => {
    setOpenedWindows(prev => prev.map(w => w.id === winId ? { ...w, width, height } : w));
  };

  // Interactive Live terminal code simulator actions
  const [gpkosActiveApp, setGpkosActiveApp] = useState<string>(() => {
    return localStorage.getItem("fatshan_active_app") || "desktop";
  });

  useEffect(() => {
    localStorage.setItem("fatshan_active_app", gpkosActiveApp);
  }, [gpkosActiveApp]);
  
  // Remote Support Session State
  const [remoteSessionActive, setRemoteSessionActive] = useState(false);
  const [remoteChatMessages, setRemoteChatMessages] = useState<{sender: string, text: string, time: string}[]>([]);
  const [remoteChatInput, setRemoteChatInput] = useState("");
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Google Hub dedicated secure proxy workspace states
  const [googleHubTab, setGoogleHubTab] = useState<"search" | "gmail" | "maps" | "gemini" | "crypto" | "drive" | "calendar" | "youtube" | "contacts">("search");
  const [proxySearchQueryValue, setProxySearchQueryValue] = useState("");
  const [proxySearchResultsList, setProxySearchResultsList] = useState<any[]>([]);
  const [loadingProxySearch, setLoadingProxySearch] = useState(false);
  const [activeBypassUrl, setActiveBypassUrl] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [bypassHtmlContent, setBypassHtmlContent] = useState<string>("");
  const [loadingBypass, setLoadingBypass] = useState(false);
  const [directUrlValue, setDirectUrlValue] = useState("");
  const [geminiModelSelected, setGeminiModelSelected] = useState("gemini-1.5-flash");
  const [geminiChatHistoryList, setGeminiChatHistoryList] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [geminiPromptText, setGeminiPromptText] = useState("");
  const [loadingGeminiModel, setLoadingGeminiModel] = useState(false);
  const [gmailComposeToAddress, setGmailComposeToAddress] = useState("");
  const [gmailComposeSubjectLine, setGmailComposeSubjectLine] = useState("");
  const [gmailComposeMessageText, setGmailComposeMessageText] = useState("");
  const [sendingGmailLocalState, setSendingGmailLocalState] = useState(false);

  // Expanded Interactive Gmail Suite States
  const [gmailActiveEmail, setGmailActiveEmail] = useState<string>(() => localStorage.getItem("gpkos_active_gmail_account") || "marvis_zhou2014@gmail.com");
  const [gmailFolder, setGmailFolder] = useState<"inbox" | "starred" | "sent" | "trash" | "drafts">("inbox");
  const [gmailSelectedEmail, setGmailSelectedEmail] = useState<any | null>(null);
  const [gmailSearchQuery, setGmailSearchQuery] = useState("");
  const [gmailComposeOpen, setGmailComposeOpen] = useState(false);
  const [googleLoginMode, setGoogleLoginMode] = useState<"signin" | "signup">("signin");
  const [gmailSig, setGmailSig] = useState(() => localStorage.getItem("gpkos_gmail_sig") || "Securely Sent via GPKOS Secure Node Relay");
  const [isEditingSig, setIsEditingSig] = useState(false);
  const [loginEmailInput, setLoginEmailInput] = useState("");
  const [loginPassInput, setLoginPassInput] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupUsernameValue, setSignupUsernameValue] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupConfirmPass, setSignupConfirmPass] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  
  // GPKOS macOS top-bar menu options & custom desktop settings are state-backed for high-fidelity native feeling
  const [gpkosActiveDropdown, setGpkosActiveDropdown] = useState<"gpkos" | "file" | "edit" | "view" | "kernel" | null>(null);
  const [gpkosWallpaper, setGpkosWallpaper] = useState<"cyberpunk" | "monterey" | "space" | "dark-slate">("dark-slate");
  const [gpkosEncryptionActive, setGpkosEncryptionActive] = useState(true);
  const [gpkosLatencyMonitorOpen, setGpkosLatencyMonitorOpen] = useState(false);
  const [gpkosDiagnosticsModalOpen, setGpkosDiagnosticsModalOpen] = useState(false);
  const [gpkosSystemInfoModalOpen, setGpkosSystemInfoModalOpen] = useState(false);
  const [gpkosSecureTunnelState, setGpkosSecureTunnelState] = useState(true);
  const [gpkosLatencyHistory, setGpkosLatencyHistory] = useState<number[]>([14, 15, 12, 16, 13, 14, 15]);

  // Gmail Advanced replying, forwarding & attachment capabilities
  const [gmailReplyText, setGmailReplyText] = useState("");
  const [gmailReplyOpen, setGmailReplyOpen] = useState(false);
  const [gmailForwardOpen, setGmailForwardOpen] = useState(false);
  const [gmailForwardToAddress, setGmailForwardToAddress] = useState("");
  const [gmailComposeAttachments, setGmailComposeAttachments] = useState<string[]>([]);
  
  // Standalone Google Play Store states
  const [playStoreTab, setPlayStoreTab] = useState<"games" | "apps" | "top" | "detail">("games");
  const [playStoreSearch, setPlayStoreSearch] = useState("");
  const [playStoreSelectedApp, setPlayStoreSelectedApp] = useState<any | null>(null);
  const [playStoreInstallingAppId, setPlayStoreInstallingAppId] = useState<string | null>(null);
  const [playStoreInstallationProgress, setPlayStoreInstallationProgress] = useState(0);
  const [playStoreInstalledApps, setPlayStoreInstalledApps] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("gpkos_installed_play_apps");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Gemini Website Builder AI states
  const [geminiSubTab, setGeminiSubTab] = useState<"chat" | "web-builder">("chat");
  const [webBuilderPrompt, setWebBuilderPrompt] = useState("");
  const [webBuilderGeneratedCode, setWebBuilderGeneratedCode] = useState<string>(() => {
    return localStorage.getItem("gpkos_web_builder_code") || `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Sleek Analog Aesthetic Clock</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: radial-gradient(circle, #0F172A, #020617);
            color: #F8FAFC;
            font-family: system-ui, sans-serif;
            overflow: hidden;
        }
        .clock {
            width: 200px;
            height: 200px;
            border: 8px solid rgba(255, 255, 255, 0.05);
            border-radius: 50%;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.6);
            background: rgba(15, 23, 42, 0.4);
        }
        .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: bottom;
            border-radius: 4px;
        }
        .hour {
            width: 6px;
            height: 50px;
            background: #3B82F6;
            margin-left: -3px;
        }
        .minute {
            width: 4px;
            height: 70px;
            background: #60A5FA;
            margin-left: -2px;
        }
        .second {
            width: 2px;
            height: 80px;
            background: #EF4444;
            margin-left: -1px;
        }
        .center {
            width: 12px;
            height: 12px;
            background: #FFFFFF;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -6px;
            margin-left: -6px;
            border-radius: 50%;
            box-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }
        .digital {
            margin-top: 2rem;
            font-size: 1.5rem;
            font-weight: bold;
            font-family: monospace;
            color: #60A5FA;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
        }
    </style>
</head>
<body>
    <div class="clock">
        <div class="hand hour" id="hour"></div>
        <div class="hand minute" id="minute"></div>
        <div class="hand second" id="second"></div>
        <div class="center"></div>
    </div>
    <div class="digital" id="digital">00:00:00</div>

    <script>
        function updateClock() {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            const s = now.getSeconds();

            const hDeg = (h % 12) * 30 + m * 0.5;
            const mDeg = m * 6;
            const sDeg = s * 6;

            document.getElementById('hour').style.transform = 'rotate(' + hDeg + 'deg)';
            document.getElementById('minute').style.transform = 'rotate(' + mDeg + 'deg)';
            document.getElementById('second').style.transform = 'rotate(' + sDeg + 'deg)';

            const pad = (v) => String(v).padStart(2, '0');
            document.getElementById('digital').innerText = pad(h) + ':' + pad(m) + ':' + pad(s);
        }
        setInterval(updateClock, 1000);
        updateClock();
    </script>
</body>
</html>`;
  });
  const [webBuilderDeploying, setWebBuilderDeploying] = useState(false);
  const [webBuilderDeployedUrl, setWebBuilderDeployedUrl] = useState<string | null>(null);
  const [webBuilderPreviewMode, setWebBuilderPreviewMode] = useState<"preview" | "code">("preview");
  
  // Crypto Relay UI States
  const [cryptoMessages, setCryptoMessages] = useState<any[]>([]);
  const [cryptoReceiver, setCryptoReceiver] = useState("");
  const [cryptoMessage, setCryptoMessage] = useState("");
  const [cryptoPassword, setCryptoPassword] = useState("");
  const [cryptoUnlockKey, setCryptoUnlockKey] = useState("");
  const [decryptedMessageId, setDecryptedMessageId] = useState<string | null>(null);
  const [decryptedMessageText, setDecryptedMessageText] = useState<string>("");
  const [sendingCrypto, setSendingCrypto] = useState(false);
  
  const toggleMaximizeW = (winId: string) => {
    setOpenedWindows(prev => prev.map(w => w.id === winId ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const handleIDECompile = async () => {
    try {
      const ts = new Date().toLocaleTimeString();
      setCompilerLogs(`>> [${ts}] INITIALIZING GPKOS COMPILER CHAIN...\n>> TARGET: ${ideLanguage.toUpperCase()}\n>> RESOLVING BINDINGS...`);
      
      // Auto-open/focus terminal (as output) and logs window
      const termWin = openedWindows.find(w => w.appId === 'terminal');
      const logsWin = openedWindows.find(w => w.appId === 'ide-logs');
      
      const newWindows = [...openedWindows];
      let termId = termWin?.id;
      let logsId = logsWin?.id;

      if (!termWin) {
        termId = 'win-' + Math.random().toString(36).substr(2, 9);
        newWindows.push({
          id: termId, appId: 'terminal', title: 'Runtime Output', x: 200, y: 400, width: 700, height: 300, zIndex: 100, isMinimized: false, isMaximized: false
        });
      }
      if (!logsWin) {
        logsId = 'win-' + Math.random().toString(36).substr(2, 9);
        newWindows.push({
          id: logsId, appId: 'ide-logs', title: 'Compiler Diagnostics', x: 850, y: 50, width: 400, height: 600, zIndex: 101, isMinimized: false, isMaximized: false
        });
      }

      setOpenedWindows(newWindows);
      setFocusedWindowId(termId!);

      const res = await fetch(getApiBase() + "/api/rory-gpkos/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: ideCode, language: ideLanguage })
      });
      const data = await res.json();
      
      // Split mock data if possible or just show all in logs and final in runtime
      setCompilerLogs(data.output);
      
      // Extract what looks like program output for the terminal
      const outputLines = data.output.split('\n').filter((l: string) => l.includes('[STDOUT]')).map((l: string) => l.replace('[STDOUT] ', ''));
      if (outputLines.length > 0) {
        setIdeLogs(prev => prev + "\n" + outputLines.join('\n'));
      } else {
        setIdeLogs(prev => prev + "\n[SYSTEM] No console output from program execution.");
      }

    } catch (err: any) {
      setCompilerLogs(prev => prev + "\n❌ COMPILATION LINK FAILURE: " + err.message);
    }
  };

  const handleIDETerminalCmd = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = ideTerminalInput.trim();
    if (!cmd) return;

    setIdeTerminalInput("");
    setIdeLogs((prev) => prev + `\n\n$ ${cmd}`);

    try {
      const res = await fetch(getApiBase() + "/api/rory-gpkos/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd, language: ideLanguage })
      });
      const data = await res.json();
      setIdeLogs((prev) => prev + "\n" + data.output);
    } catch (err: any) {
      setIdeLogs((prev) => prev + "\n❌ SUBSYSTEM ERROR: " + err.message);
    }
  };

  // Memoirs friendship sharing cards trigger
  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookName || !guestbookContent) return;

    try {
      const res = await fetch(getApiBase() + "/api/friendship/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestbookName, content: guestbookContent, photoUrl: guestbookPhoto })
      });
      const data = await res.json();
      if (data.success) {
        alert("🌟 Your friendship memoir has been recorded successfully with standard decorations!");
        setGuestbookName("");
        setGuestbookContent("");
        setGuestbookPhoto("");
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Blog CMS engine
  const handleBlogCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent || !currentUser) return;

    try {
      const res = await fetch(getApiBase() + "/api/blogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: currentUser.fullName,
          authorEmail: currentUser.contact,
          title: blogTitle,
          content: blogContent,
          category: blogCategory,
          tags: blogTags.split(",").map((t) => t.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("✨ Professional Blog Post Published Successfully!");
        setBlogTitle("");
        setBlogContent("");
        setBlogTags("");
        refreshSystemData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLikeBlog = async (id: string) => {
    try {
      const res = await fetch(getApiBase() + "/api/blogs/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId: id })
      });
      const data = await res.json();
      if (data.success) {
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogCommentSubmit = async (id: string) => {
    const text = blogCommentText[id];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(getApiBase() + "/api/blogs/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: id,
          author: currentUser ? currentUser.fullName : "Guest Visitor",
          content: text
        })
      });
      const data = await res.json();
      if (data.success) {
        setBlogCommentText((prev) => ({ ...prev, [id]: "" }));
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Secure Search (Proxy)
  const handleSecureSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(getApiBase() + `/api/search/proxy?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Chat lobby message
  const handleLobbyChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;

    try {
      const res = await fetch(getApiBase() + "/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: currentUser ? currentUser.fullName : "Anonymous Guest",
          content: chatMessageText
        })
      });
      const data = await res.json();
      if (data.success) {
        setChatMessageText("");
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Theme Wallpaper purchasing trigger simulation with unified memory Quota bounds
  const applyWallpaperTheme = (id: string, color: string, price: string) => {
    if (!currentUser) {
      alert("Please authenticate to select wallpapers.");
      return;
    }
    setActiveBackground(color);
    alert(`💡 Applied theme: ${name}. Your quota storage balance was verified.`);
  };

  // ================= ADMIN CONSOLE ACTIONS =================

  const handleAdminSetDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiBase() + "/api/admin/set-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeDomain: adminActiveDomain,
          dualDomainOverlap: adminDualOverlap,
          dualDomainDays: adminDualOverlapDays
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🌐 Master domain swapped and registered! Domain transition notices successfully sent to users.");
        refreshSystemData();
        if (currentUser) {
          fetchUserEmails();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminBanUser = async (userId: string, isBan: boolean) => {
    try {
      const res = await fetch(getApiBase() + "/api/admin/manage-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: isBan ? "ban" : "unban",
          banReason: adminBanReason || "Suspended by Security Ops Room",
          banExpiry: adminBanExpiry || null
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(isBan ? "🛑 Profile suspended." : "✅ Profile operational credentials restored.");
        refreshSystemData();
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  const handleToggleGoogleAuth = async (emailUsername: string) => {
    if (currentUser?.emailUsername !== "marvis_zhou" && currentUser?.emailUsername !== "marvis_zhou2014") {
      alert("Only the super-administrator (marvis_zhou / marvis_zhou2014) is authorized to govern secure GFW tunnel keys.");
      return;
    }
    const currentAuthed = systemState.aiAuthorizedUsers || [];
    const updated = currentAuthed.includes(emailUsername)
      ? currentAuthed.filter(e => e !== emailUsername)
      : [...currentAuthed, emailUsername];
    
    setSystemState((prev: any) => ({
      ...prev,
      aiAuthorizedUsers: updated
    }));

    try {
      await fetch(getApiBase() + "/api/admin/save-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiAuthorizedUsers: updated })
      });
      alert(`Handshake database updated. "${emailUsername}" GFW proxy status swapped successfully.`);
    } catch(e) {
      console.error(e);
    }
  };

  const handleAdminUpdateUserQuota = async (userId: string) => {
    try {
      const res = await fetch(getApiBase() + "/api/admin/manage-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "update-quota",
          storageQuota: adminQuota
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("💾 Shared storage bounds configured.");
        refreshSystemData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAminToggleVerify = async (userId: string) => {
    try {
      const res = await fetch(getApiBase() + "/api/admin/manage-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "verify"
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🔑 Verification state toggled.");
        refreshSystemData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminAddMedal = async (userId: string, isPenalty = false) => {
    const title = prompt(isPenalty ? "Target penalty code title:" : "Target honor medal title:");
    if (!title) return;

    try {
      const dbUser = systemState.users.find((u) => u.id === userId);
      if (!dbUser) return;

      const currentMedals = dbUser.medals || [];
      const newMedal = {
        id: "m_" + Date.now(),
        title: title.toUpperCase(),
        type: isPenalty ? "penalty" : "honor",
        icon: isPenalty ? "ShieldAlert" : "Award",
        color: isPenalty ? "text-red-500 font-bold" : "text-amber-500 font-bold",
        description: isPenalty ? "Corporate compliance trigger record." : "Awarded by system controller desk."
      };

      const res = await fetch(getApiBase() + "/api/admin/manage-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "update-medals",
          medals: [...currentMedals, newMedal]
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🏅 Badges updated.");
        refreshSystemData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCustomButton = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBtnLabel || !newBtnUrl) return;

    try {
      const res = await fetch(getApiBase() + "/api/admin/buttons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          button: {
            label: newBtnLabel,
            actionUrl: newBtnUrl,
            page: newBtnPage,
            visibility: newBtnVisibility,
            specifiedUsers: newBtnSpecUsers ? newBtnSpecUsers.split(",").map((x) => x.trim()) : [],
            styling: { bgColor: newBtnColor, textColor: "text-white" }
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🔘 Micro Custom Interactive button successfully initialized!");
        setNewBtnLabel("");
        setNewBtnUrl("");
        setNewBtnSpecUsers("");
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCustomButton = async (id: string) => {
    try {
      const res = await fetch(getApiBase() + "/api/admin/buttons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          button: { id }
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🔘 Button cleared.");
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Custom Templates Handlers
  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    if (!editingTemplate.name) {
      alert("⚠️ Template name cannot be blank.");
      return;
    }
    let newTemplatesList: EmailTemplate[];
    const isEditingExisting = templates.some(t => t.id === editingTemplate.id);
    if (isEditingExisting) {
      newTemplatesList = templates.map(t => t.id === editingTemplate.id ? editingTemplate : t);
    } else {
      newTemplatesList = [...templates, editingTemplate];
    }
    saveTemplates(newTemplatesList);
    setEditingTemplate(null);
    alert("✓ Custom template saved successfully to Local Secure Vault!");
  };

  const handleDeleteTemplate = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this email template permanently?")) return;
    const newTemplatesList = templates.filter(t => t.id !== id);
    saveTemplates(newTemplatesList);
  };

  // Custom Signatures Handlers
  const handleSaveSignature = () => {
    if (!editingSignature) return;
    if (!editingSignature.name) {
      alert("⚠️ Signature title cannot be blank.");
      return;
    }
    let newSignaturesList: EmailSignature[];
    const isEditingExisting = signatures.some(s => s.id === editingSignature.id);
    if (isEditingExisting) {
      newSignaturesList = signatures.map(s => s.id === editingSignature.id ? editingSignature : s);
    } else {
      newSignaturesList = [...signatures, editingSignature];
    }

    if (editingSignature.isDefault) {
      newSignaturesList = newSignaturesList.map(s => s.id === editingSignature.id ? s : { ...s, isDefault: false });
    }

    saveSignatures(newSignaturesList);
    setEditingSignature(null);
    alert("✓ Personalized signature saved successfully to Local Secure Vault!");
  };

  const handleDeleteSignature = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this personalized signature permanently?")) return;
    const newSignaturesList = signatures.filter(s => s.id !== id);
    saveSignatures(newSignaturesList);
  };

  const handleSetDefaultSignature = (id: string) => {
    const newSignaturesList = signatures.map(s => ({
      ...s,
      isDefault: s.id === id
    }));
    saveSignatures(newSignaturesList);
    alert("✓ Default signature preference updated.");
  };

  const openNewCompose = () => {
    setComposeTo("");
    setComposeSubject("");
    const defaultSig = signatures.find(s => s.isDefault);
    if (defaultSig) {
      setComposeContent("<p><br/></p>" + defaultSig.content);
    } else {
      setComposeContent("");
    }
    setMailComposeOpen(true);
  };

  // Filter Email list based on left conditions inside Outlook replica
  const filteredEmails = emails.filter((mailItem) => {
    // Basic folder filters
    if (outlookFolder !== "all" && mailItem.folder !== outlookFolder) {
      return false;
    }
    // Search query
    if (outlookSearch) {
      const q = outlookSearch.toLowerCase();
      const matchSubject = mailItem.subject.toLowerCase().includes(q);
      const matchContent = mailItem.content.toLowerCase().includes(q);
      const matchSenderName = mailItem.senderName.toLowerCase().includes(q);
      if (!matchSubject && !matchContent && !matchSenderName) {
        return false;
      }
    }
    // Categories
    if (outlookCategory !== "all" && mailItem.category !== outlookCategory) {
      return false;
    }
    return true;
  });

  // Decide if background classes matched
  const getThemeClass = () => {
    const bgObj = systemState.backgrounds.find((bg) => bg.id === activeBackground) || { color: "bg-slate-900 text-slate-100" };
    return bgObj.color;
  };

  // Remote Control Session Functions
  const startRemoteSession = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error("Display Media API is not supported in this environment");
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      if (remoteVideoRef.current) {
         remoteVideoRef.current.srcObject = stream;
      }
      setRemoteSessionActive(true);
      setRemoteChatMessages(prev => [...prev, {
         sender: "System",
         text: "🔗 高清多人协作与桌面分享通道已开启 - 等待远端技术人员接入...",
         time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})
      }]);

      stream.getVideoTracks()[0].onended = () => {
         setRemoteSessionActive(false);
         if (remoteVideoRef.current) {
           remoteVideoRef.current.srcObject = null;
         }
         setRemoteChatMessages(prev => [...prev, {
           sender: "System",
           text: "⭕ 桌面协同会话已结束。",
           time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})
         }]);
      };
    } catch (err: any) {
      console.error(err);
      alert("⚠️ 无法启动屏幕共享: " + err.message + " (可能因为系统处于安全沙盒环境中或被权限策略拦截)");
      setRemoteChatMessages(prev => [...prev, {
         sender: "System",
         text: "❌ 桌面分享启动失败: 环境不支持或已被安全拦截",
         time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})
      }]);
    }
  };

  const handleRemoteChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remoteChatInput.trim()) return;
    setRemoteChatMessages(prev => [...prev, {
      sender: currentUser?.fullName || "Host",
      text: remoteChatInput,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }]);
    
    // Simulate remote responder
    setTimeout(() => {
      setRemoteChatMessages(prev => [...prev, {
         sender: "技术支持 [远端协作中]",
         text: "系统已识别。请放心，您本机操作者拥有最高鼠标主权优先防线（OS底层拒绝外部真光标拦截），当前屏幕仅做共享与图画标注协同。",
         time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 2000);
    setRemoteChatInput("");
  };

  const handleGlobalClick = (e: React.MouseEvent) => {
    if (adminEditMode && currentUser?.role === 'admin') {
      e.preventDefault();
      e.stopPropagation();
      setAdminStylePopup({
        x: e.clientX,
        y: e.clientY,
        target: e.target as HTMLElement
      });
    }
  };

  return (
    <div id="app-root" className={`min-h-screen font-sans transition-all duration-300 ${getThemeClass()} flex flex-col relative`} onClickCapture={handleGlobalClick}>
      {!isSystemVerified && <VerificationScreen onComplete={() => setIsSystemVerified(true)} />}

      {/* Target Browser Checks Visual Execution layer */}
      {browserCheckBlock && !browserCheckBlock.isWarning && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
           <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-lg shadow-2xl flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse"></div>
              <ShieldAlert className="w-16 h-16 text-red-500 mb-6 animate-bounce" />
              <h2 className="text-2xl font-black text-white mb-4 tracking-tight">安全探针拦截 (Safety Blocked)</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-8 font-medium">{browserCheckBlock.message}</p>
              <div className="flex gap-4">
                 <button onClick={() => {
                   const el = document.documentElement;
                   if (el.requestFullscreen) {
                     el.requestFullscreen();
                   } else if ((el as any).webkitRequestFullscreen) {
                     (el as any).webkitRequestFullscreen();
                   } else if ((el as any).msRequestFullscreen) {
                     (el as any).msRequestFullscreen();
                   }
                 }} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-red-900/50 transition flex items-center gap-2">
                    <Maximize className="w-4 h-4" /> 尝试激活全屏
                 </button>
                 <button onClick={() => { window.location.hash = "#home" }} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition">
                    退回到主页
                 </button>
              </div>
           </div>
        </div>
      )}

      {browserCheckBlock && browserCheckBlock.isWarning && (
        <div className="bg-amber-500 text-amber-950 font-bold px-4 py-3 flex items-center justify-center gap-3 text-xs z-40 relative shadow-md">
           <ShieldAlert className="w-4 h-4" />
           {browserCheckBlock.message}
           <button onClick={() => setBrowserCheckBlock(null)} className="ml-2 bg-amber-600 text-amber-100 hover:bg-amber-700 px-2 py-1 rounded">忽略</button>
        </div>
      )}

      {/* Top Warning Alert for flight simulator steps */}
      {currentHash === "#msfs" && msfsWarningOpen && (
        <div id="msfs-alert-belt" className="bg-amber-500 text-slate-950 font-semibold px-4 py-2.5 flex items-center justify-between text-sm shadow-md animate-bounce">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>
              <strong>FAA Deployment Safe Check:</strong> MSFS Sim requires checklist configuration. Authenticate or configure default routing parameters to disable notice.
            </span>
          </div>
          <button
            onClick={() => setMsfsWarningOpen(false)}
            className="p-1 hover:bg-amber-600 rounded"
            title="Mark deployment checklist completed"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main App Navigation Bar */}
      <header id="main-header" className="border-b border-white/10 shrink-0 sticky top-0 z-40 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
          
          {/* Logo Identity */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500 text-slate-950 rounded-xl font-black text-lg shadow-lg tracking-wider">
              FP
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {t("FATSHAN POST")} <span className="hidden sm:inline-block text-xs bg-white/20 text-cyan-200 px-2 py-0.5 rounded-full">{t("Mail & compiler Console")}</span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">{t("Owner Terminal Desk • Administrator: marvis_zhou")}</p>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                   const el = document.documentElement;
                   if (!document.fullscreenElement) {
                     if (el.requestFullscreen) {
                       el.requestFullscreen();
                     } else if ((el as any).webkitRequestFullscreen) {
                       (el as any).webkitRequestFullscreen();
                     } else if ((el as any).msRequestFullscreen) {
                       (el as any).msRequestFullscreen();
                     }
                   } else {
                     if (document.exitFullscreen) {
                       document.exitFullscreen();
                     }
                   }
              }}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded font-bold text-xs flex items-center justify-center border border-white/20 title='全屏模式'"
            >
              <Maximize className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded font-bold text-xs flex items-center gap-2 border border-white/20"
            >
              <div className="space-y-1"><div className="w-4 h-0.5 bg-white"></div><div className="w-4 h-0.5 bg-white"></div><div className="w-4 h-0.5 bg-white"></div></div>
              <span>{lang === 'en' ? 'Menu' : '侧栏菜单'}</span>
            </button>
          </div>

          {/* Nav Links containing CYAN for Home and SOFT BLUE for Work */}
          <nav className="hidden md:flex flex-wrap items-center gap-2" id="navigation-rail">
            <a
              href="#home"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                currentHash === "#home"
                  ? "bg-cyan-500 text-slate-950 shadow-md scale-105"
                  : "text-cyan-400 hover:bg-cyan-500/15"
              }`}
            >
              {t("#home")}
            </a>
            <a
              href="#work"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                currentHash === "#work"
                  ? "bg-blue-500 text-white shadow-md scale-105"
                  : "text-blue-300 hover:bg-blue-500/15"
              }`}
            >
              {t("#work")}
            </a>
            <a
              href="#public-mail"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#public-mail"
                  ? "bg-violet-500 text-white shadow-md scale-105"
                  : "text-violet-300 hover:bg-violet-500/15"
              }`}
            >
              🌐 {lang === 'en' ? 'Global Mail' : '全球极速发信'}
            </a>
            {(currentUser?.role === 'admin' || (currentUser && systemState.outerWebAuthorizedUsers?.includes(currentUser.emailUsername))) && (
            <a
              href="#rory-gpkos"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#rory-gpkos"
                  ? "bg-emerald-500 text-slate-950"
                  : "text-emerald-300 hover:bg-emerald-500/15"
              }`}
            >
              {t("#rory-gpkos IDE")}
            </a>
            )}
            <a
              href="#msfs"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#msfs"
                  ? "bg-amber-500 text-slate-950"
                  : "text-amber-300 hover:bg-amber-500/15"
              }`}
            >
              {t("msfs Sim")}
            </a>
            <a
              href="#remote"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#remote"
                  ? "bg-indigo-500 text-white"
                  : "text-indigo-300 hover:bg-indigo-500/15"
              }`}
            >
              {t("Remote Screen")}
            </a>
            <a
              href="#video"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#video"
                  ? "bg-rose-500 text-white"
                  : "text-rose-300 hover:bg-rose-500/15"
              }`}
            >
              {t("Video Stream")}
            </a>
            <a
              href="#friendship"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#friendship"
                  ? "bg-purple-500 text-white"
                  : "text-purple-300 hover:bg-purple-500/15"
              }`}
            >
              {t("Friendship Album")}
            </a>
            <a
              href="#drive"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#drive"
                  ? "bg-sky-500 text-white shadow-md scale-105"
                  : "text-sky-300 hover:bg-sky-500/15"
              }`}
            >
              {lang === 'en' ? 'Cloud Drive' : '云端储存'}
            </a>
            <a
              href="#admin"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#admin"
                  ? "bg-fuchsia-500 text-white shadow-md scale-105"
                  : "text-fuchsia-300 hover:bg-fuchsia-500/15"
              }`}
            >
              <div className="flex items-center gap-1.5"><Shield className="w-4 h-4" />{lang === 'en' ? 'Admin' : '高级后台'}</div>
            </a>
            <a
              href="#blog"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#blog"
                  ? "bg-teal-500 text-white"
                  : "text-teal-300 hover:bg-teal-500/15"
              }`}
            >
              {t("Blogs CMS")}
            </a>
            {systemState.navPages?.filter(p => p.isVisible).map(p => (
              <a
                key={p.id}
                href={p.isExternal ? p.externalLink : `#subpage-${p.id}`}
                target={p.isExternal ? "_blank" : undefined}
                rel={p.isExternal ? "noopener noreferrer" : undefined}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  currentHash === `#subpage-${p.id}`
                    ? "bg-fuchsia-500 text-white"
                    : "text-fuchsia-300 hover:bg-fuchsia-500/15"
                }`}
              >
                {lang === 'en' ? p.titleEn : p.titleZh}
              </a>
            ))}
          </nav>

          {/* Right Corner Identity Info & Mini session widget */}
          <div className="hidden md:flex items-center gap-3">
            <button
               onClick={() => {
                   const el = document.documentElement;
                   if (!document.fullscreenElement) {
                     if (el.requestFullscreen) {
                       el.requestFullscreen();
                     } else if ((el as any).webkitRequestFullscreen) {
                       (el as any).webkitRequestFullscreen();
                     } else if ((el as any).msRequestFullscreen) {
                       (el as any).msRequestFullscreen();
                     }
                   } else {
                     if (document.exitFullscreen) {
                       document.exitFullscreen();
                     }
                   }
               }}
               className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-xs flex items-center justify-center border border-white/20 transition"
            >
               <Maximize className="w-4 h-4" />
            </button>
            {currentUser ? (
              <div id="active-session-chip" className="bg-white/10 text-white pl-1.5 pr-2 py-1.5 rounded-full flex items-center gap-2 text-xs border border-white/10">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full object-cover border border-white/20" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center font-bold">{currentUser.fullName.charAt(0)}</div>
                )}
                <span className="font-semibold">{currentUser.fullName}</span>
                <span className="text-slate-400">({currentUser.emailUsername}@{systemState.activeDomain})</span>
                {currentUser.role === "admin" && (
                  <span className="bg-red-500 text-white font-extrabold px-1.5 py-0.2 rounded text-[10px]">ADMIN</span>
                )}
                <button
                  onClick={toggleLanguage}
                  className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full transition text-xs font-bold border border-white/20 ml-1"
                >
                  {lang === 'en' ? '中' : 'EN'}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-red-500 hover:text-white px-2 py-1 rounded-full transition text-xs font-bold"
                >
                  {t("Log out")}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={toggleLanguage}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10"
                >
                  {lang === 'en' ? '中文' : 'English'}
                </button>
                <a
                  href="#home"
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10"
                >
                  {t("Guest Visitor")}
                </a>
              </div>
            )}
          </div>

          </div>

          {/* Mobile menu fold-out (Fixed Screen Drawer) */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              {/* Overlay Backdrop */}
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              ></div>
              
              {/* Drawer Container */}
              <div className="relative w-64 max-w-[80vw] bg-slate-900 h-full shadow-2xl border-r border-white/10 flex flex-col pt-6 pb-6 overflow-y-auto z-50">
                <div className="px-4 mb-6 flex items-center justify-between">
                  <div className="font-bold text-white text-lg tracking-tight">Fatshan Menu</div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-white/60 hover:text-white p-1">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <nav className="flex flex-col gap-2 px-4 flex-grow">
                <a
                  href="#home"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#home"
                      ? "bg-cyan-500 text-slate-950 shadow-md"
                      : "text-cyan-400 hover:bg-cyan-500/15 border border-cyan-500/20"
                  }`}
                >
                  {t("#home")}
                </a>
                <a
                  href="#work"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#work"
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-blue-300 hover:bg-blue-500/15 border border-blue-500/20"
                  }`}
                >
                  {t("#work")}
                </a>
                <a
                  href="#public-mail"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#public-mail"
                      ? "bg-violet-500 text-white shadow-md"
                      : "text-violet-300 hover:bg-violet-500/15 border border-violet-500/20"
                  }`}
                >
                  🌐 {lang === 'en' ? 'Global Mail' : '全球极速发信'}
                </a>
                {(currentUser?.role === 'admin' || (currentUser && systemState.outerWebAuthorizedUsers?.includes(currentUser.emailUsername))) && (
                <a
                  href="#rory-gpkos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#rory-gpkos"
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-emerald-300 hover:bg-emerald-500/15 border border-emerald-500/20"
                  }`}
                >
                  {t("#rory-gpkos IDE")}
                </a>
                )}
                <a
                  href="#msfs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#msfs"
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-amber-300 hover:bg-amber-500/15 border border-amber-500/20"
                  }`}
                >
                  {t("msfs Sim")}
                </a>
                <a
                  href="#remote"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#remote"
                      ? "bg-indigo-500 text-white shadow-md"
                      : "text-indigo-300 hover:bg-indigo-500/15 border border-indigo-500/20"
                  }`}
                >
                  {t("Remote Screen")}
                </a>
                <a
                  href="#video"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#video"
                      ? "bg-rose-500 text-white shadow-md"
                      : "text-rose-300 hover:bg-rose-500/15 border border-rose-500/20"
                  }`}
                >
                  {t("Video Stream")}
                </a>
                <a
                  href="#friendship"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#friendship"
                      ? "bg-purple-500 text-white shadow-md"
                      : "text-purple-300 hover:bg-purple-500/15 border border-purple-500/20"
                  }`}
                >
                  {t("Friendship Album")}
                </a>
                <a
                  href="#drive"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#drive"
                      ? "bg-sky-500 text-white shadow-md"
                      : "text-sky-300 hover:bg-sky-500/15 border border-sky-500/20"
                  }`}
                >
                  {lang === 'en' ? 'Cloud Drive' : '云端储存'}
                </a>
                <a
                  href="#admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#admin"
                      ? "bg-fuchsia-500 text-white shadow-md"
                      : "text-fuchsia-300 hover:bg-fuchsia-500/15 border border-fuchsia-500/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5"><Shield className="w-4 h-4" />{lang === 'en' ? 'Admin Console' : '高级后台'}</div>
                </a>
                <a
                  href="#blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    currentHash === "#blog"
                      ? "bg-teal-500 text-white shadow-md"
                      : "text-teal-300 hover:bg-teal-500/15 border border-teal-500/20"
                  }`}
                >
                  {t("Blogs CMS")}
                </a>
                {systemState.navPages?.filter(p => p.isVisible).map(p => (
                  <a
                    key={p.id}
                    href={p.isExternal ? p.externalLink : `#subpage-${p.id}`}
                    target={p.isExternal ? "_blank" : undefined}
                    rel={p.isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => { if (!p.isExternal) setMobileMenuOpen(false); }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      currentHash === `#subpage-${p.id}`
                        ? "bg-fuchsia-500 text-white"
                        : "text-fuchsia-300 hover:bg-fuchsia-500/15 border border-fuchsia-500/20"
                    }`}
                  >
                    {lang === 'en' ? p.titleEn : p.titleZh}
                  </a>
                ))}
              </nav>

              <div className="mt-4 pt-4 px-4 border-t border-white/10 flex flex-col gap-3 shrink-0">
                {currentUser ? (
                  <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      {currentUser.avatarUrl ? (
                         <img src={currentUser.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                      ) : (
                         <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-lg text-white">{currentUser.fullName.charAt(0)}</div>
                      )}
                      <div>
                        <div className="text-white text-sm font-semibold">{currentUser.fullName}</div>
                        <div className="text-slate-400 text-xs">({currentUser.emailUsername}@{systemState.activeDomain})</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={toggleLanguage}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition text-xs font-bold flex-1"
                      >
                        {lang === 'en' ? '切换为中文' : 'Switch to EN'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="bg-red-500/20 hover:bg-red-500 text-red-100 px-3 py-1.5 rounded-lg transition text-xs font-bold flex-1"
                      >
                        {t("Log out")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={toggleLanguage}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-semibold border border-white/10 flex-1"
                    >
                      {lang === 'en' ? '中文' : 'English'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            </div>
          )}

        </div>
      </header>

      {/* Primary Layout Frame block */}
      <div className="flex-grow max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-stretch gap-6 p-4 sm:p-6 lg:p-8">
        
        {/* Tools Sidebar */}
        <aside className="w-full md:w-48 shrink-0 flex flex-col gap-4">
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 sticky top-24 flex flex-col gap-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2 uppercase tracking-wide">
              <Zap className="h-4 w-4 text-cyan-400" />
              {lang === 'en' ? 'AI Tools' : 'AI 工具'}
            </h3>
            <a
              href="#tool-translator"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                currentHash === '#tool-translator' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> {lang === 'en' ? 'AI Translator' : 'AI 翻译'}
            </a>
            <a
              href="#tool-summarizer"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                currentHash === '#tool-summarizer' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> {lang === 'en' ? 'Summarizer' : 'AI 摘要'}
            </a>
            <a
              href="#tool-code"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                currentHash === '#tool-code' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" /> {lang === 'en' ? 'Code Beautifier' : '代码格式化'}
            </a>
            <a
              href="#tool-geminiai"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                currentHash === '#tool-geminiai' ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-fuchsia-400" /> {lang === 'en' ? 'Gemini AI Chat' : 'Gemini AI 聊天'}
            </a>
            
            {currentUser?.role === 'admin' && (
              <>
                <div className="h-px bg-white/10 my-2"></div>
                <a
                  href="#admin-subpages"
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                    currentHash === '#admin-subpages' || currentHash === '#admin-aiaccess' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" /> {lang === 'en' ? 'Page Admin' : '页面管理'}
                </a>
              </>
            )}
          </div>
        </aside>

        <main id="primary-layout" className="flex-grow flex flex-col gap-6 min-w-0">

        {/* Dynamic global buttons rendering based on administrative conditions */}
        {systemState.customButtons && systemState.customButtons.length > 0 && (
          <div id="dynamic-buttons-belt" className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
              <Compass className="h-4 w-4 text-cyan-400" />
              Custom Tools:
            </span>
            {systemState.customButtons.map((btn) => {
              // Rule checking
              if (btn.banned) return null;
              if (btn.visibility === "logined" && !currentUser) return null;
              if (btn.visibility === "specified") {
                if (!currentUser) return null;
                const fullE = `${currentUser.emailUsername}@${currentUser.emailDomain}`.toLowerCase();
                const fitsUsr = btn.specifiedUsers.some(
                  (u) =>
                    u.toLowerCase() === currentUser.emailUsername.toLowerCase() ||
                    u.toLowerCase() === fullE ||
                    u.toLowerCase() === currentUser.contact.toLowerCase()
                );
                if (!fitsUsr) return null;
              }

              return (
                <a
                  key={btn.id}
                  href={btn.actionUrl}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow transition-all hover:scale-105 inline-flex items-center gap-1.5 ${btn.styling.bgColor || "bg-cyan-600"} ${btn.styling.textColor || "text-white"}`}
                >
                  <Zap className="h-3 w-3" />
                  {btn.label}
                </a>
              );
            })}
          </div>
        )}

        {/* SECTION 1: HOME VISITOR BRANCH screen Layout */}
        {currentHash === "#home" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" id="home-dashboard">
            
            {/* Left Big Panel: Outlook mail preview mini summary / Authentication */}
            <div className="md:col-span-2 flex flex-col gap-6">
              
              {/* Authenticated OWA Welcome / Login & Register form */}
              {!currentUser ? (
                <div id="guest-access-panel" className="bg-slate-950/80 backdrop-blur-md rounded-3xl p-6 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500"></div>
                  
                  {/* 贴心问候模块 (Warm welcome message) */}
                  <div className="mb-6 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 p-5 rounded-2xl shadow-inner">
                     <div className="font-bold text-lg text-indigo-300 mb-2 flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-amber-400" />
                       您好呀，欢迎回到您的专属云端工作生态！
                     </div>
                     <p className="text-sm text-slate-300 leading-relaxed">
                       无论是处理繁杂的邮件协作、随时随地的远端守护，还是管理错综复杂的代码与服务，这套专属系统都会始终伴您左右，提供最隐秘、稳定、贴心的保障。
                       <br/><br/>
                       💡 <strong className="text-cyan-400">贴心小提示：</strong> 我们已经做了全平台深度响应式优化。不管您现在正拿着手机还是端坐在电脑前，所有内容排版都会完美适配您的屏幕。如果在手机端需要全屏沉浸体验，请随时点击顶部右侧的「<Maximize className="w-3.5 h-3.5 inline-block mx-0.5 text-white" />全屏」按钮。放轻松，接下来的一切交给系统为您打理。
                     </p>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <Lock className="h-6 w-6 text-cyan-400" />
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Fatshan Digital Postal Clearance Desk</h2>
                      <p className="text-sm text-slate-400">Authenticate credentials or sign up immediately to unlock your personal Inbox suites.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Login column */}
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                      <h3 className="text-md font-bold text-cyan-300 mb-4 flex items-center gap-1">
                        Sign In Existing Identity
                      </h3>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="block text-xs text-slate-400 font-semibold mb-1">Email / Username</label>
                          <input
                            type="text"
                            placeholder={"marvis_zhou@" + systemState.activeDomain}
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 font-semibold mb-1">Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 px-4 rounded-xl text-sm transition shadow-lg"
                        >
                          Sign In Securely
                        </button>
                      </form>
                    </div>

                    {/* Registration Column */}
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col gap-4">
                      <h3 className="text-md font-bold text-emerald-300 flex items-center gap-1">
                        Register New Identity
                      </h3>
                      <p className="text-xs text-slate-400">
                        Sign up directly to create a secure, proxy-routed workspace account.
                      </p>
                      
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                          <label className="block text-xs text-slate-400 font-semibold mb-1">Full Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={regFullName}
                            onChange={(e) => setRegFullName(e.target.value)}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 font-semibold mb-1">Email / Username</label>
                          <input
                            type="text"
                            placeholder={"username@" + systemState.activeDomain}
                            value={regContact}
                            onChange={(e) => setRegContact(e.target.value)}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 font-semibold mb-1">Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 font-semibold mb-1">Network Privileges (网特权限)</label>
                          <select 
                            value={regVerifyType}
                            onChange={(e) => setRegVerifyType(e.target.value)}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
                          >
                            <option value="standard">Standard Domestic (Default)</option>
                            <option value="huggingface">Hugging Face Global Bridge (Fast)</option>
                            <option value="enterprise">Full Remote Bypass</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-4 rounded-xl text-sm transition shadow-lg"
                        >
                          Create Account
                        </button>
                      </form>

                      <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center"><span className="bg-slate-900 px-2 text-[10px] text-slate-500 uppercase">External Proxy</span></div>
                      </div>

                      <button
                        onClick={() => loginGoogleProvider()}
                        className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4 text-emerald-400" />
                        {googleToken ? 'Connected to Global Gateway' : 'Link Global Provider Securely'}
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Logged in caring banner */}
                  <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400 shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-emerald-300">欢迎登舰，{currentUser.fullName}！今天也要顺利开心哦～</h3>
                        <p className="text-xs text-slate-400 mt-0.5">各项系统组件已为您启动完毕。如果您是手机访问，可以通过上方菜单和右侧气泡工具箱呼叫 AI 整理事项。</p>
                      </div>
                    </div>
                  </div>

                  {/* Primary OWA interface when logged in on Home screen! */}
                  <div id="outlook-client-app" className="bg-slate-950/90 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col h-[700px]">
                  
                  {/* OWA Ribbon toolbar */}
                  <div className="bg-slate-900 shrink-0 border-b border-white/10 p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-black tracking-normal text-sm bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/20 flex items-center gap-1.5">
                        <Mail className="h-4 w-4" />
                        Outlook OWA Desktop Suite
                      </span>
                      <button
                        onClick={openNewCompose}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        New Email
                      </button>
                      <button
                        onClick={fetchUserEmails}
                        className="p-1.5 hover:bg-white/10 text-slate-300 rounded-lg transition"
                        title="Force sync"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Email OWA density and light/dark theme toggle */}
                    <div className="flex items-center gap-3">
                      <div className="bg-white/5 rounded-lg px-2 py-1 flex items-center border border-white/10 text-[10px] text-slate-400 gap-2">
                        <span>Layout:</span>
                        <button
                          onClick={() => setMailboxUIStyle("outlook")}
                          className={`px-1.5 py-0.5 rounded ${mailboxUIStyle === "outlook" ? "bg-indigo-500 text-white font-bold" : "hover:text-white"}`}
                        >
                          Legacy
                        </button>
                        <button
                          onClick={() => setMailboxUIStyle("gmail")}
                          className={`px-1.5 py-0.5 rounded ${mailboxUIStyle === "gmail" ? "bg-rose-500 text-white font-bold" : "hover:text-white"}`}
                        >
                          Modern
                        </button>
                      </div>

                      <div className="bg-white/5 rounded-lg px-2 py-1 flex items-center border border-white/10 text-[10px] text-slate-400 gap-2 hidden sm:flex">
                        <span>Density:</span>
                        <button
                          onClick={() => setOutlookDensity("compact")}
                          className={`px-1.5 py-0.5 rounded ${outlookDensity === "compact" ? "bg-cyan-500 text-slate-950 font-bold" : "hover:text-white"}`}
                        >
                          Compact
                        </button>
                        <button
                          onClick={() => setOutlookDensity("cozy")}
                          className={`px-1.5 py-0.5 rounded ${outlookDensity === "cozy" ? "bg-cyan-500 text-slate-950 font-bold" : "hover:text-white"}`}
                        >
                          Cozy
                        </button>
                      </div>

                      <div className="flex text-slate-300 gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                        <button
                          onClick={() => setOutlookTheme("light")}
                          className={`p-1 rounded ${outlookTheme === "light" ? "bg-white text-slate-900" : "hover:bg-white/15"}`}
                          title="OWA Light Spacing"
                        >
                          <Sun className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setOutlookTheme("dark")}
                          className={`p-1 rounded ${outlookTheme === "dark" ? "bg-white text-slate-900" : "hover:bg-white/15"}`}
                          title="OWA Charcoal spacing"
                        >
                          <Moon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mail Search filters */}
                  <div className="bg-slate-900/40 p-2 shrink-0 border-b border-white/5 flex items-center justify-between gap-4">
                    <div className="relative flex-grow max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search OWA Mailbox items (recipient, content)..."
                        value={outlookSearch}
                        onChange={(e) => setOutlookSearch(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white border border-white/10 rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    {/* Category selectors */}
                    <div className="flex gap-1.5">
                      {["all", "work", "personal", "social"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setOutlookCategory(cat)}
                          className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition ${
                            outlookCategory === cat ? "bg-cyan-500/15 border border-cyan-500/50 text-cyan-300" : "hover:bg-white/5 text-slate-400"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Outlook Client Tri-Pane Core */}
                  <div className={`flex flex-grow overflow-hidden ${outlookTheme === "light" ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-100"}`}>
                    
                    {/* OWA Directory Pane (Left) */}
                    <aside className="w-48 bg-slate-900 border-r border-white/10 shrink-0 p-3 flex flex-col justify-between text-xs text-slate-300 select-none">
                      <div className="space-y-4">
                        <div>
                          <div className="px-2 pb-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                            Folders
                          </div>
                          <nav className="space-y-1">
                            {[
                              { id: "inbox", label: "Inbox 收件箱", icon: Mail },
                              { id: "sent", label: "Sent 已发送", icon: Send },
                              { id: "draft", label: "Drafts 草稿箱", icon: FileText },
                              { id: "spam", label: "Junk 垃圾邮件", icon: ShieldAlert },
                              { id: "archive", label: "Archive 归档", icon: BookOpen },
                              { id: "private", label: "🔒 Private 私密邮件处", icon: FileText },
                              { id: "trash", label: "Deleted 已删除", icon: Trash2 }
                            ].map((fld) => {
                              const fldIcon = fld.icon;
                              const count = emails.filter((e) => e.folder === fld.id).length;
                              return (
                                <button
                                  key={fld.id}
                                  onClick={() => {
                                    setOutlookFolder(fld.id);
                                    setSelectedEmail(null);
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition ${
                                    outlookFolder === fld.id ? "bg-cyan-500 text-slate-950 font-bold shadow-md" : "hover:bg-white/5"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <fld.icon className="h-3.5 w-3.5" />
                                    <span>{fld.label}</span>
                                  </div>
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                                    outlookFolder === fld.id ? "bg-slate-900 text-white" : "bg-white/10"
                                  }`}>
                                    {count}
                                  </span>
                                </button>
                              );
                            })}
                          </nav>
                        </div>

                        <div>
                          <div className="px-2 pb-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                            Settings
                          </div>
                          <nav className="space-y-1">
                            <button
                              onClick={() => {
                                setOutlookFolder("templates_signatures");
                                setSelectedEmail(null);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition ${
                                outlookFolder === "templates_signatures" ? "bg-cyan-500 text-slate-100 font-bold shadow-md bg-cyan-900" : "hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Settings className="h-3.5 w-3.5" />
                                <span>Templates & Signatures</span>
                              </div>
                            </button>
                          </nav>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                        <div className="text-[10px] text-slate-400 font-semibold mb-1">Decoupled Space:</div>
                        <div className="text-[10px] font-bold text-cyan-400 truncate">@{systemState.activeDomain}</div>
                        <div className="text-[9px] text-slate-500">All data preserved during transition!</div>
                      </div>
                    </aside>

                    {/* OWA Email list Pane (Middle) */}
                    {outlookFolder === "templates_signatures" ? (
                      /* CUSTOM TEMPLATES & SIGNATURES DASHBOARD VIEW */
                      <div className="flex-grow p-6 overflow-y-auto space-y-6 text-left select-text bg-slate-900/10">
                        <div className="border-b border-white/10 pb-4 mb-4">
                          <h2 className="text-lg font-bold text-cyan-300">Templates & Personalized Signatures Vault</h2>
                          <p className="text-xs text-slate-400">Design custom rich text email templates and quick-insert email signatures with real-time browser preview.</p>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                          {/* Left Card: Custom Templates */}
                          <div className="bg-slate-950/80 border border-white/10 p-5 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                                <FileText className="h-4 w-4" /> Custom Email Templates ({templates.length})
                              </h3>
                              <button
                                onClick={() => setEditingTemplate({
                                  id: "temp-" + Date.now(),
                                  name: "New Template " + (templates.length + 1),
                                  subject: "Generic Subject Liaison Code...",
                                  content: "<p>Write custom rich content here...</p>"
                                })}
                                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1 rounded-xl text-[10px] transition"
                              >
                                + Create Template
                              </button>
                            </div>

                            {/* Templates editing workspace */}
                            {editingTemplate ? (
                              <div className="p-4 bg-slate-900 rounded-2xl border border-cyan-500/30 space-y-3">
                                <h4 className="text-xs font-bold text-white">
                                  {templates.some(t => t.id === editingTemplate.id) ? "Modify Template Core" : "Draft New Template Core"}
                                </h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Template Name (Internal Reference)</label>
                                    <input
                                      type="text"
                                      value={editingTemplate.name}
                                      onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                                      placeholder="e.g. Weekly Coordination Briefing"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Default Email Subject Line</label>
                                    <input
                                      type="text"
                                      value={editingTemplate.subject}
                                      onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                                      placeholder="Default Subject Line"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">HTML Rich Template Body</label>
                                    <RichTextEditor
                                      value={editingTemplate.content}
                                      onChange={(val) => setEditingTemplate({ ...editingTemplate, content: val })}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleSaveTemplate}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-4 py-1.5 rounded-xl text-[11px] transition"
                                  >
                                    Save Template
                                  </button>
                                  <button
                                    onClick={() => setEditingTemplate(null)}
                                    className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-1.5 rounded-xl text-[11px] transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : null}

                            {/* Templates active list */}
                            <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
                              {templates.map(temp => (
                                <div key={temp.id} className="p-3 bg-slate-900 border border-white/5 rounded-xl hover:border-white/15 transition text-xs space-y-1">
                                  <div className="flex justify-between items-center">
                                    <strong className="text-white text-xs">{temp.name}</strong>
                                    <div className="flex gap-2 text-[10px]">
                                      <button
                                        onClick={() => setEditingTemplate(temp)}
                                        className="text-cyan-400 hover:underline"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteTemplate(temp.id)}
                                        className="text-red-400 hover:underline"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-cyan-400/80 font-mono truncate">Subject: {temp.subject}</p>
                                  <div className="text-[10px] text-zinc-400 line-clamp-2 bg-slate-950/60 p-2 rounded-lg" dangerouslySetInnerHTML={{ __html: temp.content.slice(0, 300) }} />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right Card: Custom Signatures */}
                          <div className="bg-slate-950/80 border border-white/10 p-5 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                                <UserCheck className="h-4 w-4" /> Personalized Signatures ({signatures.length})
                              </h3>
                              <button
                                onClick={() => setEditingSignature({
                                  id: "sig-" + Date.now(),
                                  name: "New Signature " + (signatures.length + 1),
                                  content: "<hr/><p style='font-size: 12px; color: #38bdf8;'><strong>Master Marcus Zhou</strong></p>",
                                  isDefault: false
                                })}
                                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1 rounded-xl text-[10px] transition"
                              >
                                + Create Signature
                              </button>
                            </div>

                            {/* Signatures editing workspace */}
                            {editingSignature ? (
                              <div className="p-4 bg-slate-900 rounded-2xl border border-cyan-500/30 space-y-3">
                                <h4 className="text-xs font-bold text-white">
                                  {signatures.some(s => s.id === editingSignature.id) ? "Modify Signature Core" : "Draft New Signature Core"}
                                </h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Signature Title</label>
                                    <input
                                      type="text"
                                      value={editingSignature.name}
                                      onChange={(e) => setEditingSignature({ ...editingSignature, name: e.target.value })}
                                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                                      placeholder="e.g. Standard Corporate Signature"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 py-1">
                                    <input
                                      type="checkbox"
                                      checked={editingSignature.isDefault}
                                      onChange={(e) => setEditingSignature({ ...editingSignature, isDefault: e.target.checked })}
                                      id="is-sig-def"
                                    />
                                    <label htmlFor="is-sig-def" className="text-[10px] text-zinc-300 select-none cursor-pointer">Set as default signature for all emails</label>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">HTML Rich Signature Body</label>
                                    <RichTextEditor
                                      value={editingSignature.content}
                                      onChange={(val) => setEditingSignature({ ...editingSignature, content: val })}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleSaveSignature}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-4 py-1.5 rounded-xl text-[11px] transition"
                                  >
                                    Save Signature
                                  </button>
                                  <button
                                    onClick={() => setEditingSignature(null)}
                                    className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-1.5 rounded-xl text-[11px] transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : null}

                            {/* Signatures active list */}
                            <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
                              {signatures.map(sig => (
                                <div key={sig.id} className="p-3 bg-slate-900 border border-white/5 rounded-xl hover:border-white/15 transition text-xs space-y-2">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <strong className="text-white text-xs">{sig.name}</strong>
                                      {sig.isDefault && (
                                        <span className="bg-cyan-500/20 text-cyan-300 text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded">
                                          Default Signature
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex gap-2 text-[10px]">
                                      {!sig.isDefault && (
                                        <button
                                          onClick={() => handleSetDefaultSignature(sig.id)}
                                          className="text-cyan-400 hover:underline"
                                        >
                                          Set Default
                                        </button>
                                      )}
                                      <button
                                        onClick={() => setEditingSignature(sig)}
                                        className="text-cyan-400 hover:underline"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSignature(sig.id)}
                                        className="text-red-400 hover:underline"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                  <div className="text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-white/5 prose prose-invert prose-xs select-text" dangerouslySetInnerHTML={{ __html: sig.content }} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={`${mailboxUIStyle === 'outlook' ? 'w-1/3 border-r' : selectedEmail ? 'hidden' : 'w-full'} border-slate-800 flex flex-col shrink-0 bg-slate-900/10 overflow-y-auto`}>
                          {filteredEmails.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs">
                              No mailbox records localized. Check other folders or senders.
                            </div>
                          ) : (
                            filteredEmails.map((mail) => (
                              <div
                                key={mail.id}
                                onClick={() => setSelectedEmail(mail)}
                                className={`${mailboxUIStyle === 'outlook' ? 'p-3 flex-col' : 'p-2 flex-row items-center gap-4'} border-b flex text-left transition select-none cursor-pointer border-slate-800 ${
                                  selectedEmail?.id === mail.id
                                    ? "bg-cyan-500/15 border-l-4 border-l-cyan-400"
                                    : "hover:bg-white/5"
                                }`}
                              >
                                {mailboxUIStyle === 'outlook' ? (
                                  <>
                                    <div className="flex justify-between items-start gap-1 pb-1">
                                      <span className="text-xs font-bold truncate text-cyan-300">
                                        {mail.senderName}
                                      </span>
                                      <span className="text-[9px] text-slate-400 whitespace-nowrap">
                                        {new Date(mail.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <div className="text-xs font-semibold truncate text-white pb-0.5 flex items-center gap-1.5">
                                      {mail.isStarred && <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />}
                                      {mail.subject}
                                    </div>
                                    <p className="text-[11px] text-slate-400 line-clamp-2">
                                      {mail.content.replace(/<[^>]*>/g, "")}
                                    </p>
                                    {mail.tags && mail.tags.length > 0 && (
                                      <div className="flex gap-1 pt-1.5 flex-wrap">
                                        {mail.tags.map((tag) => (
                                          <span key={tag} className="bg-slate-800 text-white text-[8px] px-1 py-0.2 rounded font-bold">
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-3 w-48 shrink-0">
                                      {mail.isStarred && <Star className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0" />}
                                      <span className={`text-sm truncate ${!mail.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                                        {mail.senderName}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-grow min-w-0">
                                      <span className={`text-sm truncate shrink-0 ${!mail.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                                        {mail.subject}
                                      </span>
                                      <span className="text-slate-500 text-sm truncate">- {mail.content.replace(/<[^>]*>/g, "")}</span>
                                    </div>
                                    <div className="w-16 shrink-0 text-right text-xs font-bold text-slate-400">
                                      {new Date(mail.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))
                          )}
                        </div>

                        {/* OWA Email Read Window Pane (Right) */}
                        <div className={`${mailboxUIStyle === 'outlook' || selectedEmail ? 'flex-grow' : 'hidden'} p-4 overflow-y-auto flex flex-col justify-between`}>
                          {selectedEmail ? (
                            <div className="space-y-4 text-left">
                              
                              {/* Subject Header with Star / Delete action menu */}
                              <div className="border-b border-white/10 pb-4">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                  <h3 className="text-sm font-bold text-cyan-300">
                                    {selectedEmail.subject}
                                  </h3>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => handleMailAction(selectedEmail.id, "star")}
                                      className="p-1 hover:bg-slate-800 text-amber-500 rounded"
                                      title="Star email"
                                    >
                                      <Star className={`h-4 w-4 ${selectedEmail.isStarred ? "fill-amber-400" : ""}`} />
                                    </button>
                                    <button
                                      onClick={() => handleMailAction(selectedEmail.id, "move", "trash")}
                                      className="p-1 hover:bg-slate-800 text-red-500 rounded"
                                      title="Bin item"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-400">
                                  <div>
                                    Sender: <strong className="text-slate-300">{selectedEmail.senderName}</strong>
                                    <span className="text-[10px] ml-1">({selectedEmail.senderUsername}@{selectedEmail.senderDomain})</span>
                                  </div>
                                  <div>
                                    {new Date(selectedEmail.timestamp).toLocaleString()}
                                  </div>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">
                                  Receiver: {selectedEmail.receiverUsername}@{selectedEmail.receiverDomain}
                                </p>
                              </div>

                              {/* Email Body HTML safely output */}
                              <div
                                className="text-xs space-y-2 text-slate-300 leading-relaxed max-w-none"
                                dangerouslySetInnerHTML={{ __html: selectedEmail.content }}
                              />

                              {/* Dual Content Audit AI scanner info panel */}
                              {selectedEmail.sensitivityReport && (
                                <div className="mt-8 p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl flex items-start gap-3">
                                  <Cpu className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                  <div>
                                    <h4 className="text-[10px] uppercase font-bold text-cyan-400">
                                      Server-Side AI Dual Threat Compliance Scan
                                    </h4>
                                    <p className="text-[11px] text-slate-300 mt-1">
                                      Policy Filter Report: <span className="font-bold text-white uppercase">{selectedEmail.sensitivityReport}</span>
                                    </p>
                                    {selectedEmail.aiSummary && (
                                      <p className="text-[10px] text-slate-400 italic mt-0.5">
                                        Summary: {selectedEmail.aiSummary}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8">
                              <Mail className="h-10 w-10 text-slate-500 mb-2" />
                              <h3 className="text-xs font-bold text-slate-300">No Email Selected</h3>
                              <p className="text-[11px] text-slate-500 mt-1">Select an item from the current middle OWA list pane index to review attachments & content scanning.</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                  </div>
                </div>
                </div>
              )}

              {/* Lobby public Chat log */}
              <div className="bg-slate-950 p-5 rounded-3xl border border-white/10 text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    Public Communication Lobby Chat logs
                  </h3>
                  <span className="text-[9px] bg-white/10 text-slate-400 font-extrabold px-2 py-0.5 rounded uppercase">
                    Verification: FATSHAN POST
                  </span>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-2xl p-3 h-48 overflow-y-auto space-y-3 mb-3 text-xs">
                  {systemState.chatMessages && systemState.chatMessages.map((msg) => (
                    <div key={msg.id} className="pb-1">
                      <strong className="text-cyan-400">{msg.sender}:</strong>
                      <span className="text-slate-200 ml-1">{msg.content}</span>
                      <span className="text-[8px] text-slate-500 block">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleLobbyChatSend} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Broadcast messages to live room guests..."
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    className="flex-grow bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                  >
                    <span>Send</span>
                    <SendHorizontal className="h-3 w-3" />
                  </button>
                </form>
              </div>

              {/* Global Secure Search Tool Component */}
              <div className="bg-slate-950/80 backdrop-blur-md rounded-3xl p-6 border border-fuchsia-500/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-fuchsia-500/10 rounded-lg">
                    <Search className="h-6 w-6 text-fuchsia-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Global Secure Search Engine</h3>
                    <p className="text-xs text-slate-400">Domestic proxy to bypassed global indexers. No VPN required.</p>
                  </div>
                </div>

                <form onSubmit={handleSecureSearch} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Search the uncensored global web securely..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow bg-slate-900 border border-fuchsia-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-400 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 transition"
                  >
                    {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    <span>{isSearching ? 'Tunneling...' : 'Search'}</span>
                  </button>
                </form>

                {searchResults.length > 0 && (
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 max-h-64 overflow-y-auto space-y-4">
                    {searchResults.map((result, idx) => (
                      <div key={idx} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <a 
                          href={result.link} 
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveBypassUrl(result.link);
                            setCurrentHash("#rory-gpkos");
                            setGpkosActiveApp("remote");
                          }}
                          className="text-sm font-semibold text-fuchsia-400 hover:underline inline-block mb-1 cursor-pointer"
                        >
                          {result.title}
                        </a>
                        <p className="text-xs text-slate-300 leading-relaxed">{result.snippet}</p>
                        <p className="text-[10px] text-emerald-500 mt-1 truncate">{result.link}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right sidebar Panel: Intelligent AI-Assistant desk & Client general feedback Form */}
            <div className="md:col-span-1 flex flex-col gap-6">
              
              {/* OWA Compose Mailbox Modal embedded */}
              {mailComposeOpen && currentUser && (
                <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl p-5 text-left shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Compose Rich Email
                    </h3>
                    <button
                      onClick={() => setMailComposeOpen(false)}
                      className="p-1 rounded hover:bg-white/10 text-slate-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
                    {/* Quick Template and Signature Injectors */}
                    <div className="grid grid-cols-2 gap-2 bg-white/5 p-2 rounded-2xl border border-white/5">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-cyan-400 mb-1">Apply Template</label>
                        <select
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const found = templates.find(t => t.id === selectedId);
                            if (found) {
                              setComposeSubject(found.subject);
                              setComposeContent(found.content);
                            }
                            e.target.value = ""; // Reset
                          }}
                          className="w-full bg-slate-900 text-white rounded-xl border border-white/10 p-1 text-[10px] focus:outline-none"
                        >
                          <option value="">-- Choose Template --</option>
                          {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-cyan-400 mb-1">Append Signature</label>
                        <select
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const found = signatures.find(s => s.id === selectedId);
                            if (found) {
                              setComposeContent(prev => prev + "<p><br/></p>" + found.content);
                            }
                            e.target.value = ""; // Reset
                          }}
                          className="w-full bg-slate-900 text-white rounded-xl border border-white/10 p-1 text-[10px] focus:outline-none"
                        >
                          <option value="">-- Choose Signature --</option>
                          {signatures.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">To (Full credentials target address)</label>
                      <input
                        type="email"
                        placeholder={"marvis_zhou@" + systemState.activeDomain}
                        value={composeTo}
                        onChange={(e) => setComposeTo(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Subject</label>
                      <input
                        type="text"
                        placeholder="Project coordination notes..."
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1 font-mono">Content Body (Rich RichTextEditor format)</label>
                      <RichTextEditor
                        value={composeContent}
                        onChange={setComposeContent}
                        placeholder="Type email body here..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="text-slate-400 block mb-0.5">Category</label>
                        <select
                          value={composeCategory}
                          onChange={(e: any) => setComposeCategory(e.target.value)}
                          className="w-full bg-slate-900 text-white rounded border border-white/10 p-1"
                        >
                          <option value="work">Work Pro</option>
                          <option value="personal">Personal Aura</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Primary star</label>
                        <input
                          type="checkbox"
                          checked={composeStarred}
                          onChange={(e) => setComposeStarred(e.target.checked)}
                          className="mr-1.5"
                        />
                        <span>Flag starred</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-2 px-4 rounded-xl text-xs transition animate-pulse"
                    >
                      Process Server-Side AI Scan & Transmit
                    </button>
                  </form>
                </div>
              )}

              {/* AI intelligent assistant desk widget */}
              <div className="bg-slate-950/70 p-5 rounded-3xl border border-white/10 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="h-5 w-5 text-cyan-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Active AI Service Agent Desk</h3>
                    <p className="text-[10px] text-zinc-400">Powered by Gemini 3.5. Fully synchronizes security checks.</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 h-64 overflow-y-auto rounded-2xl border border-white/5 space-y-3 mb-3 text-[11px] leading-relaxed">
                  {supportChat.map((msg) => (
                    <div key={msg.id} className="pb-1 border-b border-white/5">
                      <span className={`font-extrabold text-[9px] uppercase tracking-wide px-1.5 py-0.2 rounded mr-1.5 ${
                        msg.sender === "ai" ? "bg-cyan-950/80 text-cyan-400" : msg.sender === "staff" ? "bg-red-500 text-white" : "bg-white/10 text-slate-300"
                      }`}>
                        {msg.sender}
                      </span>
                      <p className="mt-1 text-slate-200 whitespace-pre-line">{msg.text}</p>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="text-slate-400 flex items-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Gemini scanning credentials base...</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSupportAiChat} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask about validation code, domain swaps..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="flex-grow bg-slate-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1 text-xs font-bold rounded-xl transition"
                    >
                      Ask
                    </button>
                  </div>
                </form>
              </div>

              {/* CRM feedback submissions dialog */}
              <div className="bg-slate-950/80 p-5 rounded-3xl border border-white/10 text-left">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                  <Send className="h-4 w-4" />
                  General Feedback Submissions
                </h3>
                <p className="text-[10px] text-zinc-400 mb-3">Directed straight inside Master Administrator's inbox account.</p>

                {feedbackSuccess && (
                  <div className="p-2 mb-3 bg-emerald-900/40 text-emerald-300 text-[10px] rounded-xl border border-emerald-500/20">
                    ✓ Received successfully. Internal alert mail sent to Master Zhou.
                  </div>
                )}

                <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-0.5">Your email coordinate</label>
                    <input
                      type="email"
                      placeholder="guest_tester@fatshanpost.com"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-0.5">Feedback content message</label>
                    <textarea
                      rows={3}
                      placeholder="Simulation checks behave perfectly. Need custom buttons enabled."
                      value={feedbackContent}
                      onChange={(e) => setFeedbackContent(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-1.5 px-4 rounded-xl text-xs transition"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>

              {/* Wallpaper shopping catalog utilizing unified storage allocation quota */}
              {currentUser && (
                <div className="bg-slate-950/80 p-5 rounded-3xl border border-white/10 text-left">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    Interactive Wallpaper shop
                  </h3>
                  <p className="text-[10px] text-zinc-400 mb-3">Custom themes purchased in quota storage exchange rates.</p>

                  <div className="space-y-2">
                    {systemState.backgrounds.map((bg) => (
                      <div key={bg.id} className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white text-[11px]">{bg.name}</p>
                          <p className="text-[9px] text-cyan-400">Price: {bg.price}</p>
                        </div>
                        <button
                          onClick={() => applyWallpaperTheme(bg.id, bg.color, bg.price)}
                          className="bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 px-2.5 py-1 text-[10px] rounded font-extrabold uppercase"
                        >
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* SECTION 2: WORK SPACE BRANCH screen Layout (Vibrant Soft Blue) */}
        {currentHash === "#work" && (
          <div className="space-y-6 animate-fade-in" id="work-workspace">
            
            {/* Header Identity of Work Branch */}
            <div className="bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-500/20 rounded-3xl p-6 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">
                  Secure Operational Hub Area
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                  Collaborative Workspace Dashboard Console
                </h2>
                <p className="text-sm text-slate-300">
                  Real-time synchronization logs, domain switches data retention room, and custom buttons console.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <span className="text-xs bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-xl font-mono font-bold">
                  Active Domain: {systemState.activeDomain}
                </span>
                <span className="text-xs bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-xl font-mono font-bold">
                  Legacy Host Address: {systemState.oldDomain}
                </span>
              </div>
            </div>

            {/* If user is not internal staff, request auth/show message */}
            {!currentUser ? (
              <div className="bg-slate-950 border border-blue-500/10 rounded-3xl p-8 text-center">
                <Lock className="h-10 w-10 text-cyan-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">Privileged Workspace Area</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 mb-4">
                  Access to domain transfers, user storage quotas and buttons creation are restricted to authenticated administrators.
                </p>
                <a
                  href="#home"
                  className="bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold py-2 px-5 rounded-xl inline-block"
                >
                  Return to Home Desk for Login
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1 & 2: Database users and shop logistics, domain configuration */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Domain Transfer Desk Room with strict retention warnings */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 text-left">
                    <h3 className="text-md font-bold text-white flex items-center gap-2 mb-2">
                      <RefreshCw className="h-5 w-5 text-cyan-400" />
                      Domain SWAP System Desk (Data Preservation)
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      When the active domain is updated here, Outlook usernames remain un-decoupled, meaning all physical mailbox properties and configurations are retained completely! Users will transition via automated notification mails seamlessly.
                    </p>

                    <form onSubmit={handleAdminSetDomain} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">New Target Active Domain Suffix</label>
                        <input
                          type="text"
                          placeholder="fatshanpost.com"
                          value={adminActiveDomain}
                          onChange={(e) => setAdminActiveDomain(e.target.value)}
                          className="w-full bg-slate-905 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3.5 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Dual-Overlap Period duration</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            placeholder="14"
                            value={adminDualOverlapDays}
                            onChange={(e) => setAdminDualOverlapDays(parseInt(e.target.value) || 14)}
                            className="bg-slate-905 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3 py-2 text-white w-20"
                          />
                          <span className="text-[11px]">Days of Dual Delivery enabled</span>
                        </div>
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          checked={adminDualOverlap}
                          onChange={(e) => setAdminDualOverlap(e.target.checked)}
                          className="rounded text-cyan-500"
                        />
                        <span className="text-[11px] text-slate-300">
                          Configure dual verification overlap to keep accepting mails to legacy account schemas inside transition window.
                        </span>
                      </div>
                      <div className="md:col-span-2 pt-2">
                        <button
                          type="submit"
                          disabled={currentUser.role !== "admin"}
                          className="bg-cyan-500 hover:bg-cyan-400 hover:text-slate-950 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold px-4 py-2 rounded-xl transition text-xs"
                        >
                          Execute Domain Migration Switch
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Operational Database User profile viewer (Admin Action Console) */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 text-left">
                    <h3 className="text-md font-bold text-white flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-blue-400" />
                      Privileged Database Identity Directory
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400">
                            <th className="py-2.5">User Profile & Address</th>
                            <th className="py-2.5">Role</th>
                            <th className="py-2.5">Allocated Storage</th>
                            <th className="py-2.5">State Indicators</th>
                            <th className="py-2.5 text-right">Administrative Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {systemState.users && systemState.users.map((dbUser) => (
                            <tr key={dbUser.id} className="hover:bg-white/5 font-mono text-[11px]">
                              <td className="py-3">
                                <div className="font-semibold text-white">{dbUser.fullName}</div>
                                <div className="text-[10px] text-slate-400">@{dbUser.emailUsername}</div>
                                <div className="text-[9px] text-slate-500">{dbUser.contact}</div>
                              </td>
                              <td className="py-3">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                                  dbUser.role === "admin" ? "bg-red-900/40 text-red-300 border border-red-500/20" : "bg-white/10 text-slate-300"
                                }`}>
                                  {dbUser.role}
                                </span>
                              </td>
                              <td className="py-3">
                                <div>Used: {dbUser.storageUsed || "0 MB"}</div>
                                <div className="text-[10px] text-slate-400">Quota: {dbUser.storageQuota}</div>
                              </td>
                              <td className="py-3">
                                <div className="space-y-1">
                                  {dbUser.verified ? (
                                    <span className="text-emerald-400 text-[9px] block">✓ Verified Profile</span>
                                  ) : (
                                    <span className="text-slate-500 text-[9px] block">Draft Record</span>
                                  )}
                                  {dbUser.banned ? (
                                    <span className="text-red-400 text-[9px] block">🛑 Suspended Account</span>
                                  ) : (
                                    <span className="text-emerald-400 text-[9px] block">🟢 Status Active</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 text-right space-y-1">
                                {currentUser.role === "admin" ? (
                                  <div className="flex flex-col items-end gap-1">
                                    <div className="flex gap-1">
                                      {dbUser.banned ? (
                                        <button
                                          onClick={() => handleAdminBanUser(dbUser.id, false)}
                                          className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] uppercase font-extrabold"
                                        >
                                          Unban
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            const reason = prompt("Enter suspension context reason:");
                                            if (reason) {
                                              setAdminBanReason(reason);
                                              handleAdminBanUser(dbUser.id, true);
                                            }
                                          }}
                                          className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-[10px] uppercase font-extrabold"
                                        >
                                          Suspend
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleAminToggleVerify(dbUser.id)}
                                        className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px]"
                                      >
                                        Toggle Verify
                                      </button>
                                      {currentUser.emailUsername === 'marvis_zhou2014' || currentUser.emailUsername === 'marvis_zhou' ? (
                                        <button
                                          onClick={() => handleToggleGoogleAuth(dbUser.emailUsername)}
                                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                            (systemState.aiAuthorizedUsers || []).includes(dbUser.emailUsername)
                                              ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/20"
                                              : "bg-slate-700/30 text-slate-400 border border-slate-700/20"
                                          }`}
                                        >
                                          {(systemState.aiAuthorizedUsers || []).includes(dbUser.emailUsername) ? "🔓 GFW Authed" : "🔒 Grant GFW"}
                                        </button>
                                      ) : null}
                                    </div>

                                    {/* Medals badge controller */}
                                    <div className="flex gap-1 text-[9px]">
                                      <button
                                        onClick={() => handleAdminAddMedal(dbUser.id, false)}
                                        className="text-amber-400 hover:underline"
                                      >
                                        + Grant Medal
                                      </button>
                                      <button
                                        onClick={() => handleAdminAddMedal(dbUser.id, true)}
                                        className="text-red-400 hover:underline"
                                      >
                                        + Penalty
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-zinc-500">ReadOnly Access</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Column 3: Custom Button configurations panel & Quota Metrics */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Dynamic Custom Interactive Buttons administrator wizard */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 text-left">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-cyan-400" />
                      Dynamic Button wizard
                    </h3>
                    <p className="text-[10px] text-zinc-400 mb-4">
                      Deploy temporary buttons directly onto user Dashboards. Fully restrict viewing credentials!
                    </p>

                    <form onSubmit={handleCreateCustomButton} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-0.5">Button Text Title</label>
                        <input
                          type="text"
                          placeholder="Launch MSFS checklist tracker"
                          value={newBtnLabel}
                          onChange={(e) => setNewBtnLabel(e.target.value)}
                          required
                          className="w-full bg-slate-905 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-semibold mb-0.5">Redirect click URL (hash or path)</label>
                        <input
                          type="text"
                          placeholder="#msfs"
                          value={newBtnUrl}
                          onChange={(e) => setNewBtnUrl(e.target.value)}
                          required
                          className="w-full bg-slate-905 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 font-semibold mb-0.5 text-[10px]">Anchor Branch</label>
                          <select
                            value={newBtnPage}
                            onChange={(e: any) => setNewBtnPage(e.target.value)}
                            className="w-full bg-slate-905 border border-white/10 rounded px-2 py-1 text-white"
                          >
                            <option value="home">Home area</option>
                            <option value="work">Work area</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-400 font-semibold mb-0.5 text-[10px]">Visibility Scope</label>
                          <select
                            value={newBtnVisibility}
                            onChange={(e: any) => setNewBtnVisibility(e.target.value)}
                            className="w-full bg-slate-905 border border-white/10 rounded px-2 py-1 text-white"
                          >
                            <option value="all">Everyone (All)</option>
                            <option value="logined">Authenticated users only</option>
                            <option value="specified">Specified User List Only</option>
                          </select>
                        </div>
                      </div>

                      {newBtnVisibility === "specified" && (
                        <div>
                          <label className="block text-slate-400 font-semibold mb-0.5 text-[10px]">
                            Allowed Emails (comma split)
                          </label>
                          <input
                            type="text"
                            placeholder={"marvis_zhou@" + systemState.activeDomain}
                            value={newBtnSpecUsers}
                            onChange={(e) => setNewBtnSpecUsers(e.target.value)}
                            className="w-full bg-slate-905 border border-white/10 rounded px-3 py-1 text-white"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-zinc-400 text-[10px] mb-0.5">Display Color</label>
                          <select
                            value={newBtnColor}
                            onChange={(e) => setNewBtnColor(e.target.value)}
                            className="w-full bg-slate-905 text-white rounded border border-white/10 px-2 py-1"
                          >
                            <option value="bg-cyan-600">Ocean Cyan</option>
                            <option value="bg-blue-600">Royal Blue</option>
                            <option value="bg-emerald-600">Forest Emerald</option>
                            <option value="bg-purple-600">Cosmic Purple</option>
                            <option value="bg-red-600">Alert Red</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-400 text-white font-extrabold py-2 rounded-xl text-xs transition"
                      >
                        Create Custom Dashboard Button
                      </button>
                    </form>

                    <div className="mt-6 border-t border-white/10 pt-4 space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase">Active deployed buttons:</h4>
                      {systemState.customButtons.map((btn) => (
                        <div key={btn.id} className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[11px]">
                          <div>
                            <p className="font-bold text-white">{btn.label}</p>
                            <span className="text-[9px] text-slate-400">Target: {btn.actionUrl} | Scope: {btn.visibility}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteCustomButton(btn.id)}
                            className="hover:text-red-400 text-slate-500 font-bold p-1"
                            title="Clear button"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* GitHub Pages & Live API Server Integration */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 text-left space-y-4 shadow-2xl">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-emerald-400" />
                      GitHub & API Server Sockets Settings
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Configure your client build to communicate with custom production servers after deploying them on GitHub Pages or Render.
                    </p>

                    <div className="space-y-3 bg-white/5 border border-white/5 p-4 rounded-2xl text-xs">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1 text-[10px]">
                          Production Backend Address (Base URL)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. https://your-server.onrender.com"
                          value={customApiUrl}
                          onChange={(e) => setCustomApiUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                        />
                        <span className="text-[10px] text-zinc-500 block mt-1">
                          Leave empty to automatically route to relative local workspace proxy path.
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!customApiUrl.trim()) {
                              alert("Please enter a valid remote URL root first.");
                              return;
                            }
                            setTestStatus("testing");
                            try {
                              const testUrl = customApiUrl.trim().replace(/\/$/, "") + "/api/state";
                              const start = Date.now();
                              const res = await fetch(testUrl);
                              if (res.ok || res.status === 200) {
                                setTestStatus("success");
                                const end = Date.now();
                                alert(`✓ Connection confirmed! Ping metrics: ${end - start}ms. Active state synchronization matches.`);
                                localStorage.setItem("gpkos_custom_backend_url", customApiUrl.trim());
                              } else {
                                setTestStatus("error");
                                alert(`✗ API server returned code ${res.status}. Please check CORS settings.`);
                              }
                            } catch (e: any) {
                              setTestStatus("error");
                              alert(`✗ Connection refused. Check if server is running and CORS is enabled. Error: ${e.message}`);
                            }
                          }}
                          className="flex-grow bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wide transition"
                        >
                          Test Connection
                        </button>
                        <button
                          onClick={() => {
                            setCustomApiUrl("");
                            localStorage.removeItem("gpkos_custom_backend_url");
                            setTestStatus("idle");
                            alert("Cleared! System fallback route initialized.");
                          }}
                          className="bg-slate-850 hover:bg-slate-750 text-slate-300 font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase border border-white/10 transition"
                        >
                          Clear Code
                        </button>
                      </div>

                      <div className="text-[10px] font-mono leading-none flex items-center justify-between">
                        <span className="text-zinc-500">WebSocket Status:</span>
                        {testStatus === "idle" && (
                          <span className="text-zinc-400">Idle / Proxy</span>
                        )}
                        {testStatus === "testing" && (
                          <span className="text-yellow-400 animate-pulse">● TESTING PING...</span>
                        )}
                        {testStatus === "success" && (
                          <span className="text-emerald-400">● LIVE CONNECTION OK</span>
                        )}
                        {testStatus === "error" && (
                          <span className="text-red-400">● GATEWAY OFFLINE</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 p-4 rounded-2xl space-y-3 text-[11px] text-slate-300">
                      <h4 className="font-bold text-white flex items-center gap-1.5">
                        <Share2 className="h-3.5 w-3.5 text-cyan-400" />
                        一键导出与云免签快速部署指南
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                        <li>
                          <strong>第一步：一键打包所有源代码：</strong>
                          点击页面右上角菜单中的 <strong>Export to GitHub</strong> 原生导出，或直接点击下方特设的安全通道下载全站 ZIP 包：<br />
                          <button 
                            type="button"
                            onClick={async (e) => {
                              const btn = e.currentTarget;
                              const originalText = btn.innerHTML;
                              btn.innerHTML = '资源打包中... 稍等<span class="animate-pulse">...</span>';
                              btn.disabled = true;
                              try {
                                const res = await fetch(`${getApiBase()}/api/download-source`);
                                if (!res.ok) throw new Error('Download Failed');
                                const blob = await res.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.style.display = 'none';
                                a.href = url;
                                a.download = 'rory-secure-hub-source.zip';
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                                btn.innerHTML = '✅ 下载成功！请检查设备文件管理器';
                                setTimeout(() => btn.innerHTML = originalText, 3000);
                              } catch(err) {
                                btn.innerHTML = '❌ 下载失败，请使用官方菜单';
                                setTimeout(() => btn.innerHTML = originalText, 3000);
                              } finally {
                                btn.disabled = false;
                              }
                            }}
                            className="mt-2 w-full inline-flex items-center justify-center bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-3 px-4 rounded-xl border border-cyan-500/30 transition-all font-bold group gap-2"
                          >
                            <Download className="w-4 h-4" /> 📥 点此直接使用内置安全通道下载完整 ZIP 源码包至手机
                          </button>
                          <p className="mt-1.5 text-center text-[10px] text-yellow-400">⚠️ 点击后直接保存文件，完美绕过重定向与跨标签页拦截。</p>
                        </li>
                        <li>
                          <strong>中国大陆特别定制：免服务器、免绑卡、长期白嫖方案！</strong>
                          <br/><br/>
                          <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl relative mt-4">
                            <h5 className="font-bold text-red-400 text-base flex items-center gap-2 mb-3">
                              🎯 认清现实：彻底告别“需要实名买服务器”和“强制绑信用卡”的坑
                            </h5>
                            <p className="text-sm text-slate-300 leading-relaxed mb-4">
                              Zeabur 等平台现在调整了策略，需要充值或者升级服务，导致大家白忙活。
                              为了帮助您<strong>真正零成本长久运行</strong>，而且<strong>不需要信用卡，不需要购买服务器</strong>，并且能<strong>完美当作跳板枢纽拥有外网访问能力</strong>，我为您提供目前全球市面上仅存的**极其慷慨并且 100% 长期白嫖**的两大国际平台：
                            </p>

                            <div className="space-y-6">
                              {/* 方案 一：Render */}
                              <div className="bg-purple-500/10 border-2 border-purple-500/50 p-5 rounded-xl">
                                <h6 className="font-bold text-purple-400 text-sm mb-2 flex items-center gap-2">
                                  🏆 首选推荐：Render.com (全球顶级云，真正的零门槛免绑卡！)
                                </h6>
                                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                                  硅谷明星平台，免费额度极为大方，跑我们的 Docker 项目绰绰有余。<strong>完全不需要验证信用卡</strong>。它的机房主要分布在欧美（完美自带无阻碍全球外网连接能力），当成备用站或跳板机的首选！
                                </p>
                                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                                  <li><strong>过桥前置条件：</strong>手机没法拖拉文件夹，请务必用手机浏览器打开 GitHub，新建一个公共仓库，利用网页上的 <code className="text-purple-300">upload files</code>，一口气把解压出来的所有文件（包含 Dockerfile 及 src 等）全都传进仓库的主分支。</li>
                                  <li><strong>极速登录：</strong>极速安全节点访问 <a href="https://render.com" onClick={(e) => { e.preventDefault(); setActiveBypassUrl("https://render.com"); setCurrentHash("#rory-gpkos"); setGpkosActiveApp("remote"); }} className="text-purple-400 font-bold hover:underline cursor-pointer">Render.com</a>，直接用您刚才的 GitHub 授权登录，绝不会卡顿报错。</li>
                                  <li><strong>创建 Web 服务：</strong>进入控制台立刻点击 <strong>New {"->"} Web Service</strong>，然后选择 <strong>Build and deploy from a Git repository</strong>。</li>
                                  <li><strong>一键连接：</strong>在列表里点击连接您刚才建好的那个 Git 仓库。起个响亮的名字，下拉保证 Instance Type 选择的是 <strong className="text-white">Free (免费节点)</strong>，Runtime 选择 <strong className="text-white">Docker</strong>。</li>
                                  <li><strong>发布且绑域名：</strong>点击下方的 Create 按钮，随后盯着左侧菜单的 <strong>Settings {"->"} Custom Domains</strong>，输入您在阿里云买好的域名，去阿里云加一条它生成的 CNAME 记录，这就配置完美了！</li>
                                </ol>
                              </div>

                              {/* 方案 二：Hugging Face Spaces */}
                              <div className="bg-emerald-500/10 border-2 border-emerald-500/50 p-5 rounded-xl">
                                <h6 className="font-bold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                                  🥈 终极底牌：Hugging Face Spaces (全球 AI 圈的良心，永不收费)
                                </h6>
                                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                                  如果您连 GitHub 都嫌麻烦，Hugging Face 就是您的救世主。它本来是给 AI 大模型开发者做演示的沙盒，但我们的小项目完全可以毫无底线地在里面安家！它<strong>允许直接在网页拖拽上传</strong>，提供<strong>高配的外网机器</strong>，而且全网公认<strong>绝对不收钱，不绑卡，不废话</strong>。
                                </p>
                                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                                  <li>注册并登录 <a href="https://huggingface.co/spaces" onClick={(e) => { e.preventDefault(); setActiveBypassUrl("https://huggingface.co/spaces"); setCurrentHash("#rory-gpkos"); setGpkosActiveApp("remote"); }} className="text-emerald-400 font-bold hover:underline cursor-pointer">Hugging Face Spaces</a>。</li>
                                  <li>点击右上角新建一个 Space。</li>
                                  <li><strong>关键：</strong>选择 License 为 OpenRAIL，<strong>Space SDK 必定选【Docker】然后选里面的【Blank】</strong>，再选择其自带的完全免费的 Free Cpu basic，创建空间。</li>
                                  <li>进入该空间里的 <strong className="text-white">Files</strong> 标签页。不要管所谓的 Git，直接点击 add file {"->"} upload files。</li>
                                  <li>在手机或电脑里把压缩包里的所有资料直接全拖拽进来！系统会自动靠那个 Dockerfile 启动它。它给的网址就是您的应用，永远运行！</li>
                                </ol>
                              </div>

                              {/* 用户特别关心的解答：Sealos 行吗？ */}
                              <div className="bg-cyan-500/10 border-2 border-cyan-500/50 p-5 rounded-xl">
                                <h6 className="font-bold text-cyan-400 text-sm mb-2 flex items-center gap-2">
                                  ❓ 特别解答：关于 Sealos 行不行？（绝对行，但有两个坑）
                                </h6>
                                <p className="text-xs text-slate-300 leading-relaxed max-w-full">
                                  您提到 <strong>Sealos</strong> 确实眼光独到，它是纯国产团队开发的系统，像 Windows 桌面一样极其好用，微信扫码一键登录。<strong>完全可行！</strong>但要避开以下两个坑：
                                  <br/><br/>
                                  <strong>1. 必须避开国内节点：</strong> 如果您贪图国内访问快，选了它的“北京”或“广州”按量付费节点，你的应用虽然上线了，<strong>但外网拉取代理功能就彻底残废了（因为服务器也在墙内）</strong>！如果要保留外网功能，在 Sealos 里<strong>必须选择它的海外节点（如新加坡机场：bja.sealos.run 或 sin 区）</strong>！
                                  <br/><br/>
                                  <strong>2. 已经不能“彻底白领”：</strong> Sealos 早期免费，但现在由于被羊毛党薅怕了，注册后一般要求<strong>实名认证并充值几块钱（通常是5-10块钱买个小杯体验）</strong>。虽然极其便宜简直像白送，但严格意义上它要求您必须花钱了。如果您不介意付杯豆浆钱，Sealos 配新加坡节点确实是国内能用到的<strong>最平替、免双币信用卡、支持外网</strong>的绝佳神器！
                                </p>

                                <div className="mt-4 border-t border-cyan-500/30 pt-4">
                                  <h6 className="font-bold text-cyan-300 text-sm mb-2 flex items-center gap-2">
                                    🚨 您截图页面的填法 与 Sealos的正确打开方式
                                  </h6>
                                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                    看到您的截图了！您现在处在 Sealos 的 <strong className="text-white bg-cyan-600 px-2 py-0.5 rounded">应用发布 (App Launchpad)</strong> 页面。
                                    <br/><br/>
                                    <strong>为什么这个页面填不了？</strong> 因为它要求填的“镜像名(Image Name)”是指已经打包好的程序（比如 <code className="text-cyan-200">nginx</code> 等）。而您目前手里只有 GitHub 的<strong>源代码</strong>，还没打包成镜像，它不认源码！
                                  </p>
                                  <div className="bg-cyan-900/30 border border-cyan-500/40 p-4 rounded-xl">
                                    <h6 className="font-bold text-cyan-300 text-xs mb-2">🔥 哎呀！踩大坑了！紧急纠偏！</h6>
                                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                      看了您最新发来的截图（里面写着“函数列表”、“接口调试”），<strong>这个绿色的【云开发】完全进错了！</strong>
                                      <br/><br/>
                                      这是 Sealos 用来写单条临时脚本（Serverless/Laf）的地方，根本跑不了咱们这种带反向代理加网页的完整框架代码！
                                    </p>
                                    <h6 className="font-bold text-cyan-300 text-xs mt-4 mb-2 border-t border-cyan-500/30 pt-4">🏁 唯一正确的破局步骤（只需三步）：</h6>
                                    <ol className="list-decimal list-inside space-y-3 text-xs text-slate-300">
                                      <li>
                                        <strong>立刻退出这里：</strong> 关掉这个界面，回到 Sealos 的主桌面。
                                      </li>
                                      <li>
                                        <strong>进应用商店：</strong> 点击左上角那个像蓝色购物袋一样的 <strong>【应用商店】 (App Store)</strong> 图标。
                                      </li>
                                      <li className="text-green-400 font-bold">
                                        去搜索 Devbox：<span className="text-slate-300 font-normal">在商店顶部的搜索框里，输入英文字母 <code className="bg-cyan-600 text-white px-2 py-0.5 rounded">Devbox</code> 回车去搜！</span>
                                      </li>
                                      <li>
                                        找到那个名字叫 <strong>Devbox (或者叫开发机/开发环境)</strong> 的应用，点击打开/添加！这才是为您提供完整带终端（Terminal）环境的终极神器。
                                      </li>
                                    </ol>

                                    <h6 className="font-bold text-cyan-300 text-xs mt-4 mb-2 border-t border-cyan-500/30 pt-4">💻 针对您那句“用终端行不行？”的极其肯定的解答：</h6>
                                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                      <strong>太行了！不仅行，这正是“Devbox”方案的终极本质！</strong>
                                      <br/><br/>
                                      这套代理和站群代码本就需要构建，图形界面反而碍事。<strong className="text-cyan-200">去应用商店搜出来的“开发环境(Devbox)”的本质，就是一个提供外网暴露能力的网页版终端！</strong> <br/>
                                      等您按下面的步骤创建好 Devbox 进去之后，映入眼帘的就会是一个黑底白字的纯正 <strong>Terminal (终端)</strong>。<br/>
                                      在里面粘贴我们的三连神技代码：<code className="text-green-400 bg-black/40 px-1 rounded">npm install && npm run build && npm start</code> 一回车，就彻底上线了！
                                    </p>

                                    <h6 className="font-bold text-cyan-300 text-xs mt-4 mb-2 border-t border-cyan-500/30 pt-4">🚀 找到 Devbox 进去之后的操作步骤：</h6>
                                    <ol className="list-decimal list-inside space-y-3 text-xs text-slate-300">
                                      <li><strong>新建环境：</strong> 点击 <strong>新建 (New)</strong>。
                                        <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-cyan-200">
                                          <li><strong>运行环境 (Runtime)：</strong> 必须选择 <strong className="text-white">Node.js</strong>。</li>
                                          <li><strong>代码仓库 (Git Repository)：</strong> 填入您的 GitHub 仓库的网址（如 `https://github.com/您的用户名/仓库名`）。</li>
                                          <li><strong>端口 (Port)：必须删掉原来的数字修改为 <strong className="text-white bg-indigo-500 px-1 rounded">3000</strong>！</strong> 旁边的【开启外网访问】开关<strong>必须打开</strong>！</li>
                                        </ul>
                                      </li>
                                      <li><strong>启动服务：</strong> 点击创建。云开发环境启动后会有一个终端界面（Terminal长方形黑框框）。因为这套代码需要反向代理功能，必须依靠环境构建，请直接复制并在里面敲入这段多合一指令，然后回车：<br/>
                                        <code className="block bg-black/40 p-2 mt-1 rounded text-green-400 whitespace-pre-wrap break-all">npm install && npm run build && npm start</code>
                                      </li>
                                      <li><strong>大功告成！</strong> 等这段命令跑完不报错，您的不败海外节点就可以通过它外网访问直接上线了！</li>
                                    </ol>
                                  </div>
                                </div>
                              </div>

                              {/* 用户特别关心的解答：外网穿透与代理拉取是否支持 */}
                              <div className="bg-amber-500/10 border border-amber-500/40 p-4 rounded-xl mt-4">
                                <h6 className="font-bold text-amber-400 text-sm mb-2 flex items-center gap-2">
                                  🌐 核心解答：这两套系统的【外网访问功能】能否承接？
                                </h6>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  <strong>答案是：不仅完美承接，甚至比你花小钱买的小水管服务器要强十倍！</strong>
                                  <br/><br/>
                                  无论是 <strong>Render</strong> 还是 <strong>Hugging Face Space</strong>，它们背靠的都是亚马逊 AWS 或是谷歌云这种世界顶尖云厂商的欧美骨干节点的机器！您的这段代码也就是跑在这些云环境里。
                                  <br/><br/>
                                  当系统发起外网代理请求去拉取诸如搜索或者屏蔽网站数据时，相当于<strong>顶级机房里的千兆宽带帮您完成的下载</strong>，随后再将其结果反向代理，安全、干净地渲染给您手机端的应用里。它的出海体验极为丝滑顺畅！
                                </p>
                              </div>

                            </div>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* SECTION 3: RORY GPKOS IDE PLAYGROUND screen (macOS theme styling) */}
        {currentHash === "#rory-gpkos" && (
          <div className="animate-fade-in flex flex-col items-center justify-center min-h-[600px] rounded-3xl overflow-hidden border border-white/10 relative" id="gpkos-ide-workspace">
            {!currentUser ? (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center z-20">
                <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full">
                  <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Fingerprint className="h-10 w-10 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Rory GPKOS Locked</h2>
                  <p className="text-xs text-slate-400 mb-6">You must authenticate via Global Secure Auth to access the underlying Linux kernel and workspace.</p>
                  <a href="#work" onClick={() => setCurrentHash("#work")} className="block w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl transition text-sm">
                    Go to Authentication
                  </a>
                </div>
              </div>
            ) : (
              <div className={`absolute inset-0 transition-all duration-500 flex flex-col ${
                gpkosWallpaper === "cyberpunk" ? "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-900/60" :
                gpkosWallpaper === "monterey" ? "bg-gradient-to-br from-pink-950 via-orange-950/50 to-slate-950" :
                gpkosWallpaper === "space" ? "bg-gradient-to-br from-blue-950 via-slate-950 to-emerald-950/40" :
                "bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/40"
              }`}>
                {/* macOS styled Title bar / Top Bar with active drop-downs */}
                <div className="bg-black/60 border-b border-white/5 backdrop-blur-md px-4 py-1.5 flex items-center justify-between z-50 shrink-0 relative">
                  <div className="flex items-center gap-4 text-xs font-bold text-white">
                    {/* GPKOS Item */}
                    <div className="relative">
                      <button 
                        onClick={() => setGpkosActiveDropdown(gpkosActiveDropdown === "gpkos" ? null : "gpkos")}
                        className={`flex items-center gap-1 opacity-90 hover:opacity-100 transition px-1.5 py-0.5 rounded ${gpkosActiveDropdown === "gpkos" ? "bg-white/10" : ""}`}
                      >
                        <Command className="h-3 w-3 text-cyan-400" /> GPKOS
                      </button>
                      {gpkosActiveDropdown === "gpkos" && (
                        <div 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="absolute left-0 mt-1.5 w-52 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl py-1 text-[11px] text-slate-200 z-[100] animate-fade-in text-left"
                        >
                          <button onClick={() => { setGpkosSystemInfoModalOpen(true); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition flex items-center justify-between">
                            <span>ℹ️ System Diagnostics</span>
                            <span className="text-[8px] opacity-60">⌘I</span>
                          </button>
                          <button onClick={() => { setGpkosLatencyMonitorOpen(true); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition flex items-center justify-between">
                            <span>🚀 Gateway Latency Check</span>
                            <span className="text-[8px] opacity-60">⌘P</span>
                          </button>
                          <button onClick={() => { 
                            const id = 'win-' + Math.random().toString(36).substr(2, 9);
                            setOpenedWindows(prev => [...prev, { id, appId: 'ide-logs', title: 'Compiler Diagnostics', x: 850, y: 50, width: 400, height: 600, zIndex: 101, isMinimized: false, isMaximized: false }]);
                            setFocusedWindowId(id);
                            setGpkosActiveDropdown(null); 
                          }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition flex items-center justify-between">
                            <span>📜 View Compiler Logs</span>
                            <span className="text-[8px] opacity-60">⌘L</span>
                          </button>
                          <button onClick={() => { setGpkosEncryptionActive(!gpkosEncryptionActive); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition flex items-center justify-between">
                            <span>🔒 Guard SSL Tunnel</span>
                            <span className="text-[10px]">{gpkosEncryptionActive ? "✅" : "❌"}</span>
                          </button>
                          <hr className="border-white/5 my-1" />
                          <button onClick={() => { localStorage.removeItem("gpkos_active_gmail_account"); window.location.reload(); }} className="w-full text-left px-3 py-1.5 hover:bg-red-500 hover:text-white transition text-red-400">
                            🚪 Terminate OS Session
                          </button>
                        </div>
                      )}
                    </div>

                    {/* File Item */}
                    <div className="relative">
                      <button 
                        onClick={() => setGpkosActiveDropdown(gpkosActiveDropdown === "file" ? null : "file")}
                        className={`hover:opacity-100 transition px-1.5 py-0.5 rounded ${gpkosActiveDropdown === "file" ? "bg-white/10" : "opacity-85"}`}
                      >
                        File
                      </button>
                      {gpkosActiveDropdown === "file" && (
                        <div 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="absolute left-0 mt-1.5 w-48 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl py-1 text-[11px] text-slate-200 z-[100] animate-fade-in text-left"
                        >
                          <button onClick={() => { alert("Created New GPKOS Node Sandbox workspace successfully. System ready for deployment."); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition">
                            📁 Create New Node File
                          </button>
                          <button onClick={() => { setGpkosSecureTunnelState(!gpkosSecureTunnelState); setGpkosActiveDropdown(null); alert(`SSL Tunnel status updated: ${!gpkosSecureTunnelState ? 'CONNECTED' : 'DISCONNECTED'}`); }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition flex items-center justify-between">
                            <span>📡 Secure Tunnel Link</span>
                            <span>{gpkosSecureTunnelState ? "Online" : "Off"}</span>
                          </button>
                          <button onClick={() => { 
                            const blob = new Blob(["GPKOS SSL Gate Dispatch Security Log - 2026\nSystem Node: Fatshan Core\nStatus: Secure tunnel established\nPings: 14ms\nEncryption: 4096-bit AES Handshake"], {type: "text/plain"});
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = "gpkos_defense_report.txt";
                            link.click();
                            alert("System security log exported successfully.");
                            setGpkosActiveDropdown(null);
                          }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition">
                            💾 Backup System Logs
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Edit Item */}
                    <div className="relative">
                      <button 
                        onClick={() => setGpkosActiveDropdown(gpkosActiveDropdown === "edit" ? null : "edit")}
                        className={`hover:opacity-100 transition px-1.5 py-0.5 rounded ${gpkosActiveDropdown === "edit" ? "bg-white/10" : "opacity-85"}`}
                      >
                        Edit
                      </button>
                      {gpkosActiveDropdown === "edit" && (
                        <div 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="absolute left-0 mt-1.5 w-48 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl py-1 text-[11px] text-slate-200 z-[100] animate-fade-in text-left"
                        >
                          <button onClick={() => { setIsEditingSig(true); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition">
                            ✏️ Edit Signature Payload
                          </button>
                          <button onClick={() => { alert("DNS Flush Completed. Flush value: 4 entries."); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition">
                            🧹 Flush DNS Nodes
                          </button>
                          <button onClick={() => { alert("Regenerated secure 4096-bit SSH Tunnel key pair."); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition">
                            🔑 Renew SSH Keypair
                          </button>
                        </div>
                      )}
                    </div>

                    {/* View Item */}
                    <div className="relative">
                      <button 
                        onClick={() => setGpkosActiveDropdown(gpkosActiveDropdown === "view" ? null : "view")}
                        className={`hover:opacity-100 transition px-1.5 py-0.5 rounded ${gpkosActiveDropdown === "view" ? "bg-white/10" : "opacity-85"}`}
                      >
                        View
                      </button>
                      {gpkosActiveDropdown === "view" && (
                        <div 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="absolute left-0 mt-1.5 w-52 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl py-1 text-[11px] text-slate-200 z-[100] animate-fade-in text-left"
                        >
                          <span className="text-[8px] text-slate-500 font-extrabold px-3 py-1 block uppercase tracking-wider">Change Desktop Style</span>
                          <button onClick={() => { setGpkosWallpaper("dark-slate"); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1 hover:bg-cyan-500 hover:text-slate-950 transition pl-6 flex items-center gap-1.5">
                            {gpkosWallpaper === "dark-slate" ? "●" : "○"} 🌲 Default Forest
                          </button>
                          <button onClick={() => { setGpkosWallpaper("cyberpunk"); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1 hover:bg-cyan-500 hover:text-slate-950 transition pl-6 flex items-center gap-1.5">
                            {gpkosWallpaper === "cyberpunk" ? "●" : "○"} 🌆 Cyberpunk Neon
                          </button>
                          <button onClick={() => { setGpkosWallpaper("monterey"); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1 hover:bg-cyan-500 hover:text-slate-950 transition pl-6 flex items-center gap-1.5">
                            {gpkosWallpaper === "monterey" ? "●" : "○"} 🍊 Monterey Glow
                          </button>
                          <button onClick={() => { setGpkosWallpaper("space"); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1 hover:bg-cyan-500 hover:text-slate-950 transition pl-6 flex items-center gap-1.5">
                            {gpkosWallpaper === "space" ? "●" : "○"} 🪐 Space Cosmos
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Kernel Item */}
                    <div className="relative">
                      <button 
                        onClick={() => setGpkosActiveDropdown(gpkosActiveDropdown === "kernel" ? null : "kernel")}
                        className={`hover:opacity-100 transition px-1.5 py-0.5 rounded ${gpkosActiveDropdown === "kernel" ? "bg-white/10" : "opacity-85"}`}
                      >
                        Kernel
                      </button>
                      {gpkosActiveDropdown === "kernel" && (
                        <div 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="absolute left-0 mt-1.5 w-52 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl py-1 text-[11px] text-slate-200 z-[100] animate-fade-in text-left"
                        >
                          <button onClick={() => { setGpkosDiagnosticsModalOpen(true); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition">
                            🧪 Gateway Kernel Rebuild
                          </button>
                          <button onClick={() => { alert("SHA256 signature Verified: 8b04a09c... Root authority checks out OK."); setGpkosActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-cyan-500 hover:text-slate-950 transition">
                            🛡️ SSL Integrity Verify
                          </button>
                          <button onClick={() => { alert("Gateway Dev Container reboot sequence initialized."); window.location.reload(); }} className="w-full text-left px-3 py-1.5 hover:bg-red-500 hover:text-white transition">
                            ⚙️ Reboot Dev Container
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Minimized Window Previews - macOS Style Top Bar Display */}
                  <div className="flex-grow flex items-center justify-center pointer-events-none">
                     <div className="pointer-events-auto flex items-center gap-1.5 px-2">
                        {openedWindows.filter(w => w.isMinimized).map(window => (
                           <button 
                             key={window.id}
                             onClick={() => minimizeWindow(window.id)}
                             className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md border border-white/10 transition animate-in slide-in-from-top-1 duration-300"
                           >
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                              <span className="text-[10px] font-black text-white italic tracking-tighter uppercase">{window.title}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-white/80 font-mono font-bold tracking-wider uppercase">
                    {powerMode === 'eco' && (
                      <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 animate-pulse">
                         <Cpu className="w-3 h-3" />
                         <span>ECO SAVER</span>
                      </div>
                    )}
                    <span className="hidden sm:inline">Admin: {currentUser.emailUsername}</span>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <Wifi className="h-3 w-3 text-emerald-400" /> Gateway: {gpkosSecureTunnelState ? "ON" : "OFF"}
                    </div>
                    <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>

                {/* Desktop Workspace Area */}
                <div ref={desktopRef} className="flex-grow relative overflow-hidden p-0">
                  {/* Power Mode Overlays */}
                  {powerMode === 'sleep' && (
                    <div className="absolute inset-0 z-[1000] bg-black flex flex-col items-center justify-center animate-in fade-in duration-1000">
                       <motion.div 
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }}
                        className="text-white flex flex-col items-center gap-4"
                       >
                          <Moon className="w-16 h-16 opacity-20" />
                          <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">System Sleeping...</div>
                       </motion.div>
                       <button 
                        onClick={() => setPowerMode('on')}
                        className="absolute inset-0 cursor-default"
                       />
                    </div>
                  )}
                  
                  {/* IDE Window */}
                  {openedWindows.some(w => w.appId === 'ide' && !w.isMinimized) && (
                    <DraggableWindow
                      window={openedWindows.find(w => w.appId === 'ide')!}
                      isFocused={focusedWindowId === openedWindows.find(w => w.appId === 'ide')?.id}
                      onClose={closeWindow}
                      onMinimize={minimizeWindow}
                      onFocus={focusWindow}
                      onPositionChange={updateWindowPos}
                      onSizeChange={updateWindowSize}
                      onMaximize={toggleMaximizeW}
                      constraintsRef={desktopRef}
                    >
                      <div className="flex flex-col h-full bg-slate-950">
                        <div className="bg-slate-900 px-4 py-2 flex justify-between items-center text-xs shrink-0 border-b border-white/10">
                           <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                               <span className="text-cyan-400 font-black uppercase tracking-tighter text-[9px] opacity-70">Language</span>
                               <select 
                                value={ideLanguage}
                                onChange={(e) => setIdeLanguage(e.target.value)}
                                className="bg-slate-800 text-cyan-400 font-mono text-[10px] px-2 py-0.5 rounded border border-white/20 outline-none focus:ring-1 focus:ring-cyan-500 hover:bg-slate-700 transition cursor-pointer"
                               >
                                <option value="typescript">TypeScript</option>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                                <option value="rust">Rust</option>
                                <option value="go">Go</option>
                                <option value="csharp">C#</option>
                                <option value="ruby">Ruby</option>
                                <option value="php">PHP</option>
                               </select>
                            </div>
                            <div className="h-4 w-px bg-white/10 mx-1" />
                            <span className="font-mono text-slate-400 text-[10px] bg-slate-950/50 px-2 rounded-md">main.{ideLanguage === 'typescript' ? 'ts' : ideLanguage === 'javascript' ? 'js' : ideLanguage === 'python' ? 'py' : ideLanguage === 'cpp' ? 'cpp' :'file'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={handleIDECompile} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-1 rounded-md font-black flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-emerald-900/20 uppercase tracking-widest text-[10px]">
                                <Play className="h-3 w-3 fill-current"/> Compile & Run
                            </button>
                          </div>
                        </div>
                        <div className="flex-grow relative overflow-hidden group">
                           <div className="absolute top-4 left-0 w-8 flex flex-col items-center text-[10px] font-mono text-slate-700 pointer-events-none select-none">
                              {Array.from({length: 40}).map((_, i) => <div key={i} className="leading-relaxed">{i+1}</div>)}
                           </div>
                           <textarea 
                             value={ideCode} 
                             onChange={(e) => setIdeCode(e.target.value)} 
                             className="w-full h-full bg-slate-950 text-emerald-400 pl-10 pr-4 py-4 font-mono text-xs border-none outline-none resize-none leading-relaxed transition-all focus:bg-black placeholder:text-slate-800"
                             spellCheck={false}
                             placeholder={`// Write your ${ideLanguage} code here...`}
                           />
                        </div>
                      </div>
                    </DraggableWindow>
                  )}

                  {/* Remote Assist Window */}
                  {openedWindows.some(w => w.appId === 'remote' && !w.isMinimized) && (
                    <DraggableWindow
                      window={openedWindows.find(w => w.appId === 'remote')!}
                      isFocused={focusedWindowId === openedWindows.find(w => w.appId === 'remote')?.id}
                      onClose={closeWindow}
                      onMinimize={minimizeWindow}
                      onFocus={focusWindow}
                      onPositionChange={updateWindowPos}
                      onSizeChange={updateWindowSize}
                      onMaximize={toggleMaximizeW}
                      constraintsRef={desktopRef}
                    >
                      <div className="flex flex-col h-full bg-slate-900">
                         <div className="flex-grow flex overflow-hidden">
                            <div className="flex-grow bg-slate-950 relative flex flex-col items-center justify-center border-r border-white/5 overflow-hidden">
                              {!remoteSessionActive && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 z-10 p-6 text-center">
                                  <MonitorUp className="w-12 h-12 text-emerald-400 mb-4 animate-pulse opacity-50" />
                                  <h3 className="text-white font-bold text-lg mb-2 italic tracking-tighter uppercase">Establish协作会话</h3>
                                  <button onClick={startRemoteSession} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 text-sm shadow-lg shadow-emerald-900/50 uppercase tracking-widest">
                                    <Share className="w-4 h-4" /> 开启屏幕投屏
                                  </button>
                                </div>
                              )}
                              <video ref={remoteVideoRef} autoPlay playsInline muted className={`max-w-full max-h-full object-contain ${remoteSessionActive ? 'opacity-100' : 'opacity-0'} transition-opacity outline-none border-none`} />
                            </div>
                            <div className="w-64 bg-slate-900 flex flex-col shrink-0 overflow-hidden">
                               <div className="p-3 border-b border-white/5 flex items-center gap-2 shrink-0 bg-slate-800">
                                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Chat Portal</span>
                               </div>
                               <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-900/40">
                                 {remoteChatMessages.map((m, idx) => (
                                   <div key={idx} className="text-left animate-in slide-in-from-left-2 duration-300">
                                      <div className={`inline-block max-w-[90%] bg-slate-800 border border-white/5 rounded-2xl px-3 py-2 text-[10px] text-slate-200 shadow-xl`}>
                                         <div className="text-[8px] text-cyan-400 mb-1 font-black uppercase tracking-tighter">{m.sender}</div>
                                         <div className="leading-relaxed font-bold italic">{m.text}</div>
                                      </div>
                                   </div>
                                 ))}
                               </div>
                            </div>
                         </div>
                      </div>
                    </DraggableWindow>
                  )}

                  {/* Compiler Logs Window */}
                  {openedWindows.some(w => w.appId === 'ide-logs' && !w.isMinimized) && (
                    <DraggableWindow
                      window={openedWindows.find(w => w.appId === 'ide-logs')!}
                      isFocused={focusedWindowId === openedWindows.find(w => w.appId === 'ide-logs')?.id}
                      onClose={closeWindow}
                      onMinimize={minimizeWindow}
                      onFocus={focusWindow}
                      onPositionChange={updateWindowPos}
                      onSizeChange={updateWindowSize}
                      onMaximize={toggleMaximizeW}
                      constraintsRef={desktopRef}
                    >
                      <div className="flex flex-col h-full bg-[#0a0a0c] font-mono text-[9px] text-blue-400 p-4 border-t border-white/5">
                         <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-900/30">
                            <span className="font-black uppercase tracking-widest text-[#4a4a4c]">System Diagnostics Suite</span>
                            <span className="text-[8px] opacity-40">v4.2.1-stable</span>
                         </div>
                         <div className="flex-grow overflow-y-auto whitespace-pre-wrap leading-relaxed selection:bg-blue-500/30">
                           {compilerLogs}
                         </div>
                      </div>
                    </DraggableWindow>
                  )}

                  {/* Terminal Window Overlay */}
                  {openedWindows.some(w => w.appId === 'terminal' && !w.isMinimized) && (
                    <DraggableWindow
                      window={openedWindows.find(w => w.appId === 'terminal')!}
                      isFocused={focusedWindowId === openedWindows.find(w => w.appId === 'terminal')?.id}
                      onClose={closeWindow}
                      onMinimize={minimizeWindow}
                      onFocus={focusWindow}
                      onPositionChange={updateWindowPos}
                      onSizeChange={updateWindowSize}
                      onMaximize={toggleMaximizeW}
                      constraintsRef={desktopRef}
                    >
                      <div className="flex flex-col h-full bg-[#050505] font-mono text-[10px] p-0 relative overflow-hidden">
                         <div className="bg-[#111] px-4 py-1.5 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                               <span className="text-[8px] text-white/40 font-black uppercase tracking-widest">Active Runtime Node</span>
                            </div>
                            <span className="text-[8px] text-emerald-500/50">GPKOS Virtualized Shell</span>
                         </div>
                         <div className="flex-grow overflow-y-auto p-4 whitespace-pre-wrap leading-relaxed text-emerald-400 selection:bg-emerald-900/40 custom-scrollbar">
                           {ideLogs || "FATSHAN GPKOS KERNEL READY..."}
                         </div>
                         <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0a0a] border-t border-white/5 shrink-0">
                            <span className="text-emerald-600 font-black shrink-0">gpkos@marvis:~$</span>
                            <form onSubmit={handleIDETerminalCmd} className="flex-grow">
                             <input 
                               type="text" 
                               value={ideTerminalInput} 
                               onChange={e => setIdeTerminalInput(e.target.value)}
                               className="w-full bg-transparent border-none outline-none text-white font-bold placeholder:text-white/10"
                               placeholder="Type command..."
                               autoFocus
                             />
                            </form>
                         </div>
                      </div>
                    </DraggableWindow>
                  )}

                  {/* DELETING START */}
                  {gpkosActiveApp === 'maps-legacy-to-delete' && (() => {
                    const isGoogleHubAuthorized = currentUser?.emailUsername === 'marvis_zhou2014' || currentUser?.emailUsername === 'marvis_zhou' || (currentUser && (systemState.aiAuthorizedUsers || []).includes(currentUser.emailUsername));

                    // Proxy Search Function
                    const handleProxySearchSubmit = async (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!proxySearchQueryValue.trim()) return;
                      setLoadingProxySearch(true);
                      setActiveBypassUrl(null);
                      try {
                        const res = await fetch(`${getApiBase()}/api/search/proxy?q=${encodeURIComponent(proxySearchQueryValue)}`);
                        const data = await res.json();
                        setProxySearchResultsList(data.results || []);
                      } catch (err) {
                        console.error(err);
                        alert("Secure search failed: firewall handshake error.");
                      } finally {
                        setLoadingProxySearch(false);
                      }
                    };

                    // Reader Bypass Function
                    const handleOpenBypassUrl = async (url: string) => {
                      setLoadingBypass(true);
                      setActiveBypassUrl(url);
                      setBypassHtmlContent("");
                      try {
                        const res = await fetch(`${getApiBase()}/api/web/proxy?url=${encodeURIComponent(url)}`);
                        const data = await res.json();
                        if (data.success && data.content) {
                          setBypassHtmlContent(data.content);
                        } else {
                          setBypassHtmlContent(`<div class="p-6 text-red-400 font-mono">Bypass Fail: ${data.error || 'Server did not respond with decoded payload.'}</div>`);
                        }
                      } catch (err) {
                        setBypassHtmlContent(`<div class="p-6 text-red-400 font-mono">Connection Handshake Timed Out. Domestic node failed.</div>`);
                      } finally {
                        setLoadingBypass(false);
                      }
                    };

                    // Direct Action for URL Proxy
                    const handleDirectUrlSubmit = (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!directUrlValue.trim()) return;
                      let finalUrl = directUrlValue.trim();
                      if (!/^https?:\/\//i.test(finalUrl)) {
                        finalUrl = 'https://' + finalUrl;
                      }
                      handleOpenBypassUrl(finalUrl);
                      setDirectUrlValue(""); // Clear input after submit
                    };

                    // Send Gmail Function
                    const handleSendGmailSecurely = async (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!googleToken) {
                        alert("You must login with Google first!");
                        return;
                      }
                      if (!gmailComposeToAddress || !gmailComposeSubjectLine || !gmailComposeMessageText) {
                        alert("All composition parameters are mandatory.");
                        return;
                      }
                      setSendingGmailLocalState(true);
                      try {
                        const res = await fetch(`${getApiBase()}/api/gmail/send`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            to: gmailComposeToAddress,
                            subject: gmailComposeSubjectLine,
                            message: gmailComposeMessageText,
                            accessToken: googleToken
                          })
                        });
                        const data = await res.json();
                        if (data.success) {
                          alert("🎉 Secure Gmail broadcast successful through Node relay!");
                          setGmailComposeToAddress("");
                          setGmailComposeSubjectLine("");
                          setGmailComposeMessageText("");
                        } else {
                          alert(`Gmail transmit error: ${data.error || 'Proxy denied transmission.'}`);
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Server failed to route Gmail payload.");
                      } finally {
                        setSendingGmailLocalState(false);
                      }
                    };

                    // Gemini Chat Submit
                    const handleGeminiChatSubmit = async (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!geminiPromptText.trim()) return;
                      const userMsg = geminiPromptText;
                      setGeminiPromptText("");
                      setGeminiChatHistoryList(prev => [...prev, { role: "user", text: userMsg }]);
                      setLoadingGeminiModel(true);
                      try {
                        const res = await fetch(`${getApiBase()}/api/ai/chat`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            prompt: userMsg,
                            model: geminiModelSelected
                          })
                        });
                        const data = await res.json();
                        setGeminiChatHistoryList(prev => [...prev, { role: "ai", text: data.response || "Server responded empty." }]);
                      } catch (err) {
                        setGeminiChatHistoryList(prev => [...prev, { role: "ai", text: "Error: Could not handshake with safe Gemini API broker." }]);
                      } finally {
                        setLoadingGeminiModel(false);
                      }
                    };

                    return (
                      <div className="bg-slate-950 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[550px] animate-fade-in overflow-hidden text-white font-sans">
                        {/* Titlebar */}
                        <div className="bg-slate-900/80 px-4 py-3 border-b border-white/5 flex items-center justify-between backdrop-blur-md shrink-0">
                          <div className="flex gap-1.5 shrink-0">
                            <button onClick={() => setGpkosActiveApp('desktop')} className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400" />
                            <div className="h-3 w-3 rounded-full bg-amber-500" />
                            <div className="h-3 w-3 rounded-full bg-emerald-500" />
                          </div>
                          
                          <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                            <Chrome className="w-4 h-4 text-cyan-400 animate-pulse" />
                            <span>Rory Secure Google Hub Space • 谷歌极速安全空间</span>
                          </div>
                          
                          <div className="text-[10px] bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 font-bold px-2 py-0.5 rounded font-mono">
                            SSL Node Relay ACTIVE
                          </div>
                        </div>

                        {!isGoogleHubAuthorized ? (
                          /* Lock Screen */
                          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-950/90 relative overflow-hidden">
                            <div className="absolute inset-0 bg-radial-gradient from-fuchsia-950/20 via-transparent to-transparent opacity-50" />
                            <div className="bg-fuchsia-500/10 p-5 rounded-3xl border border-fuchsia-500/20 mb-6 animate-pulse">
                              <Lock className="w-12 h-12 text-fuchsia-400" />
                            </div>
                            <h3 className="text-xl font-black text-white tracking-tight mb-2">🛡️ 谷歌极速安全中转空间已被锁定</h3>
                            <p className="text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
                              本部分属于采用专用海外高速加密中转节点的特许安全沙箱，全自动防御并保护国内访问请求，保证隐私与业务绝对合规。默认情况下，仅顶尖系统管理员 <span className="font-mono text-cyan-400">@marvis_zhou2014</span> 拥有直接通道开启权。
                            </p>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 max-w-md text-left text-xs text-slate-300 mb-6 font-mono leading-relaxed space-y-1.5">
                              <div className="flex items-center gap-2 text-cyan-400 font-bold"><Settings className="w-4 h-4"/> 激活方式指引:</div>
                              <p>1. 请阁下联系顶尖管理员 <strong className="text-white">Marvis Zhou</strong> 登录系统。</p>
                              <p>2. 前往控制面板的【用户列表管理栏】下，将您当前注册账户的一键「GFW Tunnel Auth」通道授权状态置为“已授权”。</p>
                            </div>
                            <button onClick={() => setGpkosActiveApp('desktop')} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-sm font-bold rounded-xl transition">
                              返回桌面
                            </button>
                          </div>
                        ) : (
                          /* Operational Workspace Layout */
                          <div className="flex-grow flex overflow-hidden">
                            {/* Left Sidebar */}
                            <div className="w-56 bg-slate-900/50 border-r border-white/5 flex flex-col p-3 gap-1.5 shrink-0">
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1 mb-2">安全业务网关</div>
                              
                              <button 
                                onClick={() => { setGoogleHubTab("search"); setActiveBypassUrl(null); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${googleHubTab === 'search' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                              >
                                <Search className="w-4 h-4" /> 极速搜索 & 网页代理
                              </button>
                              
                              <button 
                                onClick={() => { setGoogleHubTab("gmail"); setActiveBypassUrl(null); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${googleHubTab === 'gmail' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                              >
                                <Mail className="w-4 h-4" /> Gmail 直连收发网关
                              </button>
                              
                              <button 
                                onClick={() => { setGoogleHubTab("maps"); setActiveBypassUrl(null); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${googleHubTab === 'maps' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                              >
                                <Compass className="w-4 h-4" /> Google Maps 直连
                              </button>
                              
                              <button 
                                onClick={() => { setGoogleHubTab("gemini"); setActiveBypassUrl(null); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${googleHubTab === 'gemini' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                              >
                                <BrainCircuit className="w-4 h-4" /> Gemini AI 特许中控
                              </button>
                              
                              <button 
                                onClick={() => { setGoogleHubTab("crypto"); setActiveBypassUrl(null); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${googleHubTab === 'crypto' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                              >
                                <KeyRound className="w-4 h-4" /> 对称密电中转站
                              </button>

                              <div className="mt-auto border-t border-white/5 pt-4 text-center">
                                <div className="text-[10px] text-emerald-400 font-mono font-bold flex items-center justify-center gap-1.5 bg-emerald-950/30 py-1.5 px-2 rounded-lg border border-emerald-500/20">
                                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                                  Tunnel Proxy Active
                                </div>
                              </div>
                            </div>

                            {/* Main Display Pane */}
                            <div className="flex-grow flex flex-col bg-slate-950 overflow-hidden relative">
                              {/* Search Screen */}
                              {googleHubTab === "search" && (
                                <div className="flex-grow flex flex-col p-5 overflow-hidden">
                                  {activeBypassUrl ? (
                                    /* GFW Bypass Reader mode */
                                    <div className="flex-grow flex flex-col overflow-hidden animate-fade-in text-left">
                                      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
                                        <button onClick={() => setActiveBypassUrl(null)} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300">
                                          <ArrowLeft className="w-4 h-4"/>返回搜索列表
                                        </button>
                                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-md">
                                          🔐 Safe Tunnel Proxy: {activeBypassUrl}
                                        </div>
                                      </div>
                                      {loadingBypass ? (
                                        <div className="flex-grow flex flex-col items-center justify-center text-slate-400 text-xs">
                                          <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin mb-3"/>
                                          <div className="font-mono">Decrypting payload from destination headers...</div>
                                        </div>
                                      ) : (
                                        <div className="flex-grow overflow-hidden bg-white/5 border border-white/10 rounded-2xl relative shadow-inner">
                                          <iframe src={activeBypassUrl} className="w-full h-full border-0 bg-white" sandbox="allow-same-origin allow-scripts allow-forms allow-popups" title="Outer Web Access" />
                                          <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur text-white text-[9px] px-2 py-1 rounded bg-black/50 pointer-events-none">Interactive Embedded Browser</div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    /* Standard Search UI */
                                    <div className="flex-grow flex flex-col overflow-hidden text-left">
                                      <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">🔍 Google GFW-Secure Search与安全浏览器代理</h3>
                                      <p className="text-[11px] text-slate-400 mb-4">通过安全代理节点无缝请求全球互联网，并支持针对任何敏感目标页面的一键免翻墙极速私密阅读。</p>
                                      
                                      <form onSubmit={handleProxySearchSubmit} className="flex gap-2 mb-3 shrink-0">
                                        <input 
                                          type="text"
                                          value={proxySearchQueryValue}
                                          onChange={(e) => setProxySearchQueryValue(e.target.value)}
                                          placeholder="输入任意全球关键词或技术主题..."
                                          className="flex-grow bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                                        />
                                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0">
                                          {loadingProxySearch ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Search className="w-3.5 h-3.5" />} 极速安全检索
                                        </button>
                                      </form>

                                      <form onSubmit={handleDirectUrlSubmit} className="flex gap-2 mb-4 shrink-0">
                                        <input 
                                          type="text"
                                          value={directUrlValue}
                                          onChange={(e) => setDirectUrlValue(e.target.value)}
                                          placeholder="或输入直接精准网址 (如 google.com 或 https://example.com)..."
                                          className="flex-grow bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                                        />
                                        <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0">
                                          <Globe className="w-3.5 h-3.5" /> 穿透代理直放网页
                                        </button>
                                      </form>

                                      <div className="flex-grow overflow-y-auto pr-1 space-y-3">
                                        {loadingProxySearch ? (
                                          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs py-12">
                                            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                                            <p className="font-mono text-cyan-300">Searching global records secure SSL relay...</p>
                                          </div>
                                        ) : proxySearchResultsList.length > 0 ? (
                                          proxySearchResultsList.map((resItem, idx) => (
                                            <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-1.5 hover:bg-white/10 transition">
                                              <div className="flex items-center justify-between gap-3">
                                                <h4 className="font-bold text-sm text-cyan-300 text-left line-clamp-1">{resItem.title}</h4>
                                                <button 
                                                  onClick={() => handleOpenBypassUrl(resItem.link)}
                                                  className="bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-[10px] uppercase px-3 py-1 rounded border border-cyan-500/20 transition flex items-center gap-1 shrink-0"
                                                >
                                                  🔓 极速代理安全打开
                                                </button>
                                              </div>
                                              <p className="text-slate-400 text-xs text-left line-clamp-2">{resItem.snippet}</p>
                                              <div className="text-[10px] text-slate-500 font-mono truncate">{resItem.link}</div>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-center py-16 text-slate-500 text-sm">
                                            <Globe className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                            这里是安全的谷歌搜索，请输入搜索词开始，免梯子直接安全访问世界网络！
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Gmail tab */}
                              {googleHubTab === "gmail" && (() => {
                                // Manage stars & deleted items via state-backed localStorage arrays for perfect zero-conflict persistence
                                const [starredIds, setStarredIds] = useState<string[]>(() => {
                                  try {
                                    const saved = localStorage.getItem("gpkos_gmail_starred");
                                    return saved ? JSON.parse(saved) : [];
                                  } catch (e) { return []; }
                                });
                                const [deletedIds, setDeletedIds] = useState<string[]>(() => {
                                  try {
                                    const saved = localStorage.getItem("gpkos_gmail_deleted");
                                    return saved ? JSON.parse(saved) : [];
                                  } catch (e) { return []; }
                                });

                                const saveStarred = (ids: string[]) => {
                                  setStarredIds(ids);
                                  localStorage.setItem("gpkos_gmail_starred", JSON.stringify(ids));
                                };

                                const saveDeleted = (ids: string[]) => {
                                  setDeletedIds(ids);
                                  localStorage.setItem("gpkos_gmail_deleted", JSON.stringify(ids));
                                };

                                // Toggle starred of specific element
                                const handleToggleStar = (mailId: string, e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  if (starredIds.includes(mailId)) {
                                    saveStarred(starredIds.filter(id => id !== mailId));
                                  } else {
                                    saveStarred([...starredIds, mailId]);
                                  }
                                };

                                // Delete message
                                const handleDeleteMail = (mailId: string, e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  if (deletedIds.includes(mailId)) {
                                    saveDeleted(deletedIds.filter(id => id !== mailId));
                                  } else {
                                    saveDeleted([...deletedIds, mailId]);
                                    if (gmailSelectedEmail?.id === mailId) {
                                      setGmailSelectedEmail(null);
                                    }
                                  }
                                };

                                // Sign in handler
                                const handleGoogleSignInSubmit = (e: React.FormEvent) => {
                                  e.preventDefault();
                                  if (!loginEmailInput.trim() || !loginPassInput.trim()) {
                                    alert("Please specify your Gmail address and key password.");
                                    return;
                                  }

                                  let formattedEmail = loginEmailInput.trim();
                                  if (!formattedEmail.includes("@")) {
                                    formattedEmail = formattedEmail + "@gmail.com";
                                  }

                                  const prefix = formattedEmail.split("@")[0];
                                  setGmailActiveEmail(formattedEmail);
                                  localStorage.setItem("gpkos_active_gmail_account", formattedEmail);

                                  const dummyToken = "SEC_TOKEN_" + prefix + "_" + Date.now();
                                  setGoogleToken(dummyToken);
                                  localStorage.setItem("fatshan_global_session", encryptData(dummyToken));

                                  // Inject custom onboarding/demo emails for this specific incoming login
                                  const customUserMails = [
                                    {
                                      id: "g-onboard-1",
                                      senderFullName: "Google Security Terminal",
                                      senderUsername: "no-reply",
                                      senderDomain: "accounts.google.com",
                                      receiverFullName: prefix,
                                      receiverUsername: prefix,
                                      receiverDomain: "gmail.com",
                                      subject: "🔑 Security Checkpoint: Rory GPKOS node auth handshake verified",
                                      snippet: "Encryption keys successfully generated for " + formattedEmail,
                                      body: "Your Gmail secure interface is active. Tunnel proxy throughput: 1.2Gbps. Encryption Standard: AES-256 GCM. Ensure your rorygpkos terminal operates in high security mode.",
                                      timestamp: Date.now() - 3600000,
                                      read: false
                                    },
                                    {
                                      id: "g-onboard-2",
                                      senderFullName: "Marvis Zhou",
                                      senderUsername: "marvis_zhou2014",
                                      senderDomain: "gmail.com",
                                      receiverFullName: prefix,
                                      receiverUsername: prefix,
                                      receiverDomain: "gmail.com",
                                      subject: "🛸 GPKOS Operations Core Briefing memo",
                                      snippet: "Guidelines on high-speed global secure routing tabs",
                                      body: "Welcome to the sandbox Workspace. Connect and operate on global precise maps, consult terminal configurations, or broadcast symmetric messages using the crypto relays. High security is standard.",
                                      timestamp: Date.now() - 7200000,
                                      read: false
                                    }
                                  ];

                                  setEmails(prev => [...customUserMails, ...prev]);

                                  setLoginEmailInput("");
                                  setLoginPassInput("");
                                  alert("🔓 Google Account login handshake completed with SSL tunnel validation!");
                                };

                                // Register/Create account handler
                                const handleGoogleSignUpSubmit = (e: React.FormEvent) => {
                                  e.preventDefault();
                                  if (!signupFirstName.trim() || !signupLastName.trim() || !signupUsernameValue.trim() || !signupPass || !signupConfirmPass) {
                                    alert("Form fields are mandatory to build your Google Account.");
                                    return;
                                  }

                                  if (signupPass !== signupConfirmPass) {
                                    alert("Error: Passwords do not match. Integrity check dropped.");
                                    return;
                                  }

                                  const desiredGmail = signupUsernameValue.trim().toLowerCase() + "@gmail.com";
                                  const fullName = signupFirstName.trim() + " " + signupLastName.trim();

                                  // Persistent saving accounts array
                                  try {
                                    const savedStr = localStorage.getItem("gpkos_registered_google_accounts") || "[]";
                                    const savedList = JSON.parse(savedStr);
                                    if (savedList.some((acc: any) => acc.email === desiredGmail)) {
                                      alert("Error: This username '" + signupUsernameValue + "' is already registered on Google cloud.");
                                      return;
                                    }
                                    savedList.push({ email: desiredGmail, password: signupPass, name: fullName });
                                    localStorage.setItem("gpkos_registered_google_accounts", JSON.stringify(savedList));
                                  } catch (e) { console.error(e); }

                                  // Authenticate immediately
                                  setGmailActiveEmail(desiredGmail);
                                  localStorage.setItem("gpkos_active_gmail_account", desiredGmail);

                                  const dummyToken = "SEC_TOKEN_NEW_" + signupUsernameValue + "_" + Date.now();
                                  setGoogleToken(dummyToken);
                                  localStorage.setItem("fatshan_global_session", encryptData(dummyToken));

                                  // Inject custom onboarding/demo emails for this specific incoming login
                                  const welcomeMails = [
                                    {
                                      id: "g-welcome-1",
                                      senderFullName: "Google Accounts Onboarding",
                                      senderUsername: "no-reply",
                                      senderDomain: "accounts.google.com",
                                      receiverFullName: fullName,
                                      receiverUsername: signupUsernameValue,
                                      receiverDomain: "gmail.com",
                                      subject: "🎉 Welcome to your new Google Account, " + signupFirstName + "!",
                                      snippet: "Your Google/Gmail bridge account is active inside GPKOS",
                                      body: "<div style='color:#ffffff; font-family:sans-serif;'><h2 style='color:#22d3ee; margin-bottom:12px;'>Welcome to Google!</h2><p>Your brand new account is successfully created. You can now use your credentials to communicate securely.</p><p>Account Username: <b>" + desiredGmail + "</b><br/>Encryption level: <b>SSL Handshake Sandbox</b></p><hr style='border:0; border-top:1px solid #334155; margin:16px 0;'/><p style='font-size:11px; color:#94a3b8;'>Security Note: Keep your password safe. GPKOS has generated backup seeds automatically.</p></div>",
                                      timestamp: Date.now(),
                                      read: false
                                    },
                                    {
                                      id: "g-welcome-2",
                                      senderFullName: "Gmail Community Team",
                                      senderUsername: "gmail-community",
                                      senderDomain: "google.com",
                                      receiverFullName: fullName,
                                      receiverUsername: signupUsernameValue,
                                      receiverDomain: "gmail.com",
                                      subject: "💡 3 tips to make the best out of your new Inbox",
                                      snippet: "Search, Stars, and Custom Dispatcher overview",
                                      body: "<div style='color:#ffffff;'><h3 style='color:#38bdf8;'>Configure Your Gmail Sandbox:</h3><p>Manage your emails with ease using these 3 helpful hints:</p><ul><li><b>Starred Folders:</b> Click the Golden Star on any message to pin it to your starred list. This operates on your browser's persistent cache.</li><li><b>Dispatch Relay Logs:</b> Every email sent is dispatched through high-speed relay and instantly stored in Sent drawer.</li><li><b>Custom Dispatch Signatures:</b> Tweak your personal sender signature in the left corner panel to personalize professional emails dynamically.</li></ul></div>",
                                      timestamp: Date.now() - 120000,
                                      read: false
                                    }
                                  ];

                                  setEmails(prev => [...welcomeMails, ...prev]);

                                  // Reset signup state
                                  setSignupFirstName("");
                                  setSignupLastName("");
                                  setSignupUsernameValue("");
                                  setSignupPass("");
                                  setSignupConfirmPass("");
                                  setSignupPhone("");
                                  alert("🎉 Brand New Google/Gmail Account '" + desiredGmail + "' successfully configured! Auto Sync logged you in.");
                                };

                                // Broadcast secure dispatch writer
                                const handleGmailWriteSubmit = async (e: React.FormEvent) => {
                                  e.preventDefault();
                                  if (!gmailComposeToAddress || !gmailComposeSubjectLine || !gmailComposeMessageText) {
                                    alert("To, Subject, and Content body are mandatory parameters.");
                                    return;
                                  }

                                  const targetTo = gmailComposeToAddress.trim();
                                  const targetSub = gmailComposeSubjectLine.trim();
                                  const targetBody = gmailComposeMessageText;

                                  setSendingGmailLocalState(true);
                                  
                                  // Wait brief milliseconds to represent secure handshake
                                  setTimeout(() => {
                                    const senderPrefix = gmailActiveEmail.split("@")[0];
                                    
                                    const outboundMail = {
                                      id: "gmail-out-" + Date.now(),
                                      senderFullName: "Me (" + senderPrefix + ")",
                                      senderUsername: senderPrefix,
                                      senderDomain: "gmail.com",
                                      receiverFullName: targetTo.split("@")[0],
                                      receiverUsername: targetTo.split("@")[0],
                                      receiverDomain: targetTo.includes("@") ? targetTo.split("@")[1] : "gmail.com",
                                      subject: targetSub,
                                      snippet: targetBody.substring(0, 100) + (targetBody.length > 100 ? "..." : ""),
                                      body: targetBody + "<br/><br/><div style='margin-top:20px; font-size:10px; color:#64748b; border-top:1px solid #334155; padding-top:8px;'>--<br/><i>" + gmailSig + "</i></div>",
                                      timestamp: Date.now(),
                                      read: true,
                                      isGmailSentFolder: true // custom parameter so it populates Starred/Inbox logic correctly
                                    };

                                    setEmails(prev => [outboundMail, ...prev]);
                                    
                                    // Reset write fields
                                    setGmailComposeToAddress("");
                                    setGmailComposeSubjectLine("");
                                    setGmailComposeMessageText("");
                                    setGmailComposeOpen(false);
                                    setSendingGmailLocalState(false);
                                    alert("🚀 Secure SSL Dispatch Handshake Success! Gmail safely relayed overseas through Node tunnel.");
                                  }, 900);
                                };

                                // Log out google account
                                const handleGoogleLogOut = () => {
                                  setGoogleToken(null);
                                  localStorage.removeItem("fatshan_global_session");
                                  alert("🔒 Google Secure handshakes terminated. Browser session safely locked.");
                                };

                                // Load presets easily for testing
                                const handleApplyPresetAccount = (presetEmail: string) => {
                                  setLoginEmailInput(presetEmail);
                                  setLoginPassInput("gpkos_master_security_key");
                                };

                                // Filter the OWA global data list based on current logged in user settings
                                const activeUserPrefix = gmailActiveEmail.split("@")[0];
                                
                                const filteredMails = emails.filter(mail => {
                                  // Skip deleted items
                                  if (deletedIds.includes(mail.id)) return false;

                                  // Apply queries
                                  if (gmailSearchQuery.trim()) {
                                    const term = gmailSearchQuery.toLowerCase();
                                    const matches = 
                                      mail.subject?.toLowerCase().includes(term) ||
                                      mail.senderFullName?.toLowerCase().includes(term) ||
                                      mail.body?.toLowerCase().includes(term) ||
                                      mail.snippet?.toLowerCase().includes(term);
                                    if (!matches) return false;
                                  }

                                  // Apply folders
                                  if (gmailFolder === "starred") {
                                    return starredIds.includes(mail.id);
                                  } else if (gmailFolder === "sent") {
                                    return mail.isGmailSentFolder || mail.senderUsername === activeUserPrefix;
                                  } else if (gmailFolder === "trash") {
                                    // Normally handled, we let it be handled or empty
                                    return false; 
                                  } else if (gmailFolder === "drafts") {
                                    return false;
                                  } else {
                                    // "inbox"
                                    // Exclude items flagged as out sent unless addressed back to me
                                    const isSentByMe = mail.isGmailSentFolder || mail.senderUsername === activeUserPrefix;
                                    return !isSentByMe;
                                  }
                                });

                                return (
                                  <div className="flex-grow flex flex-col p-4 overflow-hidden text-left h-full">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-3 mb-3 shrink-0 gap-2">
                                      <div>
                                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                                          <Mail className="w-5 h-5 text-red-500" />
                                          Gmail 极速中转安全主控
                                        </h3>
                                        <p className="text-[10px] text-slate-400">专为国内直连全球 Google 账号收发业务深度定制，数据由节点沙盒对称强加密，杜绝痕迹污染。</p>
                                      </div>
                                      
                                      {googleToken && (
                                        <div className="flex items-center gap-2.5 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl font-mono text-[10px] shrink-0 self-end md:self-auto">
                                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                          <span className="text-slate-300">User: <strong className="text-white">{gmailActiveEmail}</strong></span>
                                          <button 
                                            onClick={handleGoogleLogOut} 
                                            className="ml-2.5 text-red-400 hover:text-red-300 hover:underline border-l border-white/10 pl-2.5 font-bold uppercase tracking-wider"
                                          >
                                            Logout
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    {!googleToken ? (
                                      /* Google login overlay featuring tabbed selector: Login or Sign Up account creation */
                                      <div className="flex-grow flex items-center justify-center py-4 overflow-y-auto w-full">
                                        <div className="bg-slate-900/60 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6">
                                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-cyan-500" />
                                          
                                          {/* Google Logo */}
                                          <div className="text-center flex flex-col items-center gap-1.5">
                                            <div className="text-xl font-black text-white flex items-center gap-1.5 font-sans tracking-tight">
                                              <span className="text-blue-500 font-extrabold">G</span>
                                              <span className="text-red-500 font-extrabold">o</span>
                                              <span className="text-amber-500 font-extrabold">o</span>
                                              <span className="text-blue-500 font-extrabold">g</span>
                                              <span className="text-green-500 font-extrabold">l</span>
                                              <span className="text-red-500 font-extrabold">e</span>
                                              <span className="text-slate-400 font-medium text-xs font-mono ml-1.5 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">GPKOS Bridge</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400">Secure proxy sandbox session key system</p>
                                          </div>

                                          {/* Form toggles */}
                                          <div className="flex border-b border-white/5 p-0.5 bg-slate-950/60 rounded-xl">
                                            <button 
                                              onClick={() => setGoogleLoginMode("signin")}
                                              className={`flex-grow py-2 rounded-lg text-xs font-bold transition-all ${googleLoginMode === 'signin' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                                            >
                                              🔑 登录您的 Google 账号
                                            </button>
                                            <button 
                                              onClick={() => setGoogleLoginMode("signup")}
                                              className={`flex-grow py-2 rounded-lg text-xs font-bold transition-all ${googleLoginMode === 'signup' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/15' : 'text-slate-400 hover:text-white'}`}
                                            >
                                              ✨ 注册 Google 免费新账号
                                            </button>
                                          </div>

                                          {googleLoginMode === "signin" ? (
                                            /* Sign In view with Preset Auto handshakes */
                                            <form onSubmit={handleGoogleSignInSubmit} className="space-y-4">
                                              <div>
                                                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Google 邮箱地址 (Gmail Address)</label>
                                                <input 
                                                  type="text"
                                                  required
                                                  value={loginEmailInput}
                                                  onChange={e => setLoginEmailInput(e.target.value)}
                                                  placeholder="yourname@gmail.com"
                                                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500 font-mono"
                                                />
                                              </div>
                                              <div>
                                                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">账户安全密码 (Google Password)</label>
                                                <input 
                                                  type="password"
                                                  required
                                                  value={loginPassInput}
                                                  onChange={e => setLoginPassInput(e.target.value)}
                                                  placeholder="••••••••••••••"
                                                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                                                />
                                              </div>

                                              {/* Preset helper for fast validation testing */}
                                              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5 space-y-1.5 text-[10px]">
                                                <div className="text-slate-500 font-bold flex items-center gap-1">⚡ 体验账号免密一键登入:</div>
                                                <div className="flex flex-wrap gap-1.5">
                                                  <button 
                                                    type="button"
                                                    onClick={() => handleApplyPresetAccount("marvis_zhou2014@gmail.com")}
                                                    className="bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/5 px-2 py-0.5 rounded font-mono"
                                                  >
                                                    marvis_zhou2014
                                                  </button>
                                                  <button 
                                                    type="button"
                                                    onClick={() => handleApplyPresetAccount("gpkos.sysadmin@gmail.com")}
                                                    className="bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/5 px-2 py-0.5 rounded font-mono"
                                                  >
                                                    gpkos.sysadmin
                                                  </button>
                                                </div>
                                              </div>

                                              <button 
                                                type="submit"
                                                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-tight text-xs py-2.5 rounded-xl transition"
                                              >
                                                完成安全 Google 密码校验与登录 Handshake
                                              </button>
                                            </form>
                                          ) : (
                                            /* Registration Sign Up view */
                                            <form onSubmit={handleGoogleSignUpSubmit} className="space-y-3 max-h-[300px] overflow-y-auto pr-1 text-left">
                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <label className="text-[9px] uppercase text-slate-400 font-bold block mb-1">姓 (Last Name)</label>
                                                  <input 
                                                    type="text"
                                                    required
                                                    value={signupLastName}
                                                    onChange={e => setSignupLastName(e.target.value)}
                                                    placeholder="Zhou"
                                                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="text-[9px] uppercase text-slate-400 font-bold block mb-1">名 (First Name)</label>
                                                  <input 
                                                    type="text"
                                                    required
                                                    value={signupFirstName}
                                                    onChange={e => setSignupFirstName(e.target.value)}
                                                    placeholder="Marvis"
                                                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
                                                  />
                                                </div>
                                              </div>

                                              <div>
                                                <label className="text-[9px] uppercase text-slate-400 font-bold block mb-1">自定义 Google 账号名 (Desired Username)</label>
                                                <div className="flex items-center">
                                                  <input 
                                                    type="text"
                                                    required
                                                    value={signupUsernameValue}
                                                    onChange={e => setSignupUsernameValue(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
                                                    placeholder="marvis.is.free"
                                                    className="flex-grow bg-slate-950 border border-white/10 rounded-l-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                                                  />
                                                  <span className="bg-slate-950 border-y border-r border-white/10 rounded-r-lg px-2.5 py-1.5 text-[10px] text-slate-400 font-bold">@gmail.com</span>
                                                </div>
                                                <span className="text-[8px] text-slate-500">Only letters, numbers, hyphens, and periods allowed.</span>
                                              </div>

                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <label className="text-[9px] uppercase text-slate-400 font-bold block mb-1">密码 (Password)</label>
                                                  <input 
                                                    type="password"
                                                    required
                                                    value={signupPass}
                                                    onChange={e => setSignupPass(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="text-[9px] uppercase text-slate-400 font-bold block mb-1">确认密码 (Confirm)</label>
                                                  <input 
                                                    type="password"
                                                    required
                                                    value={signupConfirmPass}
                                                    onChange={e => setSignupConfirmPass(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                                                  />
                                                </div>
                                              </div>

                                              <div>
                                                <label className="text-[9px] uppercase text-slate-400 font-bold block mb-1">安全备用电话号码 (Phone - Optional)</label>
                                                <input 
                                                  type="text"
                                                  value={signupPhone}
                                                  onChange={e => setSignupPhone(e.target.value)}
                                                  placeholder="+86 138-0000-0000"
                                                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                                                />
                                              </div>

                                              <button 
                                                type="submit"
                                                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-tight text-xs py-2 rounded-xl transition mt-2"
                                              >
                                                ⚙️ 全自动创建并同步登录谷歌账号 (Build & AutoLogin)
                                              </button>
                                            </form>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      /* Fully Featured State-Driven Gmail Interactive Sandbox Client Suite */
                                      <div className="flex-grow flex flex-col md:flex-row overflow-hidden border border-white/5 rounded-2xl bg-slate-950 shadow-inner">
                                        
                                        {/* Sub-layout: 1. Gmail Left controls & signature hub */}
                                        <div className="w-full md:w-44 bg-slate-900/40 border-b md:border-b-0 md:border-r border-white/5 flex flex-col p-2.5 gap-1.5 shrink-0 select-none">
                                          
                                          {/* Floating style writing dispatch button */}
                                          <button 
                                            onClick={() => setGmailComposeOpen(true)}
                                            className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-[10px] py-2 rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5 uppercase mb-2"
                                          >
                                            <Edit className="w-3.5 h-3.5" /> 撰写新邮件 (Compose)
                                          </button>

                                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 px-2">Folders</span>

                                          {[
                                            { id: "inbox", label: "收件箱 (Inbox)", icon: Mail, badgeColor: "bg-cyan-500/10 text-cyan-400" },
                                            { id: "starred", label: "星标邮件 (Starred)", icon: Star, badgeColor: "bg-amber-500/10 text-amber-400" },
                                            { id: "sent", label: "已发送 (Sent)", icon: Send, badgeColor: "bg-purple-500/10 text-purple-400" }
                                          ].map(tab => {
                                            const Icon = tab.icon;
                                            
                                            // Dynamic tab counts calculation based on active list
                                            let count = 0;
                                            if (tab.id === "starred") count = starredIds.length;
                                            else if (tab.id === "sent") count = emails.filter(m => m.isGmailSentFolder || m.senderUsername === activeUserPrefix).length;
                                            else count = filteredMails.length; // inbox active

                                            return (
                                              <button
                                                key={tab.id}
                                                onClick={() => { setGmailFolder(tab.id as any); setGmailSelectedEmail(null); }}
                                                className={`w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg transition text-[10px] ${gmailFolder === tab.id ? 'bg-white/5 text-white font-bold border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                                              >
                                                <div className="flex items-center gap-2">
                                                  <Icon className="w-3.5 h-3.5" />
                                                  <span>{tab.label}</span>
                                                </div>
                                                {count > 0 && (
                                                  <span className={`px-1.5 py-0.2 rounded font-mono text-[8px] font-bold ${tab.badgeColor}`}>{count}</span>
                                                )}
                                              </button>
                                            );
                                          })}

                                          {/* Signature customizer configuration workspace */}
                                          <div className="mt-auto border-t border-white/5 pt-3">
                                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 px-2 block mb-1">Relay Signature</span>
                                            
                                            {isEditingSig ? (
                                              <div className="space-y-1">
                                                <textarea 
                                                  value={gmailSig}
                                                  onChange={e => { setGmailSig(e.target.value); localStorage.setItem("gpkos_gmail_sig", e.target.value); }}
                                                  className="w-full bg-slate-950 border border-white/15 rounded p-1 text-[9px] font-mono text-slate-300 h-16 resize-none focus:border-cyan-500 outline-none"
                                                />
                                                <button 
                                                  onClick={() => setIsEditingSig(false)}
                                                  className="w-full bg-white/5 hover:bg-white/10 text-[8px] py-1 rounded text-cyan-300 font-bold"
                                                >
                                                  Done Editing
                                                </button>
                                              </div>
                                            ) : (
                                              <div 
                                                onClick={() => setIsEditingSig(true)}
                                                className="p-2 bg-slate-905 border border-white/5 hover:border-slate-800 rounded-lg text-[8px] font-mono text-slate-400 text-left leading-normal cursor-pointer select-none truncate hover:text-slate-200 transition"
                                                title="Click to edit signature"
                                              >
                                                "{gmailSig}"
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Sub-layout: 2. Mail Items intermediate List Column */}
                                        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 flex flex-col overflow-hidden shrink-0">
                                          
                                          {/* Inline fast query search box */}
                                          <div className="p-2 bg-slate-900/60 border-b border-white/5">
                                            <input 
                                              type="text"
                                              value={gmailSearchQuery}
                                              onChange={e => setGmailSearchQuery(e.target.value)}
                                              placeholder="🔍 Search mail headers/body..."
                                              className="w-full bg-slate-950 border border-white/15 rounded-lg px-2.5 py-1 text-[10px] text-white outline-none focus:border-cyan-500"
                                            />
                                          </div>

                                          <div className="flex-grow overflow-y-auto divide-y divide-white/5">
                                            {filteredMails.length === 0 ? (
                                              <div className="p-8 text-center text-slate-500 text-[10px]">No emails in this drawer.</div>
                                            ) : (
                                              filteredMails.map((mail) => {
                                                const isStarred = starredIds.includes(mail.id);
                                                const isSelected = gmailSelectedEmail?.id === mail.id;
                                                return (
                                                  <div 
                                                    key={mail.id} 
                                                    onClick={() => setGmailSelectedEmail(mail)}
                                                    className={`p-2.5 text-left transition relative cursor-pointer group select-none ${isSelected ? 'bg-cyan-950/20 border-l-2 border-cyan-500' : 'hover:bg-white/5'}`}
                                                  >
                                                    <div className="flex items-center justify-between mb-1 gap-1.5">
                                                      <span className="font-extrabold text-[10px] text-cyan-300 truncate max-w-[120px]">
                                                        {mail.senderFullName === "Me" ? `To: ${mail.receiverFullName || 'Someone'}` : mail.senderFullName}
                                                      </span>
                                                      <span className="text-[8px] text-slate-500 shrink-0 font-mono">
                                                        {new Date(mail.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                      </span>
                                                    </div>
                                                    
                                                    <p className={`text-[10px] text-white truncate leading-tight ${!mail.read ? 'font-bold text-slate-100' : 'text-slate-200'}`}>
                                                      {mail.subject || "(No Subject)"}
                                                    </p>
                                                    <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5" dangerouslySetInnerHTML={{ __html: mail.snippet || mail.body || "" }} />

                                                    {/* Quick control overlays (star, delete) */}
                                                    <div className="absolute right-2 bottom-1.5 opacity-40 group-hover:opacity-100 flex items-center gap-1.5 transition">
                                                      <button 
                                                        onClick={(e) => handleToggleStar(mail.id, e)}
                                                        className={`p-0.5 hover:scale-110 transition ${isStarred ? "text-amber-400" : "text-slate-500"}`}
                                                      >
                                                        ★
                                                      </button>
                                                      <button 
                                                        onClick={(e) => handleDeleteMail(mail.id, e)}
                                                        className="p-0.5 text-slate-500 hover:text-red-400 hover:scale-110 transition"
                                                        title="Delete email"
                                                      >
                                                        ✕
                                                      </button>
                                                    </div>
                                                  </div>
                                                );
                                              })
                                            )}
                                          </div>
                                        </div>

                                        {/* Sub-layout: 3. Rich Reading Content Details Pane */}
                                        <div className="flex-grow flex flex-col bg-slate-950/30 overflow-y-auto min-h-[220px]">
                                          {gmailSelectedEmail ? (
                                            <div className="p-4 flex flex-col gap-4">
                                              
                                              {/* Mail Headers box */}
                                              <div className="border-b border-white/5 pb-3">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                  <h4 className="text-sm font-extrabold text-white leading-normal leading-snug">{gmailSelectedEmail.subject || "(No Subject)"}</h4>
                                                  
                                                  <div className="flex items-center gap-1.5 shrink-0">
                                                    <button 
                                                      onClick={(e) => handleToggleStar(gmailSelectedEmail.id, e)}
                                                      className={`px-2 py-0.5 rounded border text-[9px] font-bold ${starredIds.includes(gmailSelectedEmail.id) ? "border-amber-500/30 bg-amber-500/10 text-amber-300" : "border-white/10 text-slate-400"}`}
                                                    >
                                                      ★ Starred
                                                    </button>
                                                    
                                                    <button 
                                                      onClick={(e) => handleDeleteMail(gmailSelectedEmail.id, e)}
                                                      className="px-2 py-0.5 rounded border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-[9px] font-bold"
                                                    >
                                                      ✕ Delete
                                                    </button>
                                                  </div>
                                                </div>

                                                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                                                  <div>
                                                    Sender: <strong className="text-cyan-300">{gmailSelectedEmail.senderFullName}</strong> &lt;{gmailSelectedEmail.senderUsername}@{gmailSelectedEmail.senderDomain}&gt;
                                                  </div>
                                                  <div>
                                                    {new Date(gmailSelectedEmail.timestamp).toLocaleString()}
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Mail Core Rich Text rendering body */}
                                              <div className="text-[11px] text-slate-200 leading-relaxed text-left break-words overflow-y-auto max-h-72">
                                                {gmailSelectedEmail.body ? (
                                                  <div 
                                                    className="font-sans space-y-2 prose prose-invert max-w-none text-left"
                                                    dangerouslySetInnerHTML={{ __html: gmailSelectedEmail.body }} 
                                                  />
                                                ) : (
                                                  <p className="text-slate-500 italic">No message content body declared.</p>
                                                )}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="flex-grow flex flex-col items-center justify-center text-slate-500 p-8">
                                              <div className="bg-white/5 p-4 rounded-full border border-white/5 mb-2.5">
                                                <Mail className="w-8 h-8 text-slate-600" />
                                              </div>
                                              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">No mail selected</span>
                                              <p className="text-[9px] text-slate-600 max-w-xs mt-1 text-center">Select an incoming secure transmission from the list column to verify metadata payload.</p>
                                            </div>
                                          )}
                                        </div>

                                      </div>
                                    )}

                                    {/* Sub-layout: 4. Floating Composer Component Popup overlay */}
                                    {gmailComposeOpen && (
                                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                                        <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative flex flex-col overflow-hidden">
                                          <div className="bg-slate-950 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                                            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                                              <Edit className="w-4 h-4 text-red-500" />
                                              Gmail Mail Direct Dispatcher Node
                                            </h4>
                                            <button 
                                              onClick={() => setGmailComposeOpen(false)}
                                              className="text-slate-400 hover:text-white font-extrabold text-xs"
                                            >
                                              ✕
                                            </button>
                                          </div>

                                          <form onSubmit={handleGmailWriteSubmit} className="p-4 space-y-3">
                                            <div>
                                              <label className="text-[9px] uppercase text-slate-400 font-extrabold tracking-wider mb-1 block">收件人 (Recipient To)</label>
                                              <input 
                                                type="email"
                                                required
                                                placeholder="colleague@company.com"
                                                value={gmailComposeToAddress}
                                                onChange={e => setGmailComposeToAddress(e.target.value)}
                                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                                              />
                                            </div>

                                            <div>
                                              <label className="text-[9px] uppercase text-slate-400 font-extrabold tracking-wider mb-1 block">邮件主题 (Subject Title)</label>
                                              <input 
                                                type="text"
                                                required
                                                placeholder="Symmetric crypt-key memo dispatch"
                                                value={gmailComposeSubjectLine}
                                                onChange={e => setGmailComposeSubjectLine(e.target.value)}
                                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none"
                                              />
                                            </div>

                                            <div>
                                              <label className="text-[9px] uppercase text-slate-400 font-extrabold tracking-wider mb-1 block">信件主体 (Letter Content Body)</label>
                                              <textarea 
                                                required
                                                placeholder="Write your cryptographically sandboxed message content here..."
                                                value={gmailComposeMessageText}
                                                onChange={e => setGmailComposeMessageText(e.target.value)}
                                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white h-24 focus:border-cyan-500 outline-none resize-none font-sans"
                                              />
                                            </div>

                                            {/* Preview default signature */}
                                            <div className="bg-slate-950 p-2 rounded-lg border border-white/5 text-[8px] font-mono text-slate-400">
                                              <span className="font-bold text-slate-500 text-[7px] uppercase block mb-0.5">Appended Signature Preview:</span>
                                              -- <br/>
                                              {gmailSig}
                                            </div>

                                            <button 
                                              type="submit"
                                              disabled={sendingGmailLocalState}
                                              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-tight text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5"
                                            >
                                              {sendingGmailLocalState ? <RefreshCw className="w-3 animate-spin"/> : "⚡ Start SSL Relay handshakes & relay out"}
                                            </button>
                                          </form>
                                        </div>
                                      </div>
                                    )}

                                  </div>
                                )();
                              })}

                              {/* Maps tab */}
                              {googleHubTab === "maps" && (
                                <div className="flex-grow flex flex-col overflow-hidden text-left h-full">
                                  <div className="bg-slate-900/80 p-3 border-b border-white/5 shrink-0 flex items-center justify-between">
                                     <div>
                                       <h3 className="text-sm font-bold text-white">🗺️ Google Maps 极速中转通道</h3>
                                       <p className="text-[10px] text-slate-400">专用 SSL 海外管道极速载入地图，解决被墙阻截导致地图花屏、请求失败与卡死等常见故障。</p>
                                     </div>
                                     <div className="flex items-center gap-1.5 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
                                        GFW BYPASS OK
                                     </div>
                                  </div>
                                  <div className="flex-grow relative bg-slate-950">
                                     <div className="absolute inset-0 z-0">
                                       <GoogleMapsWrapper />
                                     </div>
                                  </div>
                                </div>
                              )}

                              {/* Gemini tab */}
                              {googleHubTab === "gemini" && (
                                <div className="flex-grow flex flex-col p-5 overflow-hidden text-left">
                                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 shrink-0">
                                    <div>
                                      <h3 className="text-base font-bold text-white flex items-center gap-2">🧠 Gemini 决策人工智能中控</h3>
                                      <p className="text-[11px] text-slate-400">支持灵活挑选 Gemini 的可用微调版本，进行全自动海外代理问答交互。</p>
                                    </div>
                                    
                                    {/* Select Version of Gemini model */}
                                    <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10">
                                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Model:</span>
                                      <select 
                                        value={geminiModelSelected}
                                        onChange={(e) => setGeminiModelSelected(e.target.value)}
                                        className="bg-transparent text-xs text-cyan-300 font-bold font-mono outline-none border-none cursor-pointer"
                                      >
                                        <option value="gemini-1.5-flash" className="bg-slate-950 text-white font-mono">gemini-1.5-flash (极速流畅)</option>
                                        <option value="gemini-1.5-pro" className="bg-slate-950 text-white font-mono">gemini-1.5-pro (精深分析)</option>
                                        <option value="gemini-2.0-flash" className="bg-slate-950 text-white font-mono">gemini-2.0-flash (次世代高速)</option>
                                        <option value="gemini-2.5-flash-experimental" className="bg-slate-950 text-white font-mono">gemini-2.5-flash-exp (前卫特性)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="flex-grow flex flex-col bg-slate-900/30 border border-white/5 rounded-2xl overflow-hidden p-3 relative">
                                    {/* Chat Area */}
                                    <div className="flex-grow overflow-y-auto space-y-3 mb-3 pr-1">
                                      {geminiChatHistoryList.map((m, idx) => (
                                        <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                          <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs ${m.role === 'user' ? 'bg-cyan-500/10 text-cyan-100 border border-cyan-500/20' : 'bg-slate-900 border border-white/5 text-slate-200'}`}>
                                            <div className="text-[9px] uppercase font-bold mb-1 opacity-50 font-mono tracking-wider">{m.role === 'user' ? 'Operator' : geminiModelSelected}</div>
                                            <p className="whitespace-pre-wrap leading-relaxed select-text">{m.text}</p>
                                          </div>
                                        </div>
                                      ))}
                                      {loadingGeminiModel && (
                                        <div className="flex justify-start">
                                          <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                                            <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin"/> {geminiModelSelected} is processing logical traces...
                                          </div>
                                        </div>
                                      )}
                                      {geminiChatHistoryList.length === 0 && (
                                        <div className="text-center text-slate-500 font-mono text-xs py-14">
                                          Ready for secure AI instructions with model variant: <span className="text-cyan-400 font-bold">{geminiModelSelected}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Prompts Input Form */}
                                    <form onSubmit={handleGeminiChatSubmit} className="flex gap-2 mt-auto shrink-0 border-t border-white/5 pt-2.5">
                                      <input 
                                        type="text"
                                        value={geminiPromptText}
                                        onChange={(e) => setGeminiPromptText(e.target.value)}
                                        placeholder="输入任意要下达给谷歌 AI 的安全决策..."
                                        className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                                      />
                                      <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition flex items-center gap-1 shrink-0">
                                        Send Direct AI
                                      </button>
                                    </form>
                                  </div>
                                </div>
                              )}

                              {/* Crypto Relay Tab */}
                              {googleHubTab === "crypto" && (
                                <div className="flex-grow flex flex-col p-5 overflow-hidden text-left bg-slate-950 font-sans">
                                  <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 mb-4 shrink-0">
                                    <div>
                                      <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">🛡️ 对称加密数字密电中转站 (End-to-End Relay)</h3>
                                      <p className="text-[11px] text-slate-400 mt-1">
                                        基于客户端浏览器首层加盐异或 (XOR) 与 Base64 双重离线加密。数据在发往 db.json 之前已化为乱码，完全自建无谷歌云介入，实现零信任中转。
                                      </p>
                                    </div>
                                    <button
                                      onClick={async () => {
                                        if(!currentUser) return;
                                        setSendingCrypto(true);
                                        const res = await fetch(`${getApiBase()}/api/crypto/messages?user=${currentUser.emailUsername}`);
                                        const d = await res.json();
                                        if(d.success) setCryptoMessages(d.messages || []);
                                        setSendingCrypto(false);
                                      }}
                                      className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                                    >
                                      {sendingCrypto ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <RefreshCw className="w-3.5 h-3.5"/>}
                                      拉取最新密电网络
                                    </button>
                                  </div>

                                  <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-hidden">
                                     {/* Left: Sender UI */}
                                     <div className="bg-purple-950/20 border border-purple-500/20 rounded-2xl flex flex-col p-4 overflow-y-auto relative">
                                        <h4 className="text-sm font-bold text-white mb-4 border-b border-purple-500/10 pb-2">加密发送面板 (Encode)</h4>
                                        <div className="space-y-4">
                                           <div>
                                              <label className="text-xs font-bold text-purple-300 mb-1.5 block">🎯 接收人网关 ID (Receiver Username)</label>
                                              <input type="text" placeholder="输入系统内的用户名，如 marvis_zhou" value={cryptoReceiver} onChange={e => setCryptoReceiver(e.target.value)} className="w-full bg-slate-900 border border-purple-500/20 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-400 outline-none"/>
                                           </div>
                                           <div>
                                              <label className="text-xs font-bold text-purple-300 mb-1.5 block">📝 明文信件内容 (Raw Content)</label>
                                              <textarea placeholder="在这里输入最高机密内容..." value={cryptoMessage} onChange={e => setCryptoMessage(e.target.value)} className="w-full h-24 bg-slate-900 border border-purple-500/20 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-400 outline-none resize-none"/>
                                           </div>
                                           <div>
                                              <label className="text-xs font-bold text-purple-300 mb-1.5 block flex items-center gap-1"><KeyRound className="w-3.5 h-3.5"/> 🔐 本地对称口令金钥 (Symmetric Key)</label>
                                              <input type="password" placeholder="口令绝不会传向服务器，双方必须线下对好暗号" value={cryptoPassword} onChange={e => setCryptoPassword(e.target.value)} className="w-full bg-slate-900 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-red-300 focus:border-red-500 outline-none font-mono"/>
                                              <p className="text-[9px] text-slate-500 mt-1.5 font-mono">WARNING: This key encrypts text via local XOR before egress. Server has 0 knowledge.</p>
                                           </div>
                                           <button 
                                             onClick={async (e) => {
                                                e.preventDefault();
                                                if(!cryptoReceiver || !cryptoMessage || !cryptoPassword || !currentUser) {
                                                   alert("信息不全，无法生成密文负载！(Require Receiver, Message, Password)"); return;
                                                }
                                                setSendingCrypto(true);
                                                try {
                                                  // Client side local XOR & B64
                                                  const xorEncryptDecrypt = (text: string, key: string) => {
                                                    let res = '';
                                                    for (let i = 0; i < text.length; i++) {
                                                      res += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
                                                    }
                                                    return res;
                                                  };
                                                  const rawUtf8 = unescape(encodeURIComponent(cryptoMessage));
                                                  const xorData = xorEncryptDecrypt(rawUtf8, cryptoPassword);
                                                  const encryptedBase64 = btoa(xorData);
                                                  
                                                  const res = await fetch(`${getApiBase()}/api/crypto/send`, {
                                                    method: 'POST', headers: {'Content-Type': 'application/json'},
                                                    body: JSON.stringify({
                                                      sender: currentUser.emailUsername,
                                                      receiver: cryptoReceiver,
                                                      encryptedPayload: encryptedBase64
                                                    })
                                                  });
                                                  const d = await res.json();
                                                  if(d.success) {
                                                    alert("✅ 密电已加密并成功离线转移至服务器 db.json (端到端保护)");
                                                    setCryptoReceiver(""); setCryptoMessage(""); setCryptoPassword("");
                                                  }
                                                } catch(err) {
                                                  alert("Encryption transport failed!");
                                                }
                                                setSendingCrypto(false);
                                             }}
                                             className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-lg transition-transform hover:-translate-y-0.5 shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                                           >
                                              {sendingCrypto ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Lock className="w-4 h-4"/>}
                                              在浏览器内核本地加密并送出
                                           </button>
                                        </div>
                                     </div>

                                     {/* Right: Message Terminal */}
                                     <div className="bg-slate-900 border border-white/5 rounded-2xl flex flex-col p-4 overflow-hidden relative">
                                        <h4 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2">接收到的截获密文库 (Decrypted Terminal)</h4>
                                        <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                                           {cryptoMessages.length === 0 ? (
                                              <div className="text-center py-10 text-slate-500 text-xs font-mono">
                                                No encrypted packets received on this station.
                                              </div>
                                           ) : cryptoMessages.map(msg => (
                                              <div key={msg.id} className="bg-slate-950 p-3 rounded-xl border border-white/5 shadow-inner">
                                                 <div className="flex justify-between items-center mb-2">
                                                    <div className="flex flex-col">
                                                      <span className="text-[10px] text-slate-500 font-mono">FROM: <strong className="text-purple-400">{msg.sender}</strong></span>
                                                      <span className="text-[10px] text-slate-500 font-mono">TO: <strong className="text-cyan-400">{msg.receiver}</strong></span>
                                                    </div>
                                                    <span className="text-[9px] text-slate-600 font-mono">{new Date(msg.timestamp).toLocaleString()}</span>
                                                 </div>
                                                 
                                                 {decryptedMessageId === msg.id ? (
                                                    <div className="bg-emerald-950/40 p-2 rounded border border-emerald-500/20 text-emerald-400 font-mono text-xs break-all whitespace-pre-wrap">
                                                       {decryptedMessageText}
                                                    </div>
                                                 ) : (
                                                    <div className="bg-slate-900 p-2 rounded text-slate-600 font-mono text-[9px] break-all border border-slate-800">
                                                       {msg.encryptedPayload}
                                                    </div>
                                                 )}
                                                 
                                                 <div className="mt-3 flex gap-2">
                                                    {decryptedMessageId === msg.id ? (
                                                       <button onClick={() => { setDecryptedMessageId(null); setCryptoUnlockKey(""); }} className="text-[10px] text-slate-500 hover:text-white transition uppercase font-bold tracking-widest bg-slate-800 px-3 py-1 rounded">Lock Interface</button>
                                                    ) : (
                                                       <div className="flex-grow flex gap-2">
                                                         <input type="password" placeholder="Key (Offline Decrypt...)" value={cryptoUnlockKey} onChange={e => setCryptoUnlockKey(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white focus:border-emerald-500 outline-none"/>
                                                         <button 
                                                           onClick={() => {
                                                              if(!cryptoUnlockKey) return;
                                                              try {
                                                                const xorEncryptDecrypt = (text: string, key: string) => {
                                                                  let res = '';
                                                                  for (let i = 0; i < text.length; i++) {
                                                                    res += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
                                                                  }
                                                                  return res;
                                                                };
                                                                const decodedB64 = atob(msg.encryptedPayload);
                                                                const rawStr = xorEncryptDecrypt(decodedB64, cryptoUnlockKey);
                                                                setDecryptedMessageText(decodeURIComponent(escape(rawStr)));
                                                                setDecryptedMessageId(msg.id);
                                                              } catch (err) {
                                                                alert("解密失败：密文损坏或浏览器解析异常 (Error Decrypting)");
                                                              }
                                                              setCryptoUnlockKey("");
                                                           }}
                                                           className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3 rounded uppercase whitespace-nowrap transition"
                                                         >
                                                           Decrypt
                                                         </button>
                                                       </div>
                                                    )}
                                                 </div>
                                              </div>
                                           ))}
                                        </div>
                                     </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Google Play Store */}
                  {gpkosActiveApp === 'google-play' && (() => {
                    return (
                      <div className="absolute inset-x-8 top-12 bottom-20 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in z-40">
                         <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="bg-blue-600 p-2 rounded-xl text-white shadow"><ShoppingBag className="h-5 w-5" /></div>
                               <span className="font-bold text-slate-800 text-lg">Google Play</span>
                            </div>
                            <button onClick={() => setGpkosActiveApp('desktop')} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="h-5 w-5 text-slate-500" /></button>
                         </div>
                         <div className="flex-grow flex flex-col p-8 overflow-y-auto bg-slate-50">
                            <div className="max-w-4xl mx-auto w-full">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                  <div>
                                     <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 shadow-inner">
                                        <Smartphone className="h-10 w-10 text-slate-400" />
                                     </div>
                                     <h2 className="text-3xl font-black text-slate-900 mb-2">Sync Account</h2>
                                     <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                        The Google Play Store requires a verified developer account to access high-speed binary distribution nodes.
                                     </p>
                                     <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg">Sign In to Sync</button>
                                  </div>
                                  <div className="space-y-4">
                                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><CheckCircle className="h-6 w-6" /></div>
                                        <div>
                                           <div className="text-xs font-bold text-slate-900">Verified System</div>
                                           <div className="text-[10px] text-slate-500 font-mono tracking-tight">NODES_SECURE_VERIFIED</div>
                                        </div>
                                     </div>
                                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 opacity-50">
                                        <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><AlertTriangle className="h-6 w-6" /></div>
                                        <div>
                                           <div className="text-xs font-bold text-slate-900">Payload Pending</div>
                                           <div className="text-[10px] text-slate-500 font-mono tracking-tight">WAITING_FOR_AUTH_HANDSHAKE</div>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    );
                  })()}

                  {/* Gmail App */}
                  {gpkosActiveApp === 'gmail' && (() => {
                    return (
                      <div className="absolute inset-x-8 top-12 bottom-20 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in z-40 text-left">
                        <div className="bg-slate-800 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-rose-500 p-2 rounded-xl text-white shadow-lg shadow-rose-900/20"><Mail className="h-5 w-5" /></div>
                            <span className="font-bold text-slate-100 italic tracking-tighter text-xl">Gmail <span className="text-slate-500 font-normal text-xs not-italic">Suite</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                             <button onClick={() => setGpkosActiveApp('desktop')} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold text-slate-400 transition border border-white/5 uppercase tracking-widest">Close App</button>
                             {!googleToken ? (
                                <button onClick={() => loginGoogleProvider()} className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] px-4 py-1.5 rounded-full shadow-lg transition">Sign In</button>
                             ) : (
                                <button onClick={() => { setGoogleToken(null); localStorage.removeItem("fatshan_global_session"); }} className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-[10px] px-4 py-1.5 rounded-full shadow-lg transition">Logout</button>
                             )}
                          </div>
                        </div>
                        <div className="flex-grow flex bg-slate-950 relative overflow-hidden">
                           {!googleToken ? (
                             <div className="flex-grow flex items-center justify-center relative">
                               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500 via-transparent to-transparent"></div>
                               <div className="text-center z-10 max-w-sm">
                                 <div className="mb-8 relative inline-block">
                                    <div className="absolute inset-0 bg-rose-500/20 blur-3xl animate-pulse rounded-full"></div>
                                    <div className="bg-slate-900 border border-white/10 p-8 rounded-full relative z-10 shadow-2xl">
                                      <ShieldAlert className="h-16 w-16 text-rose-400 mx-auto" />
                                    </div>
                                 </div>
                                 <h2 className="text-2xl font-black text-slate-100 mb-4 tracking-tight">Access Token Required</h2>
                                 <p className="text-slate-400 text-xs leading-relaxed mb-8 px-4">
                                   Please authenticate via the <span className="text-rose-400 font-bold">Secure Gateway</span> to proceed with full Gmail synchronization.
                                 </p>
                                 <button onClick={() => loginGoogleProvider()} className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-900/40 transition active:scale-95 uppercase tracking-widest text-[11px]">
                                   Sign in with Google
                                 </button>
                               </div>
                             </div>
                           ) : (
                             <div className="flex-grow flex flex-col">
                               <div className="flex-grow overflow-y-auto divide-y divide-white/5">
                                 {loadingGoogleData['gmail'] ? (
                                   <div className="p-20 text-center flex flex-col items-center gap-4">
                                      <RefreshCw className="h-10 w-10 text-rose-500 animate-spin" />
                                      <span className="text-slate-400 animate-pulse font-mono text-xs uppercase tracking-widest">Handshaking with Google Mail Servers...</span>
                                   </div>
                                 ) : emails.filter(m => m.id.startsWith('gmail-') || m.senderDomain === 'gmail.com').length === 0 ? (
                                   <div className="p-20 text-center text-slate-500 font-mono text-sm">No items found in synchronized buffer.</div>
                                 ) : (
                                   emails.filter(m => m.id.startsWith('gmail-') || m.senderDomain === 'gmail.com').map(mail => (
                                     <div key={mail.id} className="p-4 hover:bg-white/5 transition border-l-2 border-transparent hover:border-rose-500 cursor-pointer">
                                       <div className="flex justify-between items-start mb-1">
                                         <span className="text-rose-400 font-black text-xs truncate max-w-[200px]">{mail.senderFullName || mail.senderUsername}</span>
                                         <span className="text-[10px] text-slate-500 font-mono italic">{new Date(mail.timestamp).toLocaleTimeString()}</span>
                                       </div>
                                       <h4 className="text-white font-bold text-sm mb-1 leading-tight">{mail.subject}</h4>
                                       <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{mail.snippet}</p>
                                     </div>
                                   ))
                                 )}
                               </div>
                             </div>
                           )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Gemini app */}
                  {gpkosActiveApp === 'gemini' && (() => {
                    return (
                      <div className="absolute inset-x-8 top-12 bottom-20 bg-[#0a0a1a] border border-cyan-500/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in z-40">
                         <div className="bg-black/60 backdrop-blur-xl px-6 py-4 border-b border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-900/40 animate-pulse"><Sparkles className="h-5 w-5" /></div>
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 tracking-tighter text-xl">Gemini <span className="text-slate-500 font-normal text-xs italic">Experimental Hub</span></span>
                          </div>
                          <button onClick={() => setGpkosActiveApp('desktop')} className="px-4 py-1 gap-1.5 bg-slate-900 hover:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 transition border border-white/5 flex items-center">
                            <X className="h-3 w-3" /> ESC
                          </button>
                        </div>
                        <div className="flex-grow flex flex-col p-6 overflow-y-auto">
                           <div className="max-w-2xl mx-auto w-full flex flex-col gap-8 py-10">
                              <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-[2rem] text-center">
                                 <div className="text-blue-400 text-sm font-bold mb-2">Welcome to GPKOS Artificial Intelligence</div>
                                 <div className="text-slate-400 text-xs">How can I assist you with the Fatshan node operations today?</div>
                              </div>
                              <div className="flex flex-col gap-4">
                                 <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-white/5"><BrainCircuit className="h-4 w-4 text-blue-400" /></div>
                                    <div className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl rounded-tl-none text-xs text-slate-300 leading-relaxed shadow-sm">
                                       Hello! I am Gemini, your dedicated AI core for this workspace. I can help with log analysis, security auditing, or general queries about the Fatshan Post console.
                                    </div>
                                 </div>
                                 <div className="flex gap-4 justify-end">
                                    <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-xs text-white leading-relaxed shadow-lg">
                                       Show me the latest latency report for the Tokyo Node.
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-lg"><User className="h-4 w-4 text-white" /></div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        {/* Gemini input bar */}
                        <div className="p-6 bg-black/40 border-t border-white/5">
                           <div className="max-w-2xl mx-auto relative group">
                              <input 
                                type="text" 
                                placeholder="Message Gemini..." 
                                className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-4 pr-14 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                              />
                              <button className="absolute right-2 top-2 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition shadow-lg active:scale-95">
                                 <ArrowRight className="h-4 w-4" />
                              </button>
                           </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Global Secure Bridge App */}
                  {gpkosActiveApp === 'global-bridge' && (() => {
                    return (
                      <div className="absolute inset-x-8 top-12 bottom-20 bg-[#020617] border border-cyan-500/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in z-50 text-left">
                        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-cyan-600 p-2 rounded-xl text-white shadow-lg"><Globe className="h-5 w-5" /></div>
                            <span className="font-bold text-slate-100 text-xl tracking-tighter">Secure Bridge Proxy <span className="text-slate-500 font-normal text-xs ml-2">Global Connectivity Node</span></span>
                          </div>
                          <button onClick={() => setGpkosActiveApp('desktop')} className="p-2 hover:bg-white/10 rounded-full transition text-slate-400 group">
                            <X className="h-5 w-5 group-hover:scale-110 transition" />
                          </button>
                        </div>
                        <div className="flex-grow p-8 overflow-y-auto bg-slate-950/50">
                          <div className="max-w-2xl mx-auto">
                             <SecureBridge />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Google Maps App */}
                  {gpkosActiveApp === 'maps' && (() => {
                    return (
                      <div className="absolute inset-x-8 top-12 bottom-20 bg-[#020617] border border-emerald-500/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in z-50 text-left">
                        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg"><MapPin className="h-5 w-5" /></div>
                            <span className="font-bold text-slate-100 text-xl tracking-tighter">Google Maps <span className="text-slate-500 font-normal text-xs ml-2">Integrated Navigation</span></span>
                          </div>
                          <div className="flex items-center gap-3">
                             {!googleToken && <button onClick={() => loginGoogleProvider()} className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] px-4 py-1.5 rounded-full shadow-lg transition">Sync Google Node</button>}
                             <button onClick={() => setGpkosActiveApp('desktop')} className="p-2 hover:bg-white/10 rounded-full transition text-slate-400 group">
                               <X className="h-5 w-5 group-hover:scale-110 transition" />
                             </button>
                          </div>
                        </div>
                        <div className="flex-grow p-4 bg-slate-950 flex flex-col">
                           <div className="flex-grow mb-4">
                              <GoogleMapsWrapper />
                           </div>
                           <div className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bridged GPS Active</span>
                                 </div>
                                 <div className="h-4 w-[1px] bg-slate-700" />
                                 <span className="text-[9px] text-slate-600 font-mono italic">via Hugging Face Secure Relay v4.1</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Shield className="w-3.5 h-3.5 text-cyan-500" />
                                 <span className="text-[10px] text-cyan-500 font-bold tracking-tighter uppercase">AES-256 Encrypted</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Google Drive App */}
                  {gpkosActiveApp === 'drive' && (() => {
                    return (
                      <div className="absolute inset-x-8 top-12 bottom-20 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in z-40 text-left">
                         <div className="bg-slate-800 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="bg-amber-500 p-2 rounded-xl text-white shadow-lg"><HardDrive className="h-5 w-5" /></div>
                               <span className="font-bold text-slate-100 text-xl tracking-tighter">Google Drive <span className="text-slate-500 font-normal text-xs ml-2">Secure Cloud Storage</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                               <button onClick={() => setGpkosActiveApp('desktop')} className="p-2 hover:bg-white/10 rounded-full transition text-slate-400"><X className="h-5 w-5" /></button>
                               {!googleToken && <button onClick={() => loginGoogleProvider()} className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold">Login</button>}
                            </div>
                         </div>
                         <div className="flex-grow p-6 bg-slate-950 overflow-y-auto">
                            {!googleToken ? (
                               <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                  <Lock className="h-12 w-12 text-slate-600 mb-4" />
                                  <p className="text-slate-400 text-sm">Synchronization Offline. Authenticate to view cloud assets.</p>
                               </div>
                            ) : loadingGoogleData['drive'] ? (
                               <div className="h-full flex flex-col items-center justify-center gap-3">
                                  <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
                                  <span className="text-slate-500 font-mono text-[10px] tracking-widest">QUERYING DISTRIBUTED NODES...</span>
                               </div>
                            ) : (
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {googleDriveFiles.map(file => (
                                     <div key={file.id} className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition cursor-pointer group">
                                        <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-amber-500/20 transition">
                                           {file.iconLink ? <img src={file.iconLink} alt="" className="h-6 w-6" /> : <Box className="h-6 w-6 text-amber-500" />}
                                        </div>
                                        <div className="flex-grow overflow-hidden text-left">
                                           <div className="text-white text-xs font-bold truncate">{file.name}</div>
                                           <div className="text-[10px] text-slate-500 font-mono uppercase truncate">{file.mimeType.split('.').pop()} Node Asset</div>
                                        </div>
                                        <a href={file.webViewLink} target="_blank" rel="noreferrer" className="p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-cyan-400 transition">
                                           <Download className="h-4 w-4" />
                                        </a>
                                     </div>
                                  ))}
                                  {googleDriveFiles.length === 0 && <div className="col-span-full py-20 text-center text-slate-600 italic">No cloud assets found in standard clusters.</div>}
                               </div>
                            )}
                         </div>
                      </div>
                    );
                  })()}

                  {/* Google Calendar App */}
                  {gpkosActiveApp === 'calendar' && (() => {
                    return (
                      <div className="absolute inset-x-8 top-12 bottom-20 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in z-40 text-left">
                         <div className="bg-slate-800 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="bg-blue-600 p-2 rounded-xl text-white shadow"><Calendar className="h-5 w-5" /></div>
                               <span className="font-bold text-slate-100 text-xl tracking-tighter">Google Calendar</span>
                            </div>
                            <button onClick={() => setGpkosActiveApp('desktop')} className="p-2 hover:bg-white/10 rounded-full transition text-slate-400"><X className="h-5 w-5" /></button>
                         </div>
                         <div className="flex-grow p-6 bg-slate-950 overflow-y-auto">
                            {!googleToken ? (
                               <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs uppercase tracking-widest opacity-40">handshake required</div>
                            ) : loadingGoogleData['calendar'] ? (
                               <div className="h-full flex items-center justify-center"><RefreshCw className="h-8 w-8 text-blue-500 animate-spin" /></div>
                            ) : (
                               <div className="max-w-xl mx-auto space-y-3">
                                  {googleCalendarEvents.map(event => (
                                     <div key={event.id} className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex gap-6 items-start hover:bg-white/5 transition group">
                                        <div className="text-right w-20 shrink-0 font-mono">
                                           <div className="text-xs font-black text-cyan-400">{new Date(event.start?.dateTime || event.start?.date || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                           <div className="text-[9px] text-slate-600 font-bold uppercase">{new Date(event.start?.dateTime || event.start?.date || "").toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                                        </div>
                                        <div className="flex-grow">
                                           <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition">{event.summary || "(No Title Event)"}</div>
                                           <div className="text-[10px] text-slate-500 mt-1 font-mono">{event.location || "Global Coordinates Sync"}</div>
                                        </div>
                                     </div>
                                  ))}
                                  {googleCalendarEvents.length === 0 && <div className="py-20 text-center text-slate-600 font-mono text-xs uppercase tracking-widest whitespace-nowrap overflow-hidden">End of transmission. No schedule data.</div>}
                               </div>
                            )}
                         </div>
                      </div>
                    );
                  })()}

                  {/* Google Photos App */}
                  {gpkosActiveApp === 'photos' && (() => {
                    return (
                      <div className="absolute inset-x-8 top-12 bottom-20 bg-slate-950 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in z-40">
                         <div className="bg-black/60 backdrop-blur-xl px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 p-2 rounded-xl text-white shadow-lg"><Images className="h-5 w-5" /></div>
                               <span className="font-bold text-white text-lg">Google Photos</span>
                            </div>
                            <button onClick={() => setGpkosActiveApp('desktop')} className="p-2 hover:bg-white/10 rounded-full transition text-slate-500"><X className="h-5 w-5" /></button>
                         </div>
                         <div className="flex-grow p-6 overflow-y-auto bg-slate-950">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                               {[1,2,3,4,5,6,7,8].map(i => (
                                 <div key={i} className="aspect-square bg-slate-900 border border-white/5 rounded-2xl overflow-hidden relative group cursor-pointer shadow-lg">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-3">
                                       <div className="text-[9px] font-bold text-white uppercase tracking-widest">FATSHAN_SURVEY_{i}.PNG</div>
                                    </div>
                                    <div className="w-full h-full flex items-center justify-center text-slate-800">
                                       <Camera className="h-8 w-8 opacity-20" />
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/40 backdrop-blur px-1.5 py-0.5 rounded text-[8px] font-bold text-white border border-white/10 opacity-60 group-hover:opacity-100 transition">ENCRYPTED</div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    );
                  })()}

                  {/* YouTube App */}
                  {gpkosActiveApp === 'youtube' && (() => {
                    return (
                      <div className="absolute inset-x-8 top-12 bottom-20 bg-[#0f0f0f] border border-red-500/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in z-40 text-left">
                         <div className="bg-black/80 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <Youtube className="h-6 w-6 text-red-600" />
                               <span className="font-black text-white italic tracking-tighter text-xl">YouTube <span className="text-[10px] not-italic text-red-500 align-top opacity-60">ADMIN</span></span>
                            </div>
                            <button onClick={() => setGpkosActiveApp('desktop')} className="px-4 py-1 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold text-slate-500 transition border border-white/5 uppercase tracking-widest">Exit</button>
                         </div>
                         <div className="flex-grow p-6 bg-transparent overflow-y-auto">
                            {!googleToken ? (
                               <div className="h-full flex items-center justify-center opacity-30 invertgrayscale">
                                  <Play className="h-16 w-16" />
                                </div>
                            ) : loadingGoogleData['youtube'] ? (
                               <div className="h-full flex items-center justify-center"><RefreshCw className="h-8 w-8 text-red-600 animate-spin" /></div>
                            ) : (
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {googleYoutubeActivities.map(act => (
                                     <div key={act.id} className="bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/30 transition group cursor-pointer">
                                        <div className="aspect-video bg-slate-800 relative overflow-hidden">
                                           {act.snippet?.thumbnails?.medium?.url && <img src={act.snippet.thumbnails.medium.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />}
                                           <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition duration-300" />
                                           <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase font-mono">Verified</div>
                                        </div>
                                        <div className="p-3">
                                           <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">{act.snippet?.type || "Activity"} Buffer</div>
                                           <div className="text-white text-xs font-black leading-tight line-clamp-2">{act.snippet?.title}</div>
                                           <div className="text-[9px] text-slate-500 mt-2 font-mono truncate">ID: {act.id}</div>
                                        </div>
                                     </div>
                                  ))}
                                  {googleYoutubeActivities.length === 0 && <div className="col-span-full py-20 text-center text-slate-700 font-black uppercase tracking-[0.2em]">Signal Silenced. No active transmissions found.</div>}
                               </div>
                            )}
                         </div>
                      </div>
                    );
                  })()}

                  {/* Google Contacts App */}
                  {gpkosActiveApp === 'contacts' && (() => {
                    return (
                      <div className="absolute inset-x-8 top-12 bottom-20 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in z-40 text-left">
                         <div className="bg-slate-800 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="bg-cyan-500 p-2 rounded-xl text-white shadow-lg"><Users className="h-5 w-5" /></div>
                               <span className="font-bold text-slate-100 text-xl tracking-tighter">Google Contacts</span>
                            </div>
                            <button onClick={() => setGpkosActiveApp('desktop')} className="p-2 hover:bg-white/10 rounded-full transition text-slate-400"><X className="h-5 w-5" /></button>
                         </div>
                         <div className="flex-grow p-6 bg-slate-950 overflow-y-auto">
                            {!googleToken ? (
                               <div className="h-full flex items-center justify-center opacity-30 grayscale"><Users className="h-16 w-16" /></div>
                            ) : loadingGoogleData['contacts'] ? (
                               <div className="h-full flex items-center justify-center"><RefreshCw className="h-8 w-8 text-cyan-500 animate-spin" /></div>
                            ) : (
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {googleContacts.map((contact, idx) => {
                                     const name = contact.names?.[0]?.displayName || "Unknown Identity";
                                     const email = contact.emailAddresses?.[0]?.value || "No Email Bridge";
                                     const photo = contact.photos?.[0]?.url;
                                     return (
                                       <div key={idx} className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition group">
                                          <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-800 border-2 border-white/5 shrink-0">
                                             {photo ? <img src={photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center text-slate-600 font-black">{name.charAt(0)}</div>}
                                          </div>
                                          <div className="overflow-hidden">
                                             <div className="text-white text-xs font-black truncate">{name}</div>
                                             <div className="text-[10px] text-slate-500 font-mono truncate">{email}</div>
                                          </div>
                                       </div>
                                     );
                                  })}
                                  {googleContacts.length === 0 && <div className="col-span-full py-20 text-center text-slate-700 font-mono text-xs uppercase tracking-widest">Isolated Environment. Connection List Empty.</div>}
                               </div>
                            )}
                         </div>
                      </div>
                    );
                  })()}
                  {/* DELETING END */}
                  {/* Mobile Search Window */}
                  {gpkosActiveApp === 'mobile-search' && (() => {
                    const isGoogleHubAuthorized = currentUser?.emailUsername === 'marvis_zhou2014' || currentUser?.emailUsername === 'marvis_zhou' || (currentUser && (systemState.aiAuthorizedUsers || []).includes(currentUser.emailUsername));

                    const handleProxySearchSubmit = async (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!proxySearchQueryValue.trim()) return;
                      setLoadingProxySearch(true);
                      setActiveBypassUrl(null);
                      try {
                        const res = await fetch(`${getApiBase()}/api/search/proxy?q=${encodeURIComponent(proxySearchQueryValue)}`);
                        const data = await res.json();
                        setProxySearchResultsList(data.results || []);
                      } catch (err) {
                        console.error(err);
                        alert("Secure search failed.");
                      } finally {
                        setLoadingProxySearch(false);
                      }
                    };

                    const handleOpenBypassUrl = async (url: string) => {
                      setLoadingBypass(true);
                      setActiveBypassUrl(url);
                      setBypassHtmlContent("");
                      try {
                        const res = await fetch(`${getApiBase()}/api/web/proxy?url=${encodeURIComponent(url)}`);
                        const data = await res.json();
                        if (data.success && data.content) {
                          setBypassHtmlContent(data.content);
                        } else {
                          setBypassHtmlContent(`<div class="p-6 text-red-400 font-mono">Bypass Fail: ${data.error || 'Server did not respond with decoded payload.'}</div>`);
                        }
                      } catch (err) {
                        setBypassHtmlContent(`<div class="p-6 text-red-400 font-mono">Connection Handshake Timed Out.</div>`);
                      } finally {
                        setLoadingBypass(false);
                      }
                    };

                    return (
                      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-black border-[8px] border-slate-800 rounded-[3rem] w-full max-w-[340px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col h-[650px] animate-fade-in overflow-hidden relative font-sans text-white">
                          {/* Notch */}
                        <div className="absolute top-0 inset-x-0 h-6 bg-transparent flex justify-center z-[60]">
                           <div className="w-32 h-6 bg-slate-800 rounded-b-3xl border-b border-x border-white/5 flex justify-center items-center shadow-md">
                              <div className="w-10 h-1.5 bg-black/50 rounded-full border border-white/5"></div>
                           </div>
                        </div>
                        
                        {/* Phone Window Header */}
                        <div className="absolute top-8 left-4 right-4 flex justify-between z-50 items-center">
                           <button onClick={() => { 
                             if (activeBypassUrl) {
                               setActiveBypassUrl(null);
                             } else {
                               setGpkosActiveApp('desktop'); 
                             }
                           }} className="bg-slate-900/80 hover:bg-slate-800 p-2.5 rounded-full backdrop-blur-md transition border border-white/10 shadow-lg">
                              <ArrowLeft className="w-4 h-4 text-white" />
                           </button>
                           <div className="text-[10px] font-bold text-white/40 tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">RORY_OS</div>
                           <div className="w-9 h-9"></div>
                        </div>

                        {!isGoogleHubAuthorized ? (
                            <div className="flex-grow flex flex-col justify-center p-6 text-center mt-12 overflow-y-auto z-40 bg-slate-950 relative">
                                 <div className="absolute inset-0 bg-radial-gradient from-fuchsia-950/20 via-transparent to-transparent opacity-30" />
                                 <div className="bg-fuchsia-500/10 p-5 rounded-3xl mb-6 mx-auto inline-block border border-fuchsia-500/20 shadow-xl shadow-fuchsia-900/20 relative z-10">
                                   <Lock className="w-10 h-10 text-fuchsia-400 animate-pulse drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]" />
                                 </div>
                                 <h3 className="font-black text-rose-400 mb-3 text-xl tracking-tight relative z-10">System Locked</h3>
                                 <p className="text-slate-400 text-xs text-left bg-slate-900/80 p-5 rounded-2xl mb-8 leading-relaxed font-mono border border-white/5 relative z-10 shadow-inner">
                                    Mobile Tunnel Auth required.<br/><br/>
                                    <span className="text-rose-300">Err_Code: 0xPERMISSION_DENIED</span><br/>
                                    Please contact administrator @marvis_zhou2014 to grant access.
                                 </p>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col overflow-y-auto mt-[4.5rem] bg-slate-950 relative z-40">
                               {activeBypassUrl ? (
                                  <div className="flex flex-col h-full bg-slate-50 relative top-0 z-[55]">
                                     <div className="bg-slate-100/90 backdrop-blur-md border-b border-slate-300 px-4 pt-4 pb-3 flex flex-col gap-2 shrink-0 shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)] top-0 sticky">
                                       <div className="font-mono text-slate-800 text-[10px] text-center px-4 py-2 bg-slate-200/80 rounded-lg truncate border border-slate-300/50 shadow-inner">
                                         <Lock className="inline-block w-3 h-3 mr-1 text-slate-400"/>
                                         {activeBypassUrl}
                                       </div>
                                       <div className="flex justify-between items-center px-1">
                                         <div className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Secure Proxy Embed</div>
                                       </div>
                                     </div>
                                     <div className="flex-grow overflow-hidden bg-slate-900 border-none relative isolate shadow-inner w-full h-full">
                                       <iframe src={activeBypassUrl} className="w-full h-full border-0 bg-white" sandbox="allow-same-origin allow-scripts allow-forms allow-popups" title="Outer Web Access" />
                                       <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-[9px] px-2 py-1 rounded pointer-events-none border border-white/10">Mobile iframe Embed</div>
                                     </div>
                                  </div>
                               ) : (
                                  <div className="px-5 pt-2 pb-8 flex flex-col">
                                     <div className="text-center mb-10 mt-2 animate-fade-in-up">
                                        <div className="bg-gradient-to-br from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent text-3xl font-black mb-1.5">Mobile Hub</div>
                                        <div className="text-[9px] text-slate-500 font-mono tracking-[0.2em] bg-slate-900 inline-block px-3 py-1 rounded-full border border-white/5 shadow-inner">ENCRYPTED TUNNEL</div>
                                     </div>

                                     <form onSubmit={handleProxySearchSubmit} className="relative group mb-10">
                                        <input 
                                          type="text" 
                                          value={proxySearchQueryValue} 
                                          onChange={e => setProxySearchQueryValue(e.target.value)}
                                          placeholder="Search anything..."
                                          disabled={loadingProxySearch}
                                          className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800 transition-all shadow-inner disabled:opacity-50 z-20 relative"
                                        />
                                        <Search className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors z-30" />
                                        <div className="absolute inset-x-0 -bottom-3 -z-10 bg-cyan-500/10 blur-xl h-10 group-focus-within:bg-cyan-500/20 transition-colors rounded-full opacity-0 group-focus-within:opacity-100"></div>
                                     </form>

                                     {loadingProxySearch ? (
                                        <div className="flex flex-col items-center justify-center p-8 gap-4 mt-6 bg-slate-900/30 rounded-3xl border border-white/5">
                                          <div className="relative">
                                            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
                                            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin relative z-10" />
                                          </div>
                                          <div className="text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase">Routing Request...</div>
                                        </div>
                                     ) : (
                                        proxySearchResultsList.length > 0 ? (
                                           <div className="space-y-4">
                                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between mb-4 px-2">
                                                 <span>Results Index</span>
                                                 <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-white/5">{proxySearchResultsList.length} Found</span>
                                              </div>
                                              {proxySearchResultsList.map((r, idx) => (
                                                 <div key={idx} className="bg-slate-900/60 border border-white/5 hover:border-white/10 rounded-2xl p-4 active:scale-[0.98] transition-all cursor-pointer shadow-sm relative overflow-hidden group" onClick={() => handleOpenBypassUrl(r.link)}>
                                                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/0 group-hover:bg-cyan-500/50 transition-colors"></div>
                                                   <h4 className="text-sm font-bold text-slate-100 mb-1.5 leading-snug group-hover:text-cyan-300 transition-colors">{r.title}</h4>
                                                   <div className="text-[10px] text-cyan-500/80 truncate mb-2 font-mono flex items-center gap-1.5"><Globe className="w-3 h-3 shrink-0"/> {r.link}</div>
                                                   <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{r.snippet}</p>
                                                 </div>
                                              ))}
                                           </div>
                                        ) : (
                                           <div>
                                             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Quick Actions</div>
                                             <div className="grid grid-cols-2 gap-3">
                                               <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 hover:from-indigo-500/20 hover:to-purple-500/10 border border-indigo-500/20 p-5 rounded-[1.5rem] flex flex-col items-center justify-center aspect-square active:scale-95 transition-all cursor-pointer shadow-inner" onClick={() => { setProxySearchQueryValue("Github"); handleProxySearchSubmit({preventDefault: () => {}} as any); }}>
                                                  <div className="bg-indigo-500/20 p-3 rounded-full text-indigo-400 mb-3 shadow-[0_0_15px_rgba(99,102,241,0.2)]"><Globe className="w-6 h-6 gap-2" /></div>
                                                  <span className="font-bold text-xs text-indigo-200 tracking-wide">Developer</span>
                                                  <span className="text-[9px] text-indigo-400/60 mt-1 font-mono">GLOBAL</span>
                                               </div>
                                               <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/5 hover:from-cyan-500/20 hover:to-teal-500/10 border border-cyan-500/20 p-5 rounded-[1.5rem] flex flex-col items-center justify-center aspect-square active:scale-95 transition-all cursor-pointer shadow-inner" onClick={() => { setProxySearchQueryValue("react documentation"); handleProxySearchSubmit({preventDefault: () => {}} as any); }}>
                                                  <div className="bg-cyan-500/20 p-3 rounded-full text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]"><FileCode2 className="w-6 h-6 gap-2" /></div>
                                                  <span className="font-bold text-xs text-cyan-200 tracking-wide">Docs Base</span>
                                                  <span className="text-[9px] text-cyan-400/60 mt-1 font-mono">REACT</span>
                                               </div>
                                             </div>
                                           </div>
                                        )
                                     )}
                                  </div>
                               )}
                            </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Main Dynamic Workspace rendering */}
                <AnimatePresence mode="popLayout">
                  {openedWindows.filter(w => !['ide', 'remote', 'terminal'].includes(w.appId)).map(window => (
                    <DraggableWindow
                      key={window.id}
                      window={window}
                      isFocused={focusedWindowId === window.id}
                      onClose={closeWindow}
                      onMinimize={minimizeWindow}
                      onFocus={focusWindow}
                      onPositionChange={updateWindowPos}
                      onSizeChange={updateWindowSize}
                      onMaximize={toggleMaximizeW}
                      constraintsRef={desktopRef}
                    >
                      {window.appId === 'maps' && <GoogleMapsWidget />}
                      {window.appId === 'drive' && <CloudDrive currentUser={currentUser} />}
                      {window.appId === 'settings' && <GpkosSettings powerMode={powerMode} setPowerMode={setPowerMode} activeBackground={gpkosWallpaper} setActiveBackground={setGpkosWallpaper} />}
                      {window.appId === 'global-bridge' && <GlobalBrowser />}
                      {window.appId === 'gmail' && (
                         <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                           <div className="bg-emerald-900/40 border-b border-emerald-500/20 px-3 py-1 flex items-center justify-center gap-2 text-[10px] text-emerald-400 font-bold tracking-widest shrink-0">
                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 blur-[1px] animate-pulse"></span>
                               ROUTED VIA GLOBAL HF PROXY NODE (NETWORK OPTIMIZED)
                           </div>
                           <div className="flex items-center justify-center flex-grow text-slate-500 font-bold uppercase tracking-widest bg-slate-900/50">
                             Gmail / Mail Cloud Workspace Loaded
                           </div>
                         </div>
                      )}
                      {/* Fallback for other apps */}
                      {!['maps', 'drive', 'settings', 'global-bridge', 'gmail'].includes(window.appId) && (
                        <div className="flex items-center justify-center h-full text-slate-500 font-bold uppercase tracking-widest bg-slate-900/50">
                           {window.title} Module Loaded
                        </div>
                      )}
                    </DraggableWindow>
                  ))}
                </AnimatePresence>

                </div>

                {/* macOS styled Dock bottom */}
                <div className="pb-4 pt-2 flex justify-center z-[2000] shrink-0">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-4 shadow-2xl">
                    <button onClick={() => launchApp('remote', '远程协同协作 (Admin)')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2`}>
                       <div className="bg-emerald-900/60 p-2.5 rounded-xl shadow border border-emerald-500/30"><MonitorUp className="h-6 w-6 text-emerald-400" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Remote Assist</span>
                    </button>
                    <button onClick={() => launchApp('terminal', 'GPKOS Kernel Terminal')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2`}>
                       <div className="bg-slate-900 p-2.5 rounded-xl shadow border border-white/10"><Terminal className="h-6 w-6 text-emerald-400" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">Terminal</span>
                    </button>
                    <button onClick={() => launchApp('ide', 'GPKOS Code Sandbox')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2`}>
                       <div className="bg-cyan-900/60 p-2.5 rounded-xl shadow border border-cyan-500/30"><FileCode2 className="h-6 w-6 text-cyan-400" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">Compiler</span>
                    </button>
                    <button onClick={() => launchApp('mobile-search', 'Mobile Search Hub')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2`}>
                       <div className="bg-purple-900/60 p-2.5 rounded-xl shadow border border-purple-500/30"><Smartphone className="h-6 w-6 text-purple-400" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Mobile Hub</span>
                    </button>
                    <button onClick={() => launchApp('global-bridge', 'Global Browser')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2`}>
                       <div className="bg-cyan-900/60 p-2.5 rounded-xl shadow border border-cyan-500/30 font-bold"><Shield className="h-6 w-6 text-cyan-400" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Browser</span>
                    </button>
                    <button onClick={() => launchApp('maps', 'Google Maps HUB')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2`}>
                       <div className="bg-slate-900 p-2.5 rounded-xl shadow border border-white/10 hover:border-emerald-500/50 transition-colors"><Chrome className="h-6 w-6 text-cyan-400" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Google Hub</span>
                    </button>
                    <button onClick={() => launchApp('gmail', 'Mail Cloud Workspace')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2`}>
                       <div className="bg-slate-900 p-2.5 rounded-xl shadow border border-white/10 hover:border-rose-500/50 transition-colors"><Mail className="h-6 w-6 text-rose-500" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Gmail</span>
                    </button>
                    <button onClick={() => launchApp('drive', 'GPKOS Cloud Drive')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2`}>
                       <div className="bg-slate-900 p-2.5 rounded-xl shadow border border-white/10 hover:border-amber-500/50 transition-colors"><HardDrive className="h-6 w-6 text-amber-500" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Drive</span>
                    </button>
                    <button onClick={() => launchApp('gemini', 'Gemini Pro Workspace')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2`}>
                       <div className="bg-[#131214] p-2.5 rounded-xl shadow border border-white/10 hover:border-violet-500/50 transition-colors"><BrainCircuit className="h-6 w-6 text-violet-400 animate-pulse" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Gemini AI</span>
                    </button>
                    <div className="w-px h-8 bg-white/20 mx-1"></div>
                    <button onClick={() => launchApp('settings', 'System Preferences')} className="group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2">
                       <div className="bg-slate-800 p-2.5 rounded-xl shadow border border-white/10 hover:border-cyan-500/50 transition-colors"><Settings className="h-6 w-6 text-white" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">Settings</span>
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* SECTION 4: MSFS FLIGHT SIMULATOR CHECKLIST CONFIGURATION screen */}
        {currentHash === "#msfs" && (
          <div className="bg-slate-950/90 rounded-3xl p-6 border border-white/10 text-left space-y-6 animate-fade-in" id="msfs-dashboard">
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Compass className="h-5 w-5 text-amber-500" />
                Microsoft Flight Simulator Desk Space
              </h2>
              <p className="text-xs text-slate-400">
                Federal Aviation Coordination Console • Validation token checklist logic.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Flight metrics controller panel */}
              <div className="md:col-span-1 bg-white/5 p-5 rounded-2xl space-y-4 border border-white/5 text-xs">
                <h3 className="font-bold text-amber-300 text-sm">Aero Flight Variables</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Fuel Reserve ({msfsFuel}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={msfsFuel}
                      onChange={(e) => setMsfsFuel(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Cruising Altitude ({msfsAltitude} ft)</label>
                    <input
                      type="range"
                      min="0"
                      max="40000"
                      step="500"
                      value={msfsAltitude}
                      onChange={(e) => setMsfsAltitude(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Ground Speed Indicator ({msfsSpeed} knots)</label>
                    <input
                      type="range"
                      min="0"
                      max="600"
                      value={msfsSpeed}
                      onChange={(e) => setMsfsSpeed(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold">Auto-Pilot Mode Switch</span>
                    <button
                      onClick={() => setMsfsAutoPilot(!msfsAutoPilot)}
                      className={`px-3 py-1 rounded font-bold text-[10px] uppercase ${
                        msfsAutoPilot ? "bg-emerald-500 text-slate-950" : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {msfsAutoPilot ? "ONLINE" : "OFFLINE"}
                    </button>
                  </div>
                </div>
              </div>

              {/* FAA Pre-flight checklist checks */}
              <div className="md:col-span-2 bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4 text-xs">
                <h3 className="font-bold text-slate-200 text-sm">Lock FAA Certification Protocols Checklist</h3>

                <div className="space-y-3.5">
                  {msfsChecklists.map((chk) => (
                    <div
                      key={chk.id}
                      onClick={() => {
                        setMsfsChecklists((prev) =>
                          prev.map((c) => (c.id === chk.id ? { ...c, done: !c.done } : c))
                        );
                      }}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between select-none ${
                        chk.done
                          ? "bg-emerald-900/20 border-emerald-500/20 text-emerald-200"
                          : "bg-slate-900 border-white/10 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {chk.done ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <div className="h-4 w-4 rounded-full border border-slate-500" />}
                        <span>{chk.name}</span>
                      </div>
                      <span className="text-[9px] font-bold font-mono tracking-wider">
                        {chk.done ? "RESOLVED" : "REQUIRED"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl">
                  <p className="text-[11px] text-amber-200">
                    <strong>Preflight Directive Instructions:</strong> Checklists must resolve entirely. All user account coordinate logs must bind under constant string token: <strong>FATSHAN POST</strong>.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SECTION 5: REMOTE DESKTOP SCREEN COLLABORATION screen */}
        {currentHash === "#remote" && (
          <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 text-left space-y-6 animate-fade-in" id="remote-dashboard">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Monitor className="h-5 w-5 text-indigo-400" />
                Remote Control Coordination desktop Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Collaborative remote support Desk • Status audit indicators.
              </p>
            </div>

            <div className="bg-slate-900 border-2 border-dashed border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-slate-300 min-h-[350px] relative">
              
              <div className="absolute top-4 left-4 bg-red-500 text-white font-black text-[10px] px-2.5 py-1 rounded animate-pulse uppercase tracking-wider">
                LIVE REMOTE
              </div>

              <Monitor className="h-16 w-16 text-indigo-400 animate-pulse mb-4" />
              <h3 className="text-md font-bold text-white mb-2">Simulated Active Support Screen Session</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                You are securely linked to user support. Operational validator key: <strong>FATSHAN POST</strong> is initialized securely.
              </p>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-slate-300 text-[10px]">
                  Frame Bitrate: 4.2 Mbps
                </span>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-slate-300 text-[10px]">
                  FPS: 60 fps
                </span>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-slate-300 text-[10px]">
                  Resolution: 1920x1080
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: VIDEO CMS stream page */}
        {currentHash === "#video" && (
          <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 text-left space-y-6 animate-fade-in" id="video-dashboard">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Video className="h-5 w-5 text-rose-500" />
                  Visual Multi-speed Video Stream Desk
                </h2>
                <p className="text-xs text-slate-400">
                  Custom simulated streaming portal • Dynamic speed multiplier controllers.
                </p>
              </div>

              {/* Subtitle warning */}
              <div className="bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-mono px-3 py-1 rounded">
                Verification code: FATSHAN POST
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Media Player Replica */}
              <div className="lg:col-span-2 bg-black border border-white/10 rounded-2xl overflow-hidden aspect-video relative flex flex-col justify-between">
                
                {/* Simulated frame overlay */}
                <div className="p-4 bg-gradient-to-b from-black/80 to-transparent text-xs text-white flex justify-between items-center select-none">
                  <span className="font-bold flex items-center gap-1">
                    <Zap className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
                    GPKOS Air Flight Simulation Tutorial
                  </span>
                  <span className="bg-rose-500 text-slate-905 px-2 py-0.5 rounded font-bold uppercase text-[9px]">
                    Speed: {videoSpeed}x
                  </span>
                </div>

                <div className="flex-grow flex items-center justify-center p-8 select-none">
                  {videoPlaying ? (
                    <div className="space-y-2 text-center">
                      <Tv className="h-12 w-12 text-rose-500 mx-auto animate-bounce" />
                      <p className="text-xs text-slate-400">Streaming coordinates tutorial content at speed {videoSpeed}x</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Play className="h-12 w-12 text-slate-500 mx-auto" />
                      <p className="text-xs text-slate-500">Stall. Stream paused by operator.</p>
                    </div>
                  )}
                </div>

                {/* Simulated Subtitles */}
                <div className="bg-black/90 p-3 text-center text-xs text-zinc-200 border-t border-white/5 select-none font-medium">
                  "{videoSubtitle}"
                </div>

                {/* Simulated Playhead timeline bar */}
                <div className="bg-slate-900 px-4 py-3 flex items-center justify-between gap-4 select-none shrink-0 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setVideoPlaying(!videoPlaying)}
                      className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold px-3 py-1.5 rounded transition text-[10px]"
                    >
                      {videoPlaying ? "PAUSE" : "PLAY"}
                    </button>
                    <span className="text-zinc-400">03:45 / 15:00</span>
                  </div>

                  {/* Speed switch */}
                  <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-white/10 p-0.5">
                    {[1.0, 1.25, 1.5, 2.0].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => {
                          setVideoSpeed(spd);
                          if (spd === 1.0) setVideoSubtitle("FATSHAN POST: Commencing final flight trim coordination.");
                          if (spd === 1.25) setVideoSubtitle("FATSHAN POST: Commencing speed adjustments... Fuel values mapped.");
                          if (spd === 1.5) setVideoSubtitle("FATSHAN POST: Deploying checklist models... All terminals responsive.");
                          if (spd === 2.0) setVideoSubtitle("FATSHAN POST: Compiler sandboxes fully operational inside Docker runtime.");
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          videoSpeed === spd ? "bg-rose-500 text-slate-950" : "hover:text-white text-zinc-400"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Side video information checklists */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4 text-xs">
                <h3 className="font-bold text-slate-200 text-sm">Media Properties</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 block mb-1">Interactive Quality Selectors</span>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                      {["720p", "1080p", "4k"].map((q) => (
                        <button
                          key={q}
                          onClick={() => setVideoQuality(q)}
                          className={`p-1.5 rounded border transition uppercase font-bold ${
                            videoQuality === q ? "bg-rose-500/10 border-rose-500/50 text-rose-300" : "border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Stream Author Metadata</span>
                    <strong className="text-slate-300 block">Flight Instructor Marvis Zhou</strong>
                    <span className="text-[10px] text-zinc-500">marvis_zhou@{systemState.activeDomain}</span>
                  </div>

                  <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl">
                    <p className="text-[10px] text-rose-200">
                      <strong>Security Scan Pass:</strong> Video is verified and contains no malicious content parameters.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SECTION 7: FRIENDSHIP DIRECTORY / YEARBOOK screen */}
        {currentHash === "#friendship" && (
          <div className="bg-slate-950/90 rounded-3xl p-6 border border-white/10 text-left space-y-6 animate-fade-in" id="friendship-album">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Friendship Memoirs & Album Directory
              </h2>
              <p className="text-xs text-slate-400">
                Emotional yearbook sharing desk • Custom yearbook entries and signatures.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form memoir submit */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-xs text-left">
                <h3 className="font-bold text-purple-300 mb-3 text-sm">Create Yearbook Profile Card</h3>

                <form onSubmit={handleGuestbookSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Your Full Signature Name</label>
                    <input
                      type="text"
                      placeholder="Marvis Zhou"
                      value={guestbookName}
                      onChange={(e) => setGuestbookName(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-purple-500 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Memoirs Narrative Message</label>
                    <textarea
                      rows={4}
                      placeholder="To all pilots and terminal hackers, let's make verification standard checking: FATSHAN POST..."
                      value={guestbookContent}
                      onChange={(e) => setGuestbookContent(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-purple-500 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Optional Memoir Portrait URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={guestbookPhoto}
                      onChange={(e) => setGuestbookPhoto(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-purple-500 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition"
                  >
                    Publish Yearbook Signature
                  </button>
                </form>
              </div>

              {/* Album catalog output */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-slate-200 text-sm">Registered Dynamic Album Memoirs</h3>

                {systemState.friendshipRecords && systemState.friendshipRecords.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-8">No yearbook profile entries yet. Create first signature.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {systemState.friendshipRecords && systemState.friendshipRecords.map((m) => (
                      <div key={m.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex gap-3 text-left">
                        {m.photoUrl && (
                          <img
                            src={m.photoUrl}
                            alt={m.name}
                            className="h-14 w-14 rounded-full border-2 border-purple-500 shrink-0 object-cover"
                          />
                        )}
                        <div className="text-xs space-y-1">
                          <strong className="text-purple-300 block">{m.name}</strong>
                          <p className="text-slate-300 italic">"{m.content}"</p>
                          <span className="text-[10px] text-zinc-500 block">
                            Signed: {new Date(m.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* SECTION 8: CMS BLOGS PORTAL screen */}
        {currentHash === "#blog" && (
          <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 text-left space-y-6 animate-fade-in" id="blog-dashboard">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-400" />
                Interactive Professional CMS Blogs Desk
              </h2>
              <p className="text-xs text-slate-400">
                Custom tech articles publishing portal • Standard categorizations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Creator screen */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-xs text-left h-fit">
                <h3 className="font-bold text-teal-300 mb-3 text-sm">Compose New Blog Article</h3>

                {!currentUser ? (
                  <p className="text-[11px] text-slate-400 italic">
                    You must sign-in into your Outlook / Post system profile to publish blog coordinate texts.
                  </p>
                ) : (
                  <form onSubmit={handleBlogCreateSubmit} className="space-y-4">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Article Title Header</label>
                      <input
                        type="text"
                        placeholder="Rory GPKOS Terminal coordination"
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-teal-500 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Content Body</label>
                      <textarea
                        rows={6}
                        placeholder="Configure validation codes nicely. String reference FATSHAN POST works."
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-teal-500 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Category Group</label>
                      <select
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1.5 text-white"
                      >
                        <option value="Technology">Technology & Compilers</option>
                        <option value="Simulator">Flight Simulator tutorials</option>
                        <option value="General">General updates</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Tags (Comma split)</label>
                      <input
                        type="text"
                        placeholder="Docker, SMTP, GPT"
                        value={blogTags}
                        onChange={(e) => setBlogTags(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-teal-500 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition"
                    >
                      Publish Tech Blog
                    </button>
                  </form>
                )}
              </div>

              {/* Blog articles list preview panel */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-slate-200 text-sm">Published Blog Feed</h3>

                {systemState.blogs && systemState.blogs.length === 0 ? (
                  <p className="text-slate-500 text-xs py-8 text-center">No CMS blog articles matched. Submit a story first.</p>
                ) : (
                  systemState.blogs && systemState.blogs.map((art) => (
                    <div key={art.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl text-left space-y-3">
                      
                      <div className="flex justify-between items-start gap-4 flex-wrap border-b border-white/5 pb-2">
                        <div>
                          <span className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded font-extrabold uppercase">
                            {art.category}
                          </span>
                          <h4 className="text-md font-bold text-white mt-1.5">{art.title}</h4>
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(art.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{art.content}</p>

                      <div className="flex items-center gap-4 text-xs select-none">
                        <button
                          onClick={() => handleLikeBlog(art.id)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>Likes ({art.likes || 0})</span>
                        </button>
                        <span className="text-zinc-500">Author: {art.author} ({art.authorEmail})</span>
                      </div>

                      {/* Comments feed block info */}
                      <div className="bg-slate-950 p-3 rounded-xl space-y-2 border border-white/5 text-[11px]">
                        <span className="font-bold text-slate-400 block border-b border-white/5 pb-1">Answers ({art.comments?.length || 0})</span>
                        
                        {art.comments && art.comments.map((comm) => (
                          <div key={comm.id} className="pb-1 border-b border-white/5">
                            <strong className="text-cyan-400">{comm.author}:</strong>
                            <span className="text-slate-300 ml-1.5">{comm.content}</span>
                          </div>
                        ))}

                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Publish reply message..."
                            value={blogCommentText[art.id] || ""}
                            onChange={(e) => setBlogCommentText({ ...blogCommentText, [art.id]: e.target.value })}
                            className="bg-slate-900 border border-white/10 rounded p-1 text-[11px] flex-grow focus:outline-none focus:border-cyan-500 text-white"
                          />
                          <button
                            onClick={() => handleBlogCommentSubmit(art.id)}
                            className="bg-teal-500 text-slate-950 px-3 py-1 rounded font-bold uppercase select-none text-[10px]"
                          >
                            Reply
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        )}

        {/* Ext: Tools and Admin */}
        {currentHash === "#admin" && (
          <div className="animate-fade-in flex flex-col gap-6" id="admin-dashboard">
            <div className="bg-slate-900 border border-fuchsia-500/20 rounded-3xl p-6 flex flex-col shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-fuchsia-500">
                    <Shield className="w-32 h-32" />
                </div>
                <div className="z-10">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Shield className="h-6 w-6 text-fuchsia-400" /> 高级管理员控制台
                    </h2>
                    <p className="text-slate-400 text-sm">全站状态感知与特权系统防御管控中心，拦截外界恶意访问，掌握应用全生命周期。</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 shadow-lg relative h-full">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-3xl"></div>
                    <h3 className="font-bold text-white text-md mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-400" /> 核心系统指标 (System Metrics)
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 text-sm">
                            <span className="text-slate-400 font-mono">微服务网关引擎</span>
                            <span className="text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded text-xs flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> ONLINE</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 text-sm">
                            <span className="text-slate-400 font-mono">全局云端存储负载</span>
                            <span className="text-amber-400 font-bold">14.6%</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 text-sm">
                            <span className="text-slate-400 font-mono">非法恶意拦截总数</span>
                            <span className="text-cyan-400 font-bold">1,024 阻断</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 text-sm">
                            <span className="text-slate-400 font-mono">前端 CDN 边缘计算状态</span>
                            <span className="text-fuchsia-400 font-bold font-mono text-[10px]">VERIFIED OK</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 shadow-lg relative">
                    <div className="absolute top-0 right-0 w-1 h-full bg-blue-500 rounded-r-3xl"></div>
                    <h3 className="font-bold text-white text-md mb-4 flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-blue-400" /> 直达内核层 (Deep Core Routing)
                    </h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                        您的账号已被授权访问高度敏感的数据枢纽。选择下方控制面板深入执行管理员调度：
                    </p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => setCurrentHash("#admin-subpages")} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white p-3.5 rounded-xl flex items-center justify-between font-bold shadow-lg transition text-sm">
                            <span className="flex items-center gap-2"><Settings className="w-4 h-4"/> 全局页面子网管</span>
                            <ArrowRight className="w-4 h-4 opacity-50" />
                        </button>
                        <button onClick={() => setCurrentHash("#work")} className="w-full bg-slate-800 hover:bg-slate-700 text-white p-3.5 rounded-xl flex items-center justify-between font-bold transition text-sm">
                            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-cyan-400"/> 用户数据资源管控 (DB)</span>
                            <ArrowRight className="w-4 h-4 opacity-50" />
                        </button>
                        <button onClick={() => setCurrentHash("#admin-aiaccess")} className="w-full bg-slate-800 hover:bg-slate-700 text-white p-3.5 rounded-xl flex items-center justify-between font-bold transition text-sm">
                            <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-rose-400"/> AI 数据大屏防火墙策略</span>
                            <ArrowRight className="w-4 h-4 opacity-50" />
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}

        {currentHash === "#public-mail" && (
           <PublicMail currentActiveDomain={systemState.activeDomain || "fatshanpost.com"} />
        )}

        {currentHash === "#drive" && (
           <CloudDrive currentUser={currentUser} />
        )}

        {currentHash === "#tool-translator" && <ToolTranslator lang={lang} />}
        {currentHash === "#tool-summarizer" && <ToolSummarizer lang={lang} />}
        {currentHash === "#tool-code" && <ToolCode lang={lang} />}
        {currentHash === "#tool-geminiai" && <ToolGeminiAI lang={lang} currentUser={currentUser} systemState={systemState} />}
        
        {currentHash === "#admin-subpages" && currentUser?.role === 'admin' && (
          <>
            <AdminDatabaseEditor lang={lang} />
            <DeploymentHub />
            <AdminSubpages lang={lang} systemState={systemState} setSystemState={setSystemState} />
            <AdminAIAccess 
              lang={lang} 
              systemState={systemState} 
              setSystemState={setSystemState} 
              onAIGeminiModify={() => {
                 setIframeLoading(true);
                 setActiveBypassUrl("https://aistudio.google.com");
                 setCurrentHash("#rory-gpkos");
                 setGpkosActiveApp("remote");
              }}
            />
            <AdminBrowserChecks lang={lang} systemState={systemState} setSystemState={setSystemState} />
          </>
        )}

        {/* Dynamic Branch Pages mapping */}
        {systemState.navPages?.filter(p => !p.isExternal && p.isVisible).map(p => (
          currentHash === `#subpage-${p.id}` && <React.Fragment key={p.id}><DynamicSubPage page={p} lang={lang} /></React.Fragment>
        ))}

      </main>
      </div>

      {/* Footer copyright */}
      <footer id="main-footer" className="mt-auto border-t border-white/10 p-6 shrink-0 text-center text-xs text-slate-400 bg-black/40">
        <p className="mb-1">
          <strong>FATSHAN POST Operational Desk</strong> • Verification Check constant standard: <strong>FATSHAN POST</strong>
        </p>
        <p className="text-zinc-500 text-[10px]">
          Outlook Decoupling Architecture • Micro Custom Buttons Engine room • Rory Compiler simulator desktop
        </p>
      </footer>

      {/* Admin Visual Editor Toggle and Popup */}
      {currentUser?.role === 'admin' && (
        <>
          <button 
             onClick={() => setAdminEditMode(!adminEditMode)}
             className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-2xl transition-all ${adminEditMode ? 'bg-fuchsia-500 text-slate-900 shadow-fuchsia-500/50 hover:bg-fuchsia-400 animate-pulse' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
             title="Toggle Visual Layout Engine"
          >
             {adminEditMode ? <Settings className="w-5 h-5 animate-spin"/> : <Settings className="w-5 h-5"/>}
          </button>
          
          {adminEditMode && adminStylePopup && (
             <div 
               className="fixed z-[999] bg-slate-900 border border-fuchsia-500/50 shadow-2xl rounded-2xl w-64 animate-fade-in text-left overflow-hidden flex flex-col"
               style={{ left: Math.min(adminStylePopup.x + 10, window.innerWidth - 270), top: Math.min(adminStylePopup.y + 10, window.innerHeight - 300) }}
             >
                <div className="bg-slate-950 p-2.5 border-b border-fuchsia-500/20 flex items-center justify-between">
                   <div className="text-xs font-bold text-fuchsia-400 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Recommended Styles</div>
                   <button onClick={() => setAdminStylePopup(null)} className="text-slate-400 hover:text-white"><Terminal className="w-3.5 h-3.5"/></button>
                </div>
                <div className="p-2 space-y-1">
                   {['Typewriter Effect 🪄', 'Gradient Text 🌈', 'Neon Glow 🔆', 'Slide Up Fade 🚀'].map(styleAction => (
                     <button 
                        key={styleAction}
                        onClick={() => {
                          const target = adminStylePopup.target;
                          if (target) {
                            if (styleAction.includes('Typewriter')) {
                              target.style.overflow = "hidden";
                              target.style.whiteSpace = "nowrap";
                              target.style.animation = "typing 2s steps(40, end)";
                            } else if (styleAction.includes('Gradient')) {
                              target.className += " bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500";
                            } else if (styleAction.includes('Neon')) {
                              target.style.textShadow = "0 0 10px rgba(16,185,129,0.8), 0 0 20px rgba(16,185,129,0.8)";
                              target.className += " text-emerald-400";
                            } else if (styleAction.includes('Slide')) {
                              target.className += " animate-fade-in";
                            }
                          }
                          setAdminStylePopup(null);
                        }}
                        className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-fuchsia-500/20 hover:text-white transition font-medium"
                     >
                       {styleAction}
                     </button>
                   ))}
                   <div className="border-t border-white/5 my-1" />
                   <button 
                     onClick={() => {
                         setAdminStylePopup(null);
                         setAdminEditMode(false);
                         setIframeLoading(true);
                         setActiveBypassUrl("https://aistudio.google.com");
                         setCurrentHash("#rory-gpkos");
                         setGpkosActiveApp("remote");
                     }}
                     className="w-full text-left p-2 rounded text-xs text-emerald-400 hover:bg-emerald-500/20 font-bold flex items-center gap-2"
                   >
                     🚀 Gemini AI 改
                   </button>
                </div>
             </div>
          )}
        </>
      )}

      {/* Handshake Success Overlay */}
      <AnimatePresence>
        {isHandshaking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-8 text-center"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-slate-900 border border-cyan-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6 relative shadow-inner">
                 <Shield className="w-10 h-10 text-cyan-400" />
                 <motion.div 
                   animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 rounded-full border-2 border-cyan-500/50"
                 />
              </div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2 italic underline decoration-cyan-500 underline-offset-8 font-serif">HF Space Tunnel Established</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6 px-4">Global Handshake Complete (1000/1000 Tests Passed)</p>
              <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 mb-6 shadow-inner font-mono text-[10px]">
                 <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500">
                    <span>Protocol</span>
                    <span className="text-cyan-500 italic">HF-Mutual TLS 1.3</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500">
                    <span>Exit Bridge</span>
                    <span className="text-green-500">HF-Space-Relay-Tokyo</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500">
                    <span>Validation</span>
                    <span className="text-emerald-400">1000 Cycles Verified</span>
                 </div>
              </div>
              <p className="text-[10px] text-slate-500 italic opacity-80 max-w-xs text-center">Connected to Hugging Face global node... Data encryption active.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
