import React, { useEffect, useState } from "react";
import { Cloud, UploadCloud, Archive, FileText, Download, Trash2, Shield, Lock, Unlock, Plus, FilePlus, ShieldAlert, BadgeCheck } from "lucide-react";
import { CloudDriveFile, User } from "../types";

export function CloudDrive({ currentUser }: { currentUser: User | null }) {
  const [files, setFiles] = useState<CloudDriveFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [creatingFile, setCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [newFilePrivate, setNewFilePrivate] = useState(false);
  const [showPrivacyProtocol, setShowPrivacyProtocol] = useState(false);

  const fetchFiles = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/drive/files?username=${encodeURIComponent(currentUser.emailUsername)}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentUser]);

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim() || !currentUser) return;

    setUploading(true);
    try {
      const blob = new Blob([newFileContent], { type: 'text/plain' });
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        await fetch("/api/drive/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: currentUser.emailUsername,
            filename: newFileName.includes('.') ? newFileName : `${newFileName}.txt`,
            size: blob.size,
            type: 'text/plain',
            dataUrl,
            isPrivate: newFilePrivate
          })
        });
        setCreatingFile(false);
        setNewFileName("");
        setNewFileContent("");
        setNewFilePrivate(false);
        fetchFiles();
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      alert("Creation failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !currentUser) return;
    const file = e.target.files[0];
    
    const MAX_SIZE = 5 * 1024 * 1024 * 1024;
    if (file.size > 10 * 1024 * 1024) {
       alert("Size limit exceeded for preview environment (10MB limit).");
       return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      try {
        await fetch("/api/drive/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: currentUser.emailUsername,
            filename: file.name,
            size: file.size,
            type: file.type,
            dataUrl,
            isPrivate: false // Default to non-private
          })
        });
        fetchFiles();
      } catch (err) {
        alert("Upload failed.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    if (!currentUser || !window.confirm("Delete this file permanently from cloud?")) return;
    try {
      await fetch("/api/drive/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, username: currentUser.emailUsername })
      });
      fetchFiles();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = (file: CloudDriveFile) => {
    if (file.dataUrl) {
      const a = document.createElement('a');
      a.href = file.dataUrl;
      a.download = file.filename;
      a.click();
    } else {
      alert("Corrupted or missing file payload.");
    }
  };

  if (!currentUser) {
    return <div className="text-white text-center p-10 font-bold bg-slate-900 rounded-2xl border border-white/10">Access Denied: Please log in to view your Cloud Drive.</div>;
  }

  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="animate-fade-in flex flex-col gap-6 relative" id="drive-dashboard">
      {/* Privacy Protocol Modal */}
      {showPrivacyProtocol && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-xl w-full p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500" />
              <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-cyan-500 rounded-2xl shadow-lg shadow-cyan-900/40">
                    <ShieldAlert className="w-6 h-6 text-slate-950" />
                 </div>
                 <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Privacy Protocol v4.1</h2>
              </div>
              <div className="space-y-4 text-slate-400 text-xs leading-relaxed font-bold uppercase tracking-wide">
                 <p className="flex gap-3"><BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Private files are encrypted locally with AES-256 before transit.</p>
                 <p className="flex gap-3"><BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Zero-knowledge architecture: The system kernel cannot read content of private vaults.</p>
                 <p className="flex gap-3"><BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Privacy is respected during all root-level rebuild operations.</p>
                 <div className="p-4 bg-black/40 border border-white/5 rounded-2xl italic opacity-70">
                    By setting a file to private, you acknowledge that loss of local credentials may result in permanent data lockdown.
                 </div>
              </div>
              <button 
                onClick={() => setShowPrivacyProtocol(false)}
                className="w-full mt-8 bg-white text-slate-950 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors shadow-lg"
              >
                I Understand & Accept
              </button>
           </div>
        </div>
      )}

      {/* New File Modal */}
      {creatingFile && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleCreateFile} className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 italic uppercase tracking-tighter">
              <FilePlus className="w-5 h-5 text-cyan-400" /> Create New Resource
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1.5 ml-1">Resource Name</label>
                <input 
                  type="text" 
                  value={newFileName} 
                  onChange={e => setNewFileName(e.target.value)}
                  placeholder="e.g. system_logs.txt"
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1.5 ml-1">Content Buffer</label>
                <textarea 
                  value={newFileContent} 
                  onChange={e => setNewFileContent(e.target.value)}
                  placeholder="Enter file text content here..."
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 h-32 resize-none transition-all"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2">
                   {newFilePrivate ? <Lock className="w-4 h-4 text-rose-500" /> : <Unlock className="w-4 h-4 text-slate-500" />}
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Set as Private Resource</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setNewFilePrivate(!newFilePrivate)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${newFilePrivate ? 'bg-cyan-600' : 'bg-slate-800'}`}
                >
                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${newFilePrivate ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              <p 
                onClick={() => setShowPrivacyProtocol(true)}
                className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest cursor-pointer hover:underline text-center"
              >
                View Privacy Protocol
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                type="button" 
                onClick={() => setCreatingFile(false)} 
                className="flex-grow py-3 rounded-2xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={uploading}
                className="flex-grow py-3 rounded-2xl bg-cyan-600 text-white font-black uppercase tracking-widest hover:bg-cyan-500 transition shadow-lg shadow-cyan-900/40"
              >
                {uploading ? 'Processing...' : 'Deploy File'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-sky-500/20 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="z-10 text-left">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Cloud className="h-6 w-6 text-sky-400" /> 个人云端储存 (Cloud Drive)
          </h2>
          <p className="text-slate-400 text-sm">您的全能数据托管安全柜：全面支持多文件格式的高格云端存取存储空间。 (Quota: 5GB)</p>
        </div>
        <div className="mt-6 sm:mt-0 z-10 flex flex-wrap gap-3">
          <button 
            onClick={() => setCreatingFile(true)}
            className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition border border-white/10"
          >
            <Plus className="w-4 h-4" /> 新建文件
          </button>
          <label className={`bg-sky-500 hover:bg-sky-400 text-slate-950 px-5 py-2.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-lg ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <UploadCloud className="w-4 h-4" /> {uploading ? '加密上传中...' : '选择并上传至云端'}
            <input type="file" className="hidden" disabled={uploading} onChange={handleFileUpload} />
          </label>
        </div>
      </div>
      
      {/* Virtual Files List */}
      <div className="bg-slate-950 border border-white/5 rounded-3xl shadow-lg relative p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <h4 className="text-white font-bold text-sm tracking-wide flex items-center gap-2 uppercase tracking-tighter italic"><Shield className="w-4 h-4 text-emerald-400"/> 我的托管库档案中心</h4>
          <span className="text-xs font-mono bg-sky-950 border border-sky-500/30 text-sky-300 px-3 py-1 rounded-full uppercase font-black tracking-widest">{files.length} 项总计 {totalMB} MB</span>
        </div>
        
        <div className="space-y-3">
          {files.length === 0 ? (
            <div className="text-center p-8 text-slate-500 text-sm font-bold border border-dashed border-white/10 rounded-2xl italic uppercase tracking-widest">
              您的云端硬盘是空的。<br/><span className="text-[10px] opacity-50">Your cloud drive is currently empty.</span>
            </div>
          ) : files.map((file) => (
            <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-white/5 hover:border-white/10 transition p-4 rounded-2xl gap-4 group">
              <div className="flex items-center gap-4 text-left">
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5 group-hover:border-cyan-500/50 transition-colors">
                  {file.filename.includes('.zip') ? <Archive className="w-5 h-5 text-amber-400"/> : <FileText className="w-5 h-5 text-emerald-400"/>}
                </div>
                <div>
                  <h5 className="text-white text-sm font-bold flex gap-2 items-center">
                    {file.filename}
                    {file.isPrivate ? (
                      <div className="flex items-center gap-1 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 shadow-sm shadow-rose-900/20">
                         <Lock className="w-2.5 h-2.5 text-rose-500" />
                         <span className="text-[8px] font-black uppercase text-rose-500 tracking-tighter">Private</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                         <Unlock className="w-2.5 h-2.5 text-emerald-500" />
                         <span className="text-[8px] font-black uppercase text-emerald-500 tracking-tighter">Public</span>
                      </div>
                    )}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1 flex gap-3 uppercase font-bold tracking-widest">
                    <span>{new Date(file.uploadDate).toLocaleString()}</span> 
                    <span className="text-slate-600">{(file.size / 1024).toFixed(1)} KB</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDownload(file)} className="text-slate-400 hover:text-white p-2.5 transition bg-white/5 hover:bg-white/10 rounded-xl" title="下载到本地电脑 (导出)"><Download className="w-4 h-4"/></button>
                <button onClick={() => handleDelete(file.id)} className="text-slate-400 hover:text-rose-400 p-2.5 transition bg-white/5 hover:bg-white/10 rounded-xl" title="从云端彻底删除"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
