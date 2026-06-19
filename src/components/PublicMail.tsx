import React, { useState } from "react";
import { Send, Target, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";

export function PublicMail({ currentActiveDomain }: { currentActiveDomain: string }) {
  const [targetUsername, setTargetUsername] = useState("");
  const [senderName, setSenderName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUsername || !subject || !content) return;
    setSending(true);
    setResult(null);

    const actualSenderName = senderName.trim() || 'Anonymous Outsider';
    const fakeSenderDomain = "external-web.net";

    try {
      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderUsername: actualSenderName,
          senderDomain: fakeSenderDomain,
          receiverAddress: `${targetUsername.trim()}@${currentActiveDomain}`,
          subject: subject,
          content: content,
          folder: "inbox",
          category: "personal",
          isStarred: false,
          attachments: []
        })
      });

      const data = await res.json();
      if (data.success) {
        setResult(`Success! Message intercepted and successfully routed to ${targetUsername}@${currentActiveDomain}. ` + (data.isSpam ? "(Filtered as potential Spam)" : ""));
        setTargetUsername("");
        setSenderName("");
        setSubject("");
        setContent("");
      } else {
        setResult("Delivery Failed: " + data.error);
      }
    } catch (e) {
      setResult("Network error. Unable to connect to host relay.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[600px] animate-fade-in relative overflow-hidden text-center z-10 w-full" id="public-mail">
      <div className="max-w-xl w-full bg-slate-900 border border-violet-500/20 shadow-[0_0_40px_rgba(139,92,246,0.1)] rounded-3xl p-8 relative">
        <div className="absolute top-0 right-0 bg-violet-600 px-3 py-1 rounded-bl-xl rounded-tr-3xl text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-1"><Sparkles className="w-3 h-3" /> Secure Gateway</div>
        <div className="mb-6 border-b border-white/5 pb-4">
          <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
            <Target className="w-7 h-7 text-violet-400" />
            Global Email Relay
          </h2>
          <p className="text-slate-400 text-sm mt-2">No MX Records Required. Send secure messages directly into the internal network. All traffic undergoes Deep Integrity Scan automatically.</p>
        </div>

        {result && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-bold shadow-inner border flex items-center justify-center gap-2 ${result.includes('Success') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
            {result.includes('Success') ? <ShieldCheck className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}
            {result}
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4 text-left">
          <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 block">Target Username (__④_栏)</label>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  placeholder="username"
                  className="w-full bg-transparent border-b border-slate-700 text-white font-mono py-1 focus:outline-none focus:border-violet-500 transition"
                  value={targetUsername}
                  onChange={e => setTargetUsername(e.target.value)}
                />
                <span className="text-slate-500 font-mono ml-2 text-sm flex-shrink-0">@{currentActiveDomain}</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 block">Your Name (Optional)</label>
              <input
                type="text"
                placeholder="Anonymous"
                className="w-full bg-transparent border-b border-slate-700 text-white font-mono py-1 focus:outline-none focus:border-violet-500 transition"
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
              />
            </div>
          </div>
          <div>
             <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 block">Subject</label>
             <input
               type="text"
               required
               placeholder="Message Intent..."
               className="w-full bg-slate-950 border border-white/5 rounded-xl text-white font-sans py-2.5 px-4 focus:outline-none focus:border-violet-500 transition"
               value={subject}
               onChange={e => setSubject(e.target.value)}
             />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 block flex justify-between">
              <span>Body</span>
              <span className="text-violet-500/60 lowercase">Protected</span>
            </label>
            <textarea
              required
              placeholder="Write your secure payload here..."
              className="w-full h-32 bg-slate-950 border border-white/5 rounded-xl text-white font-sans py-3 px-4 focus:outline-none focus:border-violet-500 transition resize-none"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={sending}
            className="w-full mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {sending ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {sending ? 'Routing Payload...' : 'Transmit into Network'}
          </button>
        </form>
      </div>
    </div>
  );
}
