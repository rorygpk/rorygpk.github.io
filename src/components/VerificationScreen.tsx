import React, { useState, useEffect } from "react";
import { ShieldCheck, Activity, CheckSquare, Square, Globe } from "lucide-react";

export function VerificationScreen({ onComplete }: { onComplete: () => void }) {
  const [isChecked, setIsChecked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showAutoCheck, setShowAutoCheck] = useState(true);

  // Auto-check simulation for the first few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAutoCheck(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = () => {
    if (isVerifying) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsChecked(true);
      setTimeout(() => {
        onComplete();
      }, 800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#fafafa] dark:bg-slate-900 flex flex-col items-center justify-center font-sans">
      <div className="max-w-md w-full p-8 relative flex flex-col items-center">
        
        {/* Main Verification Card */}
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6 w-full flex items-center gap-4 mb-6 cursor-pointer border border-slate-200 dark:border-slate-700" onClick={handleVerify}>
          <div className="shrink-0 transition-all duration-300">
            {isChecked ? (
              <ShieldCheck className="w-8 h-8 text-green-500" />
            ) : isVerifying ? (
              <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-600 border-t-cyan-500 animate-spin" />
            ) : (
              <CheckSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 hover:text-cyan-500 transition-colors" />
            )}
          </div>
          <div className="flex-1">
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-lg select-none">
              Verify you are human
            </span>
          </div>
          <div className="shrink-0 flex items-center justify-center p-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Cloudflare_icon.svg/1024px-Cloudflare_icon.svg.png" alt="security" className="w-8 h-8 opacity-20 grayscale" />
          </div>
        </div>

        {/* Security Diagnostics output */}
        <div className="w-full text-center space-y-2">
          {showAutoCheck ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono flex items-center justify-center gap-2">
              <Activity className="w-4 h-4 animate-pulse" /> Performing system automated diagnostics...
            </p>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
              Please check the box to access Rory Secure Hub.
            </p>
          )}
        </div>

        {/* Meta details footer */}
        <div className="absolute bottom-[-100px] w-full text-center text-xs text-slate-400 dark:text-slate-500 font-mono space-y-1">
          <p>Ray ID: {Math.random().toString(36).substring(2, 16).toLowerCase()}</p>
          <p>Performance & security verification powered by SecureEdge</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-[10px]">
             <Globe className="w-3 h-3" /> Secure Connection
          </div>
        </div>
      </div>
    </div>
  );
}
