import { Users } from "lucide-react";

export function Friendship() {
  return (
    <div className="flex flex-col h-full bg-pink-50 p-4 md:p-8">
       <h1 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 flex items-center gap-3 text-pink-700">
         <Users />
         同学录 (Friendship Directory)
       </h1>
       <div className="max-w-2xl bg-white p-4 md:p-6 rounded-xl shadow-sm border border-pink-100">
         <p className="text-gray-600 text-sm md:text-base">此分支作为社交目录运行，具有统一的存储分配。 (This branch acts as a social directory with unified storage allocation...)</p>
       </div>
    </div>
  );
}
