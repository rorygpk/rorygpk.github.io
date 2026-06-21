import React, { useState, useEffect } from "react";
import { Search, RotateCcw, AlertTriangle, ShieldCheck, Globe, MapPin, Mail, ExternalLink } from "lucide-react";

export const GlobalBrowser: React.FC = () => {
  const [url, setUrl] = useState("https://huggingface.co/spaces/zhoumarvis/roeygpk"); 
  const [iframeSrc, setIframeSrc] = useState("");
  const [proxyEnabled, setProxyEnabled] = useState(true);

  // Initialize src and listen for proxied navigations
  useEffect(() => {
    updateIframeSrc(url, proxyEnabled);

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PROXY_NAVIGATE' && event.data.url) {
        updateIframeSrc(event.data.url, proxyEnabled);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [proxyEnabled]);

  const updateIframeSrc = (targetUrl: string, useProxy: boolean) => {
    let finalUrl = targetUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        finalUrl = 'https://' + targetUrl;
    }
    setUrl(finalUrl);

    if (useProxy) {
      setIframeSrc(`/api/web/proxy-html?url=${encodeURIComponent(finalUrl)}`);
    } else {
      setIframeSrc(finalUrl);
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    updateIframeSrc(url, proxyEnabled);
  };

  const toggleProxy = () => {
    const nextProxy = !proxyEnabled;
    setProxyEnabled(nextProxy);
    updateIframeSrc(url, nextProxy);
  };

  const loadPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    updateIframeSrc(presetUrl, proxyEnabled);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 flex-grow rounded-b-xl overflow-hidden text-slate-100">
      {/* Browser Bar */}
      <div className="bg-slate-950 p-2 border-b border-white/10 shadow-sm shrink-0 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 ml-1 mr-3 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600/50"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/50"></div>
          </div>

          <button onClick={() => updateIframeSrc(url, proxyEnabled)} className="p-1.5 hover:bg-white/5 rounded-xl transition text-slate-400 hover:text-white shrink-0">
            <RotateCcw className="w-4 h-4" />
          </button>

          <form onSubmit={handleNavigate} className="flex-grow flex items-center relative">
            <ShieldCheck className={`absolute left-3 w-4 h-4 ${proxyEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-900 border border-white/15 rounded-full py-1.5 pl-9 pr-24 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              placeholder="Search or enter web address"
            />
            <div className="absolute right-1 top-1 bottom-1 flex">
               <button 
                  type="button" 
                  onClick={toggleProxy} 
                  className={`px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider transition ${proxyEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-white/5'}`}
               >
                  {proxyEnabled ? 'Proxy Link: ON' : 'Direct Link'}
               </button>
            </div>
          </form>

          <button onClick={handleNavigate} className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl transition font-bold shrink-0">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Navigation Shortcuts */}
        <div className="flex flex-wrap items-center gap-1.5 px-1 pb-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mr-1">Quick Tunnel:</span>
          <button 
            onClick={() => loadPreset("https://huggingface.co/spaces/zhoumarvis/roeygpk")}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-[10px] text-cyan-300 border border-cyan-500/20 transition"
          >
            <Globe className="w-3 h-3 text-cyan-400" /> Space App (roeygpk)
          </button>
          <button 
            onClick={() => loadPreset("https://maps.google.com")}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-[10px] text-emerald-300 border border-emerald-500/20 transition"
          >
            <MapPin className="w-3 h-3 text-emerald-400" /> Google Maps
          </button>
          <button 
            onClick={() => loadPreset("https://mail.google.com")}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-[10px] text-rose-300 border border-rose-500/20 transition"
          >
            <Mail className="w-3 h-3 text-rose-400" /> Google Mail
          </button>
        </div>
      </div>

      {proxyEnabled && (
         <div className="bg-emerald-950/85 border-b border-emerald-500/20 px-3 py-1 flex items-center justify-between gap-2 text-[10px] text-emerald-400 font-medium shrink-0 animate-pulse">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ROUTED THROUGH HIGH-SPEED HF DECRYPTED TUNNEL PROXY SERVER. SAMEORIGIN BYPASSED.</span>
            </div>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-0.5 text-[9px] hover:underline text-cyan-400 font-bold tracking-wider uppercase shrink-0"
            >
              Open Direct <ExternalLink className="w-2.5 h-2.5" />
            </a>
         </div>
      )}

      {/* Browser View */}
      <div className="flex-grow bg-white relative">
        {iframeSrc ? (
          <iframe
            src={iframeSrc}
            className="absolute inset-0 w-full h-full border-0 bg-white"
            title="Global Encrypted Browser View"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-400 font-mono text-xs">
            Establishing Secure Proxy Handshake...
          </div>
        )}
      </div>
    </div>
  );
};
