import { ShieldAlert, Users, Store, MessageSquare } from "lucide-react";

export function Home() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight">欢迎，访客 (Welcome, Visitor)</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">FATSHAN POST 公共门户 (Public Portal)</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm whitespace-nowrap">
               在线客服 (Support)
             </button>
             <button className="flex-1 sm:flex-none px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 shadow-sm whitespace-nowrap">
               登录与注册 (Login)
             </button>
          </div>
        </header>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <Users className="w-7 h-7 md:w-8 md:h-8 text-cyan-500 mb-4" />
            <h3 className="text-base md:text-lg font-medium mb-2">公开群聊 (Public Groups)</h3>
            <p className="text-gray-500 text-xs md:text-sm">直接加入公开频道。已启用笔友沟通系统。(Join public channels directly. Penpal system enabled.)</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <Store className="w-7 h-7 md:w-8 md:h-8 text-cyan-500 mb-4" />
            <h3 className="text-base md:text-lg font-medium mb-2">资源商城 (Asset Mall)</h3>
            <p className="text-gray-500 text-xs md:text-sm">个性化背景与全站UI组件市场。(Custom backgrounds and UI elements marketplace.)</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
             <MessageSquare className="w-7 h-7 md:w-8 md:h-8 text-cyan-500 mb-4" />
             <h3 className="text-base md:text-lg font-medium mb-2">AI 助手 (AI Assistant)</h3>
             <p className="text-gray-500 text-xs md:text-sm">自动问答库查询与智能支持。(Automated knowledge base queries and support.)</p>
          </div>
        </div>

        {/* Admin Policy Notice */}
        <div className="bg-blue-50/50 border border-blue-100 p-4 md:p-6 rounded-xl flex items-start gap-3 md:gap-4 flex-col sm:flex-row">
           <ShieldAlert className="w-6 h-6 text-blue-600 shrink-0 mt-1 mb-2 sm:mb-0" />
           <div>
             <h4 className="text-blue-900 font-medium mb-1 text-sm md:text-base">全局监控规则已生效 (Global Verification Rules Active)</h4>
             <p className="text-blue-700/80 text-xs md:text-sm leading-relaxed">
               所有活动均受中央管理系统监控与控制。绝对最高管理员为 <span className="font-mono bg-blue-100 px-1 py-0.5 rounded text-blue-900 break-all">marvis_zhou@outlook.com</span>。动态权限与域名数据保留策略生效中。
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}
