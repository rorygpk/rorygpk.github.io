import { FileText } from "lucide-react";

export function Blog() {
  return (
    <div className="flex flex-col h-full bg-white p-4 md:p-8 overflow-y-auto w-full items-center">
       <div className="max-w-3xl w-full">
         <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-3 text-gray-900 border-b pb-4">
           <FileText className="shrink-0" />
           官方博客 (Official Blog)
         </h1>
         <div className="space-y-8">
            <article className="prose max-w-none">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">架构设计：全局域名切换 (Architecting Domain Switch)</h2>
              <p className="text-gray-500 text-xs md:text-sm mb-4">发布人 (Posted by) marvis_zhou@outlook.com</p>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                通过将用户 ID 与邮箱后缀解耦，我们可以在中央数据库中即时更新全局域名字段。由于用户历史记录、附件和日志都绑定到不可变的 UUID 上，
                因而能够在公司品牌重塑过程中保持数据 100% 完整。 
                (By decoupling user IDs from their email suffixes, we can update the global domain string 
                in the central database instantly. User history, attachments, and logs are tied to the immutable 
                UUID, keeping data 100% intact across company rebranding.)
              </p>
            </article>
         </div>
       </div>
    </div>
  );
}
