import React, { useState } from "react";
import { Mail, Shield, Sliders, Play, BrainCircuit, Trash2, Star, RotateCcw } from "lucide-react";

interface GpkosReplicasProps {
  currentUser: any;
  mockEmailsList: any[];
  setMockEmailsList: React.Dispatch<React.SetStateAction<any[]>>;
  installedApps: string[];
  setInstalledApps: React.Dispatch<React.SetStateAction<string[]>>;
  kernelStats: any;
  desktopWallpaper: string;
  setDesktopWallpaper: (wp: string) => void;
  dockAutohide: boolean;
  setDockAutohide: (hide: boolean) => void;
  openGPKOSApp: (appId: string) => void;
  setGpkosWindows: React.Dispatch<React.SetStateAction<any>>;
  setEmails: React.Dispatch<React.SetStateAction<any[]>>;
}

// ==========================================
// ✉️ GMAIL SIMULATOR COMPONENT
// ==========================================
export const GmailApp: React.FC<GpkosReplicasProps> = ({
  currentUser,
  mockEmailsList,
  setMockEmailsList,
  setGpkosWindows,
  setEmails
}) => {
  const [layoutTheme, setLayoutTheme] = useState<"gmail" | "outlook">("gmail");
  const [folder, setFolder] = useState<string>("inbox");
  const [selectedId, setSelectedId] = useState<string | null>("m2");
  const [composeTo, setComposeTo] = useState<string>("");
  const [composeSub, setComposeSub] = useState<string>("");
  const [composeTxt, setComposeTxt] = useState<string>("");
  const [isComposing, setIsComposing] = useState<boolean>(false);

  const currentUnreadCount = mockEmailsList.filter(m => m.unread && m.folder === "inbox").length;
  const filteredMails = mockEmailsList.filter(m => m.folder === folder);
  const selectedMail = mockEmailsList.find(m => m.id === selectedId);

  const glassEffect = localStorage.getItem("gpkos_glass") === "true";

  const handleSendMail = () => {
    if (!composeTo.trim() || !composeTxt.trim()) {
      alert("请填写收件人和邮件内容！");
      return;
    }

    const newMail = {
      id: "m_sent_" + Date.now(),
      sender: currentUser?.fullName || "周锦淇",
      senderEmail: (currentUser?.emailUsername || "marvis_zhou2014") + "@" + (layoutTheme === "gmail" ? "gmail.com" : "outlook.com"),
      subject: composeSub || "(无主题)",
      date: "刚刚",
      body: composeTxt,
      unread: false,
      starred: false,
      folder: "sent"
    };

    setMockEmailsList(prev => [newMail, ...prev]);
    if (setEmails) {
      setEmails(prev => [
        {
          id: "mail_" + Date.now(),
          senderFullName: newMail.sender,
          senderEmailAddress: newMail.senderEmail,
          subject: newMail.subject,
          body: newMail.body,
          timestamp: new Date().toISOString(),
          isUnread: false,
          isStarred: false,
          folder: "outbox"
        },
        ...prev
      ]);
    }

    setIsComposing(false);
    setComposeTo("");
    setComposeSub("");
    setComposeTxt("");
    alert(`🎉 邮件已通过 ${layoutTheme === "gmail" ? "Google" : "Microsoft"} 加密服务器中继成功发出！`);
  };

  return (
    <div className={`flex-grow flex flex-col text-slate-800 overflow-hidden rounded-2xl h-full font-sans relative ${glassEffect ? 'bg-white/70 backdrop-blur-3xl' : 'bg-slate-50'}`}>
      
      {/* Premium Integrated Header Control with Layout Switcher */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b shrink-0 ${layoutTheme === 'gmail' ? 'bg-[#f6f8fc]/90 border-slate-200' : 'bg-[#0078d4] text-white border-transparent'}`}>
        <div className="flex items-center gap-3">
          {layoutTheme === 'gmail' ? (
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none"><path d="M3 8L10.89 13.26C11.56 13.7 12.44 13.7 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="#EA4335" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="font-extrabold text-sm tracking-tight text-slate-700">GPKOS Gmail Hub</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="font-black text-xs bg-white text-[#0078d4] w-5 h-5 rounded-md flex items-center justify-center shadow-sm">O</div>
              <span className="font-extrabold text-sm tracking-tight">GPKOS Outlook Workspace</span>
            </div>
          )}
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${layoutTheme === 'gmail' ? 'bg-rose-100 text-rose-600' : 'bg-blue-800/60 text-blue-100'}`}>
            Secure Link
          </span>
        </div>

        {/* Coordinated Pill Switcher */}
        <div className="flex items-center bg-slate-200/50 p-0.5 rounded-full border border-slate-300/30">
          <button 
            onClick={() => { setLayoutTheme("gmail"); setSelectedId(null); }}
            className={`px-3 py-1 rounded-full text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer ${layoutTheme === 'gmail' ? 'bg-[#ea4335] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Gmail
          </button>
          <button 
            onClick={() => { setLayoutTheme("outlook"); setSelectedId(null); }}
            className={`px-3 py-1 rounded-full text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer ${layoutTheme === 'outlook' ? 'bg-white text-[#0078d4] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Outlook
          </button>
        </div>
      </div>

      {/* Compose pop up inside window */}
      {isComposing && (
        <div className="absolute bottom-4 right-4 w-[420px] border border-slate-300/60 shadow-2xl rounded-2xl flex flex-col z-[100] animate-fade-in font-sans text-sm bg-white overflow-hidden">
          <div className={`px-4 py-3 flex justify-between items-center font-bold text-white text-xs ${layoutTheme === 'gmail' ? 'bg-[#222222]' : 'bg-[#0078d4]'}`}>
            <span>撰写新邮件</span>
            <button onClick={() => setIsComposing(false)} className="text-white/80 hover:text-white hover:scale-110 font-bold text-sm bg-white/10 hover:bg-white/20 w-6 h-6 rounded-full flex items-center justify-center transition cursor-pointer">✕</button>
          </div>
          <div className="flex flex-col p-2 space-y-2.5 bg-slate-50/50">
            <input 
              type="text" 
              placeholder="收件人邮箱 / To" 
              value={composeTo}
              onChange={e => setComposeTo(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-slate-800 text-xs"
            />
            <input 
              type="text" 
              placeholder="邮件主题 / Subject" 
              value={composeSub}
              onChange={e => setComposeSub(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-slate-800 text-xs font-semibold"
            />
            <textarea 
              placeholder="请在此输入邮件正文内容..."
              value={composeTxt}
              onChange={e => setComposeTxt(e.target.value)}
              className="w-full h-44 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 py-2.5 px-3 resize-none text-slate-800 text-xs leading-relaxed"
            />
            <div className="p-1 flex items-center justify-end">
              <button 
                onClick={handleSendMail}
                className={`text-white font-bold px-6 py-2 rounded-full transition text-xs shadow-md cursor-pointer ${layoutTheme === 'gmail' ? 'bg-[#ea4335] hover:bg-[#d93025]' : 'bg-[#0078d4] hover:bg-[#005a9e]'}`}
              >
                发送邮件 / Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Inner Split Workspace */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* ==================== 1. GMAIL LAYOUT SIDEBAR ==================== */}
        {layoutTheme === "gmail" && (
          <div className="w-56 bg-[#f6f8fc]/40 p-3 flex flex-col gap-1 shrink-0 select-none text-left border-r border-slate-200/50">
            <button 
              onClick={() => {
                setIsComposing(true);
                setComposeTo("");
                setComposeSub("");
                setComposeTxt("");
              }}
              className="bg-[#c2e7ff] hover:bg-[#b0dcf8] text-slate-800 font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2.5 transition duration-200 shadow-sm text-xs mb-4 w-11/12 mx-auto cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              写信 / Compose
            </button>

            {[
              { id: "inbox", label: "收件箱", count: currentUnreadCount, dot: "📥" },
              { id: "starred", label: "已星标", dot: "⭐" },
              { id: "sent", label: "已发送", dot: "📤" },
              { id: "drafts", label: "草稿箱", dot: "📝" },
              { id: "trash", label: "垃圾箱", dot: "🗑️" }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => { setFolder(item.id); setSelectedId(null); }}
                className={`w-full text-left px-4 py-2 rounded-r-full text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${folder === item.id ? "bg-[#ea4335]/10 text-[#ea4335]" : "text-slate-600 hover:bg-slate-200/40"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm leading-none">{item.dot}</span>
                  <span>{item.label}</span>
                </div>
                {item.count ? item.count > 0 ? (
                  <span className="text-[10px] bg-red-100 text-red-600 font-extrabold px-1.5 py-0.5 rounded-full">{item.count}</span>
                ) : null : null}
              </button>
            ))}
          </div>
        )}

        {/* ==================== 2. OUTLOOK LAYOUT NAVIGATION RAIL ==================== */}
        {layoutTheme === "outlook" && (
          <div className="w-12 bg-slate-900 text-slate-400 flex flex-col items-center py-4 gap-6 shrink-0 select-none">
            <button onClick={() => { setFolder("inbox"); setSelectedId(null); }} className={`hover:text-white hover:scale-110 transition text-base border-none bg-transparent cursor-pointer ${folder === "inbox" ? "text-blue-400" : ""}`} title="邮件">✉️</button>
            <button onClick={() => alert("Outlook 日历功能已对接安全网关。")} className="hover:text-white hover:scale-110 transition text-base border-none bg-transparent cursor-pointer" title="日历">📅</button>
            <button onClick={() => alert("联系人花名册数据库同步就绪。")} className="hover:text-white hover:scale-110 transition text-base border-none bg-transparent cursor-pointer" title="联系人">👥</button>
          </div>
        )}

        {/* ==================== OUTLOOK SUB-FOLDER SELECTOR ==================== */}
        {layoutTheme === "outlook" && (
          <div className="w-40 bg-slate-50/80 p-3 flex flex-col gap-1 shrink-0 select-none border-r border-slate-200">
            <button 
              onClick={() => {
                setIsComposing(true);
                setComposeTo("");
                setComposeSub("");
                setComposeTxt("");
              }}
              className="bg-[#0078d4] hover:bg-[#005a9e] text-white font-extrabold py-2 px-3 rounded-lg text-center transition text-xs mb-3 flex items-center justify-center border-none shadow-sm cursor-pointer gap-1"
            >
              ➕ 新邮件
            </button>

            {[
              { id: "inbox", label: "收件箱", icon: "📥", count: currentUnreadCount },
              { id: "starred", label: "重要邮件", icon: "🚩" },
              { id: "sent", label: "发件箱", icon: "📤" },
              { id: "drafts", label: "草稿夹", icon: "📝" },
              { id: "trash", label: "已删除", icon: "🗑️" }
            ].map(df => (
              <button 
                key={df.id}
                onClick={() => { setFolder(df.id); setSelectedId(null); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-colors border-none cursor-pointer ${folder === df.id ? "bg-[#0078d4]/10 text-[#0078d4]" : "text-slate-600 hover:bg-[#edebe9]/50"}`}
              >
                <div className="flex items-center gap-2">
                  <span>{df.icon}</span>
                  <span>{df.label}</span>
                </div>
                {df.count ? df.count > 0 ? (
                  <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-1 rounded">{df.count}</span>
                ) : null : null}
              </button>
            ))}
          </div>
        )}

        {/* ==================== WORKSPACE INNER SPLIT CONTAINER ==================== */}
        <div className="flex-1 flex overflow-hidden bg-white rounded-tl-xl border-l border-slate-200">
          
          {/* List Section */}
          <div className={`${(layoutTheme === 'outlook' || selectedMail) ? 'w-[45%]' : 'w-full'} border-r border-slate-100 flex flex-col overflow-hidden`}>
            <div className="bg-slate-50/50 px-3 py-2 border-b border-slate-100 flex justify-between items-center shrink-0">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                {folder === 'inbox' ? '收件箱 / INBOX' : folder === 'starred' ? '已标记 / FLAGGED' : folder === 'sent' ? '已发送 / SENT' : '邮件列表'}
              </span>
              <span className="text-[9px] font-mono text-slate-400">Total: {filteredMails.length} items</span>
            </div>

            <div className="flex-grow overflow-y-auto divide-y divide-slate-100 bg-white">
              {filteredMails.map(mail => (
                <div 
                  key={mail.id}
                  onClick={() => {
                    setSelectedId(mail.id);
                    setMockEmailsList(prev => prev.map(m => m.id === mail.id ? { ...m, unread: false } : m));
                  }}
                  className={`p-3 text-left transition-all cursor-pointer border-l-4 relative hover:bg-slate-50/50 ${selectedId === mail.id ? "bg-blue-50/30 border-blue-500" : "border-transparent"} ${mail.unread ? "font-black" : ""}`}
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5">
                    <span className={`truncate max-w-[120px] font-bold ${mail.unread ? 'text-slate-900' : 'text-slate-500'}`}>{mail.sender}</span>
                    <span className="text-[9px] font-mono">{mail.date}</span>
                  </div>
                  <h4 className={`text-xs truncate mb-1 ${mail.unread ? 'text-slate-950 font-black' : 'text-slate-700 font-medium'}`}>{mail.subject}</h4>
                  <p className="text-[10px] text-slate-400 truncate leading-relaxed">{mail.body}</p>

                  {/* Gmail star indicator */}
                  {layoutTheme === 'gmail' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMockEmailsList(prev => prev.map(m => m.id === mail.id ? { ...m, starred: !m.starred } : m));
                      }}
                      className="absolute right-3 top-3 text-xs opacity-60 hover:opacity-100 transition"
                    >
                      {mail.starred ? "⭐" : "☆"}
                    </button>
                  )}
                </div>
              ))}
              {filteredMails.length === 0 && (
                <div className="text-center py-24 text-slate-400 font-mono text-xs">没有匹配的数字邮件记录。</div>
              )}
            </div>
          </div>

          {/* Reader Section */}
          <div className={`${(layoutTheme === 'outlook' || selectedMail) ? 'flex-1' : 'hidden md:flex md:w-0'} flex flex-col overflow-hidden bg-slate-50/30`}>
            {selectedMail ? (
              <div className="flex-grow flex flex-col p-4 overflow-y-auto text-left leading-relaxed text-xs">
                
                {/* Header operations */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4 select-text">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-sm text-slate-900">{selectedMail.sender}</span>
                      <span className="text-[10px] font-mono text-slate-400">{"<"}{selectedMail.senderEmail}{">"}</span>
                    </div>
                    <h2 className="text-xs font-black text-slate-800 leading-snug">{selectedMail.subject}</h2>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                      onClick={() => {
                        setComposeTo(selectedMail.senderEmail);
                        setComposeSub("回复: " + selectedMail.subject);
                        setIsComposing(true);
                      }}
                      className="px-3 py-1 bg-slate-200/50 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] transition cursor-pointer"
                    >
                      回复 / Reply
                    </button>
                    <button 
                      onClick={() => {
                        setMockEmailsList(prev => prev.map(m => m.id === selectedMail.id ? { ...m, folder: "trash" } : m));
                        setSelectedId(null);
                        alert("邮件已被放入垃圾箱。");
                      }}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[10px] transition cursor-pointer"
                    >
                      删除 / Delete
                    </button>
                  </div>
                </div>

                {/* Email Body Panel */}
                <div className="flex-grow bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 text-slate-800 select-text whitespace-pre-wrap text-[11px] leading-relaxed">
                  {selectedMail.body}
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-slate-400 text-[10px] gap-2.5">
                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm text-lg">📧</div>
                <div>
                  <p className="font-bold text-slate-700 text-[11px] mb-0.5">请选择邮件进行阅读</p>
                  <p className="max-w-xs leading-relaxed text-slate-400">选择左侧邮件以载入安全通道，在线实时解密并阅读数字邮件载荷。</p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

// ==========================================
// 🛍️ GOOGLE PLAY STORE COMPONENT
// ==========================================
export const PlayStoreApp: React.FC<GpkosReplicasProps> = ({
  installedApps,
  setInstalledApps,
  openGPKOSApp
}) => {
  const [playStoreTab, setPlayStoreTab] = useState<string>("apps");
  const [playStoreSearchText, setPlayStoreSearchText] = useState<string>("").toLowerCase();
  const [playStoreSelectedAppId, setPlayStoreSelectedAppId] = useState<string | null>(null);
  const [installingAppId, setInstallingAppId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState<number>(0);

  const mockPlayApps = [
    { id: "gmail", name: "Gmail Web App", developer: "Google LLC", category: "Communication", rating: "4.8", size: "32 MB", downloads: "10B+", icon: "📬", desc: "Secure Google Mail client optimized with direct TLS-layered proxy bypassing seamlessly." },
    { id: "outlook", name: "Outlook Email", developer: "Microsoft Corp", category: "Productivity", rating: "4.7", size: "28 MB", downloads: "1B+", icon: "📧", desc: "Professional business webmail and unified calendar synchronization system." },
    { id: "terminal", name: "Terminal Console", developer: "GPKOS Kernel Team", category: "Tools", rating: "4.9", size: "5.2 MB", downloads: "500k+", icon: "💻", desc: "Direct sandboxed secure Linux terminal console emulator." },
    { id: "ide", name: "Typescript Compiler Sandbox", developer: "GPKOS Core Team", category: "Developer", rating: "4.9", size: "12 MB", downloads: "1M+", icon: "📝", desc: "Advanced compiler workspace executing sandboxed scripts diagnostics." },
    { id: "remote", name: "Remote Support Screen", developer: "Rory GPKOS Team", category: "Business", rating: "4.8", size: "16 MB", downloads: "2M+", icon: "📡", desc: "High definition desktop cursor and audio mirroring stream channel." },
    { id: "maps", name: "Google Maps Secure Hub", developer: "Google LLC", category: "Travel", rating: "4.5", size: "44 MB", downloads: "5B+", icon: "🗺️", desc: "Deconcentrated locale vector tiles cache mapper." }
  ];

  const filteredApps = mockPlayApps.filter(a => {
    const isTabMatch = playStoreTab === "apps"; // all are apps for now
    const isSearchMatch = a.name.toLowerCase().includes(playStoreSearchText) || a.desc.toLowerCase().includes(playStoreSearchText);
    return isTabMatch && isSearchMatch;
  });

  const selectedApp = mockPlayApps.find(a => a.id === playStoreSelectedAppId);

  return (
    <div className="flex-grow flex flex-col bg-[#111] text-[#e3e3e3] overflow-hidden rounded-b-2xl h-full font-sans">
      {/* Search Header */}
      <div className="bg-[#212121] px-4 py-2.5 border-b border-white/5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3 w-full max-w-sm">
          <span className="text-lg">🛍️</span>
          <span className="font-extrabold text-xs tracking-tight text-[#00a82d]">Google Play</span>
          <div className="flex-grow relative">
            <input 
              type="text" 
              placeholder="Search apps & games..."
              value={playStoreSearchText}
              onChange={e => setPlayStoreSearchText(e.target.value)}
              className="w-full bg-[#303030] text-[10px] px-3 py-1 rounded-full pl-8 focus:outline-none focus:bg-[#404040] border-none text-white font-sans"
            />
            <span className="absolute left-2.5 top-1 px-0.5">🔍</span>
          </div>
        </div>
        <div className="text-[9px] text-slate-400 font-mono font-bold bg-[#303030] px-2.5 py-1 rounded-full border border-white/5 uppercase select-none">
          BYPASS CAP CHANNEL OK
        </div>
      </div>

      {playStoreSelectedAppId && selectedApp ? (
        /* App Detail Page */
        <div className="flex-grow overflow-y-auto p-5 text-left animate-fade-in relative font-sans">
          <button onClick={() => setPlayStoreSelectedAppId(null)} className="mb-4 flex items-center gap-1 text-[10px] text-[#00a82d] font-extrabold hover:underline border-none bg-transparent cursor-pointer">
            ⬅️ Back to Store
          </button>

          <div className="flex gap-4 items-start mb-4">
            <div className="w-16 h-16 bg-[#2b2b2b] rounded-2xl flex items-center justify-center text-3xl shadow-xl border border-white/10 shrink-0 select-none">
              {selectedApp.icon}
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="text-base font-black text-white leading-tight mb-0.5">{selectedApp.name}</h3>
              <p className="text-[11px] text-[#00a82d] font-semibold mb-2">{selectedApp.developer}</p>
              
              <div className="flex gap-3 items-center">
                {installingAppId === selectedApp.id ? (
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between items-center text-[9px] text-slate-400 mb-1 font-bold">
                      <span className="animate-pulse text-[#00a82d]">📥 Downloading App package...</span>
                      <span>{installProgress}%</span>
                    </div>
                    <div className="w-full bg-[#303030] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#00a82d] h-full transition-all duration-300" style={{ width: `${installProgress}%` }}></div>
                    </div>
                  </div>
                ) : installedApps.includes(selectedApp.id) ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        openGPKOSApp(selectedApp.id);
                      }}
                      className="bg-[#00a82d] hover:bg-[#00c838] text-black font-extrabold px-5 py-1.5 rounded-xl text-[10px] transition border-none cursor-pointer"
                    >
                      Open App
                    </button>
                    <button 
                      onClick={() => {
                        setInstalledApps(prev => prev.filter(x => x !== selectedApp.id));
                        alert(`已卸载 ${selectedApp.name}。`);
                      }}
                      className="bg-transparent hover:bg-white/5 text-rose-400 px-2 py-1.5 rounded-xl text-[9px] transition border-none cursor-pointer"
                    >
                      卸载
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setInstallingAppId(selectedApp.id);
                      setInstallProgress(0);
                      let prog = 0;
                      const interval = setInterval(() => {
                        prog += 20;
                        setInstallProgress(prog);
                        if (prog >= 100) {
                          clearInterval(interval);
                          setInstalledApps(prev => [...prev, selectedApp.id]);
                          setInstallingAppId(null);
                          alert(`🎉 应用中心: ${selectedApp.name} 已成功安装！`);
                        }
                      }, 200);
                    }}
                    className="bg-[#00a82d] hover:bg-[#00c838] text-black font-black px-6 py-2 rounded-xl text-[10px] transition shadow-lg border-none cursor-pointer"
                  >
                    安装 (免费)
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-y border-white/5 py-3 my-4 text-center text-[10px]">
            <div>
              <div className="font-extrabold text-white">{selectedApp.rating} ★</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Approved</div>
            </div>
            <div className="border-x border-white/5">
              <div className="font-extrabold text-white">{selectedApp.size}</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Size</div>
            </div>
            <div>
              <div className="font-extrabold text-white">{selectedApp.downloads}</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Users</div>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-xs text-white mb-1.5">Overview</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{selectedApp.desc}</p>
          </div>
        </div>
      ) : (
        /* App Store Home */
        <div className="flex-grow overflow-y-auto p-4 text-left font-sans flex flex-col">
          <div className="flex gap-2 mb-4 select-none text-[10px] font-bold text-slate-400">
            <button onClick={() => setPlayStoreTab("apps")} className={`px-3 py-1 rounded-full transition-colors border-none ${playStoreTab === "apps" ? "bg-[#00a82d]/15 text-[#00a82d]" : "hover:bg-white/5"}`}>Preloaded Software Applications</button>
          </div>

          <h3 className="font-extrabold text-white text-xs mb-3 tracking-tight">
            🔥 Recommended Secure Tools
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow overflow-y-auto">
            {filteredApps.map(app => {
              const isInstalled = installedApps.includes(app.id);
              return (
                <div 
                  key={app.id} 
                  onClick={() => setPlayStoreSelectedAppId(app.id)}
                  className="bg-[#212121]/40 border border-white/5 hover:border-white/10 p-3 rounded-xl flex gap-3 transition items-start cursor-pointer hover:bg-[#212121]"
                >
                  <div className="w-11 h-11 bg-[#2b2b2b] rounded-xl flex items-center justify-center text-2xl shrink-0 shadow border border-white/5 select-none">
                    {app.icon}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-extrabold text-xs text-white hover:text-[#00a82d] transition-colors leading-tight mb-0.5 truncate">{app.name}</h4>
                    <p className="text-[9px] text-[#00a82d] font-bold mb-1">{app.category}</p>
                    <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed mb-1.5 font-sans">{app.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-slate-500 font-bold">{app.rating} ★  •  {app.size}</span>
                      {isInstalled ? (
                        <span className="text-[8px] bg-[#00a82d]/10 text-[#00a82d] px-2 py-0.5 rounded-full font-bold">已安装</span>
                      ) : (
                        <span className="text-[8px] text-[#00a82d] font-extrabold">获取 / 免费</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 📊 ACTIVITY MONITOR COMPONENT
// ==========================================
export const SysMonApp: React.FC<GpkosReplicasProps> = ({ kernelStats }) => {
  return (
    <div className="flex-grow flex bg-[#1e1e24] text-slate-200 overflow-hidden h-full rounded-b-2xl font-mono text-[11px] select-text">
      {/* Graph */}
      <div className="w-44 bg-[#15151a] border-r border-white/5 p-4 flex flex-col gap-3.5 select-none shrink-0 text-[9px] text-slate-400 text-left">
        <div className="text-white font-extrabold text-[10px] mb-0.5">Rory CPU load</div>
        <div className="bg-black/40 h-16 rounded-lg p-1.5 flex items-end gap-0.5 relative overflow-hidden border border-white/5">
          {kernelStats.historyCpu.map((v: number, i: number) => (
            <div key={i} className="bg-cyan-500 rounded-t-sm flex-grow" style={{ height: `${Math.max(4, v * 9)}%` }} title={`Load: ${v}%`} />
          ))}
          <div className="absolute top-1 right-1 text-[8px] font-bold text-cyan-300 bg-cyan-950/40 px-1 rounded">Live</div>
        </div>
        <div>
          Load: <strong className="text-cyan-400 font-bold">{kernelStats.cpu}%</strong>
        </div>

        <div className="text-white font-extrabold text-[10px] mb-0.5">Mem allocation</div>
        <div className="bg-black/40 h-16 rounded-lg p-1.5 flex items-end gap-0.5 relative overflow-hidden border border-white/5">
          {kernelStats.historyRam.map((v: number, i: number) => (
            <div key={i} className="bg-fuchsia-500 rounded-t-sm flex-grow" style={{ height: `${Math.max(4, (v - 8.2) * 450)}%` }} title={`Memory: ${v} GB`} />
          ))}
          <div className="absolute top-1 right-1 text-[8px] font-bold text-fuchsia-300 bg-fuchsia-950/40 px-1 rounded">SSL</div>
        </div>
        <div>
          Memory: <strong className="text-fuchsia-400 font-bold">{kernelStats.ram} GB</strong><br/>
          Total: 128 GB Unified
        </div>
      </div>

      {/* Process list */}
      <div className="flex-grow flex flex-col p-3 overflow-hidden">
        <div className="text-white font-bold mb-2 flex items-center justify-between border-b border-white/5 pb-1 select-none">
          <span>Active Processes ({kernelStats.processes})</span>
          <span className="text-[9px] bg-cyan-950 font-bold border border-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">RORY MULTITASK</span>
        </div>
        <div className="flex-grow overflow-y-auto space-y-1 bg-black/20 p-2 rounded-lg border border-white/5 text-left">
          <div className="grid grid-cols-4 gap-1.5 font-bold text-slate-500 text-[9px] uppercase pb-1 border-b border-white/5 select-none">
            <span>Process Name</span>
            <span>CPU</span>
            <span>RAM</span>
            <span>Status</span>
          </div>
          {[
            { name: "gmail_wrapper.app", cpu: "0.2%", mem: "128 MB", status: "Sleeping" },
            { name: "outlook_client.dylib", cpu: "0.1%", mem: "92 MB", status: "Sleeping" },
            { name: "g_playstore_store", cpu: "0.0%", mem: "64 MB", status: "Sleeping" },
            { name: "terminal.shell", cpu: (kernelStats.cpu * 0.1).toFixed(1) + "%", mem: "30 MB", status: "Active" },
            { name: "sandbox_sandbox.ts", cpu: (kernelStats.cpu * 0.25).toFixed(1) + "%", mem: "240 MB", status: "Idle" },
            { name: "g_maps_cache_loader", cpu: "0.1%", mem: "180 MB", status: "Loaded" },
            { name: "gpkos_main_kernel", cpu: "1.1%", mem: "512 MB", status: "Root Privilege" }
          ].map((proc, i) => (
            <div key={i} className="grid grid-cols-4 gap-1.5 text-[9px] text-slate-300 border-b border-white/5 py-1 hover:bg-white/5 px-1 rounded transition-colors">
              <span className="font-semibold text-slate-200 truncate">{proc.name}</span>
              <span className="text-cyan-400 font-bold">{proc.cpu}</span>
              <span className="text-fuchsia-400">{proc.mem}</span>
              <span className="text-emerald-400">{proc.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🎨 PREFERENCES SETTINGS COMPONENT
// ==========================================
export const SettingsApp: React.FC<GpkosReplicasProps> = ({
  desktopWallpaper,
  setDesktopWallpaper,
  dockAutohide,
  setDockAutohide
}) => {
  const wallpapers = [
    { name: "Big Sur Wave", logo: "🌅", desc: "Classic dynamic sunset curves.", class: "from-[#101F42] via-[#0E4DA4] via-[#7B2E7C] to-[#C93375] bg-gradient-to-br" },
    { name: "Ventura Orange", logo: "🍊", desc: "High contrast tangerine hues.", class: "from-[#B52003] via-[#DC5603] via-[#E28303] to-[#ECC75E] bg-gradient-to-br" },
    { name: "Cosmic Purple", logo: "🌌", desc: "Ambient starlight deep glow.", class: "from-[#140026] via-[#310A5D] via-[#65158A] to-[#BC4F97] bg-gradient-to-br" },
    { name: "Emerald Forest", logo: "🌲", desc: "Calming forest green waves.", class: "from-[#021A11] via-[#043324] via-[#097750] to-[#55ECC1] bg-gradient-to-br" },
    { name: "Matrix Terminal", logo: "📟", desc: "Pure dark matrix developer mode.", class: "bg-[#050505] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" }
  ];

  return (
    <div className="flex-grow flex bg-slate-900 text-white overflow-y-auto p-4 rounded-b-2xl h-full font-sans select-none text-left flex-col gap-4">
      <div>
        <h3 className="text-sm font-black tracking-tight mb-0.5 flex items-center gap-1">🎨 Wallpaper Preferences</h3>
        <p className="text-slate-400 text-[10px]">Choose your desktop wallpaper immediately. Changes apply in real-time with smooth CSS gradients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {wallpapers.map(wp => (
          <div 
            key={wp.name}
            onClick={() => {
              setDesktopWallpaper(wp.name);
            }}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-center group relative overflow-hidden ${wp.name === desktopWallpaper ? "bg-white/10 border-cyan-500" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
          >
            <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-xl border border-white/10 group-hover:scale-105 transition-transform ${wp.class}`}>
              <span>{wp.logo}</span>
            </div>
            <div>
              <h4 className="font-extrabold text-[11px] text-white flex items-center gap-1.5">
                {wp.name}
                {wp.name === desktopWallpaper && (
                  <span className="bg-cyan-500 text-slate-950 font-bold text-[7px] px-1 rounded-full font-mono">ACTIVE</span>
                )}
              </h4>
              <p className="text-[9px] text-slate-400 leading-snug mt-0.5">{wp.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 pt-3">
        <h4 className="text-xs font-bold mb-2.5 flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-cyan-400" /> OS Customization</h4>
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
          <div>
            <div className="font-extrabold text-[11px] text-slate-100 mb-0.5">Autohide Bottom Dock</div>
            <div className="text-[9px] text-slate-400 leading-snug">Slide and hide the Dock off-screen until cursor hovers.</div>
          </div>
          <button 
            onClick={() => setDockAutohide(!dockAutohide)}
            className={`px-3 py-1 rounded font-bold text-[9px] transition uppercase border-none cursor-pointer ${dockAutohide ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-slate-400"}`}
          >
            {dockAutohide ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>
    </div>
  );
};
