import React, { useState, useEffect, useRef } from "react";
import { Search, RotateCcw, AlertTriangle, ShieldCheck, Globe, MapPin, Mail, ExternalLink, Unlock, Youtube, Folder, Database } from "lucide-react";

export const GlobalBrowser: React.FC = () => {
  // Using Google webhp with igu=1 bypasses normal x-frame-options for embedding purposes!
  const [url, setUrl] = useState("https://www.google.com/webhp?igu=1"); 
  const [iframeSrc, setIframeSrc] = useState("https://www.google.com/webhp?igu=1");
  const [proxyMode, setProxyMode] = useState<"direct" | "hf-space" | "server-proxy">("direct");

  useEffect(() => {
    updateIframeSrc(url, proxyMode);
  }, [proxyMode]);

  const updateIframeSrc = (targetUrl: string, mode: typeof proxyMode) => {
    let finalUrl = targetUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        finalUrl = 'https://' + targetUrl;
    }
    setUrl(finalUrl);

    if (mode === "server-proxy") {
      setIframeSrc(`/api/web/proxy-html?url=${encodeURIComponent(finalUrl)}`);
    } else if (mode === "hf-space") {
      // Direct load to their custom HuggingFace tunnel space
      setIframeSrc("https://huggingface.co/spaces/zhoumarvis/roeygpk");
    } else {
      // Direct iframe
      setIframeSrc(finalUrl);
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    updateIframeSrc(url, proxyMode);
  };

  const loadPreset = (presetUrl: string, forceMode?: typeof proxyMode) => {
    setUrl(presetUrl);
    const m = forceMode || proxyMode;
    if (forceMode) setProxyMode(forceMode);
    updateIframeSrc(presetUrl, m);
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

          <button onClick={() => updateIframeSrc(url, proxyMode)} className="p-1.5 hover:bg-white/5 rounded-xl transition text-slate-400 hover:text-white shrink-0">
            <RotateCcw className="w-4 h-4" />
          </button>

          <form onSubmit={handleNavigate} className="flex-grow flex items-center relative">
            <ShieldCheck className={`absolute left-3 w-4 h-4 ${proxyMode === 'direct' ? 'text-slate-500' : 'text-emerald-400'}`} />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-900 border border-white/15 rounded-full py-1.5 pl-9 pr-[180px] text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              placeholder="Search or enter web address"
            />
            <div className="absolute right-1 top-1 bottom-1 flex gap-1">
               <select 
                 value={proxyMode}
                 onChange={(e) => setProxyMode(e.target.value as any)}
                 className="bg-slate-800 text-[9px] font-bold uppercase tracking-wider text-slate-300 border border-white/10 rounded-full px-2 outline-none cursor-pointer hover:bg-slate-700"
               >
                 <option value="direct">Direct Link (Native)</option>
                 <option value="hf-space">HF Dedicated Tunnel</option>
                 <option value="server-proxy">Node Proxy (Experimental)</option>
               </select>
            </div>
          </form>

          <button onClick={handleNavigate} className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl transition font-bold shrink-0">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Navigation Shortcuts */}
        <div className="flex flex-wrap items-center gap-1.5 px-2 pb-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mr-1">Google Suite:</span>
          <button 
            onClick={() => loadPreset("https://www.google.com/search?igu=1", "direct")}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-[10px] text-blue-300 border border-blue-500/20 transition"
          >
            <Unlock className="w-3 h-3 text-blue-400" /> Search
          </button>
          <button 
            onClick={() => loadPreset("https://www.youtube.com", "server-proxy")}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-[10px] text-red-300 border border-red-500/20 transition"
          >
            <Youtube className="w-3 h-3 text-red-500" /> YouTube
          </button>
          <button 
            onClick={() => loadPreset("https://mail.google.com", "server-proxy")}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-[10px] text-rose-300 border border-rose-500/20 transition"
          >
            <Mail className="w-3 h-3 text-rose-400" /> Gmail
          </button>
          <button 
            onClick={() => loadPreset("https://drive.google.com", "server-proxy")}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-[10px] text-emerald-300 border border-emerald-500/20 transition"
          >
            <Folder className="w-3 h-3 text-emerald-400" /> Drive
          </button>
          <button 
            onClick={() => loadPreset("https://maps.google.com", "server-proxy")}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-[10px] text-amber-300 border border-amber-500/20 transition"
          >
            <MapPin className="w-3 h-3 text-amber-400" /> Maps
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
          <button 
            onClick={() => loadPreset("https://huggingface.co/spaces/zhoumarvis/roeygpk", "hf-space")}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-[10px] text-cyan-300 border border-cyan-500/20 transition"
          >
            <Globe className="w-3 h-3 text-cyan-400" /> HF
          </button>
          <button 
            onClick={() => loadPreset("https://www.wikipedia.org", "direct")}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-[10px] text-slate-300 border border-slate-500/20 transition"
          >
             Wiki
          </button>
        </div>
      </div>

      {proxyMode !== 'direct' && (
         <div className="bg-emerald-950/85 border-b border-emerald-500/20 px-3 py-1 flex items-center justify-between gap-2 text-[10px] text-emerald-400 font-medium shrink-0 animate-pulse">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ROUTED THROUGH ENCRYPTED TUNNEL PROXY SERVER. SAMEORIGIN BYPASSED.</span>
            </div>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-0.5 text-[9px] hover:underline text-cyan-400 font-bold tracking-wider uppercase shrink-0 px-2 py-0.5 bg-emerald-900/50 rounded"
            >
              Open Tab Native <ExternalLink className="w-2.5 h-2.5" />
            </a>
         </div>
      )}

      {/* Browser View */}
      <div className="flex-grow bg-[#111] relative">
        <iframe
          src={iframeSrc}
          className="absolute inset-0 w-full h-full border-0 bg-white"
          title="Global Encrypted Browser View"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
          referrerPolicy="no-referrer"
        ></iframe>
      </div>
    </div>
  );
};
