import { Settings, Shield, UserCog, Database } from "lucide-react";
import React, { useState, useEffect } from "react";

export function Work() {
  const [currentDomain, setCurrentDomain] = useState("Loading...");
  const [newDomain, setNewDomain] = useState("");
  const [isAdmin, setIsAdmin] = useState(true); // Assuming admin for demo

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setCurrentDomain(data.currentDomain))
      .catch(err => console.error(err));
  }, []);

  const handleDomainChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    try {
      const res = await fetch('/api/admin/change-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDomain })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentDomain(data.currentDomain);
        setNewDomain('');
        alert("Global Domain Updated (全局域名已更新). All user emails will reflect the new domain without data loss.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        <header>
          <h1 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight">工作区 (Work Area)</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">内部运营与全局控制 (Internal Operations & Global Controls)</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-5 h-5 text-blue-600" />
                <h2 className="text-base md:text-lg font-medium">域名与数据管理 (Domain & Data Management)</h2>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-6 leading-relaxed">
                修改全局邮箱域名后缀。系统已实现用户 ID 与域名解耦，在域名迁移期间确保 100% 数据保留（历史邮件、附件、联系人）。
                (Change the global email domain. The system separates user IDs from domain suffixes, ensuring 100% data retention.)
              </p>
              
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">当前活跃域名 (Current Active Domain)</p>
                  <p className="font-mono text-base md:text-lg text-gray-900 truncate">@{currentDomain}</p>
                </div>
              </div>

              {isAdmin && (
                <form onSubmit={handleDomainChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">迁移至新域名 (Migrate to New Domain)</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        value={newDomain}
                        onChange={e => setNewDomain(e.target.value)}
                        placeholder="例 (e.g.): newcompany.com"
                        className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                      />
                      <button 
                        type="submit"
                        className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        执行迁移 (Execute)
                      </button>
                    </div>
                    <p className="text-xs text-amber-600 mt-3 leading-relaxed">
                       * 警告: 将触发无缝后端迁移规则。用户设备会通过 ID 绑定保持登录状态。
                       (Warning: Initiates seamless backend transit process.)
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-4">
             <button className="w-full bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4 hover:border-blue-400 transition-colors text-left group">
               <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors shrink-0">
                 <Shield className="w-5 h-5 text-blue-600" />
               </div>
               <div className="overflow-hidden">
                 <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">全局权限 (Global Permissions)</h4>
                 <p className="text-xs text-gray-500 truncate">管理封禁与覆写 (Manage bans, overrides)</p>
               </div>
             </button>
             
             <button className="w-full bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4 hover:border-blue-400 transition-colors text-left group">
               <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors shrink-0">
                 <UserCog className="w-5 h-5 text-blue-600" />
               </div>
               <div className="overflow-hidden">
                 <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">用户审计 (User Audit & Roles)</h4>
                 <p className="text-xs text-gray-500 truncate">员工与VIP管理 (Employee & VIP management)</p>
               </div>
             </button>

             <button className="w-full bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4 hover:border-blue-400 transition-colors text-left group">
               <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors shrink-0">
                 <Settings className="w-5 h-5 text-blue-600" />
               </div>
               <div className="overflow-hidden">
                 <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">UI 配置 (System UI Config)</h4>
                 <p className="text-xs text-gray-500 truncate">自定义分支与视觉 (Customize branches & visual)</p>
               </div>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
