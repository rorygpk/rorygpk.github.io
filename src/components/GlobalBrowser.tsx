import React, { useState } from "react";
import { Search, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";

export const GlobalBrowser: React.FC = () => {
  const [url, setUrl] = useState("https://huggingface.co/spaces/zhoumarvis/roeygpk"); // Use the HF space
  const [iframeSrc, setIframeSrc] = useState("https://huggingface.co/spaces/zhoumarvis/roeygpk");
  const [proxyEnabled, setProxyEnabled] = useState(true);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
    }
    setUrl(finalUrl);
    setIframeSrc(finalUrl);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 flex-grow rounded-b-xl overflow-hidden">
      {/* Browser Bar */}
      <div className="bg-slate-300 p-2 flex items-center gap-2 border-b border-slate-400 shadow-sm shrink-0">
        <div className="flex gap-1.5 ml-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/50"></div>
        </div>

        <button onClick={() => setIframeSrc(iframeSrc)} className="p-1.5 hover:bg-slate-400 rounded transition text-slate-700">
          <RotateCcw className="w-4 h-4" />
        </button>

        <form onSubmit={handleNavigate} className="flex-grow flex items-center relative">
          <ShieldCheck className={`absolute left-3 w-4 h-4 ${proxyEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-white border border-slate-400 rounded-full py-1.5 pl-9 pr-24 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-inner"
            placeholder="Search or enter web address"
          />
          <div className="absolute right-1 top-1 bottom-1 flex">
             <button type="button" onClick={() => setProxyEnabled(!proxyEnabled)} className={`px-2 rounded-full text-[10px] font-bold ${proxyEnabled ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-200 text-slate-500 border border-slate-300'}`}>
                {proxyEnabled ? 'HF Proxy ON' : 'Direct'}
             </button>
          </div>
        </form>

        <button onClick={handleNavigate} className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition shadow-sm">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {proxyEnabled && (
         <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-1 flex items-center gap-2 text-[10px] text-emerald-800 font-medium shrink-0">
            <AlertTriangle className="w-3 h-3" />
            Active relay utilizing Hugging Face global networks. Applications like Maps, Gmail inherently benefit. Check X-Frame-Options if pages refuse to connect.
         </div>
      )}

      {/* Browser View */}
      <div className="flex-grow bg-white relative">
        <iframe
          src={iframeSrc}
          className="absolute inset-0 w-full h-full border-0"
          title="Global Encrypted Browser View"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        ></iframe>
      </div>
    </div>
  );
};
