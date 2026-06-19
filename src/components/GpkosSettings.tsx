import React from "react";
import { 
  Zap, Sun, Moon, Volume2, ShieldCheck, UserCircle, 
  Settings as SettingsIcon, Monitor, Wifi, Bluetooth, 
  Bell, Lock, Cpu, Battery, Info, Sliders, Layout, HardDrive, Activity
} from "lucide-react";
import { GpkosPowerMode } from "../types";

interface SettingsProps {
  powerMode: GpkosPowerMode;
  setPowerMode: (mode: GpkosPowerMode) => void;
  activeBackground: string;
  setActiveBackground: (bg: string) => void;
}

export const GpkosSettings: React.FC<SettingsProps> = ({ powerMode, setPowerMode, activeBackground, setActiveBackground }) => {
  const [activeTab, setActiveTab] = React.useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Sliders },
    { id: "display", label: "Display", icon: Monitor },
    { id: "energy", label: "Energy", icon: Zap },
    { id: "privacy", label: "Privacy", icon: ShieldCheck },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <div className="flex h-full bg-slate-900/50 backdrop-blur-xl rounded-b-2xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-slate-950/50 border-r border-white/5 p-4 flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-2 mb-6 px-2">
           <div className="p-1.5 bg-cyan-500 rounded-lg shadow-lg shadow-cyan-900/40">
              <SettingsIcon className="w-4 h-4 text-slate-950" />
           </div>
           <span className="text-white text-sm font-black uppercase tracking-widest italic">Settings</span>
        </div>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-grow p-8 overflow-y-auto custom-scrollbar">
        {activeTab === 'general' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <section>
                <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Appearance & Identity</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-900/80 border border-white/5 p-4 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                            <Sun className="w-4 h-4 text-cyan-400" />
                            <span className="text-white text-xs font-bold">System Mode</span>
                         </div>
                      </div>
                      <div className="flex p-1 bg-black rounded-xl border border-white/5">
                         <button className="flex-grow py-2 text-[10px] font-black uppercase tracking-widest bg-slate-800 text-white rounded-lg">Classic</button>
                         <button className="flex-grow py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition">Hacker</button>
                      </div>
                   </div>
                   <div className="bg-slate-900/80 border border-white/5 p-4 rounded-2xl">
                      <div className="flex items-center gap-3 mb-4">
                         <Layout className="w-4 h-4 text-cyan-400" />
                         <span className="text-white text-xs font-bold">Desktop Blur</span>
                      </div>
                      <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                   </div>
                </div>
              </section>
             
             <section>
                <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Network Services</h3>
                <div className="space-y-2">
                   {['Global Proxy Bridge', 'RSA Handshake', 'Quantum Tunneling'].map(svc => (
                     <div key={svc} className="flex items-center justify-between p-4 bg-slate-950/30 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                           <Wifi className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                           <span className="text-white text-xs font-bold">{svc}</span>
                        </div>
                        <div className="w-10 h-5 bg-emerald-500/20 rounded-full border border-emerald-500/40 flex items-center justify-end px-1">
                           <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-900" />
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>
        )}

        {activeTab === 'energy' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <section>
                <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Power Management</h3>
                <div className="grid grid-cols-3 gap-4">
                   {[
                     { id: 'on', label: 'Performance', color: 'cyan', icon: Zap },
                     { id: 'saving', label: 'Eco Saver', color: 'emerald', icon: Activity },
                     { id: 'sleep', label: 'Deep Sleep', color: 'slate', icon: Moon }
                   ].map(mode => (
                     <button 
                       key={mode.id}
                       onClick={() => setPowerMode(mode.id as any)}
                       className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${powerMode === mode.id ? `bg-${mode.id === 'on' ? 'cyan' : (mode.id === 'saving' ? 'emerald' : 'slate')}-500/10 border-${mode.id === 'on' ? 'cyan' : (mode.id === 'saving' ? 'emerald' : 'slate')}-500/40` : 'bg-slate-900/50 border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'}`}
                     >
                       <Zap className={`w-6 h-6 ${powerMode === mode.id ? (mode.id === 'on' ? 'text-cyan-400' : (mode.id === 'saving' ? 'text-emerald-400' : 'text-slate-400')) : 'text-slate-600'}`} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{mode.label}</span>
                     </button>
                   ))}
                </div>
             </section>

             <section>
                <div className="p-6 bg-slate-900 shadow-inner rounded-3xl border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1/3 h-full bg-cyan-500/5 blur-3xl rounded-full" />
                   <div className="flex items-center justify-between relative z-10">
                      <div>
                         <div className="text-3xl font-black text-white tracking-tighter">98 <span className="text-xs text-slate-500 font-bold uppercase tracking-widest font-mono">%</span></div>
                         <div className="text-[9px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                            <Battery className="w-3 h-3" /> System Battery Health
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Time Remaining</div>
                         <div className="text-lg font-mono text-white font-black tracking-tighter">~14h 22m</div>
                      </div>
                   </div>
                </div>
             </section>
          </div>
        )}

        {activeTab === 'privacy' && (
           <div className="space-y-6">
              <section>
                 <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Security Protocol</h3>
                 <div className="p-6 bg-slate-950/50 border border-emerald-500/20 rounded-3xl flex items-center gap-6">
                    <div className="p-4 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-950/50">
                       <ShieldCheck className="w-8 h-8 text-slate-950" />
                    </div>
                    <div>
                       <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">User Integrity Verified</h4>
                       <p className="text-[11px] text-slate-500 font-bold leading-relaxed max-w-sm italic">All file operations are governed by RSA-4096 encryption. Private files remain inaccessible even during root-level system rebuilding sequence.</p>
                    </div>
                 </div>
              </section>
           </div>
        )}

        {activeTab === 'about' && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
             <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-fuchsia-400 rounded-3xl shadow-2xl flex items-center justify-center mb-6 overflow-hidden p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                   <Monitor className="w-10 h-10 text-white" />
                </div>
             </div>
             <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">GPKOS Beta</h2>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Version 3.12.0 • Build Fatshan-Post</p>
             <div className="bg-white/5 px-6 py-3 rounded-full flex items-center gap-3 border border-white/10">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_emerald]" />
                <span className="text-[10px] font-mono text-slate-300 font-bold">SYSTEM_KERNEL_STATUS: OPTIMAL</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
