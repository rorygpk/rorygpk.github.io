import React, { useState, useEffect } from "react";
import { 
  Send, 
  Mail, 
  User, 
  MapPin, 
  Globe, 
  Compass, 
  Search, 
  Heart, 
  Sparkles, 
  Coffee, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  FileText, 
  CheckSquare, 
  AlertCircle,
  Plus,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Penpal {
  id: string;
  name: string;
  country: string;
  flag: string;
  bio: string;
  interests: string[];
  avatar: string;
  activeStatus: "online" | "away" | "offline";
}

interface Letter {
  id: string;
  senderName: string;
  senderAvatar: string;
  recipientName: string;
  content: string;
  paperStyle: "vintage" | "cyber" | "royal" | "plain";
  stampType: "dragon" | "pigeon" | "relay" | "space";
  status: "delivered" | "in-transit" | "draft";
  deliveryProgress: number; // 0 to 100
  transitStep: string;
  createdAt: string;
  isIncoming: boolean;
}

const GLOBAL_PENPALS: Penpal[] = [
  {
    id: "sakura-kyoto",
    name: "Sakura Sato (佐藤さくら)",
    country: "Japan (Kyoto)",
    flag: "🇯🇵",
    bio: "Tea ceremony instructor and traditional flower arrangement enthusiast. I love classical Japanese literature and retro photography.",
    interests: ["Tea Ceremony", "Retro Photography", "Ikebana", "Vinyl Records"],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    activeStatus: "online"
  },
  {
    id: "marcus-valley",
    name: "Marcus Miller",
    country: "United States (California)",
    flag: "🇺🇸",
    bio: "AI research engineer by day, indie retro-game developer by night. Obsessed with custom mechanical keyboards and high-fidelity synthesizers.",
    interests: ["Artificial Intelligence", "Game Dev", "Synthwave", "Mechanical Keyboards"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    activeStatus: "online"
  },
  {
    id: "chloe-paris",
    name: "Chloé Dubois",
    country: "France (Paris)",
    flag: "🇫🇷",
    bio: "Art history student at the Sorbonne. I write poetry on vintage typewriters, explore Paris flea markets, and collect vintage postcards.",
    interests: ["Art History", "Poetry", "Typewriters", "Flea Markets"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    activeStatus: "away"
  },
  {
    id: "dmitry-moscow",
    name: "Dmitry Volkov",
    country: "Russia (Moscow)",
    flag: "🇷🇺",
    bio: "Theoretical physicist who spends free time backpacking in the wilderness. Amateur astronomer and classical piano player.",
    interests: ["Astronomy", "Backpacking", "Classical Piano", "Quantum Mechanics"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    activeStatus: "offline"
  },
  {
    id: "jiwoo-seoul",
    name: "Kim Ji-woo (김지우)",
    country: "South Korea (Seoul)",
    flag: "🇰🇷",
    bio: "UX Designer and coffee lover. I enjoy building micro-interactions, visiting design cafes, and watercolor painting on lazy weekends.",
    interests: ["UX Design", "Specialty Coffee", "Watercolor", "Indie Pop"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    activeStatus: "online"
  }
];

const PRESET_INCOMING_LETTERS: Letter[] = [
  {
    id: "let-inc-1",
    senderName: "Sakura Sato (佐藤さくら)",
    senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    recipientName: "Me",
    content: "Dear Friend,\n\nGreetings from Kyoto! Today, the cherry blossoms are beginning to dance in the gentle breeze. I was instructing my students in the tea ceremony when I suddenly thought about our letters.\n\nHow is the weather in your city today? I hope this retro letter routes safely through your virtual host system and finds you in high spirits. I've attached a virtual cherry blossom blossom to this message!\n\nWarmly,\nSakura",
    paperStyle: "vintage",
    stampType: "pigeon",
    status: "delivered",
    deliveryProgress: 100,
    transitStep: "Arrived at destination mailbox",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    isIncoming: true
  },
  {
    id: "let-inc-2",
    senderName: "Marcus Miller",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    recipientName: "Me",
    content: "Hey human,\n\nWriting to you from a rainy Silicon Valley. I just finished assembling a new 65% keyboard with vintage brass plates and lubed tactile switches. Typing this on it feels incredibly satisfying!\n\nI noticed you are running GPKOS Virtual. That kernel interface looks wild! We should definitely coordinate on some retro compiler builds in the terminal.\n\nKeep hackin'!\nMarcus",
    paperStyle: "cyber",
    stampType: "relay",
    status: "delivered",
    deliveryProgress: 100,
    transitStep: "Decrypted securely at local node",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isIncoming: true
  }
];

export const PenpalApp = () => {
  const [activeTab, setActiveTab] = useState<"directory" | "inbox" | "write" | "transit">("directory");
  const [selectedPenpal, setSelectedPenpal] = useState<Penpal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State loaded from localStorage
  const [letters, setLetters] = useState<Letter[]>(() => {
    try {
      const saved = localStorage.getItem("gpkos_penpal_letters");
      return saved ? JSON.parse(saved) : [...PRESET_INCOMING_LETTERS];
    } catch {
      return [...PRESET_INCOMING_LETTERS];
    }
  });

  const [writeForm, setWriteForm] = useState({
    recipientId: "",
    content: "",
    paperStyle: "vintage" as "vintage" | "cyber" | "royal" | "plain",
    stampType: "pigeon" as "dragon" | "pigeon" | "relay" | "space"
  });

  const [activeLetter, setActiveLetter] = useState<Letter | null>(null);

  useEffect(() => {
    localStorage.setItem("gpkos_penpal_letters", JSON.stringify(letters));
  }, [letters]);

  // Handle in-transit letters background update
  useEffect(() => {
    const interval = setInterval(() => {
      setLetters(prev => {
        let changed = false;
        const updated = prev.map(l => {
          if (l.status === "in-transit") {
            changed = true;
            const newProgress = Math.min(100, l.deliveryProgress + 10);
            let nextStep = l.transitStep;
            
            if (newProgress < 30) {
              nextStep = l.stampType === "pigeon" ? "🕊️ Carrier pigeon flying over state borders" : "📡 Packet encapsulating at local router node";
            } else if (newProgress < 60) {
              nextStep = l.stampType === "pigeon" ? "🌊 Fighting oceanic winds over deep waters" : "🌐 Routing through deep underwater fiber conduits";
            } else if (newProgress < 95) {
              nextStep = l.stampType === "pigeon" ? "🏡 Descending into municipal airspace limits" : "🔒 Undergoing final TLS key check & clearance";
            } else {
              nextStep = "📬 Delivered & stored securely";
            }

            return {
              ...l,
              deliveryProgress: newProgress,
              status: newProgress === 100 ? "delivered" as const : "in-transit" as const,
              transitStep: nextStep
            };
          }
          return l;
        });
        if (changed) {
          return updated;
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSendLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeForm.recipientId || !writeForm.content.trim()) {
      alert("请填写收信人和写信内容！");
      return;
    }

    const penpal = GLOBAL_PENPALS.find(p => p.id === writeForm.recipientId);
    if (!penpal) return;

    const newLetter: Letter = {
      id: "let-" + Date.now().toString(),
      senderName: "Me",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      recipientName: penpal.name,
      content: writeForm.content,
      paperStyle: writeForm.paperStyle,
      stampType: writeForm.stampType,
      status: "in-transit",
      deliveryProgress: 0,
      transitStep: writeForm.stampType === "pigeon" ? "🕊️ Carrier pigeon leaving the nesting grounds" : "📡 Broadcasting secure packet signature",
      createdAt: new Date().toISOString(),
      isIncoming: false
    };

    setLetters(prev => [newLetter, ...prev]);
    setWriteForm({
      recipientId: "",
      content: "",
      paperStyle: "vintage",
      stampType: "pigeon"
    });
    setSelectedPenpal(null);
    setActiveTab("transit");
    
    // Auto simulated reply after 25 seconds
    setTimeout(() => {
      const replyLetter: Letter = {
        id: "let-reply-" + Date.now().toString(),
        senderName: penpal.name,
        senderAvatar: penpal.avatar,
        recipientName: "Me",
        content: `Greetings my dear friend!\n\nI just received your lovely letter delivered via ${writeForm.stampType === "pigeon" ? "carrier pigeon" : "secure quantum routing"}.\n\nIt was so wonderful hearing from you! Your words really brought warmth to my day. I absolutely love how we can connect across continents through this digital parchment.\n\nLet's write to each other again very soon!\n\nWarm regards,\n${penpal.name}`,
        paperStyle: writeForm.paperStyle,
        stampType: writeForm.stampType,
        status: "delivered",
        deliveryProgress: 100,
        transitStep: "Arrived at destination mailbox",
        createdAt: new Date().toISOString(),
        isIncoming: true
      };
      setLetters(prev => [replyLetter, ...prev]);
    }, 25000);
  };

  const filteredPenpals = GLOBAL_PENPALS.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q) || p.interests.some(i => i.toLowerCase().includes(q));
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-3xl overflow-hidden border border-white/10 shadow-2xl select-none font-sans">
      
      {/* Penpal Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-indigo-950/60 to-slate-900/60 px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Mail className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>GPKOS Global Penpal System</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">笔友网络 v2.0</span>
            </h2>
            <p className="text-xs text-slate-400">Establish cross-continental, secure snail-mail and holographic letter conduits.</p>
          </div>
        </div>

        {/* Tab Navigation buttons */}
        <div className="flex bg-black/40 border border-white/10 p-0.5 rounded-xl shrink-0">
          <button 
            onClick={() => { setActiveTab("directory"); setActiveLetter(null); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'directory' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Globe className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" /> 笔友广场 (Square)
          </button>
          <button 
            onClick={() => { setActiveTab("inbox"); setActiveLetter(null); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all relative ${activeTab === 'inbox' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Mail className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" /> 信箱 (Inbox)
            {letters.filter(l => l.isIncoming && l.status === "delivered").length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {letters.filter(l => l.isIncoming && l.status === "delivered").length}
              </span>
            )}
          </button>
          <button 
            onClick={() => { setActiveTab("transit"); setActiveLetter(null); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'transit' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Compass className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" /> 飞鸽寄送 (Transit)
            {letters.filter(l => l.status === "in-transit").length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-bold text-[9px] animate-pulse">
                {letters.filter(l => l.status === "in-transit").length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Container Area */}
      <div className="flex-1 overflow-hidden flex">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Penpal Directory */}
          {activeTab === "directory" && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 flex flex-col md:flex-row overflow-hidden"
            >
              {/* Left Column: List and Search */}
              <div className="w-full md:w-[450px] border-r border-white/5 flex flex-col shrink-0 overflow-hidden">
                <div className="p-4 border-b border-white/5">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="搜索全球笔友 (兴趣, 语言, 国家)..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar text-left">
                  {filteredPenpals.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPenpal(p)}
                      className={`w-full p-3 rounded-2xl border text-left flex gap-3 transition-all ${selectedPenpal?.id === p.id ? 'bg-purple-950/20 border-purple-500/40' : 'bg-slate-900/40 border-white/5 hover:bg-slate-900/80 hover:border-white/10'}`}
                    >
                      <img src={p.avatar} alt="avatar" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10" />
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white truncate">{p.name}</span>
                          <span className="text-xs">{p.flag}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3 text-purple-400" /> {p.country}
                        </p>
                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{p.bio}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Profile Detail view */}
              <div className="flex-grow bg-slate-950/40 p-6 overflow-y-auto flex items-center justify-center">
                {selectedPenpal ? (
                  <div className="max-w-md w-full bg-slate-900/80 border border-white/10 rounded-3xl p-6 text-left shadow-2xl space-y-5 animate-fade-in">
                    <div className="flex items-center gap-4">
                      <img src={selectedPenpal.avatar} alt="avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30" />
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>{selectedPenpal.name}</span>
                          <span className="text-xs">{selectedPenpal.flag}</span>
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" /> {selectedPenpal.country}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`w-2 h-2 rounded-full ${selectedPenpal.activeStatus === 'online' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                          <span className="text-[10px] text-slate-400 font-mono capitalize">Active Node Status: {selectedPenpal.activeStatus}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] font-black uppercase text-purple-400 tracking-wider">Self Introduction</span>
                        <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">{selectedPenpal.bio}</p>
                      </div>

                      <div>
                        <span className="text-[9px] font-black uppercase text-purple-400 tracking-wider">Shared Hobbies & Interests</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {selectedPenpal.interests.map((int, idx) => (
                            <span key={idx} className="bg-purple-950/40 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                              #{int}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setWriteForm(prev => ({ ...prev, recipientId: selectedPenpal.id }));
                        setActiveTab("write");
                      }}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" /> 向 {selectedPenpal.name.split(" ")[0]} 寄出第一封信
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 max-w-sm">
                    <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-spin" style={{ animationDuration: '20s' }} />
                    <h4 className="font-bold text-slate-200 text-sm mb-1">Pick a Penpal to Begin</h4>
                    <p className="text-xs">Explore random penpal cards, read their profiles, and send vintage or holographic letters globally.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: Inbox & Mail Reading */}
          {activeTab === "inbox" && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 flex overflow-hidden text-left"
            >
              {/* Inbox list on left */}
              <div className="w-80 border-r border-white/5 flex flex-col overflow-y-auto shrink-0 p-4 space-y-3 custom-scrollbar bg-slate-900/10">
                <span className="text-[10px] uppercase tracking-wider font-black text-slate-400">Archived Correspondence</span>
                {letters.filter(l => l.status === "delivered").length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">信箱空空如也。</div>
                ) : (
                  letters.filter(l => l.status === "delivered").map(l => (
                    <button
                      key={l.id}
                      onClick={() => setActiveLetter(l)}
                      className={`w-full p-3 rounded-xl border text-left flex gap-3 transition-all ${activeLetter?.id === l.id ? 'bg-purple-950/20 border-purple-500/40' : 'bg-slate-900/40 border-white/5 hover:bg-slate-900/80'}`}
                    >
                      <img src={l.senderAvatar} alt="avatar" className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10" />
                      <div className="min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white truncate">{l.isIncoming ? l.senderName.split(" ")[0] : `To: ${l.recipientName.split(" ")[0]}`}</span>
                          <span className="text-[8px] text-slate-500 font-mono">{new Date(l.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{l.content}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Read area on right */}
              <div className="flex-grow p-6 overflow-y-auto bg-slate-950/20 flex flex-col justify-between">
                {activeLetter ? (
                  <div className="max-w-xl w-full mx-auto flex-grow flex flex-col space-y-4">
                    {/* Retro / cyber paper preview */}
                    <div className={`p-8 rounded-3xl border shadow-2xl relative flex-grow text-slate-900 ${
                      activeLetter.paperStyle === 'vintage' ? 'bg-[#f4efe2] border-[#dfd2be] text-amber-950 font-serif' :
                      activeLetter.paperStyle === 'cyber' ? 'bg-[#0b0f19] border-cyan-500/40 text-cyan-200 font-mono' :
                      activeLetter.paperStyle === 'royal' ? 'bg-[#fbf7f4] border-[#dfbc87] text-slate-800 font-serif' :
                      'bg-white border-slate-200 text-slate-800'
                    }`}>
                      {/* Stamp watermark overlay */}
                      <div className="absolute top-4 right-4 text-center select-none rotate-6 opacity-80">
                        {activeLetter.stampType === 'pigeon' && <div className="border-2 border-dashed border-red-800 text-red-800 font-black px-2 py-1 text-[9px] rounded-md uppercase font-mono tracking-widest">🕊️ AirMail 12c</div>}
                        {activeLetter.stampType === 'dragon' && <div className="border-2 border-dashed border-red-800 text-red-800 font-black px-2 py-1 text-[9px] rounded-md uppercase font-mono tracking-widest">🐲 Dragon Core</div>}
                        {activeLetter.stampType === 'relay' && <div className="border-2 border-dashed border-cyan-500 text-cyan-400 font-black px-2 py-1 text-[9px] rounded-md uppercase font-mono tracking-widest">📡 TLS Node</div>}
                        {activeLetter.stampType === 'space' && <div className="border-2 border-dashed border-fuchsia-500 text-fuchsia-400 font-black px-2 py-1 text-[9px] rounded-md uppercase font-mono tracking-widest">🚀 Orbital-S</div>}
                      </div>

                      <div className="mb-6 flex justify-between items-center border-b border-black/5 pb-4">
                        <div className="flex items-center gap-2">
                          <img src={activeLetter.senderAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">From</span>
                            <span className="font-bold text-xs">{activeLetter.senderName}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Timestamp</span>
                          <span className="text-[10px] font-mono">{new Date(activeLetter.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed whitespace-pre-wrap text-left min-h-[220px]">
                        {activeLetter.content}
                      </p>
                    </div>

                    {activeLetter.isIncoming && (
                      <button 
                        onClick={() => {
                          const pen = GLOBAL_PENPALS.find(p => p.name === activeLetter.senderName);
                          if (pen) {
                            setWriteForm({
                              recipientId: pen.id,
                              content: `Dear ${pen.name.split(" ")[0]},\n\n`,
                              paperStyle: activeLetter.paperStyle,
                              stampType: activeLetter.stampType
                            });
                            setActiveTab("write");
                          }
                        }}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> 立即提笔回信 (Reply)
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-24 max-w-sm mx-auto">
                    <Mail className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-200 text-xs mb-1">Correspondence Viewer</h4>
                    <p className="text-xs">Select any delivered or archived letter from the left column to read its contents.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: Writing letter */}
          {activeTab === "write" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 p-6 overflow-y-auto text-left"
            >
              <form onSubmit={handleSendLetter} className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Writing inputs (col-span-2) */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl space-y-4">
                    <h3 className="font-bold text-sm text-white border-b border-white/5 pb-2">Draft Letter Parchment</h3>
                    
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Recipient Penpal *</label>
                      <select
                        required
                        value={writeForm.recipientId}
                        onChange={e => setWriteForm(prev => ({ ...prev, recipientId: e.target.value }))}
                        className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value="">-- 选择全球笔友 --</option>
                        {GLOBAL_PENPALS.map(p => (
                          <option key={p.id} value={p.id}>{p.flag} {p.name} ({p.country})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Parchment Content *</label>
                      <textarea
                        required
                        rows={10}
                        placeholder="在此处写下对远方好友说的心里话，诉说您的极客生活或向对方分享您所在的城市故事..."
                        value={writeForm.content}
                        onChange={e => setWriteForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-purple-500 font-mono resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Aesthetic properties (1 column) */}
                <div className="space-y-4 text-left">
                  <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl space-y-4">
                    <h3 className="font-bold text-sm text-white border-b border-white/5 pb-2">Stationary Styles</h3>
                    
                    <div>
                      <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Paper Background</span>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-center">
                        <button 
                          type="button"
                          onClick={() => setWriteForm(prev => ({ ...prev, paperStyle: 'vintage' }))}
                          className={`p-2 rounded-lg border transition ${writeForm.paperStyle === 'vintage' ? 'bg-[#f4efe2] border-[#dfd2be] text-amber-950 shadow' : 'border-white/10 text-slate-400'}`}
                        >
                          📜 羊皮复古
                        </button>
                        <button 
                          type="button"
                          onClick={() => setWriteForm(prev => ({ ...prev, paperStyle: 'cyber' }))}
                          className={`p-2 rounded-lg border transition ${writeForm.paperStyle === 'cyber' ? 'bg-[#0b0f19] border-cyan-500/40 text-cyan-300 shadow' : 'border-white/10 text-slate-400'}`}
                        >
                          🌐 蓝光赛博
                        </button>
                        <button 
                          type="button"
                          onClick={() => setWriteForm(prev => ({ ...prev, paperStyle: 'royal' }))}
                          className={`p-2 rounded-lg border transition ${writeForm.paperStyle === 'royal' ? 'bg-[#fbf7f4] border-[#dfbc87] text-amber-900 shadow' : 'border-white/10 text-slate-400'}`}
                        >
                          👑 皇家画卷
                        </button>
                        <button 
                          type="button"
                          onClick={() => setWriteForm(prev => ({ ...prev, paperStyle: 'plain' }))}
                          className={`p-2 rounded-lg border transition ${writeForm.paperStyle === 'plain' ? 'bg-white border-slate-300 text-slate-800 shadow' : 'border-white/10 text-slate-400'}`}
                        >
                          📄 简约素雅
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Postal Stamps</span>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-center">
                        <button 
                          type="button"
                          onClick={() => setWriteForm(prev => ({ ...prev, stampType: 'pigeon' }))}
                          className={`p-2 rounded-lg border transition ${writeForm.stampType === 'pigeon' ? 'bg-purple-900/40 border-purple-500/50 text-purple-200' : 'border-white/10 text-slate-400'}`}
                        >
                          🕊️ 飞鸽传送
                        </button>
                        <button 
                          type="button"
                          onClick={() => setWriteForm(prev => ({ ...prev, stampType: 'dragon' }))}
                          className={`p-2 rounded-lg border transition ${writeForm.stampType === 'dragon' ? 'bg-red-950/40 border-red-500/50 text-red-200' : 'border-white/10 text-slate-400'}`}
                        >
                          🐲 神龙徽章
                        </button>
                        <button 
                          type="button"
                          onClick={() => setWriteForm(prev => ({ ...prev, stampType: 'relay' }))}
                          className={`p-2 rounded-lg border transition ${writeForm.stampType === 'relay' ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200' : 'border-white/10 text-slate-400'}`}
                        >
                          📡 分布式中继
                        </button>
                        <button 
                          type="button"
                          onClick={() => setWriteForm(prev => ({ ...prev, stampType: 'space' }))}
                          className={`p-2 rounded-lg border transition ${writeForm.stampType === 'space' ? 'bg-fuchsia-950/40 border-fuchsia-500/50 text-fuchsia-200' : 'border-white/10 text-slate-400'}`}
                        >
                          🚀 太空信使
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black uppercase transition-all shadow-lg shadow-purple-500/10"
                    >
                      立刻投递寄出
                    </button>
                  </div>
                </div>

              </form>
            </motion.div>
          )}

          {/* TAB 4: Transit tracking */}
          {activeTab === "transit" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 p-6 overflow-y-auto text-left"
            >
              <div className="max-w-2xl mx-auto space-y-6">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-purple-400 animate-spin" /> In-Transit Cargo Tracking (实时寄送状态)
                </h3>

                {letters.filter(l => l.status === "in-transit").length === 0 ? (
                  <div className="text-center py-12 bg-slate-900/40 border border-white/5 rounded-2xl p-6">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <h4 className="font-bold text-white text-xs">All Letters Safely Delivered</h4>
                    <p className="text-xs text-slate-400 mt-1">There are currently no active pigeon or space routes in progress. Explore square to write a letter!</p>
                  </div>
                ) : (
                  letters.filter(l => l.status === "in-transit").map(l => (
                    <div key={l.id} className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={l.senderAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Routing Letter To</span>
                            <strong className="text-xs text-white">{l.recipientName}</strong>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 font-bold block uppercase">Stamp</span>
                          <span className="text-[11px] font-mono capitalize">{l.stampType} stamp</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono mb-1.5">
                          <span className="text-slate-400 font-medium">Progress</span>
                          <span className="text-purple-400 font-bold">{l.deliveryProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-white/5">
                          <div 
                            className="bg-purple-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                            style={{ width: `${l.deliveryProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Step description */}
                      <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-3 rounded-xl text-xs font-mono">
                        <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="text-slate-300">{l.transitStep}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
