import React, { useState } from "react";
import { Zap, MessageSquare, FileText, Terminal, Settings, Plus, FilePlus, ChevronRight, Check, Trash2, ArrowRight, UserPlus, Users, Sparkles, MonitorSmartphone, Maximize, ShieldAlert } from "lucide-react";
import { t, Language } from "../i18n";
import { SubPage, SystemState, User, PageBrowserCheck } from "../types";

export function ToolGeminiAI({ lang, currentUser, systemState }: { lang: Language, currentUser: User | null, systemState: SystemState }) {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const isAuthorized = currentUser?.role === 'admin' || (currentUser && systemState.aiAuthorizedUsers?.includes(currentUser.emailUsername));

  const handleSend = async () => {
    if (!prompt.trim()) return;
    const newHistory = [...history, { role: 'user' as const, text: prompt }];
    setHistory(newHistory);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.reply) {
        setHistory([...newHistory, { role: 'ai', text: data.reply }]);
      } else {
        setHistory([...newHistory, { role: 'ai', text: `Error: ${data.error || 'Failed to fetch response'}` }]);
      }
    } catch (err: any) {
      setHistory([...newHistory, { role: 'ai', text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="bg-slate-900/60 border border-red-500/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
        <Sparkles className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">{lang === 'en' ? 'Unauthorized Access' : '未授权访问'}</h2>
        <p className="text-slate-400">{lang === 'en' ? 'You have not been granted access to the direct Gemini AI capabilities.' : '您尚未被授予直接使用 Gemini AI 的权限。'}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-3xl shadow-xl flex flex-col h-[700px] overflow-hidden">
      <div className="flex items-center gap-3 border-b border-white/10 p-6 bg-slate-900/80 shrink-0">
        <div className="bg-fuchsia-500/20 p-2 rounded-xl border border-fuchsia-500/30">
          <Sparkles className="h-6 w-6 text-fuchsia-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{lang === 'en' ? 'Gemini General AI' : 'Gemini 综合AI'}</h2>
          <p className="text-xs text-slate-400">{lang === 'en' ? 'Ask anything. Direct model access.' : '可以询问任何问题，无需局限网站内容。'}</p>
        </div>
      </div>
      
      <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
        {history.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm">
             {lang === 'en' ? 'Start a conversation with Gemini AI.' : '开始与 Gemini AI 对话。'}
          </div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-fuchsia-600 text-white rounded-tr-sm' 
                : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-sm'
            }`}>
              {msg.text.split('\n').map((line, j) => <p key={j} className="mb-1 last:mb-0">{line}</p>)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 border border-white/5 p-4 rounded-2xl rounded-tl-sm text-sm p-4 animate-pulse">
              thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-white/10 shrink-0">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={lang === 'en' ? 'Send a message...' : '发送消息...'}
            className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-4 pr-16 text-white text-sm focus:border-fuchsia-500 outline-none resize-none max-h-32"
            rows={2}
          ></textarea>
          <button 
            disabled={loading || !prompt.trim()}
            onClick={handleSend}
            className="absolute right-3 bottom-3 bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-50 text-white p-1.5 rounded-lg transition"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToolTranslator({ lang }: { lang: Language }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleTranslate = () => {
    // Simulated AI response
    setOutput(input ? `[Simulated Translation] \n${input}` : "");
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="bg-cyan-500/20 p-2 rounded-xl border border-cyan-500/30">
          <MessageSquare className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{lang === 'en' ? 'AI Auto-Translator' : 'AI 智能翻译'}</h2>
          <p className="text-xs text-slate-400">{lang === 'en' ? 'Powered by advanced neural processing' : '基于高级神经网络算力处理'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === 'en' ? 'Enter text to translate...' : '输入要翻译的文本...'}
          className="w-full h-64 bg-slate-950 border border-white/5 rounded-xl p-4 text-white text-sm focus:border-cyan-500 outline-none resize-none placeholder:text-slate-600"
        ></textarea>
        <div className="relative">
          <textarea
            readOnly
            value={output}
            placeholder={lang === 'en' ? 'Translation output...' : '翻译输出...'}
            className="w-full h-64 bg-slate-950 border border-white/5 rounded-xl p-4 text-cyan-300 text-sm outline-none resize-none placeholder:text-slate-600"
          ></textarea>
          {output && (
            <button className="absolute bottom-4 right-4 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
              {lang === 'en' ? 'Copy Text' : '复制文本'}
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={handleTranslate} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition flex items-center gap-2">
          <Zap className="h-4 w-4" />
          {lang === 'en' ? 'Execute Translation' : '执行翻译'}
        </button>
      </div>
    </div>
  );
}

export function ToolSummarizer({ lang }: { lang: Language }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleSummarize = () => {
    setOutput(input ? `[Simulated Summary] The provided text is ${input.length} characters long and contains important information regarding main bullet points.` : "");
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
          <FileText className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{lang === 'en' ? 'Content Summarizer' : '内容提炼总结'}</h2>
          <p className="text-xs text-slate-400">{lang === 'en' ? 'Extract key points from long articles instantly' : '瞬间从长文章中提取关键焦点'}</p>
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={lang === 'en' ? 'Paste the long text here...' : '在此处粘贴长文本...'}
        className="w-full h-48 bg-slate-950 border border-white/5 rounded-xl p-4 text-white text-sm focus:border-indigo-500 outline-none resize-none placeholder:text-slate-600"
      ></textarea>
      
      <div className="flex justify-between items-center bg-slate-950 border border-white/5 p-4 rounded-xl">
        <span className="text-xs text-slate-400">{input.length} {lang === 'en' ? 'Characters parsed' : '字数已解析'}</span>
        <button onClick={handleSummarize} className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition flex items-center gap-2">
          <Zap className="h-4 w-4" />
          {lang === 'en' ? 'Generate Summary' : '生成摘要'}
        </button>
      </div>

      {output && (
        <div className="bg-slate-800/80 border border-indigo-500/20 p-5 rounded-xl">
          <h3 className="text-sm font-bold text-indigo-300 mb-2">{lang === 'en' ? 'AI Summary Result' : 'AI 摘要结果'}</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{output}</p>
        </div>
      )}
    </div>
  );
}

export function ToolCode({ lang }: { lang: Language }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleFormat = () => {
    setOutput(input ? `// Simulated formatting output\n${input}` : "");
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
       <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/30">
          <Terminal className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{lang === 'en' ? 'Code Beautifier' : '智能代码格式化'}</h2>
          <p className="text-xs text-slate-400">{lang === 'en' ? 'Clean and structure dirty snippets' : '清理和结构化混乱的代码片段'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === 'en' ? 'Paste raw code here...' : '在此处粘贴原始代码...'}
          className="w-full h-64 bg-slate-950 border border-emerald-500/20 font-mono rounded-xl p-4 text-emerald-300 text-sm outline-none resize-none placeholder:text-emerald-700/50"
        ></textarea>
        <textarea
          readOnly
          value={output}
          placeholder={lang === 'en' ? 'Clean code will appear here...' : '干净代码将出现在这里...'}
          className="w-full h-64 bg-slate-950 border border-slate-700/50 font-mono rounded-xl p-4 text-white text-sm outline-none resize-none placeholder:text-slate-600 focus:border-amber-500"
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button onClick={handleFormat} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition flex items-center gap-2">
          <Zap className="h-4 w-4" />
          {lang === 'en' ? 'Beautify Code' : '美化代码'}
        </button>
      </div>
    </div>
  );
}

export function AdminSubpages({ lang, systemState, setSystemState }: { lang: Language, systemState: SystemState, setSystemState: React.Dispatch<React.SetStateAction<SystemState>> }) {
  const navPages = systemState.navPages || [];
  
  const handleCreate = () => {
    const newPage: SubPage = {
      id: Math.random().toString(36).substring(2, 9),
      titleEn: "New Subpage",
      titleZh: "新分支页",
      contentEn: "Welcome to the new AI generated page.",
      contentZh: "欢迎来到新的AI生成页面。",
      isExternal: false,
      isVisible: true,
      order: navPages.length,
    };
    const updated = [...navPages, newPage];
    setSystemState({ ...systemState, navPages: updated });
    fetch("/api/admin/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ navPages: updated })
    }).catch(console.error);
  };

  const handleDelete = (id: string) => {
    const updated = navPages.filter(p => p.id !== id);
    setSystemState({ ...systemState, navPages: updated });
    fetch("/api/admin/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ navPages: updated })
    }).catch(console.error);
  };

  const updatePage = (id: string, key: keyof SubPage, value: any) => {
    const updated = navPages.map(p => p.id === id ? { ...p, [key]: value } : p);
    setSystemState({
      ...systemState,
      navPages: updated
    });
    fetch("/api/admin/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ navPages: updated })
    }).catch(console.error);
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500/20 p-2 rounded-xl border border-rose-500/30">
            <Settings className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{lang === 'en' ? 'AI Branch Pages Admin' : 'AI 分支页面管理'}</h2>
            <p className="text-xs text-slate-400">{lang === 'en' ? 'Manage AI generated menus and external links' : '管理AI生成的菜单和外部链接'}</p>
          </div>
        </div>
        <button onClick={handleCreate} className="bg-rose-500 hover:bg-rose-400 text-slate-950 px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 text-xs shadow-lg shadow-rose-500/20">
          <Plus className="w-4 h-4" /> {lang === 'en' ? 'Create Page' : '创建页面'}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {navPages.map(page => (
          <div key={page.id} className="bg-slate-950 border border-white/5 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
               <span className="text-white font-bold inline-flex items-center gap-2">
                 {page.isExternal ? <ArrowRight className="w-4 h-4 text-cyan-400"/> : <FilePlus className="w-4 h-4 text-fuchsia-400"/>}
                 ID: {page.id}
               </span>
               <button onClick={() => handleDelete(page.id)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition">
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1 block">Title (EN)</label>
                <input type="text" value={page.titleEn} onChange={e => updatePage(page.id, 'titleEn', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-rose-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1 block">Title (ZH)</label>
                <input type="text" value={page.titleZh} onChange={e => updatePage(page.id, 'titleZh', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-rose-500 outline-none" />
              </div>
            </div>

            <div className="flex items-center gap-6 py-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
                <input type="checkbox" checked={page.isVisible} onChange={e => updatePage(page.id, 'isVisible', e.target.checked)} className="accent-rose-500 w-4 h-4" />
                {lang === 'en' ? 'Show in Top Nav' : '在顶部导航显示'}
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
                <input type="checkbox" checked={page.isExternal} onChange={e => updatePage(page.id, 'isExternal', e.target.checked)} className="accent-rose-500 w-4 h-4" />
                {lang === 'en' ? 'Is External Link' : '是外部链接'}
              </label>
            </div>

            {page.isExternal ? (
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1 block">External URL</label>
                <input type="text" value={page.externalLink || ''} onChange={e => updatePage(page.id, 'externalLink', e.target.value)} placeholder="https://..." className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-cyan-300 focus:border-rose-500 outline-none" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1 block">Content (EN)</label>
                  <textarea value={page.contentEn} onChange={e => updatePage(page.id, 'contentEn', e.target.value)} className="w-full h-32 bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-rose-500 outline-none resize-none"></textarea>
                </div>
                 <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1 block">Content (ZH)</label>
                  <textarea value={page.contentZh} onChange={e => updatePage(page.id, 'contentZh', e.target.value)} className="w-full h-32 bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-rose-500 outline-none resize-none"></textarea>
                </div>
              </div>
            )}
          </div>
        ))}

        {navPages.length === 0 && (
           <div className="text-center py-10 text-slate-500 text-sm">
             {lang === 'en' ? 'No custom branch pages created yet.' : '尚未创建任何自定义分支页面。'}
           </div>
        )}
      </div>
    </div>
  );
}

export function AdminAIAccess({ lang, systemState, setSystemState }: { lang: Language, systemState: SystemState, setSystemState: React.Dispatch<React.SetStateAction<SystemState>> }) {
  const [newUserEmail, setNewUserEmail] = useState("");

  const authorizedUsers = systemState.aiAuthorizedUsers || [];

  const handleAdd = () => {
    if (!newUserEmail.trim()) return;
    if (authorizedUsers.includes(newUserEmail.trim())) return;
    
    const updated = [...authorizedUsers, newUserEmail.trim()];
    setSystemState({
      ...systemState,
      aiAuthorizedUsers: updated
    });
    fetch("/api/admin/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aiAuthorizedUsers: updated })
    }).catch(console.error);
    setNewUserEmail("");
  };

  const handleRemove = (email: string) => {
    const updated = authorizedUsers.filter(e => e !== email);
    setSystemState({
      ...systemState,
      aiAuthorizedUsers: updated
    });
    fetch("/api/admin/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aiAuthorizedUsers: updated })
    }).catch(console.error);
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-6 mt-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="bg-fuchsia-500/20 p-2 rounded-xl border border-fuchsia-500/30">
          <Users className="h-6 w-6 text-fuchsia-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{lang === 'en' ? 'AI Access Admin' : 'AI 访问权限管理'}</h2>
          <p className="text-xs text-slate-400">{lang === 'en' ? 'Grant users access to the direct Gemini AI tool' : '授予用户直接使用 Gemini AI 的权限'}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="email" 
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder={lang === 'en' ? 'User Email to authorize...' : '授权的用户邮箱...'}
          className="flex-grow bg-slate-950 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:border-fuchsia-500 outline-none"
        />
        <button 
          onClick={handleAdd}
          className="bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 px-4 py-2.5 rounded-lg font-bold transition flex items-center gap-2 text-sm"
        >
          <UserPlus className="w-4 h-4" /> {lang === 'en' ? 'Authorize' : '授权'}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {authorizedUsers.map(email => (
          <div key={email} className="bg-slate-950 border border-white/5 rounded-xl py-3 px-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">{email}</span>
            <button onClick={() => handleRemove(email)} className="text-red-400 hover:text-red-300 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {authorizedUsers.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-sm">
            {lang === 'en' ? 'No users explicitly authorized yet. Admins always have access.' : '尚未明确授权任何普通用户。管理员始终拥有权限。'}
          </div>
        )}
      </div>
    </div>
  );
}

export function DynamicSubPage({ page, lang }: { page: SubPage, lang: Language }) {
  if (page.isExternal) return null; // shouldn't render here

  return (
    <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">
          {lang === 'en' ? page.titleEn : page.titleZh}
        </h1>
      </div>
      <div className="prose prose-invert max-w-none text-slate-300 leading-loose">
        {(lang === 'en' ? page.contentEn : page.contentZh).split('\n').map((para, i) => (
          <p key={i} className="mb-4">{para}</p>
        ))}
      </div>
    </div>
  );
}

export function AdminBrowserChecks({ lang, systemState, setSystemState }: { lang: Language, systemState: SystemState, setSystemState: React.Dispatch<React.SetStateAction<SystemState>> }) {
  const checks = systemState.pageBrowserChecks || [];
  
  const handleAdd = () => {
    const newCheck: PageBrowserCheck = {
      id: Math.random().toString(36).substring(2, 9),
      pageId: "#nav-" + Math.random().toString(36).substring(2, 6),
      requireFullscreen: true,
      minWidth: 0,
      minHeight: 0,
      notMetAction: "warning",
      actionMessage: "严重警告：为确保工作区交互完整，请立刻开启浏览器全屏模式 (F11)。",
      redirectUrl: ""
    };
    handleUpdate([...checks, newCheck]);
  };

  const handleUpdate = async (newChecks: PageBrowserCheck[]) => {
    try {
      const res = await fetch("/api/admin/save-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageBrowserChecks: newChecks })
      });
      if (res.ok) {
        setSystemState(prev => ({ ...prev, pageBrowserChecks: newChecks }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = (id: string) => {
    if (confirm("Are you sure?")) {
      handleUpdate(checks.filter(c => c.id !== id));
    }
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 mt-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <MonitorSmartphone className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            页面合规性与浏览器探针管理 (Admin)
          </h2>
        </div>
        <button onClick={handleAdd} className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1 transition">
          <Plus className="w-4 h-4" /> 新增规则
        </button>
      </div>
      <p className="text-xs text-slate-400">配置页面级浏览器验证探针。强制终端访客达到指定分辨率或进入『全屏模式』方可交互，否则进行告警、拦截或强制跳转处理。</p>
      
      <div className="space-y-4">
        {checks.map(c => (
          <div key={c.id} className="bg-slate-950/50 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
             <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-cyan-300 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> 拦截策略作用域: {c.pageId}</div>
                <button onClick={() => handleRemove(c.id)} className="text-red-400 hover:text-red-300 transition p-1"><Trash2 className="w-4 h-4" /></button>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                 <div>
                    <label className="block text-slate-500 mb-1">拦截触发点 (Hash URL)</label>
                    <input type="text" value={c.pageId} onChange={(e) => {
                       const updated = checks.map(x => x.id === c.id ? { ...x, pageId: e.target.value } : x);
                       setSystemState(prev => ({ ...prev, pageBrowserChecks: updated }));
                    }} onBlur={() => handleUpdate(checks)} className="w-full bg-slate-900 border border-white/10 px-2 py-1.5 rounded outline-none focus:border-cyan-500" placeholder="#msfs 或 #admin" />
                 </div>
                 <div className="flex items-end pb-1.5">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition">
                      <input type="checkbox" checked={c.requireFullscreen} onChange={(e) => {
                         const updated = checks.map(x => x.id === c.id ? { ...x, requireFullscreen: e.target.checked } : x);
                         handleUpdate(updated);
                      }} className="w-4 h-4 rounded bg-slate-900 border border-white/10" />
                      强制检查是否为『全屏』
                    </label>
                 </div>
                 <div>
                    <label className="block text-slate-500 mb-1">最低屏幕宽度 (px)</label>
                    <input type="number" value={c.minWidth} onChange={(e) => {
                       const updated = checks.map(x => x.id === c.id ? { ...x, minWidth: Number(e.target.value) } : x);
                       setSystemState(prev => ({ ...prev, pageBrowserChecks: updated }));
                    }} onBlur={() => handleUpdate(checks)} className="w-full bg-slate-900 border border-white/10 px-2 py-1.5 rounded outline-none focus:border-cyan-500" />
                 </div>
                 <div>
                    <label className="block text-slate-500 mb-1">最低屏幕高度 (px)</label>
                    <input type="number" value={c.minHeight} onChange={(e) => {
                       const updated = checks.map(x => x.id === c.id ? { ...x, minHeight: Number(e.target.value) } : x);
                       setSystemState(prev => ({ ...prev, pageBrowserChecks: updated }));
                    }} onBlur={() => handleUpdate(checks)} className="w-full bg-slate-900 border border-white/10 px-2 py-1.5 rounded outline-none focus:border-cyan-500" />
                 </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-2 p-3 bg-slate-900/50 rounded-lg">
                 <div>
                    <label className="block text-slate-500 mb-1">探测未达标响应行为</label>
                    <select value={c.notMetAction} onChange={e => {
                       const updated = checks.map(x => x.id === c.id ? { ...x, notMetAction: e.target.value as any } : x);
                       handleUpdate(updated);
                    }} className="w-full bg-slate-900 border border-white/10 px-2 py-1.5 rounded text-white outline-none focus:border-cyan-500">
                      <option value="warning">非强制警告 (Warning banner)</option>
                      <option value="block_with_message">强制拦截并锁死屏幕 (Block)</option>
                      <option value="redirect">强制降级/驱逐跳出 (Redirect)</option>
                    </select>
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-slate-500 mb-1">{c.notMetAction === 'redirect' ? '降级跳出 URL / Hash 目标' : '合规拦截通知文案'}</label>
                    <input type="text" value={c.notMetAction === 'redirect' ? c.redirectUrl : c.actionMessage} onChange={(e) => {
                       const val = e.target.value;
                       const updated = checks.map(x => x.id === c.id ? { ...x, [c.notMetAction === 'redirect' ? 'redirectUrl' : 'actionMessage']: val } : x);
                       setSystemState(prev => ({ ...prev, pageBrowserChecks: updated }));
                    }} onBlur={() => handleUpdate(checks)} className="w-full bg-slate-900 border border-white/10 px-2 py-1.5 rounded outline-none focus:border-cyan-500 text-amber-200" />
                 </div>
             </div>
          </div>
        ))}
        {checks.length === 0 && <div className="text-center text-slate-500 py-6 text-sm bg-slate-900/40 rounded-xl border border-white/5 border-dashed">当前未激活任何客户端合规探针，页面全局呈现不设限状态。</div>}
      </div>
    </div>
  );
}
