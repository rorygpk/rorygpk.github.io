import { Code2 } from "lucide-react";

export function RoryGpkos() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-900 text-gray-100 flex flex-col">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-light tracking-tight flex items-center gap-3">
           <Code2 className="text-cyan-400 shrink-0" />
           Rory GPKOS IDE
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">独立 Web IDE 环境与 Linux 编译器 (Isolated Web IDE Environment)</p>
      </header>
      
      <div className="flex-1 border border-gray-700 rounded-xl bg-black/50 p-4 font-mono text-sm overflow-hidden flex flex-col">
         <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
           <div className="w-3 h-3 rounded-full bg-red-500"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
           <div className="w-3 h-3 rounded-full bg-green-500"></div>
         </div>
         <div className="text-cyan-600">user@gpkos-env:~$ <span className="text-gray-300">echo "IDE 模块占位符 (IDE Module Placeholder)"</span></div>
         <div className="text-gray-400 mt-2">IDE 模块占位符 (IDE Module Placeholder)</div>
         <div className="text-cyan-600 mt-2">user@gpkos-env:~$ <span className="text-gray-300 animate-pulse">_</span></div>
      </div>
    </div>
  );
}
