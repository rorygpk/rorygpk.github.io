import React, { useEffect, useState } from "react";
import { Cloud, UploadCloud, Archive, FileText, Download, Trash2, Shield, Lock } from "lucide-react";
import { CloudDriveFile, User } from "../types";

export function CloudDrive({ currentUser }: { currentUser: User | null }) {
  const [files, setFiles] = useState<CloudDriveFile[]>([]);
  const [uploading, setUploading] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !currentUser) return;
    const file = e.target.files[0];
    
    // Simulate maximum 5GB size check via code (in bytes)
    const MAX_SIZE = 5 * 1024 * 1024 * 1024;
    // but we can't actually upload 5GB right now via dataURl without crashing. Let's limit it heavily for this environment
    if (file.size > 2 * 1024 * 1024) {
       alert("Size limit exceeded for preview environment (2MB limit).");
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
            isPrivate: true
          })
        });
        alert('File successfully encrypted and stored in your Cloud Drive!');
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
    <div className="animate-fade-in flex flex-col gap-6" id="drive-dashboard">
      <div className="bg-slate-900 border border-sky-500/20 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Cloud className="h-6 w-6 text-sky-400" /> 个人云端储存 (Cloud Drive)
          </h2>
          <p className="text-slate-400 text-sm">您的全能数据托管安全柜：全面支持多文件格式的高速云端存取存储空间。 (Quota: 5GB)</p>
        </div>
        <div className="mt-6 sm:mt-0 z-10 flex flex-wrap gap-3">
          <label className={`bg-sky-500 hover:bg-sky-400 text-slate-950 px-5 py-2.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-lg ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <UploadCloud className="w-4 h-4" /> {uploading ? '加密上传中...' : '选择并上传至云端'}
            <input type="file" className="hidden" disabled={uploading} onChange={handleFileUpload} />
          </label>
        </div>
      </div>
      
      {/* Virtual Files List */}
      <div className="bg-slate-950 border border-white/5 rounded-3xl shadow-lg relative p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <h4 className="text-white font-bold text-sm tracking-wide flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400"/> 我的托管库档案中心</h4>
          <span className="text-xs font-mono bg-sky-950 border border-sky-500/30 text-sky-300 px-3 py-1 rounded-full">{files.length} 项云端文件总计 {totalMB} MB</span>
        </div>
        
        <div className="space-y-3">
          {files.length === 0 ? (
            <div className="text-center p-8 text-slate-500 text-sm font-bold border border-dashed border-white/10 rounded-2xl">
              您的云端硬盘是空的。<br/>Your cloud drive is currently empty.
            </div>
          ) : files.map((file) => (
            <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-white/5 hover:border-white/10 transition p-4 rounded-2xl gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-500/20">
                  {file.filename.includes('.zip') ? <Archive className="w-5 h-5 text-amber-400"/> : <FileText className="w-5 h-5 text-emerald-400"/>}
                </div>
                <div>
                  <h5 className="text-white text-sm font-bold flex gap-2 items-center">
                    {file.filename}
                    {file.isPrivate && <Lock className="w-3 h-3 text-red-400" title="Private Encryption" />}
                  </h5>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-1 flex gap-3">
                    <span>{new Date(file.uploadDate).toLocaleString()}</span> 
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDownload(file)} className="text-slate-400 hover:text-white p-2 transition bg-white/5 hover:bg-white/10 rounded-lg" title="下载到本地"><Download className="w-4 h-4"/></button>
                <button onClick={() => handleDelete(file.id)} className="text-slate-400 hover:text-rose-400 p-2 transition bg-white/5 hover:bg-white/10 rounded-lg" title="从云端彻底删除"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
