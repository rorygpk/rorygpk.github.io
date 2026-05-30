import { MonitorSmartphone } from "lucide-react";

export function Remote() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-4 text-center bg-gray-50 text-gray-800">
       <MonitorSmartphone className="w-12 h-12 md:w-16 md:h-16 mb-4 text-gray-400" />
       <h2 className="text-xl md:text-2xl font-light">远程控制 (Remote Control)</h2>
       <p className="mt-2 text-gray-500 text-sm md:text-base">全局监控开启，等待连接... (Global admin monitoring active. Waiting for connection...)</p>
    </div>
  );
}
