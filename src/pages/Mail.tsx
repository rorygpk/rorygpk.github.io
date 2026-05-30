import { useState, useEffect } from "react";
import { 
  Search, 
  Inbox, 
  Send, 
  FileEdit, 
  Archive, 
  Trash2, 
  AlertOctagon,
  MoreVertical,
  Reply,
  Forward,
  Star,
  Menu,
  ArrowLeft
} from "lucide-react";
import { cn } from "../lib/utils";

// Mock Data
const MOCK_EMAILS = [
  { id: 1, sender: "系统管理员 (System Admin)", subject: "域名迁移通知：数据已保留 (Domain Migration Notice)", preview: "请注意，系统域名迁移已顺利完成。您的用户ID已平滑连接新的后缀，历史记录保持完好。 (Please be informed that the system domain migration has completed successfully. Your user ID has been linked...)", date: "10:42 AM", unread: true },
  { id: 2, sender: "智能客服 (AI Support)", subject: "您的队列中有新的工单 (New support ticket)", preview: "一名用户已请求从人工客服接管AI问答。请查阅附件中的聊天上下文日志。 (A user has requested human escalation from the AI bot. Please review the chat logs context attached.)", date: "昨天 (Yesterday)", unread: false },
  { id: 3, sender: "marvis_zhou@outlook.com", subject: "加急：审核待处理的VIP请求 (Urgent: Review VIP approvals)", preview: "有4名新客户请求开通涵盖视频网络与GPKOS编译器的全栈VIP权限。(We have 4 new clients requesting VIP tier access to the Video network and GPKOS compiler.)", date: "周一 (Mon)", unread: false },
];

export function Mail() {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedMail, setSelectedMail] = useState<number | null>(null);
  const [domain, setDomain] = useState("outlook.com");
  const [showFolders, setShowFolders] = useState(false);

  // If mobile view, default to no selected mail so we see the list
  useEffect(() => {
    if (window.innerWidth >= 768) {
       setSelectedMail(1);
    }
  }, []);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setDomain(data.currentDomain))
      .catch(() => {});
  }, []);

  const folders = [
    { id: "inbox", label: "收件箱 (Inbox)", icon: Inbox, count: 12 },
    { id: "sent", label: "已发送 (Sent Items)", icon: Send },
    { id: "drafts", label: "草稿 (Drafts)", icon: FileEdit, count: 4 },
    { id: "archive", label: "归档 (Archive)", icon: Archive },
    { id: "junk", label: "垃圾邮件 (Junk)", icon: AlertOctagon },
    { id: "deleted", label: "已删除 (Deleted)", icon: Trash2 },
  ];

  const activeEmailData = selectedMail ? MOCK_EMAILS.find(e => e.id === selectedMail) : null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
      {/* Top Outlook Ribbon */}
      <div className="h-14 bg-[#0F6CBD] flex items-center justify-between px-2 md:px-4 text-white shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            className="md:hidden p-1.5 hover:bg-white/20 rounded mr-1"
            onClick={() => setShowFolders(!showFolders)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:grid font-semibold text-lg tracking-wide grid-cols-3 gap-1">
            <span className="col-span-1 border border-white/30 rounded aspect-square flex items-center justify-center pt-0.5">O</span>
            <span className="col-span-1 border border-white/30 rounded aspect-square"></span>
            <span className="col-span-1 border border-white/30 rounded aspect-square"></span>
            <span className="col-span-1 border border-white/30 rounded aspect-square"></span>
            <span className="col-span-1 border border-white/30 rounded aspect-square"></span>
            <span className="col-span-1 border border-white/30 rounded aspect-square flex items-center justify-center bg-white/20"></span>
            <span className="col-span-1 border border-white/30 rounded aspect-square"></span>
            <span className="col-span-1 border border-white/30 rounded aspect-square"></span>
            <span className="col-span-1 border border-white/30 rounded aspect-square"></span>
          </div>
          <span className="font-semibold px-2 sm:px-0">Outlook</span>
        </div>
        
        <div className="max-w-xl w-full flex-1 mx-2 md:mx-8 relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
          <input 
            type="text" 
            placeholder="搜索 (Search)" 
            className="w-full bg-white/20 border-none rounded hover:bg-white/30 focus:bg-white focus:text-gray-900 transition-colors py-1.5 pl-10 pr-4 text-sm font-medium outline-none placeholder:text-white/70"
          />
        </div>
        
        <div className="flex items-center gap-4 text-xs md:text-sm font-medium mr-2 max-w-[120px] md:max-w-none truncate">
           <span className="truncate">marvis_zhou@{domain}</span>
        </div>
      </div>
      
      {/* Action Ribbon */}
      <div className={cn(
        "h-12 border-b border-gray-200 bg-gray-50 flex items-center px-2 shrink-0 overflow-x-auto",
        activeEmailData && "hidden md:flex" // Hide on mobile when reading mail
      )}>
         <button className="px-3 md:px-4 py-1.5 bg-[#0F6CBD] text-white rounded text-sm hover:bg-[#0f5ca8] font-medium flex items-center shrink-0">
            <FileEdit className="w-4 h-4 mr-2 hidden sm:block" /> 新建 (New Email)
         </button>
         <div className="w-px h-6 bg-gray-300 mx-2 md:mx-3 shrink-0"></div>
         <div className="flex items-center text-gray-700 font-medium shrink-0">
           <button className="px-2 py-1.5 hover:bg-gray-200 rounded flex items-center text-sm md:text-sm text-xs"><Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-2"/> 删除 (Delete)</button>
           <button className="px-2 py-1.5 hover:bg-gray-200 rounded flex items-center text-sm md:text-sm text-xs"><Archive className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-2"/> 归档 (Archive)</button>
           <button className="px-2 py-1.5 hover:bg-gray-200 rounded flex items-center text-sm md:text-sm text-xs"><AlertOctagon className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-2"/> 举报 (Report)</button>
         </div>
      </div>

      {/* Main Mail Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Folders (Desktop Sidebar / Mobile Overlay) */}
        <div className={cn(
          "md:w-56 border-r border-gray-200 overflow-y-auto py-2 bg-gray-50 shrink-0 transition-transform absolute md:relative z-20 h-full w-64 md:translate-x-0 shadow-xl md:shadow-none",
          showFolders ? "translate-x-0" : "-translate-x-full"
        )}>
          <ul className="space-y-0.5">
            {folders.map(folder => (
              <li key={folder.id}>
                <button
                  onClick={() => {
                     setActiveFolder(folder.id);
                     if(window.innerWidth < 768) setShowFolders(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors",
                    activeFolder === folder.id ? "bg-gray-200/50 font-medium text-gray-900" : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center truncate pr-2">
                    <folder.icon className={cn("w-4 h-4 mr-3 shrink-0", activeFolder === folder.id ? "text-[#0F6CBD]" : "text-gray-500")} />
                    <span className="truncate">{folder.label}</span>
                  </div>
                  {folder.count && (
                    <span className={cn("text-xs font-semibold shrink-0", activeFolder === folder.id ? "text-[#0F6CBD]" : "text-gray-500")}>
                      {folder.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Mobile Scrim for Folders */}
        {showFolders && <div className="fixed inset-0 bg-black/40 z-10 md:hidden" onClick={() => setShowFolders(false)} />}

        {/* Email List */}
        <div className={cn(
          "w-full md:w-80 flex flex-col border-r border-gray-200 bg-white shrink-0 absolute md:relative h-full transition-transform z-10 md:translate-x-0",
          activeEmailData ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        )}>
          <div className="p-3 border-b border-gray-200 text-sm font-semibold flex items-center justify-between sticky top-0 bg-white z-10 w-full shrink-0">
             <span>重点 (Focused)</span>
             <span className="text-gray-400 font-normal">其它 (Other)</span>
          </div>
          <div className="overflow-y-auto flex-1">
             {MOCK_EMAILS.map(email => (
               <div 
                 key={email.id}
                 onClick={() => setSelectedMail(email.id)}
                 className={cn(
                   "p-3 border-b border-gray-100 cursor-pointer relative transition-colors",
                   selectedMail === email.id ? "bg-[#f3f9fd]" : "hover:bg-gray-50"
                 )}
               >
                 {email.unread && <div className="absolute left-0 top-3 w-1 h-1/2 bg-[#0F6CBD] rounded-r-md"></div>}
                 <div className="flex justify-between items-start mb-1">
                   <h4 className={cn("text-sm truncate pr-2", email.unread ? "font-semibold text-gray-900" : "text-gray-700")}>
                     {email.sender}
                   </h4>
                   <span className={cn("text-xs whitespace-nowrap", email.unread ? "font-semibold text-[#0F6CBD]" : "text-gray-500")}>
                     {email.date}
                   </span>
                 </div>
                 <div className={cn("text-sm truncate mb-1", email.unread ? "font-semibold text-[#0F6CBD]" : "text-gray-800")}>
                   {email.subject}
                 </div>
                 <div className="text-sm text-gray-500 line-clamp-2 leading-tight">
                   {email.preview}
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Reading Pane */}
        <div className={cn(
           "w-full flex-1 bg-white overflow-y-auto flex flex-col shrink-0 absolute md:relative h-full transition-transform",
           activeEmailData ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}>
           {activeEmailData ? (
             <div className="p-4 md:p-6 h-full flex flex-col">
               
               {/* Mobile Back Button */}
               <div className="md:hidden pb-3 mb-2 flex items-center border-b border-gray-100">
                  <button 
                    onClick={() => setSelectedMail(null)}
                    className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
                  >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    返回列表 (Back)
                  </button>
               </div>

               <div className="flex justify-between items-start mb-6 gap-2">
                 <div className="w-full">
                   <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-4 pr-12 line-clamp-3">{activeEmailData.subject}</h2>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 shrink-0 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-semibold text-lg">
                       {activeEmailData.sender.charAt(0)}
                     </div>
                     <div className="overflow-hidden w-full">
                       <div className="font-semibold text-sm text-gray-900 truncate">{activeEmailData.sender}</div>
                       <div className="text-xs text-gray-500 truncate">收件人 (To): marvis_zhou@{domain}</div>
                     </div>
                   </div>
                 </div>
                 <div className="flex items-center gap-1 md:gap-2 text-gray-500 shrink-0 absolute top-4 md:top-6 right-4 md:right-6">
                    <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block"><Reply className="w-4 h-4"/></button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block"><Forward className="w-4 h-4"/></button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block"><Star className="w-4 h-4"/></button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="w-5 h-5"/></button>
                 </div>
               </div>
               
               <div className="flex-1 text-gray-800 space-y-4 text-sm leading-relaxed border-t border-gray-100 pt-6">
                 {/* Raw render for mockup */}
                 <p>{activeEmailData.preview}</p>
                 {activeEmailData.id === 1 && (
                    <div className="bg-blue-50/50 p-4 rounded border border-blue-100 font-mono text-[11px] md:text-xs mt-8 text-blue-800 break-all">
                       [系统自动生成 / SYSTEM AUTO-GENERATED]
                       <br/>原域名 (Old Domain): legacy.mail
                       <br/>新域名 (New Domain): {domain}
                       <br/>状态 (Status): 100% 数据完整性维持 (Data integrity maintained via UID mappings).
                    </div>
                 )}
               </div>
             </div>
           ) : (
             <div className="h-full hidden md:flex items-center justify-center text-gray-400 flex-col">
                <Inbox className="w-16 h-16 mb-4 text-gray-200" />
                <p>Select an item to read</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
