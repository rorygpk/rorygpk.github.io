import React, { useState } from "react";
import { Mail, Shield, Sliders, Play, BrainCircuit } from "lucide-react";

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
  const [gmailFolder, setGmailFolder] = useState<string>("inbox");
  const [gmailSelectedId, setGmailSelectedId] = useState<string | null>("m2");
  const [gmailComposeTo, setGmailComposeTo] = useState<string>("");
  const [gmailComposeSub, setGmailComposeSub] = useState<string>("");
  const [gmailComposeTxt, setGmailComposeTxt] = useState<string>("");
  const [isGmailComposing, setIsGmailComposing] = useState<boolean>(false);

  const currentUnreadCount = mockEmailsList.filter(m => m.unread && m.folder === "inbox").length;
  const filteredMails = mockEmailsList.filter(m => m.folder === gmailFolder);
  const selectedMail = mockEmailsList.find(m => m.id === gmailSelectedId);

  return (
    <div className="flex-grow flex bg-[#131214] text-slate-300 overflow-hidden rounded-b-2xl h-full font-sans relative">
      {/* Compose pop up inside window */}
      {isGmailComposing && (
        <div className="absolute bottom-4 right-4 w-96 bg-slate-900 border border-white/10 shadow-2xl shadow-cyan-500/20 rounded-2xl flex flex-col z-[100] animate-fade-in font-sans text-xs">
          <div className="bg-slate-950 text-emerald-400 px-4 py-2.5 rounded-t-2xl flex justify-between items-center font-bold border-b border-white/10 uppercase tracking-widest text-[10px]">
            <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-emerald-500" /> Secure Mail Dispatcher</span>
            <button onClick={() => setIsGmailComposing(false)} className="text-slate-500 hover:text-white font-bold text-sm">✕</button>
          </div>
          <div className="p-3.5 space-y-3 bg-slate-900/90 backdrop-blur-md rounded-b-2xl">
            <input 
              type="text" 
              placeholder="Target Tunnel Address (To)" 
              value={gmailComposeTo}
              onChange={e => setGmailComposeTo(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 py-1.5 px-2.5 focus:outline-none focus:border-emerald-500 text-white rounded font-mono text-[10px]"
            />
            <input 
              type="text" 
              placeholder="Encryption Subject" 
              value={gmailComposeSub}
              onChange={e => setGmailComposeSub(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 py-1.5 px-2.5 focus:outline-none focus:border-emerald-500 text-white rounded font-mono text-[10px]"
            />
            <textarea 
              placeholder="Inject encrypted payload text here..." 
              value={gmailComposeTxt}
              onChange={e => setGmailComposeTxt(e.target.value)}
              className="w-full h-36 bg-slate-950 border border-white/10 focus:outline-none py-2 px-2.5 resize-none text-emerald-100 rounded text-xs font-mono"
            />
            <button 
              onClick={() => {
                if(!gmailComposeTo || !gmailComposeTxt) {
                  alert("Please enter a receiver address and email body content."); return;
                }
                const newMail = {
                  id: "m_sent_" + Date.now(),
                  sender: currentUser?.fullName || "Operator",
                  senderEmail: currentUser?.emailUsername + "@gpkos.net",
                  subject: gmailComposeSub || "(无主题)",
                  date: "1秒前",
                  body: gmailComposeTxt,
                  unread: false,
                  starred: false,
                  folder: "sent"
                };
                setMockEmailsList(prev => [newMail, ...prev]);
                
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

                setIsGmailComposing(false);
                setGmailComposeTo("");
                setGmailComposeSub("");
                setGmailComposeTxt("");
                alert("🎉 邮件成功发出！自动通过 SSL 中转管道离线投递完毕。");
              }}
              className="w-full bg-emerald-600/20 border border-emerald-500/50 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold py-2 rounded-lg transition text-xs tracking-widest uppercase"
            >
              Start AES-256 Dispatch
            </button>
          </div>
        </div>
      )}

      {/* Gmail Left Sidebar Navigation */}
      <div className="w-52 bg-slate-950 border-r border-white/10 p-3 flex flex-col gap-1 shrink-0 select-none text-left font-sans">
        <div className="flex flex-col gap-1 px-1 py-1 mb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-red-500" />
            <span className="font-extrabold text-base tracking-tight text-white">Gmail Cloud</span>
          </div>
          <span className="text-[9px] text-slate-500 font-bold tracking-widest mt-0.5">极速中转安全主控</span>
        </div>

        <button 
          onClick={() => {
            setIsGmailComposing(true);
            setGmailComposeTo("");
            setGmailComposeSub("");
            setGmailComposeTxt("");
          }}
          className="bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-md hover:shadow-cyan-500/10 text-xs mb-4"
        >
          <span>✏️</span> Secure Draft
        </button>

        {[
          { id: "inbox", label: "Tunnel Inbox", icon: "📥", count: currentUnreadCount },
          { id: "starred", label: "Encrypted Starred", icon: "⭐" },
          { id: "sent", label: "Dispatched", icon: "📤" },
          { id: "drafts", label: "Local Vault", icon: "📝" },
          { id: "trash", label: "Wipe Area", icon: "🗑️" }
        ].map(folderItem => (
          <button 
            key={folderItem.id}
            onClick={() => { setGmailFolder(folderItem.id); setGmailSelectedId(null); }}
            className={`w-full text-left px-3.5 py-2 rounded-lg text-[10px] font-bold flex items-center justify-between transition-colors uppercase tracking-wider border border-transparent ${gmailFolder === folderItem.id ? "bg-white/10 text-white border-white/20" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="opacity-80">{folderItem.icon}</span>
              <span>{folderItem.label}</span>
            </div>
            {folderItem.count ? folderItem.count > 0 ? (
              <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded font-mono leading-none">{folderItem.count}</span>
            ) : null : null}
          </button>
        ))}

        <div className="mt-auto pt-3 border-t border-white/10 text-center text-[9px] text-slate-500 font-mono">
          Global Transport Relay:<br/>
          <strong className="text-emerald-500 block mt-1 animate-pulse"><Shield className="w-3 h-3 inline mr-1"/> ACTIVE OK</strong>
        </div>
      </div>

      {/* Gmail Content Workspace Grid */}
      <div className="flex-grow flex overflow-hidden bg-slate-900 border-l border-white/5">
        {/* Emails List */}
        <div className="w-[45%] border-r border-white/5 flex flex-col overflow-hidden bg-slate-900/50">
          <div className="bg-slate-950 px-4 py-2 flex justify-between items-center shrink-0 border-b border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-slate-500" /> {gmailFolder} Node Data
            </span>
          </div>
          <div className="flex-grow overflow-y-auto divide-y divide-white/5">
            {filteredMails.map(mail => (
              <div 
                key={mail.id}
                onClick={() => {
                  setGmailSelectedId(mail.id);
                  setMockEmailsList(prev => prev.map(m => m.id === mail.id ? { ...m, unread: false } : m));
                }}
                className={`p-3 text-left transition-colors cursor-pointer border-l-2 ${mail.id === gmailSelectedId ? "bg-white/5 border-emerald-500" : "hover:bg-white/5 border-transparent"} ${mail.unread ? "bg-white/[0.02]" : ""}`}
              >
                <div className="flex justify-between items-center text-[9px] text-slate-500 mb-1 font-mono uppercase tracking-tight">
                  <span className={`font-bold truncate max-w-[120px] ${mail.unread ? "text-white" : "text-slate-400"}`}>{mail.sender}</span>
                  <span className={mail.unread ? "text-emerald-500 font-bold" : "opacity-60"}>{mail.date}</span>
                </div>
                <h4 className={`text-xs line-clamp-1 mb-1 ${mail.unread ? "text-white font-extrabold" : "text-slate-300 font-medium"}`}>{mail.subject}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 font-normal font-mono">{mail.body}</p>
              </div>
            ))}
            {filteredMails.length === 0 && (
              <div className="text-center py-20 text-slate-500 font-mono text-[10px] tracking-widest uppercase">No payloads in this stream.</div>
            )}
          </div>
        </div>

        {/* Email Detail Reader Pane */}
        <div className="w-[55%] flex flex-col overflow-hidden bg-[#131214]">
          {selectedMail ? (
            <div className="flex-grow flex flex-col overflow-y-auto p-5 text-left text-xs bg-slate-950">
              <div className="border-b border-white/10 pb-4 mb-4 select-text">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{selectedMail.sender}</span>
                    <span className="text-[10px] bg-slate-900 border border-white/10 px-2 py-0.5 rounded text-slate-400 font-mono">{"<"}{selectedMail.senderEmail}{">"}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{selectedMail.date}</span>
                </div>
                <h2 className="text-sm font-black text-white leading-snug tracking-tight">{selectedMail.subject}</h2>
              </div>
              
              <div className="flex-grow whitespace-pre-wrap select-text leading-relaxed text-slate-300 font-mono text-[11px]">
                {selectedMail.body}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex gap-2 shrink-0 object-bottom">
                <button 
                  onClick={() => {
                    setGmailComposeTo(selectedMail.senderEmail);
                    setGmailComposeSub("Re: " + selectedMail.subject);
                    setIsGmailComposing(true);
                  }}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold px-4 py-2 rounded-lg text-[10px] transition border border-emerald-500/20 uppercase tracking-widest flex items-center justify-center auto-cols-auto gap-1"
                >
                  ↩ Secure Reply
                </button>
                <button 
                  onClick={() => {
                    openGPKOSApp("outlook");
                    alert("Exporting content context securely to Outlook pipeline...");
                  }}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 font-bold px-4 py-2 rounded-lg text-[10px] transition border border-white/10 uppercase tracking-widest"
                >
                  ➡️ Relay To Outlook
                </button>
                <button 
                  onClick={() => {
                    setMockEmailsList(prev => prev.map(m => m.id === selectedMail.id ? { ...m, folder: "trash" } : m));
                    setGmailSelectedId(null);
                    alert("Moved to Trash folder.");
                  }}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold px-4 py-2 rounded-lg text-[10px] transition border border-red-500/20 uppercase tracking-widest ml-auto"
                >
                  🗑️ Wipe
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-slate-500 font-mono uppercase tracking-widest text-[9px] gap-3">
              <Shield className="w-12 h-12 text-slate-700/50" />
              <p className="leading-relaxed max-w-[200px]">Node Standby.<br/>Select an encrypted payload from the left stream to intercept and view content context.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 📧 OUTLOOK COMPONENT
// ==========================================
export const OutlookApp: React.FC<GpkosReplicasProps> = ({
  currentUser,
  mockEmailsList,
  setMockEmailsList,
  setGpkosWindows
}) => {
  const [outlookFolder, setOutlookFolder] = useState<string>("inbox");
  const [outlookSelectedId, setOutlookSelectedId] = useState<string | null>("m3");
  const [outlookComposeTo, setOutlookComposeTo] = useState<string>("");
  const [outlookComposeSub, setOutlookComposeSub] = useState<string>("");
  const [outlookComposeTxt, setOutlookComposeTxt] = useState<string>("");
  const [isOutlookComposing, setIsOutlookComposing] = useState<boolean>(false);

  const currentUnreadCount = mockEmailsList.filter(m => m.unread && m.folder === "inbox").length;
  const filteredMails = mockEmailsList.filter(m => m.folder === outlookFolder);
  const selectedMail = mockEmailsList.find(m => m.id === outlookSelectedId);

  return (
    <div className="flex-grow flex bg-[#f3f2f1] text-[#242424] overflow-hidden rounded-b-2xl h-full font-sans relative">
      {/* Compose */}
      {isOutlookComposing && (
        <div className="absolute bottom-4 right-4 w-96 bg-white border border-slate-300 shadow-2xl rounded-xl flex flex-col z-[100] animate-fade-in font-sans text-xs">
          <div className="bg-[#0078d4] text-white px-4 py-2 flex justify-between items-center font-bold">
            <span>Microsoft Outlook - New Message</span>
            <button onClick={() => setIsOutlookComposing(false)} className="text-white hover:opacity-85 border-none bg-transparent cursor-pointer font-bold text-sm">✕</button>
          </div>
          <div className="p-3.5 space-y-3">
            <input 
              type="text" 
              placeholder="To (Receiver)" 
              value={outlookComposeTo}
              onChange={e => setOutlookComposeTo(e.target.value)}
              className="w-full border-b border-slate-200 py-1 focus:outline-none focus:border-[#0078d4] text-slate-800"
            />
            <input 
              type="text" 
              placeholder="Add a subject" 
              value={outlookComposeSub}
              onChange={e => setOutlookComposeSub(e.target.value)}
              className="w-full border-b border-slate-200 py-1 focus:outline-none focus:border-[#0078d4] text-slate-800"
            />
            <textarea 
              placeholder="Write raw content here..." 
              value={outlookComposeTxt}
              onChange={e => setOutlookComposeTxt(e.target.value)}
              className="w-full h-36 focus:outline-none py-1 font-sans resize-none text-slate-850"
            />
            <button 
              onClick={() => {
                if(!outlookComposeTo || !outlookComposeTxt) {
                  alert("To and Message fields are required !"); return;
                }
                const newMail = {
                  id: "m_sent_ot_" + Date.now(),
                  sender: currentUser?.fullName || "Outlook Guest User",
                  senderEmail: currentUser?.emailUsername + "@outlook-sandbox.com",
                  subject: outlookComposeSub || "(No Subject)",
                  date: "Just now",
                  body: outlookComposeTxt,
                  unread: false,
                  starred: false,
                  folder: "sent"
                };
                setMockEmailsList(prev => [newMail, ...prev]);

                setIsOutlookComposing(false);
                setOutlookComposeTo("");
                setOutlookComposeSub("");
                setOutlookComposeTxt("");
                alert("🎉 Outlook message dispatched through preloaded server relay successfully!");
              }}
              className="w-full bg-[#0078d4] hover:bg-blue-700 text-white font-bold py-2 rounded transition shadow-lg text-xs border-none cursor-pointer"
            >
              Send Secure Outlook Mail
            </button>
          </div>
        </div>
      )}

      {/* Blue Header side */}
      <div className="w-12 bg-[#1f1f1f] text-slate-400 flex flex-col items-center py-4 gap-5 shrink-0 select-none">
        <div className="text-white text-lg font-black bg-[#0078d4] w-8 h-8 rounded flex items-center justify-center">O</div>
        <button onClick={() => { setOutlookFolder("inbox"); setOutlookSelectedId(null); }} className={`hover:text-white transition text-base border-none bg-transparent cursor-pointer ${outlookFolder === "inbox" ? "text-[#0078d4]" : ""}`} title="Mail">✉️</button>
        <button onClick={() => alert("Calendar module synced.")} className="hover:text-white transition text-base border-none bg-transparent cursor-pointer" title="Calendar">📅</button>
        <button onClick={() => alert("Contacts list is active")} className="hover:text-white transition text-base border-none bg-transparent cursor-pointer" title="People">👥</button>
      </div>

      <div className="w-44 bg-[#f3f2f1] p-3 flex flex-col gap-1 shrink-0 select-none border-r border-[#edebe9] text-left">
        <div className="font-extrabold text-xs text-[#0078d4] px-1 py-1 mb-2">Outlook Web</div>
        
        <button 
          onClick={() => {
            setIsOutlookComposing(true);
            setOutlookComposeTo("");
            setOutlookComposeSub("");
            setOutlookComposeTxt("");
          }}
          className="bg-[#0078d4] hover:bg-[#005a9e] text-white font-bold py-2 px-3 rounded text-center transition text-xs mb-3 flex items-center justify-center border-none shadow-sm cursor-pointer"
        >
          ➕ New Mail
        </button>

        {[
          { id: "inbox", label: "Inbox", icon: "📥", count: currentUnreadCount },
          { id: "starred", label: "Flagged", icon: "🚩" },
          { id: "sent", label: "Sent Items", icon: "📤" },
          { id: "drafts", label: "Drafts", icon: "📝" },
          { id: "trash", label: "Deleted", icon: "🗑️" }
        ].map(df => (
          <button 
            key={df.id}
            onClick={() => { setOutlookFolder(df.id); setOutlookSelectedId(null); }}
            className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold flex items-center justify-between transition-colors border-none cursor-pointer ${outlookFolder === df.id ? "bg-[#edebe9] text-[#242424]" : "text-slate-600 hover:bg-[#edebe9]/40"}`}
          >
            <div className="flex items-center gap-2">
              <span>{df.icon}</span>
              <span>{df.label}</span>
            </div>
            {df.count ? df.count > 0 ? (
              <span className="text-[10px] text-slate-500 font-bold font-mono">{df.count}</span>
            ) : null : null}
          </button>
        ))}
      </div>

      {/* Columns */}
      <div className="flex-grow flex bg-white overflow-hidden">
        {/* List */}
        <div className="w-[45%] border-r border-[#edebe9] flex flex-col overflow-hidden">
          <div className="bg-[#faf9f8] px-3 py-1.5 border-b border-[#edebe9] flex justify-between items-center shrink-0">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">{outlookFolder}</span>
            <span className="text-[9px] text-[#0078d4] font-bold">Encrypted Link</span>
          </div>
          <div className="flex-grow overflow-y-auto divide-y divide-[#edebe9]">
            {filteredMails.map(mail => (
              <div 
                key={mail.id}
                onClick={() => {
                  setOutlookSelectedId(mail.id);
                  setMockEmailsList(prev => prev.map(m => m.id === mail.id ? { ...m, unread: false } : m));
                }}
                className={`p-3 text-left transition-colors cursor-pointer border-l-4 ${mail.id === outlookSelectedId ? "bg-slate-50 border-[#0078d4]" : "hover:bg-slate-50 border-transparent"} ${mail.unread ? "font-black text-[#242424]" : "text-[#605e5c]"}`}
              >
                <div className="flex justify-between items-center text-[9px] text-slate-400 mb-1">
                  <span className="truncate max-w-[100px]">{mail.sender}</span>
                  <span>{mail.date}</span>
                </div>
                <h4 className="text-xs text-slate-950 font-bold leading-tight truncate mb-0.5">{mail.subject}</h4>
                <p className="text-[10px] text-slate-400 truncate">{mail.body}</p>
              </div>
            ))}
            {filteredMails.length === 0 && (
              <div className="text-center py-20 text-slate-400 font-mono text-[10px]">No mail files.</div>
            )}
          </div>
        </div>

        {/* Reader */}
        <div className="w-[55%] flex flex-col overflow-hidden bg-[#faf9f8]">
          {selectedMail ? (
            <div className="flex-grow flex flex-col p-4 overflow-y-auto text-left leading-relaxed text-xs">
              <div className="border-b border-[#edebe9] pb-2.5 mb-3 select-text">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-extrabold text-[#0078d4]">{selectedMail.sender} <em className="text-slate-400 font-normal text-[9px] leading-none not-italic">({selectedMail.senderEmail})</em></span>
                  <span className="text-[9px] font-mono text-slate-400">{selectedMail.date}</span>
                </div>
                <h2 className="text-xs font-black text-slate-900 leading-snug">{selectedMail.subject}</h2>
              </div>
              <div className="flex-grow bg-white p-3 rounded-lg shadow-sm border border-[#edebe9] text-[#242424] select-text whitespace-pres-wrap text-[11px] leading-relaxed">
                {selectedMail.body}
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-slate-400 text-[10px] gap-2">
              <div className="w-10 h-10 rounded-full border border-[#edebe9] flex items-center justify-center bg-white shadow-sm text-blue-500">📧</div>
              <p className="max-w-xs leading-relaxed font-sans">Select any item from the index list to read Outlook decrypted payload securely.</p>
            </div>
          )}
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
                        alert(`Uninstalled ${selectedApp.name}. Icon removed.`);
                      }}
                      className="bg-transparent hover:bg-white/5 text-rose-400 px-2 py-1.5 rounded-xl text-[9px] transition border-none cursor-pointer"
                    >
                      Uninstall
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
                          alert(`🎉 Google Play SUCCESS: ${selectedApp.name} downloaded & sandboxed! Its launcher shortcut is now active.`);
                        }
                      }, 200);
                    }}
                    className="bg-[#00a82d] hover:bg-[#00c838] text-black font-black px-6 py-2 rounded-xl text-[10px] transition shadow-lg border-none cursor-pointer"
                  >
                    Install (Free)
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
                        <span className="text-[8px] bg-[#00a82d]/10 text-[#00a82d] px-2 py-0.5 rounded-full font-bold">已安装 Installed</span>
                      ) : (
                        <span className="text-[8px] text-[#00a82d] font-extrabold">Get / 免费</span>
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
