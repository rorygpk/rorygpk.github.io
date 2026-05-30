import { Plane } from "lucide-react";

export function Msfs() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-4 text-center bg-slate-900 text-slate-300">
       <Plane className="w-12 h-12 md:w-16 md:h-16 mb-4 text-slate-500" />
       <h2 className="text-xl md:text-2xl font-light">MSFS 飞行模拟 (Flight Simulator)</h2>
       <p className="mt-2 text-slate-500 text-sm md:text-base">使用前需要确认人工部署步骤。<br/>(Requires manual deployment step confirmation before use.)</p>
    </div>
  );
}
