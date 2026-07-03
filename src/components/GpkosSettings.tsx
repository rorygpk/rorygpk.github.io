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
  glassEffect?: boolean;
  setGlassEffect?: (effect: boolean) => void;
  glassBlur?: number;
  setGlassBlur?: (blur: number) => void;
  gpkosBackgroundMode?: "static" | "video" | "slideshow";
  setGpkosBackgroundMode?: (mode: "static" | "video" | "slideshow") => void;
  onStartSelfHealing?: () => void;
}

export const GpkosSettings: React.FC<SettingsProps> = ({ 
  powerMode, 
  setPowerMode, 
  activeBackground, 
  setActiveBackground,
  glassEffect = true,
  setGlassEffect,
  glassBlur = 20,
  setGlassBlur,
  gpkosBackgroundMode = "static",
  setGpkosBackgroundMode,
  onStartSelfHealing
}) => {
  const [activeTab, setActiveTab] = React.useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Sliders },
    { id: "display", label: "Display", icon: Monitor },
    { id: "energy", label: "Energy", icon: Zap },
    { id: "privacy", label: "Privacy", icon: ShieldCheck },
    { id: "multifunction", label: "Multi-function", icon: HardDrive },
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
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                            <Layout className="w-4 h-4 text-cyan-400" />
                            <span className="text-white text-xs font-bold">磨砂液态玻璃 (Glass)</span>
                         </div>
                         <button 
                            onClick={() => setGlassEffect && setGlassEffect(!glassEffect)}
                            className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${glassEffect ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                         >
                            {glassEffect ? 'ON' : 'OFF'}
                         </button>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                         <input 
                            type="range" 
                            min="0"
                            max="40"
                            value={glassBlur}
                            onChange={(e) => setGlassBlur && setGlassBlur(Number(e.target.value))}
                            className="flex-grow h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                         />
                         <span className="text-[10px] font-mono text-cyan-400 font-bold w-10 text-right">{glassBlur}px</span>
                      </div>
                   </div>
                </div>
              </section>

              <section>
                 <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">System Maintenance</h3>
                 <div className="bg-slate-950/40 border border-rose-500/10 p-5 rounded-2xl hover:border-rose-500/20 transition-colors">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                       <div>
                          <h4 className="text-white text-xs font-bold mb-1">GPKOS 一键自修复系统 (Self-Healing)</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed max-w-md">
                             若遇到背景加载异常、文件损坏、或设置错乱，可启动极客一键式自修复引擎。
                             系统将自动进行组件完整性校验、修复Unsplash通道、重构虚拟文件系统并一键重生。
                          </p>
                       </div>
                       <button 
                          onClick={onStartSelfHealing}
                          className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-rose-950/20 hover:shadow-rose-500/30 shrink-0 border border-rose-500/30"
                       >
                          一键自修复
                       </button>
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

        {activeTab === 'display' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <section>
                <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Background Display Mode</h3>
                <div className="grid grid-cols-3 gap-3 p-1 bg-black/60 rounded-xl border border-white/5 mb-6">
                   {[
                     { id: 'static', label: '静态图片 (Static)' },
                     { id: 'video', label: '动态粒子 (Dynamic)' },
                     { id: 'slideshow', label: '幻灯片轮播 (Slideshow)' }
                   ].map(mode => (
                     <button 
                       key={mode.id}
                       onClick={() => setGpkosBackgroundMode && setGpkosBackgroundMode(mode.id as any)}
                       className={`py-2 px-3 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${gpkosBackgroundMode === mode.id ? 'bg-cyan-500 text-slate-950 shadow-lg font-black' : 'text-slate-400 hover:text-white bg-transparent'}`}
                     >
                       {mode.label}
                     </button>
                   ))}
                </div>
             </section>

             <section>
                <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Desktop Background Selection</h3>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { id: 'dark-slate', label: 'Dark Default (黑)' },
                     { id: 'light', label: 'Light Default (白)' },
                     { id: 'russian', label: 'Colorful Russian (俄罗斯块)' },
                     { id: 'bw-mosaic', label: 'Black White Mosaic (黑白马赛克)' },
                     { id: 'monet', label: 'Monet (莫奈)' },
                     { id: 'vangogh', label: 'Van Gogh (梵高)' },
                     { id: 'forest', label: 'Forest (森树)' },
                     { id: 'grassland', label: 'Grassland (草原)' },
                     { id: 'hunan', label: 'Hunan (湖南楼房)' },
                     { id: 'river', label: 'River (江河)' },
                     { id: 'mingsha', label: 'Mingsha (鸣沙山)' },
                     { id: 'uk', label: 'UK (英国)' },
                     { id: 'shenzhen', label: 'Shenzhen (深圳)' },
                     { id: 'local', label: 'Local Scene (当地名景)' },
                     { id: 'map', label: 'Local Map (当地地图)' },
                     { id: 'custom', label: 'Custom Upload (自定义)' }
                   ].map(bg => (
                     <button 
                       key={bg.id}
                       onClick={() => setActiveBackground(bg.id)}
                       className={`relative group rounded-xl overflow-hidden border-2 transition-all ${activeBackground === bg.id ? 'border-cyan-500 shadow-lg shadow-cyan-900/30 bg-slate-800' : 'border-transparent hover:border-white/20 bg-slate-900'}`}
                     >
                       <div className="w-full h-16 flex items-center justify-center p-2">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider text-center">{bg.label}</span>
                       </div>
                       {activeBackground === bg.id && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                       )}
                     </button>
                   ))}
                </div>
                {activeBackground === 'custom' && (
                  <div className="mt-4 bg-slate-900/50 p-4 border border-white/10 rounded-xl">
                    <label className="block text-xs text-white font-bold mb-2">Upload Custom Background</label>
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            if (re.target?.result) {
                              localStorage.setItem("gpkos_custom_wallpaper", re.target.result as string);
                              alert("Custom background saved! Please refresh the page to apply.");
                              window.location.reload();
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                )}
             </section>
             
             <section>
                <div className="bg-slate-900/80 border border-white/5 p-4 rounded-2xl">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <Layout className="w-4 h-4 text-cyan-400" />
                         <span className="text-white text-xs font-bold">Custom URL</span>
                      </div>
                   </div>
                   <input 
                      type="text" 
                      placeholder="Paste image URL here..." 
                      className="w-full bg-slate-950 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                      onChange={(e) => setActiveBackground(e.target.value)}
                   />
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
             <h2 className="text-2xl font-black text-white italic tracking-tighter mb-2">RoryGpkOS VirTual</h2>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Version 4.0.0 • RoryGpk Cloud OS</p>
             <div className="bg-white/5 px-6 py-3 rounded-full flex items-center gap-3 border border-white/10">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_emerald]" />
                <span className="text-[10px] font-mono text-slate-300 font-bold">RORYGPKOS_VIRTUAL_KERNEL: OPTIMAL</span>
             </div>
          </div>
        )}

        {activeTab === 'multifunction' && (() => {
          const triggerDownload = (device: string, ext: string, content: string) => {
            const element = document.createElement("a");
            const file = new Blob([content], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = `gpkos_secure_bridge_${device.toLowerCase()}_client.${ext}`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          };

          const devices = [
            { name: "Personal Laptop (PC)", type: "computer", ip: "192.168.1.104", ping: "8ms", jitter: "0.2ms", packetLoss: "0.0%", status: "CONNECTED", speed: "125.4 Mbps", config: "client-id: pc_user_zhou\nauth-type: cert-mutual-tls\nencryption: AES-256-GCM\nmultihop: true\nremote-port: 4500\nkeepalive: 10\nroute-all: true" },
            { name: "iPhone / Android (Mobile)", type: "smartphone", ip: "192.168.1.182", ping: "14ms", jitter: "1.1ms", packetLoss: "0.01%", status: "CONNECTED", speed: "42.1 Mbps", config: "client-id: mobile_user_zhou\nauth-type: cert-mutual-tls\nencryption: AES-256-GCM\nlow-battery-optimization: active\nkeepalive: 30" },
            { name: "iPad Pro (Tablet)", type: "tablet", ip: "192.168.1.190", ping: "11ms", jitter: "0.4ms", packetLoss: "0.0%", status: "CONNECTED", speed: "84.9 Mbps", config: "client-id: tablet_user_zhou\nauth-type: cert-mutual-tls\nencryption: AES-256-GCM\nmultihop: false\nkeepalive: 15" },
            { name: "Enterprise Server (Cloud Server)", type: "server", ip: "45.79.121.34", ping: "2ms", jitter: "0.05ms", packetLoss: "0.0%", status: "STABLE RELAY", speed: "940.1 Mbps", config: "#!/bin/bash\n# GPKOS Server Relay Setup\necho 'Configuring secure relay...'\nsudo systemctl start gpkos-tunnel\nsudo gpkos-cli enable --port=4500 --tls-cert=/etc/gpkos/server.pem" }
          ];

          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
              <div>
                <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">多功能管理控制台 (Multi-function Management)</h3>
                <p className="text-slate-400 text-[10px] leading-relaxed">接入并调度您的专属设备（电脑、手机、平板、服务器等），一键触发下载安全证书或配置文件以保证多端高带宽、低抖动和最佳传输质量。</p>
              </div>

              <section className="bg-slate-950/40 border border-white/5 p-5 rounded-2xl">
                <h4 className="text-white text-xs font-bold mb-3 flex items-center gap-1.5">💻 接入设备状态与质量监控 (Quality Control Center)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {devices.map(dev => (
                    <div key={dev.name} className="bg-slate-900/60 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/30 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-xs font-bold">{dev.name}</span>
                          <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">{dev.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono mb-3">
                          <div>IP: <span className="text-slate-200">{dev.ip}</span></div>
                          <div>Ping: <span className="text-emerald-400 font-bold">{dev.ping}</span></div>
                          <div>Jitter: <span className="text-cyan-400">{dev.jitter}</span></div>
                          <div>Loss: <span className="text-slate-300">{dev.packetLoss}</span></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                        <span className="text-[9px] text-slate-500 font-mono">Speed: <span className="text-white font-bold">{dev.speed}</span></span>
                        <button
                          onClick={() => triggerDownload(dev.name.split(" ")[0], dev.type === "server" ? "sh" : "ovpn", dev.config)}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded transition duration-150 flex items-center gap-1 cursor-pointer border-none active:scale-95"
                        >
                          📥 触发下载
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-slate-950/40 border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-white text-xs font-bold mb-1">Export Global Diagnostic Certificate Package</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-md">生成并打包当前主机的全部网络安全对账密钥 (Pem) 以及集群监控日志。一键触发下载本地，用于快速对齐所有多端物理节点的安全通道。</p>
                </div>
                <button 
                  onClick={() => triggerDownload("global_bundle", "pem", "=== BEGIN RORYGPKOS MULTIDEVICE CERTIFICATE ===\nCERT_HASH: 0x9f381c818a7d2b\nVERSION: 4.2-STABLE\nENCRYPTION: AES-256-GCM\n=== END CERTIFICATE ===")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition duration-150 shadow-lg border-none active:scale-95 shrink-0"
                >
                  📥 触发下载证书包
                </button>
              </section>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
