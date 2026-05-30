import { Outlet, NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Briefcase, 
  Mail as MailIcon, 
  Code, 
  Plane, 
  MonitorSmartphone, 
  Video, 
  Users, 
  FileText,
  Menu,
  ShieldEllipsis,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";

const NAV_ITEMS = [
  { path: "/home", label: "首页 (Home)", icon: Home },
  { path: "/work", label: "工作区 (Work Area)", icon: Briefcase },
  { path: "/mail", label: "邮箱 (Outlook)", icon: MailIcon },
  { name: "独立分支 (Isolated Branches)", isHeader: true },
  { path: "/rory-gpkos", label: "Rory GPKOS IDE", icon: Code },
  { path: "/msfs", label: "飞行模拟 (MSFS)", icon: Plane },
  { path: "/remote", label: "远程控制 (Remote)", icon: MonitorSmartphone },
  { path: "/videos", label: "视频 (Videos)", icon: Video },
  { path: "/friendship", label: "同学录 (Friendship)", icon: Users },
  { path: "/blog", label: "博客 (Blog)", icon: FileText },
];

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle desktop sidebar default state based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isHome = location.pathname.includes('/home');
  const isWork = location.pathname.includes('/work');
  
  // Theme rules based on spec
  let bgClass = "bg-gray-50";
  if (isHome) bgClass = "bg-[#f0f9fa]"; // Cyan-ish for home
  if (isWork) bgClass = "bg-[#f0f4f8]"; // Light blue for work

  return (
    <div className={cn("min-h-screen flex text-gray-900 font-sans relative", bgClass)}>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col lg:relative lg:translate-x-0",
        isSidebarOpen ? "w-64" : "w-16",
        isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full",
        !isMobileMenuOpen && !isSidebarOpen && "hidden lg:flex"
      )}>
        <div className="h-14 md:h-16 flex items-center justify-between px-4 border-b border-gray-200 shrink-0">
          {(isSidebarOpen || isMobileMenuOpen) && (
            <span className="font-bold tracking-tight text-blue-600 truncate">
              FATSHAN POST
            </span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          {isMobileMenuOpen && (
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto w-full py-4 overflow-x-hidden">
          <ul className="space-y-1 px-2 w-full">
            {NAV_ITEMS.map((item, idx) => {
              if (item.isHeader) {
                return (isSidebarOpen || isMobileMenuOpen) ? (
                  <li key={idx} className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider truncate w-full">
                    {item.name}
                  </li>
                ) : <li key={idx} className="h-8" />;
              }
              
              const Icon = item.icon!;
              return (
                <li key={idx}>
                  <NavLink
                    to={item.path!}
                    className={({ isActive }) => cn(
                      "flex items-center px-3 py-2 rounded-lg transition-colors group relative",
                      isActive 
                        ? "bg-blue-50 text-blue-700 font-medium" 
                        : "text-gray-700 hover:bg-gray-100",
                      !(isSidebarOpen || isMobileMenuOpen) && "justify-center"
                    )}
                    title={!(isSidebarOpen || isMobileMenuOpen) ? item.label : undefined}
                  >
                    <Icon className={cn(
                      "shrink-0",
                      (isSidebarOpen || isMobileMenuOpen) ? "w-5 h-5 mr-3" : "w-6 h-6"
                    )} />
                    {(isSidebarOpen || isMobileMenuOpen) && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 text-sm overflow-hidden whitespace-nowrap">
          {(isSidebarOpen || isMobileMenuOpen) ? (
            <div className="flex items-center text-gray-500 w-full overflow-hidden">
              <ShieldEllipsis className="w-4 h-4 mr-2 shrink-0" />
              <div className="flex flex-col truncate w-full">
                <span className="font-medium text-gray-700 truncate w-full">marvis_zhou</span>
                <span className="text-xs truncate w-full">Admin</span>
              </div>
            </div>
          ) : (
            <ShieldEllipsis className="w-6 h-6 text-gray-500 mx-auto" />
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-hidden flex flex-col h-screen h-[100dvh]">
        {/* Mobile Header Bar */}
        <div className="lg:hidden h-14 bg-white border-b border-gray-200 flex items-center px-4 shrink-0">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 mr-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-blue-600 truncate">FATSHAN POST</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
