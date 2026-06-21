import React, { useState } from "react";
import { User, Lock, UploadCloud, Shield, CreditCard, FileText } from "lucide-react";

export const UserProfileApp = ({ currentUser, onUpdatePassword, onUploadAvatar }) => {
  const [activeTab, setActiveTab] = useState("public");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!currentUser) {
    return <div className="flex h-full items-center justify-center text-slate-400 bg-slate-900">Please login to view profile.</div>;
  }

  return (
    <div className="flex h-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl text-slate-200">
      {/* Sidebar */}
      <div className="w-48 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
        <div className="p-4 flex flex-col items-center gap-2 border-b border-white/5">
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-500 shadow-inner group relative cursor-pointer" onClick={() => onUploadAvatar()}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              <User className="w-8 h-8 text-slate-400" />
            )}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <UploadCloud className="w-4 h-4 text-white" />
              <span className="text-[9px] mt-1 font-bold">Replace</span>
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-sm tracking-wide">{currentUser.fullName || "User"}</div>
            <div className="text-[10px] text-cyan-400 font-mono">{currentUser.emailUsername}</div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">{currentUser.role}</div>
          </div>
        </div>
        <div className="flex flex-col p-2 gap-1 overflow-y-auto">
          <button onClick={() => setActiveTab("public")} className={`px-3 py-2 rounded text-xs font-bold text-left transition ${activeTab === 'public' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/5 text-slate-400'}`}>
            <User className="w-3.5 h-3.5 inline mr-1.5" /> Public Info
          </button>
          <button onClick={() => setActiveTab("private")} className={`px-3 py-2 rounded text-xs font-bold text-left transition ${activeTab === 'private' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'hover:bg-white/5 text-slate-400'}`}>
            <Lock className="w-3.5 h-3.5 inline mr-1.5" /> Private Vault
          </button>
          <button onClick={() => setActiveTab("security")} className={`px-3 py-2 rounded text-xs font-bold text-left transition ${activeTab === 'security' ? 'bg-rose-500/20 text-rose-400' : 'hover:bg-white/5 text-slate-400'}`}>
            <Shield className="w-3.5 h-3.5 inline mr-1.5" /> Security & Password
          </button>
          <button onClick={() => setActiveTab("billing")} className={`px-3 py-2 rounded text-xs font-bold text-left transition ${activeTab === 'billing' ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-white/5 text-slate-400'}`}>
            <CreditCard className="w-3.5 h-3.5 inline mr-1.5" /> Billing & Services
          </button>
          <button onClick={() => setActiveTab("orders")} className={`px-3 py-2 rounded text-xs font-bold text-left transition ${activeTab === 'orders' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-slate-400'}`}>
            <FileText className="w-3.5 h-3.5 inline mr-1.5" /> Marketplace Orders
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-slate-900 p-6 overflow-y-auto">
        {activeTab === "public" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold border-b border-white/10 pb-2 mb-4">Public Identity</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Display Name</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm" defaultValue={currentUser.fullName} />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Public Bio</label>
                <textarea className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm h-24" placeholder="Tell the world about yourself..."></textarea>
              </div>
              <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold transition">Save Public Profile</button>
            </div>
          </div>
        )}

        {activeTab === "private" && (
          <div className="space-y-4 flex flex-col items-center justify-center h-full animate-in fade-in duration-300">
             <Lock className="w-12 h-12 text-slate-700 mb-2" />
             <h3 className="text-lg font-bold text-slate-400">Encrypted Private Vault</h3>
             <p className="text-xs text-slate-500 text-center max-w-xs">Access sensitive documents, securely mount private cloud drives, and review private messaging keys.</p>
             <button className="mt-4 px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 rounded font-bold text-xs uppercase tracking-wider transition">Unlock Keystore</button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4 animate-in fade-in duration-300">
             <h2 className="text-xl font-bold border-b border-white/10 pb-2 mb-4 text-rose-400">Security & Password</h2>
             <div className="bg-rose-500/10 border border-rose-500/20 rounded p-4 mb-6">
                <h4 className="text-sm font-bold text-rose-400 mb-2 tracking-wide">Modifier Authorization Needed</h4>
                <div className="space-y-3 max-w-sm">
                  <input type="password" placeholder="Current Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-rose-900 rounded p-2 text-sm" />
                  <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-slate-950 border border-rose-900 rounded p-2 text-sm" />
                  <button onClick={() => onUpdatePassword && onUpdatePassword(password, newPassword)} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs p-2 rounded transition">Confirm Password Change</button>
                </div>
             </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold border-b border-white/10 pb-2 mb-4 text-amber-400">Billing & Capabilities</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-4 rounded border border-white/5">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Drive Storage Limit</div>
                <div className="text-2xl font-black text-white">{currentUser.driveCapacity || '15'} GB</div>
              </div>
              <div className="bg-slate-800 p-4 rounded border border-white/5">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Max Processes</div>
                <div className="text-2xl font-black text-white">{currentUser?.role === 'admin' ? "UNLIMITED" : "12"}</div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 border border-amber-500/50 text-amber-400 rounded text-xs font-bold hover:bg-amber-500/10 transition">Request Capacity Increase</button>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold border-b border-white/10 pb-2 mb-4 text-emerald-400">Marketplace Orders</h2>
            <div className="text-sm text-slate-400 bg-slate-800 p-4 rounded text-center border-dashed border border-slate-600">
                You have no active or historical marketplace transactions.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
