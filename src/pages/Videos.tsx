import { Video } from "lucide-react";

export function Videos() {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white p-4 md:p-8">
       <h1 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 flex items-center gap-3">
         <Video className="text-red-500 shrink-0" />
         视频平台 (Video Platform)
       </h1>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
             <div key={i} className="aspect-video bg-gray-800 rounded-lg border border-gray-700 animate-pulse"></div>
          ))}
       </div>
    </div>
  );
}
