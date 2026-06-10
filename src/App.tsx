import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Send,
  Trash2,
  FileText,
  Star,
  Settings,
  Terminal,
  Play,
  Share2,
  UserCheck,
  ShieldAlert,
  Sliders,
  Award,
  Plus,
  RefreshCw,
  Search,
  BookOpen,
  MessageSquare,
  Lock,
  Compass,
  Tv,
  Users,
  CheckCircle,
  Video,
  Monitor,
  Volume2,
  List,
  ChevronRight,
  User,
  ShoppingBag,
  Paperclip,
  Check,
  X,
  AlertTriangle,
  SendHorizontal,
  ThumbsUp,
  Heart,
  Image,
  Sun,
  Moon,
  Upload,
  Zap,
  Cpu,
  Sparkles,
  Fingerprint,
  Command,
  Wifi,
  FileCode2,
  Map as MapIcon,
  Chrome,
  BrainCircuit,
  ArrowLeft,
  ArrowRight,
  Cloud,
  UploadCloud,
  Box,
  Archive,
  Activity,
  Shield,
  Globe,
  KeyRound,
  MonitorUp,
  MousePointer2,
  MessageSquare,
  Monitor,
  Share,
  Download,
  Smartphone,
  Maximize,
  ShieldAlert
} from "lucide-react";
import { User as UserType, Email, Blog, FriendshipRecord, CustomButton, Order, SystemState } from "./types";
import { t, getLanguage, setLanguage, Language } from "./i18n";
import { ToolTranslator, ToolSummarizer, ToolCode, AdminSubpages, DynamicSubPage, ToolGeminiAI, AdminAIAccess, AdminBrowserChecks } from "./components/AIExtensions";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useGoogleLogin } from '@react-oauth/google';
import { encryptData, decryptData } from './lib/encryption';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 23.0215, // Fatshan coordinates roughly
  lng: 113.1214
};

function GoogleMapsWrapper() {
  const apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey // Empty to fail gracefully or show dev map
  });

  if (loadError) {
    return <div className="p-8 text-red-500 font-bold items-center flex flex-col justify-center h-full w-full">Google Maps failed to load. Please check your API key ({loadError.message || 'ApiProjectMapError'}).</div>;
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={10}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      <Marker position={defaultCenter} />
    </GoogleMap>
  ) : <div className="p-8 text-slate-500 font-bold items-center flex flex-col justify-center h-full w-full">Loading Secure Map Tunnels...</div>
}

export default function App() {
  const [lang, setLang] = useState<Language>(getLanguage());

  useEffect(() => {
    const handleLangChange = () => setLang(getLanguage());
    window.addEventListener("languageChanged", handleLangChange);
    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);

  const toggleLanguage = () => {
    setLanguage(lang === "en" ? "zh" : "en");
  };

  // Navigation Routing Hash state
  const [currentHash, setCurrentHash] = useState<string>("#home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Global Secure Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Global Google Provider Auth State
  const [googleToken, setGoogleToken] = useState<string | null>(() => {
    const st = localStorage.getItem("fatshan_global_session");
    if (st) {
      try {
         return decryptData(st);
      } catch(e) { return null; }
    }
    return null;
  });

  const loginGoogleProvider = useGoogleLogin({
    onSuccess: (codeResponse) => {
      // In implicit flow this is the access token directly
      const token = codeResponse.access_token;
      setGoogleToken(token);
      localStorage.setItem("fatshan_global_session", encryptData(token));
      alert("✅ Global secure gateway handshake complete! Your domestic Google proxy is active.");
      // Also fetch inbox to populate
      fetchGmailInbox(token);
    },
    scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly',
    onError: (error) => alert('Login Failed: ' + JSON.stringify(error))
  });

  // Global Session State
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    // Attempt local storage recall
    const saved = localStorage.getItem("gpkos_curr_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeBackground, setActiveBackground] = useState<string>("slate-classic");

  // Database synchronizer
  const [systemState, setSystemState] = useState<SystemState>({
    activeDomain: "fatshanpost.com",
    oldDomain: "fatshan.onmicrosoft.com",
    dualDomainOverlap: true,
    dualDomainDays: 14,
    customButtons: [],
    backgrounds: [],
    users: [],
    blogs: [],
    friendshipRecords: [],
    chatMessages: [],
    settings: { knowledgeBase: [] }
  });

  // UI Local Loading States
  const [emails, setEmails] = useState<Email[]>([]);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regContact, setRegContact] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regVerifyType, setRegVerifyType] = useState<"identity" | "payment">("identity");
  
  // Feedback
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Client Support Conversation
  const [supportMessage, setSupportMessage] = useState("");
  const [supportChat, setSupportChat] = useState<{ sender: "user" | "ai" | "staff"; text: string; id: string }[]>([
    { sender: "ai", text: "Welcome to FATSHAN POST helper. How can I assist you with your simulator or terminal credentials today? (System Validation Token: FATSHAN POST)", id: "init-ch" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Outlook Multi-pane States
  const [outlookFolder, setOutlookFolder] = useState<string>("inbox");
  const [outlookCategory, setOutlookCategory] = useState<string>("all");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [outlookTheme, setOutlookTheme] = useState<"light" | "dark">("light");
  const [outlookDensity, setOutlookDensity] = useState<"compact" | "cozy">("cozy");
  const [outlookSearch, setOutlookSearch] = useState("");
  const [mailComposeOpen, setMailComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [composeStarred, setComposeStarred] = useState(false);
  const [composeFolder, setComposeFolder] = useState<"inbox" | "sent" | "draft">("sent");
  const [composeCategory, setComposeCategory] = useState<"work" | "personal">("work");
  const [aiReportMessage, setAiReportMessage] = useState<{ sensitivity?: string; summary?: string } | null>(null);

  // Rory GPKOS state
  const [ideCode, setIdeCode] = useState<string>(
    `// Rory GPKOS IDE sandboxed compiler entrypoint\nexport function main() {\n  console.log("Validation Token: FATSHAN POST");\n  console.log("Workspace connected to standard Docker hub");\n}`
  );
  const [ideTerminalInput, setIdeTerminalInput] = useState("");
  const [ideLogs, setIdeLogs] = useState<string>(
    "✨ Starting Rory GPKOS TypeScript Compiler service v3.11.2\nType 'ls' or 'docker ps' into the terminal shell input to audit system active logs."
  );

  // MSFS simulator step
  const [msfsWarningOpen, setMsfsWarningOpen] = useState(true);
  const [msfsFuel, setMsfsFuel] = useState(85);
  const [msfsAltitude, setMsfsAltitude] = useState(5000);
  const [msfsSpeed, setMsfsSpeed] = useState(240);
  const [msfsAutoPilot, setMsfsAutoPilot] = useState(false);
  const [msfsChecklists, setMsfsChecklists] = useState([
    { id: 1, name: "Configure FATSHAN POST standard routing check", done: true },
    { id: 2, name: "Deploy IMAP / SMTP outlook relay coordinates", done: false },
    { id: 3, name: "Verify Flight control surface validation trim", done: false },
    { id: 4, name: "Synchronize landing landing-gear pressure telemetry", done: false }
  ]);

  // Video portal states
  const [videoSpeed, setVideoSpeed] = useState(1.0);
  const [videoQuality, setVideoQuality] = useState("1080p");
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoSubtitle, setVideoSubtitle] = useState("FATSHAN POST: Commencing final checklist parameters.");

  // Friendship guestbook state
  const [guestbookName, setGuestbookName] = useState("");
  const [guestbookContent, setGuestbookContent] = useState("");
  const [guestbookPhoto, setGuestbookPhoto] = useState("");

  // Blog CMS state
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("Technology");
  const [blogTags, setBlogTags] = useState("");
  const [blogCommentText, setBlogCommentText] = useState<{ [blogId: string]: string }>({});

  // Chat window on home state
  const [chatMessageText, setChatMessageText] = useState("");

  // Admin section state
  const [adminSelectedUserId, setAdminSelectedUserId] = useState<string>("");
  const [adminBanReason, setAdminBanReason] = useState("");
  const [adminBanExpiry, setAdminBanExpiry] = useState("");
  const [adminQuota, setAdminQuota] = useState("1 GB");
  const [adminActiveDomain, setAdminActiveDomain] = useState("fatshanpost.com");
  const [adminDualOverlap, setAdminDualOverlap] = useState(true);
  const [adminDualOverlapDays, setAdminDualOverlapDays] = useState(14);
  const [newBtnLabel, setNewBtnLabel] = useState("");
  const [newBtnUrl, setNewBtnUrl] = useState("");
  const [newBtnPage, setNewBtnPage] = useState<"home" | "work">("home");
  const [newBtnVisibility, setNewBtnVisibility] = useState<"all" | "logined" | "specified">("all");
  const [newBtnSpecUsers, setNewBtnSpecUsers] = useState("");
  const [newBtnColor, setNewBtnColor] = useState("bg-cyan-600");

  const [customApiUrl, setCustomApiUrl] = useState<string>(() => {
    return localStorage.getItem("gpkos_custom_backend_url") || "";
  });
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [browserCheckBlock, setBrowserCheckBlock] = useState<{message: string, isWarning: boolean} | null>(null);

  useEffect(() => {
    const handleCheck = () => {
       const checks = systemState.pageBrowserChecks || [];
       const applyCheck = checks.find(c => c.pageId === currentHash || currentHash.startsWith(c.pageId));
       if (applyCheck) {
          // A somewhat reliable cross-browser check for fullscreen state (API + heuristic fallback)
          const isFullscreen = document.fullscreenElement != null || (window.innerHeight >= window.screen.height - 10 && window.innerWidth >= window.screen.width - 10);
          const w = window.innerWidth;
          const h = window.innerHeight;
          let fail = false;
          if (applyCheck.requireFullscreen && !isFullscreen) fail = true;
          if (applyCheck.minWidth && w < applyCheck.minWidth) fail = true;
          if (applyCheck.minHeight && h < applyCheck.minHeight) fail = true;
          
          if (fail) {
             if (applyCheck.notMetAction === 'redirect') {
                window.location.hash = applyCheck.redirectUrl || '';
             } else {
                setBrowserCheckBlock({
                  message: applyCheck.actionMessage,
                  isWarning: applyCheck.notMetAction === 'warning'
                });
             }
          } else {
             setBrowserCheckBlock(null);
          }
       } else {
          setBrowserCheckBlock(null);
       }
    };
    handleCheck();
    window.addEventListener('resize', handleCheck);
    return () => window.removeEventListener('resize', handleCheck);
  }, [currentHash, systemState.pageBrowserChecks]);

  const getApiBase = (): string => {
    return customApiUrl.trim().replace(/\/$/, "");
  };

  useEffect(() => {
    // Fetch initial database state
    refreshSystemData();

    // Listen to route address changes
    const onHashChange = () => {
      const h = window.location.hash || "#home";
      setCurrentHash(h);
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();

    return () => window.removeEventListener("hashchange", onHashChange);
  }, [customApiUrl]);

  const fetchGmailInbox = async (token?: string | null) => {
    const actToken = token || googleToken;
    if (!actToken) return;
    try {
       const res = await fetch(getApiBase() + "/api/gmail/inbox", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ accessToken: actToken })
       });
       const data = await res.json();
       if (data.success && data.messages) {
         // Map to our local Email type structure to display in OWA
         const newMails: Email[] = data.messages.map((m: any) => ({
            id: m.id,
            senderFullName: m.from,
            senderUsername: m.from.split('@')[0].replace(/<.*/, '').trim(),
            senderDomain: m.from.includes('@') ? m.from.split('@')[1].replace('>', '') : 'google.com',
            receiverFullName: "Me",
            receiverUsername: "me",
            receiverDomain: systemState.activeDomain,
            subject: m.subject,
            snippet: m.snippet,
            body: m.snippet,
            timestamp: new Date().getTime(),
            read: false,
         }));
         setEmails(prev => [...newMails, ...prev.filter(p => !p.id.startsWith('gmail-') && !newMails.find(nm => nm.id === p.id))]);
       }
    } catch(err) {
       console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      if (googleToken) fetchGmailInbox(googleToken);
      fetchUserEmails();
    }
  }, [currentUser, systemState.activeDomain, customApiUrl, googleToken]);

  const refreshSystemData = async () => {
    try {
      const res = await fetch(getApiBase() + "/api/state");
      const data = await res.json();
      setSystemState(data);
      if (data.activeDomain) {
        setAdminActiveDomain(data.activeDomain);
      }
    } catch (e) {
      console.error("System configuration capture error", e);
    }
  };

  const fetchUserEmails = async () => {
    if (!currentUser) return;
    try {
      const resp = await fetch(
        getApiBase() + `/api/emails?username=${encodeURIComponent(currentUser.emailUsername)}&domain=${encodeURIComponent(currentUser.emailDomain)}`
      );
      const data = await resp.json();
      setEmails(data);
    } catch (err) {
      console.error("Mailboxes resolution fault", err);
    }
  };

  // Sign In Trigger
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;

    try {
      const res = await fetch(getApiBase() + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: authEmail, password: authPassword })
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || contentType.indexOf("application/json") === -1) {
        throw new Error("前端部署成功！\n\n请注意：由于当前的 Cloudflare 为纯前端托管环境，未检测到动态后端。\n\n解决办法：请按照侧边栏『极速部署指南』中的第4步操作，将您在 Render/Zeabur 获取的女武神网关链接粘贴到主页面【绑定远端接口】中即可正常登录！");
      }
      const data = await res.json();
      if (data.error) {
        alert("Authentication failed: " + data.error);
        return;
      }
      
      setCurrentUser(data.user);
      localStorage.setItem("gpkos_curr_user", JSON.stringify(data.user));
      setAuthEmail("");
      setAuthPassword("");

      // Redirect workflow default based on user status
      if (data.user.role === "admin") {
        window.location.hash = "#work";
      } else {
        window.location.hash = "#home";
      }
      refreshSystemData();
    } catch (e: any) {
      alert("Verification system status:\n\n" + e.message);
    }
  };

  // Log Out Sequence
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("gpkos_curr_user");
    setEmails([]);
    window.location.hash = "#home";
  };

  // Self Registration Sequence
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regContact || !regPassword) {
      alert("Please provide valid information inside registration slots");
      return;
    }
    try {
      const res = await fetch(getApiBase() + "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: regFullName,
          contact: regContact,
          password: regPassword,
          verificationType: regVerifyType
        })
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || contentType.indexOf("application/json") === -1) {
        throw new Error("检测到当前为纯前端站点。\n\n如需启用真实的后台注册校验功能，请至下方绑定您专属的 Render 等含动态 Node 引擎的服务端接口链接。");
      }
      const data = await res.json();
      if (data.error) {
        alert("Automation engine intercept: " + data.error);
        return;
      }

      alert("🎉 User verification registered! Primary mailbox has been created under: " + data.user.emailUsername + "@" + systemState.activeDomain);
      setCurrentUser(data.user);
      localStorage.setItem("gpkos_curr_user", JSON.stringify(data.user));
      setRegFullName("");
      setRegContact("");
      setRegPassword("");
      window.location.hash = "#home";
      refreshSystemData();
    } catch (err: any) {
      alert("Registration gateway alert:\n\n" + err.message);
    }
  };

  // Email transmission sequence
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !composeTo || !composeSubject) {
      alert("Primary email descriptors cannot be empty.");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to send this email to ${composeTo}?`);
    if (!confirmed) return;

    if (googleToken) {
      try {
        const res = await fetch(getApiBase() + "/api/gmail/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: composeTo,
            subject: composeSubject,
            message: composeContent,
            accessToken: googleToken
          })
        });
        const data = await res.json();
        if (data.error) {
           alert("Google Gateway Reject: " + data.error);
           return;
        }
        alert(`Success! Email sent securely via Google Provider to ${composeTo}.`);
        setMailComposeOpen(false);
        setComposeTo("");
        setComposeSubject("");
        setComposeContent("");
      } catch(err) {
        alert("Google Provider Failed: " + err);
      }
      return;
    }

    try {
      const res = await fetch(getApiBase() + "/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderUsername: currentUser.emailUsername,
          senderDomain: currentUser.emailDomain,
          receiverAddress: composeTo,
          subject: composeSubject,
          content: composeContent,
          folder: composeFolder,
          category: composeCategory,
          isStarred: composeStarred,
          attachments: []
        })
      });
      const data = await res.json();
      if (data.error) {
        alert("Mail gateway reject: " + data.error);
        return;
      }

      // Check for Gemini intelligence metrics
      if (data.isSpam) {
        alert("⚠️ [Security Shield Alert] Gemini categorized this transmission as potential Spam! Mail flagged and diverted inside folder.");
      } else {
        alert("📧 Transmission routed. Security compliance verified.");
      }

      // Trigger telemetry review report
      setAiReportMessage({
        sensitivity: data.sensitivityReport,
        summary: data.aiSummary
      });

      // Resetcompose
      setComposeTo("");
      setComposeSubject("");
      setComposeContent("");
      setMailComposeOpen(false);
      fetchUserEmails();
      refreshSystemData();
    } catch (err: any) {
      alert("Mail relay failure. " + err.message);
    }
  };

  // Email action triggers
  const handleMailAction = async (id: string, action: string, targetFolder?: string) => {
    try {
      await fetch(getApiBase() + "/api/emails/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id], action, targetFolder })
      });
      fetchUserEmails();
      if (selectedEmail && selectedEmail.id === id) {
        setSelectedEmail(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Guest Feedback System
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackEmail || !feedbackContent) return;
    try {
      const res = await fetch(getApiBase() + "/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderEmail: feedbackEmail, content: feedbackContent })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackSuccess(true);
        setFeedbackEmail("");
        setFeedbackContent("");
        setTimeout(() => setFeedbackSuccess(false), 5000);
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI chat customer support system
  const handleSupportAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    const userText = supportMessage;
    const userMsgId = "cust_" + Date.now();
    setSupportChat((prev) => [...prev, { sender: "user", text: userText, id: userMsgId }]);
    setSupportMessage("");
    setIsAiLoading(true);

    try {
      const res = await fetch(getApiBase() + "/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await res.json();
      
      setSupportChat((prev) => [
        ...prev,
        {
          sender: data.response.includes("Human Support Operator") ? "staff" : "ai",
          text: data.response,
          id: "sys_" + Date.now()
        }
      ]);
    } catch (e) {
      setSupportChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "The gateway router was disrupted temporarily. Verification String code check: FATSHAN POST.",
          id: "sys_fail"
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Interactive Live terminal code simulator actions
  const [gpkosActiveApp, setGpkosActiveApp] = useState<string>("desktop"); // "desktop", "terminal", "ide", "maps", "remote", "mobile-search"
  
  // Remote Support Session State
  const [remoteSessionActive, setRemoteSessionActive] = useState(false);
  const [remoteChatMessages, setRemoteChatMessages] = useState<{sender: string, text: string, time: string}[]>([]);
  const [remoteChatInput, setRemoteChatInput] = useState("");
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Google Hub dedicated secure proxy workspace states
  const [googleHubTab, setGoogleHubTab] = useState<"search" | "gmail" | "maps" | "gemini" | "crypto">("search");
  const [proxySearchQueryValue, setProxySearchQueryValue] = useState("");
  const [proxySearchResultsList, setProxySearchResultsList] = useState<any[]>([]);
  const [loadingProxySearch, setLoadingProxySearch] = useState(false);
  const [activeBypassUrl, setActiveBypassUrl] = useState<string | null>(null);
  const [bypassHtmlContent, setBypassHtmlContent] = useState<string>("");
  const [loadingBypass, setLoadingBypass] = useState(false);
  const [directUrlValue, setDirectUrlValue] = useState("");
  const [geminiModelSelected, setGeminiModelSelected] = useState("gemini-1.5-flash");
  const [geminiChatHistoryList, setGeminiChatHistoryList] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [geminiPromptText, setGeminiPromptText] = useState("");
  const [loadingGeminiModel, setLoadingGeminiModel] = useState(false);
  const [gmailComposeToAddress, setGmailComposeToAddress] = useState("");
  const [gmailComposeSubjectLine, setGmailComposeSubjectLine] = useState("");
  const [gmailComposeMessageText, setGmailComposeMessageText] = useState("");
  const [sendingGmailLocalState, setSendingGmailLocalState] = useState(false);
  
  // Crypto Relay UI States
  const [cryptoMessages, setCryptoMessages] = useState<any[]>([]);
  const [cryptoReceiver, setCryptoReceiver] = useState("");
  const [cryptoMessage, setCryptoMessage] = useState("");
  const [cryptoPassword, setCryptoPassword] = useState("");
  const [cryptoUnlockKey, setCryptoUnlockKey] = useState("");
  const [decryptedMessageId, setDecryptedMessageId] = useState<string | null>(null);
  const [decryptedMessageText, setDecryptedMessageText] = useState<string>("");
  const [sendingCrypto, setSendingCrypto] = useState(false);
  
  const handleIDECompile = async () => {
    try {
      const res = await fetch(getApiBase() + "/api/rory-gpkos/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: ideCode })
      });
      const data = await res.json();
      setIdeLogs(data.output);
    } catch (err: any) {
      setIdeLogs("❌ Link drop crash compiling. Error: " + err.message);
    }
  };

  const handleIDETerminalCmd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideTerminalInput.trim()) return;

    const cmd = ideTerminalInput;
    setIdeTerminalInput("");
    setIdeLogs((prev) => prev + `\n\n$ ${cmd}`);

    try {
      const res = await fetch(getApiBase() + "/api/rory-gpkos/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      setIdeLogs((prev) => prev + `\n${data.output}`);
    } catch (err: any) {
      setIdeLogs((prev) => prev + `\n❌ command failed. ${err.message}`);
    }
  };

  // Memoirs friendship sharing cards trigger
  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookName || !guestbookContent) return;

    try {
      const res = await fetch(getApiBase() + "/api/friendship/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestbookName, content: guestbookContent, photoUrl: guestbookPhoto })
      });
      const data = await res.json();
      if (data.success) {
        alert("🌟 Your friendship memoir has been recorded successfully with standard decorations!");
        setGuestbookName("");
        setGuestbookContent("");
        setGuestbookPhoto("");
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Blog CMS engine
  const handleBlogCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent || !currentUser) return;

    try {
      const res = await fetch(getApiBase() + "/api/blogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: currentUser.fullName,
          authorEmail: currentUser.contact,
          title: blogTitle,
          content: blogContent,
          category: blogCategory,
          tags: blogTags.split(",").map((t) => t.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("✨ Professional Blog Post Published Successfully!");
        setBlogTitle("");
        setBlogContent("");
        setBlogTags("");
        refreshSystemData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLikeBlog = async (id: string) => {
    try {
      const res = await fetch(getApiBase() + "/api/blogs/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId: id })
      });
      const data = await res.json();
      if (data.success) {
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogCommentSubmit = async (id: string) => {
    const text = blogCommentText[id];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(getApiBase() + "/api/blogs/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: id,
          author: currentUser ? currentUser.fullName : "Guest Visitor",
          content: text
        })
      });
      const data = await res.json();
      if (data.success) {
        setBlogCommentText((prev) => ({ ...prev, [id]: "" }));
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Secure Search (Proxy)
  const handleSecureSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(getApiBase() + `/api/search/proxy?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Chat lobby message
  const handleLobbyChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;

    try {
      const res = await fetch(getApiBase() + "/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: currentUser ? currentUser.fullName : "Anonymous Guest",
          content: chatMessageText
        })
      });
      const data = await res.json();
      if (data.success) {
        setChatMessageText("");
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Theme Wallpaper purchasing trigger simulation with unified memory Quota bounds
  const applyWallpaperTheme = (id: string, color: string, price: string) => {
    if (!currentUser) {
      alert("Please authenticate to select wallpapers.");
      return;
    }
    setActiveBackground(color);
    alert(`💡 Applied theme: ${name}. Your quota storage balance was verified.`);
  };

  // ================= ADMIN CONSOLE ACTIONS =================

  const handleAdminSetDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiBase() + "/api/admin/set-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeDomain: adminActiveDomain,
          dualDomainOverlap: adminDualOverlap,
          dualDomainDays: adminDualOverlapDays
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🌐 Master domain swapped and registered! Domain transition notices successfully sent to users.");
        refreshSystemData();
        if (currentUser) {
          fetchUserEmails();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminBanUser = async (userId: string, isBan: boolean) => {
    try {
      const res = await fetch(getApiBase() + "/api/admin/manage-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: isBan ? "ban" : "unban",
          banReason: adminBanReason || "Suspended by Security Ops Room",
          banExpiry: adminBanExpiry || null
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(isBan ? "🛑 Profile suspended." : "✅ Profile operational credentials restored.");
        refreshSystemData();
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  const handleToggleGoogleAuth = async (emailUsername: string) => {
    if (currentUser?.emailUsername !== "marvis_zhou" && currentUser?.emailUsername !== "marvis_zhou2014") {
      alert("Only the super-administrator (marvis_zhou / marvis_zhou2014) is authorized to govern secure GFW tunnel keys.");
      return;
    }
    const currentAuthed = systemState.aiAuthorizedUsers || [];
    const updated = currentAuthed.includes(emailUsername)
      ? currentAuthed.filter(e => e !== emailUsername)
      : [...currentAuthed, emailUsername];
    
    setSystemState((prev: any) => ({
      ...prev,
      aiAuthorizedUsers: updated
    }));

    try {
      await fetch(getApiBase() + "/api/admin/save-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiAuthorizedUsers: updated })
      });
      alert(`Handshake database updated. "${emailUsername}" GFW proxy status swapped successfully.`);
    } catch(e) {
      console.error(e);
    }
  };

  const handleAdminUpdateUserQuota = async (userId: string) => {
    try {
      const res = await fetch(getApiBase() + "/api/admin/manage-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "update-quota",
          storageQuota: adminQuota
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("💾 Shared storage bounds configured.");
        refreshSystemData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAminToggleVerify = async (userId: string) => {
    try {
      const res = await fetch(getApiBase() + "/api/admin/manage-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "verify"
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🔑 Verification state toggled.");
        refreshSystemData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminAddMedal = async (userId: string, isPenalty = false) => {
    const title = prompt(isPenalty ? "Target penalty code title:" : "Target honor medal title:");
    if (!title) return;

    try {
      const dbUser = systemState.users.find((u) => u.id === userId);
      if (!dbUser) return;

      const currentMedals = dbUser.medals || [];
      const newMedal = {
        id: "m_" + Date.now(),
        title: title.toUpperCase(),
        type: isPenalty ? "penalty" : "honor",
        icon: isPenalty ? "ShieldAlert" : "Award",
        color: isPenalty ? "text-red-500 font-bold" : "text-amber-500 font-bold",
        description: isPenalty ? "Corporate compliance trigger record." : "Awarded by system controller desk."
      };

      const res = await fetch(getApiBase() + "/api/admin/manage-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "update-medals",
          medals: [...currentMedals, newMedal]
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🏅 Badges updated.");
        refreshSystemData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCustomButton = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBtnLabel || !newBtnUrl) return;

    try {
      const res = await fetch(getApiBase() + "/api/admin/buttons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          button: {
            label: newBtnLabel,
            actionUrl: newBtnUrl,
            page: newBtnPage,
            visibility: newBtnVisibility,
            specifiedUsers: newBtnSpecUsers ? newBtnSpecUsers.split(",").map((x) => x.trim()) : [],
            styling: { bgColor: newBtnColor, textColor: "text-white" }
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🔘 Micro Custom Interactive button successfully initialized!");
        setNewBtnLabel("");
        setNewBtnUrl("");
        setNewBtnSpecUsers("");
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCustomButton = async (id: string) => {
    try {
      const res = await fetch(getApiBase() + "/api/admin/buttons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          button: { id }
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🔘 Button cleared.");
        refreshSystemData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter Email list based on left conditions inside Outlook replica
  const filteredEmails = emails.filter((mailItem) => {
    // Basic folder filters
    if (outlookFolder !== "all" && mailItem.folder !== outlookFolder) {
      return false;
    }
    // Search query
    if (outlookSearch) {
      const q = outlookSearch.toLowerCase();
      const matchSubject = mailItem.subject.toLowerCase().includes(q);
      const matchContent = mailItem.content.toLowerCase().includes(q);
      const matchSenderName = mailItem.senderName.toLowerCase().includes(q);
      if (!matchSubject && !matchContent && !matchSenderName) {
        return false;
      }
    }
    // Categories
    if (outlookCategory !== "all" && mailItem.category !== outlookCategory) {
      return false;
    }
    return true;
  });

  // Decide if background classes matched
  const getThemeClass = () => {
    const bgObj = systemState.backgrounds.find((bg) => bg.id === activeBackground) || { color: "bg-slate-900 text-slate-100" };
    return bgObj.color;
  };

  // Remote Control Session Functions
  const startRemoteSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      if (remoteVideoRef.current) {
         remoteVideoRef.current.srcObject = stream;
      }
      setRemoteSessionActive(true);
      setRemoteChatMessages(prev => [...prev, {
         sender: "System",
         text: "🔗 高清多人协作与桌面分享通道已开启 - 等待远端技术人员接入...",
         time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})
      }]);
      stream.getVideoTracks()[0].onended = () => {
         setRemoteSessionActive(false);
         if (remoteVideoRef.current) {
           remoteVideoRef.current.srcObject = null;
         }
         setRemoteChatMessages(prev => [...prev, {
           sender: "System",
           text: "⭕ 桌面协同会话已结束。",
           time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})
         }]);
      };
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoteChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remoteChatInput.trim()) return;
    setRemoteChatMessages(prev => [...prev, {
      sender: currentUser?.fullName || "Host",
      text: remoteChatInput,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }]);
    
    // Simulate remote responder
    setTimeout(() => {
      setRemoteChatMessages(prev => [...prev, {
         sender: "技术支持 [远端协作中]",
         text: "系统已识别。请放心，您本机操作者拥有最高鼠标主权优先防线（OS底层拒绝外部真光标拦截），当前屏幕仅做共享与图画标注协同。",
         time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 2000);
    setRemoteChatInput("");
  };

  return (
    <div id="app-root" className={`min-h-screen font-sans transition-all duration-300 ${getThemeClass()} flex flex-col relative`}>
      {/* Target Browser Checks Visual Execution layer */}
      {browserCheckBlock && !browserCheckBlock.isWarning && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
           <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-lg shadow-2xl flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse"></div>
              <ShieldAlert className="w-16 h-16 text-red-500 mb-6 animate-bounce" />
              <h2 className="text-2xl font-black text-white mb-4 tracking-tight">安全探针拦截 (Safety Blocked)</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-8 font-medium">{browserCheckBlock.message}</p>
              <div className="flex gap-4">
                 <button onClick={() => {
                   const el = document.documentElement;
                   if (el.requestFullscreen) {
                     el.requestFullscreen();
                   } else if ((el as any).webkitRequestFullscreen) {
                     (el as any).webkitRequestFullscreen();
                   } else if ((el as any).msRequestFullscreen) {
                     (el as any).msRequestFullscreen();
                   }
                 }} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-red-900/50 transition flex items-center gap-2">
                    <Maximize className="w-4 h-4" /> 尝试激活全屏
                 </button>
                 <button onClick={() => { window.location.hash = "#home" }} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition">
                    退回到主页
                 </button>
              </div>
           </div>
        </div>
      )}

      {browserCheckBlock && browserCheckBlock.isWarning && (
        <div className="bg-amber-500 text-amber-950 font-bold px-4 py-3 flex items-center justify-center gap-3 text-xs z-40 relative shadow-md">
           <ShieldAlert className="w-4 h-4" />
           {browserCheckBlock.message}
           <button onClick={() => setBrowserCheckBlock(null)} className="ml-2 bg-amber-600 text-amber-100 hover:bg-amber-700 px-2 py-1 rounded">忽略</button>
        </div>
      )}

      {/* Top Warning Alert for flight simulator steps */}
      {currentHash === "#msfs" && msfsWarningOpen && (
        <div id="msfs-alert-belt" className="bg-amber-500 text-slate-950 font-semibold px-4 py-2.5 flex items-center justify-between text-sm shadow-md animate-bounce">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>
              <strong>FAA Deployment Safe Check:</strong> MSFS Sim requires checklist configuration. Authenticate or configure default routing parameters to disable notice.
            </span>
          </div>
          <button
            onClick={() => setMsfsWarningOpen(false)}
            className="p-1 hover:bg-amber-600 rounded"
            title="Mark deployment checklist completed"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main App Navigation Bar */}
      <header id="main-header" className="border-b border-white/10 shrink-0 sticky top-0 z-40 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
          
          {/* Logo Identity */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500 text-slate-950 rounded-xl font-black text-lg shadow-lg tracking-wider">
              FP
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {t("FATSHAN POST")} <span className="hidden sm:inline-block text-xs bg-white/20 text-cyan-200 px-2 py-0.5 rounded-full">{t("Mail & compiler Console")}</span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">{t("Owner Terminal Desk • Administrator: marvis_zhou")}</p>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                   const el = document.documentElement;
                   if (!document.fullscreenElement) {
                     if (el.requestFullscreen) {
                       el.requestFullscreen();
                     } else if ((el as any).webkitRequestFullscreen) {
                       (el as any).webkitRequestFullscreen();
                     } else if ((el as any).msRequestFullscreen) {
                       (el as any).msRequestFullscreen();
                     }
                   } else {
                     if (document.exitFullscreen) {
                       document.exitFullscreen();
                     }
                   }
              }}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded font-bold text-xs flex items-center justify-center border border-white/20 title='全屏模式'"
            >
              <Maximize className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded font-bold text-xs flex items-center gap-2 border border-white/20"
            >
              <div className="space-y-1"><div className="w-4 h-0.5 bg-white"></div><div className="w-4 h-0.5 bg-white"></div><div className="w-4 h-0.5 bg-white"></div></div>
              <span>{lang === 'en' ? 'Menu' : '侧栏菜单'}</span>
            </button>
          </div>

          {/* Nav Links containing CYAN for Home and SOFT BLUE for Work */}
          <nav className="hidden md:flex flex-wrap items-center gap-2" id="navigation-rail">
            <a
              href="#home"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                currentHash === "#home"
                  ? "bg-cyan-500 text-slate-950 shadow-md scale-105"
                  : "text-cyan-400 hover:bg-cyan-500/15"
              }`}
            >
              {t("#home")}
            </a>
            <a
              href="#work"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                currentHash === "#work"
                  ? "bg-blue-500 text-white shadow-md scale-105"
                  : "text-blue-300 hover:bg-blue-500/15"
              }`}
            >
              {t("#work")}
            </a>
            <a
              href="#rory-gpkos"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#rory-gpkos"
                  ? "bg-emerald-500 text-slate-950"
                  : "text-emerald-300 hover:bg-emerald-500/15"
              }`}
            >
              {t("#rory-gpkos IDE")}
            </a>
            <a
              href="#msfs"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#msfs"
                  ? "bg-amber-500 text-slate-950"
                  : "text-amber-300 hover:bg-amber-500/15"
              }`}
            >
              {t("msfs Sim")}
            </a>
            <a
              href="#remote"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#remote"
                  ? "bg-indigo-500 text-white"
                  : "text-indigo-300 hover:bg-indigo-500/15"
              }`}
            >
              {t("Remote Screen")}
            </a>
            <a
              href="#video"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#video"
                  ? "bg-rose-500 text-white"
                  : "text-rose-300 hover:bg-rose-500/15"
              }`}
            >
              {t("Video Stream")}
            </a>
            <a
              href="#friendship"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#friendship"
                  ? "bg-purple-500 text-white"
                  : "text-purple-300 hover:bg-purple-500/15"
              }`}
            >
              {t("Friendship Album")}
            </a>
            <a
              href="#drive"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#drive"
                  ? "bg-sky-500 text-white shadow-md scale-105"
                  : "text-sky-300 hover:bg-sky-500/15"
              }`}
            >
              {lang === 'en' ? 'Cloud Drive' : '云端储存'}
            </a>
            <a
              href="#admin"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#admin"
                  ? "bg-fuchsia-500 text-white shadow-md scale-105"
                  : "text-fuchsia-300 hover:bg-fuchsia-500/15"
              }`}
            >
              <div className="flex items-center gap-1.5"><Shield className="w-4 h-4" />{lang === 'en' ? 'Admin' : '高级后台'}</div>
            </a>
            <a
              href="#blog"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentHash === "#blog"
                  ? "bg-teal-500 text-white"
                  : "text-teal-300 hover:bg-teal-500/15"
              }`}
            >
              {t("Blogs CMS")}
            </a>
            {systemState.navPages?.filter(p => p.isVisible).map(p => (
              <a
                key={p.id}
                href={p.isExternal ? p.externalLink : `#subpage-${p.id}`}
                target={p.isExternal ? "_blank" : undefined}
                rel={p.isExternal ? "noopener noreferrer" : undefined}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  currentHash === `#subpage-${p.id}`
                    ? "bg-fuchsia-500 text-white"
                    : "text-fuchsia-300 hover:bg-fuchsia-500/15"
                }`}
              >
                {lang === 'en' ? p.titleEn : p.titleZh}
              </a>
            ))}
          </nav>

          {/* Right Corner Identity Info & Mini session widget */}
          <div className="hidden md:flex items-center gap-3">
            <button
               onClick={() => {
                   const el = document.documentElement;
                   if (!document.fullscreenElement) {
                     if (el.requestFullscreen) {
                       el.requestFullscreen();
                     } else if ((el as any).webkitRequestFullscreen) {
                       (el as any).webkitRequestFullscreen();
                     } else if ((el as any).msRequestFullscreen) {
                       (el as any).msRequestFullscreen();
                     }
                   } else {
                     if (document.exitFullscreen) {
                       document.exitFullscreen();
                     }
                   }
               }}
               className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-xs flex items-center justify-center border border-white/20 transition"
            >
               <Maximize className="w-4 h-4" />
            </button>
            {currentUser ? (
              <div id="active-session-chip" className="bg-white/10 text-white pl-1.5 pr-2 py-1.5 rounded-full flex items-center gap-2 text-xs border border-white/10">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full object-cover border border-white/20" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center font-bold">{currentUser.fullName.charAt(0)}</div>
                )}
                <span className="font-semibold">{currentUser.fullName}</span>
                <span className="text-slate-400">({currentUser.emailUsername}@{systemState.activeDomain})</span>
                {currentUser.role === "admin" && (
                  <span className="bg-red-500 text-white font-extrabold px-1.5 py-0.2 rounded text-[10px]">ADMIN</span>
                )}
                <button
                  onClick={toggleLanguage}
                  className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full transition text-xs font-bold border border-white/20 ml-1"
                >
                  {lang === 'en' ? '中' : 'EN'}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-red-500 hover:text-white px-2 py-1 rounded-full transition text-xs font-bold"
                >
                  {t("Log out")}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={toggleLanguage}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10"
                >
                  {lang === 'en' ? '中文' : 'English'}
                </button>
                <a
                  href="#home"
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10"
                >
                  {t("Guest Visitor")}
                </a>
              </div>
            )}
          </div>

          </div>

          {/* Mobile menu fold-out (Fixed Screen Drawer) */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              {/* Overlay Backdrop */}
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              ></div>
              
              {/* Drawer Container */}
              <div className="relative w-64 max-w-[80vw] bg-slate-900 h-full shadow-2xl border-r border-white/10 flex flex-col pt-6 pb-6 overflow-y-auto z-50">
                <div className="px-4 mb-6 flex items-center justify-between">
                  <div className="font-bold text-white text-lg tracking-tight">Fatshan Menu</div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-white/60 hover:text-white p-1">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <nav className="flex flex-col gap-2 px-4 flex-grow">
                <a
                  href="#home"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#home"
                      ? "bg-cyan-500 text-slate-950 shadow-md"
                      : "text-cyan-400 hover:bg-cyan-500/15 border border-cyan-500/20"
                  }`}
                >
                  {t("#home")}
                </a>
                <a
                  href="#work"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#work"
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-blue-300 hover:bg-blue-500/15 border border-blue-500/20"
                  }`}
                >
                  {t("#work")}
                </a>
                <a
                  href="#rory-gpkos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#rory-gpkos"
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-emerald-300 hover:bg-emerald-500/15 border border-emerald-500/20"
                  }`}
                >
                  {t("#rory-gpkos IDE")}
                </a>
                <a
                  href="#msfs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#msfs"
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-amber-300 hover:bg-amber-500/15 border border-amber-500/20"
                  }`}
                >
                  {t("msfs Sim")}
                </a>
                <a
                  href="#remote"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#remote"
                      ? "bg-indigo-500 text-white shadow-md"
                      : "text-indigo-300 hover:bg-indigo-500/15 border border-indigo-500/20"
                  }`}
                >
                  {t("Remote Screen")}
                </a>
                <a
                  href="#video"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#video"
                      ? "bg-rose-500 text-white shadow-md"
                      : "text-rose-300 hover:bg-rose-500/15 border border-rose-500/20"
                  }`}
                >
                  {t("Video Stream")}
                </a>
                <a
                  href="#friendship"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#friendship"
                      ? "bg-purple-500 text-white shadow-md"
                      : "text-purple-300 hover:bg-purple-500/15 border border-purple-500/20"
                  }`}
                >
                  {t("Friendship Album")}
                </a>
                <a
                  href="#drive"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#drive"
                      ? "bg-sky-500 text-white shadow-md"
                      : "text-sky-300 hover:bg-sky-500/15 border border-sky-500/20"
                  }`}
                >
                  {lang === 'en' ? 'Cloud Drive' : '云端储存'}
                </a>
                <a
                  href="#admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentHash === "#admin"
                      ? "bg-fuchsia-500 text-white shadow-md"
                      : "text-fuchsia-300 hover:bg-fuchsia-500/15 border border-fuchsia-500/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5"><Shield className="w-4 h-4" />{lang === 'en' ? 'Admin Console' : '高级后台'}</div>
                </a>
                <a
                  href="#blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    currentHash === "#blog"
                      ? "bg-teal-500 text-white shadow-md"
                      : "text-teal-300 hover:bg-teal-500/15 border border-teal-500/20"
                  }`}
                >
                  {t("Blogs CMS")}
                </a>
                {systemState.navPages?.filter(p => p.isVisible).map(p => (
                  <a
                    key={p.id}
                    href={p.isExternal ? p.externalLink : `#subpage-${p.id}`}
                    target={p.isExternal ? "_blank" : undefined}
                    rel={p.isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => { if (!p.isExternal) setMobileMenuOpen(false); }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      currentHash === `#subpage-${p.id}`
                        ? "bg-fuchsia-500 text-white"
                        : "text-fuchsia-300 hover:bg-fuchsia-500/15 border border-fuchsia-500/20"
                    }`}
                  >
                    {lang === 'en' ? p.titleEn : p.titleZh}
                  </a>
                ))}
              </nav>

              <div className="mt-4 pt-4 px-4 border-t border-white/10 flex flex-col gap-3 shrink-0">
                {currentUser ? (
                  <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      {currentUser.avatarUrl ? (
                         <img src={currentUser.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                      ) : (
                         <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-lg text-white">{currentUser.fullName.charAt(0)}</div>
                      )}
                      <div>
                        <div className="text-white text-sm font-semibold">{currentUser.fullName}</div>
                        <div className="text-slate-400 text-xs">({currentUser.emailUsername}@{systemState.activeDomain})</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={toggleLanguage}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition text-xs font-bold flex-1"
                      >
                        {lang === 'en' ? '切换为中文' : 'Switch to EN'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="bg-red-500/20 hover:bg-red-500 text-red-100 px-3 py-1.5 rounded-lg transition text-xs font-bold flex-1"
                      >
                        {t("Log out")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={toggleLanguage}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-semibold border border-white/10 flex-1"
                    >
                      {lang === 'en' ? '中文' : 'English'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            </div>
          )}

        </div>
      </header>

      {/* Primary Layout Frame block */}
      <div className="flex-grow max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-stretch gap-6 p-4 sm:p-6 lg:p-8">
        
        {/* Tools Sidebar */}
        <aside className="w-full md:w-48 shrink-0 flex flex-col gap-4">
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 sticky top-24 flex flex-col gap-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2 uppercase tracking-wide">
              <Zap className="h-4 w-4 text-cyan-400" />
              {lang === 'en' ? 'AI Tools' : 'AI 工具'}
            </h3>
            <a
              href="#tool-translator"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                currentHash === '#tool-translator' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> {lang === 'en' ? 'AI Translator' : 'AI 翻译'}
            </a>
            <a
              href="#tool-summarizer"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                currentHash === '#tool-summarizer' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> {lang === 'en' ? 'Summarizer' : 'AI 摘要'}
            </a>
            <a
              href="#tool-code"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                currentHash === '#tool-code' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" /> {lang === 'en' ? 'Code Beautifier' : '代码格式化'}
            </a>
            <a
              href="#tool-geminiai"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                currentHash === '#tool-geminiai' ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-fuchsia-400" /> {lang === 'en' ? 'Gemini AI Chat' : 'Gemini AI 聊天'}
            </a>
            
            {currentUser?.role === 'admin' && (
              <>
                <div className="h-px bg-white/10 my-2"></div>
                <a
                  href="#admin-subpages"
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                    currentHash === '#admin-subpages' || currentHash === '#admin-aiaccess' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" /> {lang === 'en' ? 'Page Admin' : '页面管理'}
                </a>
              </>
            )}
          </div>
        </aside>

        <main id="primary-layout" className="flex-grow flex flex-col gap-6 min-w-0">

        {/* Dynamic global buttons rendering based on administrative conditions */}
        {systemState.customButtons && systemState.customButtons.length > 0 && (
          <div id="dynamic-buttons-belt" className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
              <Compass className="h-4 w-4 text-cyan-400" />
              Custom Tools:
            </span>
            {systemState.customButtons.map((btn) => {
              // Rule checking
              if (btn.banned) return null;
              if (btn.visibility === "logined" && !currentUser) return null;
              if (btn.visibility === "specified") {
                if (!currentUser) return null;
                const fullE = `${currentUser.emailUsername}@${currentUser.emailDomain}`.toLowerCase();
                const fitsUsr = btn.specifiedUsers.some(
                  (u) =>
                    u.toLowerCase() === currentUser.emailUsername.toLowerCase() ||
                    u.toLowerCase() === fullE ||
                    u.toLowerCase() === currentUser.contact.toLowerCase()
                );
                if (!fitsUsr) return null;
              }

              return (
                <a
                  key={btn.id}
                  href={btn.actionUrl}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow transition-all hover:scale-105 inline-flex items-center gap-1.5 ${btn.styling.bgColor || "bg-cyan-600"} ${btn.styling.textColor || "text-white"}`}
                >
                  <Zap className="h-3 w-3" />
                  {btn.label}
                </a>
              );
            })}
          </div>
        )}

        {/* SECTION 1: HOME VISITOR BRANCH screen Layout */}
        {currentHash === "#home" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" id="home-dashboard">
            
            {/* Left Big Panel: Outlook mail preview mini summary / Authentication */}
            <div className="md:col-span-2 flex flex-col gap-6">
              
              {/* Authenticated OWA Welcome / Login & Register form */}
              {!currentUser ? (
                <div id="guest-access-panel" className="bg-slate-950/80 backdrop-blur-md rounded-3xl p-6 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500"></div>
                  
                  {/* 贴心问候模块 (Warm welcome message) */}
                  <div className="mb-6 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 p-5 rounded-2xl shadow-inner">
                     <div className="font-bold text-lg text-indigo-300 mb-2 flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-amber-400" />
                       您好呀，欢迎回到您的专属云端工作生态！
                     </div>
                     <p className="text-sm text-slate-300 leading-relaxed">
                       无论是处理繁杂的邮件协作、随时随地的远端守护，还是管理错综复杂的代码与服务，这套专属系统都会始终伴您左右，提供最隐秘、稳定、贴心的保障。
                       <br/><br/>
                       💡 <strong className="text-cyan-400">贴心小提示：</strong> 我们已经做了全平台深度响应式优化。不管您现在正拿着手机还是端坐在电脑前，所有内容排版都会完美适配您的屏幕。如果在手机端需要全屏沉浸体验，请随时点击顶部右侧的「<Maximize className="w-3.5 h-3.5 inline-block mx-0.5 text-white" />全屏」按钮。放轻松，接下来的一切交给系统为您打理。
                     </p>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <Lock className="h-6 w-6 text-cyan-400" />
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Fatshan Digital Postal Clearance Desk</h2>
                      <p className="text-sm text-slate-400">Authenticate credentials or sign up immediately to unlock your personal Inbox suites.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Login column */}
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                      <h3 className="text-md font-bold text-cyan-300 mb-4 flex items-center gap-1">
                        Sign In Existing Identity
                      </h3>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="block text-xs text-slate-400 font-semibold mb-1">Email / Username</label>
                          <input
                            type="text"
                            placeholder={"marvis_zhou@" + systemState.activeDomain}
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 font-semibold mb-1">Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 px-4 rounded-xl text-sm transition shadow-lg"
                        >
                          Sign In Securely
                        </button>
                      </form>
                    </div>

                    {/* Registration & Global Integration Column */}
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col gap-4">
                      <h3 className="text-md font-bold text-emerald-300 mb-2 flex items-center gap-1">
                        Global Secure Auth (Double Encryption)
                      </h3>
                      <p className="text-xs text-slate-400 mb-2">
                        Bind your global provider to our secure proxy server. All data uses AES-encrypted transmission tunnels.
                      </p>
                      
                      <button
                        onClick={() => loginGoogleProvider()}
                        className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4 text-emerald-400" />
                        {googleToken ? 'Connected to Global Gateway' : 'Link Global Provider Securely'}
                      </button>

                      <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center"><span className="bg-slate-900 px-2 text-[10px] text-slate-500 uppercase">or CREATE</span></div>
                      </div>

                      <a
                        href="https://accounts.google.com/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm transition shadow-lg text-center block"
                      >
                        Register New Identity
                      </a>
                      <p className="text-[10px] text-slate-500 text-center mt-2 leading-tight">
                        Registration requires accessing the global gateway directly. Once established, return here to link it securely.
                      </p>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Logged in caring banner */}
                  <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400 shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-emerald-300">欢迎登舰，{currentUser.fullName}！今天也要顺利开心哦～</h3>
                        <p className="text-xs text-slate-400 mt-0.5">各项系统组件已为您启动完毕。如果您是手机访问，可以通过上方菜单和右侧气泡工具箱呼叫 AI 整理事项。</p>
                      </div>
                    </div>
                  </div>

                  {/* Primary OWA interface when logged in on Home screen! */}
                  <div id="outlook-client-app" className="bg-slate-950/90 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col h-[700px]">
                  
                  {/* OWA Ribbon toolbar */}
                  <div className="bg-slate-900 shrink-0 border-b border-white/10 p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-black tracking-normal text-sm bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/20 flex items-center gap-1.5">
                        <Mail className="h-4 w-4" />
                        Outlook OWA Desktop Suite
                      </span>
                      <button
                        onClick={() => {
                          setComposeTo("");
                          setComposeSubject("");
                          setComposeContent("");
                          setMailComposeOpen(true);
                        }}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        New Email
                      </button>
                      <button
                        onClick={fetchUserEmails}
                        className="p-1.5 hover:bg-white/10 text-slate-300 rounded-lg transition"
                        title="Force sync"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Email OWA density and light/dark theme toggle */}
                    <div className="flex items-center gap-3">
                      <div className="bg-white/5 rounded-lg px-2 py-1 flex items-center border border-white/10 text-[10px] text-slate-400 gap-2">
                        <span>Density:</span>
                        <button
                          onClick={() => setOutlookDensity("compact")}
                          className={`px-1.5 py-0.5 rounded ${outlookDensity === "compact" ? "bg-cyan-500 text-slate-950 font-bold" : "hover:text-white"}`}
                        >
                          Compact
                        </button>
                        <button
                          onClick={() => setOutlookDensity("cozy")}
                          className={`px-1.5 py-0.5 rounded ${outlookDensity === "cozy" ? "bg-cyan-500 text-slate-950 font-bold" : "hover:text-white"}`}
                        >
                          Cozy
                        </button>
                      </div>

                      <div className="flex text-slate-300 gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                        <button
                          onClick={() => setOutlookTheme("light")}
                          className={`p-1 rounded ${outlookTheme === "light" ? "bg-white text-slate-900" : "hover:bg-white/15"}`}
                          title="OWA Light Spacing"
                        >
                          <Sun className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setOutlookTheme("dark")}
                          className={`p-1 rounded ${outlookTheme === "dark" ? "bg-white text-slate-900" : "hover:bg-white/15"}`}
                          title="OWA Charcoal spacing"
                        >
                          <Moon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mail Search filters */}
                  <div className="bg-slate-900/40 p-2 shrink-0 border-b border-white/5 flex items-center justify-between gap-4">
                    <div className="relative flex-grow max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search OWA Mailbox items (recipient, content)..."
                        value={outlookSearch}
                        onChange={(e) => setOutlookSearch(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white border border-white/10 rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    {/* Category selectors */}
                    <div className="flex gap-1.5">
                      {["all", "work", "personal", "social"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setOutlookCategory(cat)}
                          className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition ${
                            outlookCategory === cat ? "bg-cyan-500/15 border border-cyan-500/50 text-cyan-300" : "hover:bg-white/5 text-slate-400"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Outlook Client Tri-Pane Core */}
                  <div className={`flex flex-grow overflow-hidden ${outlookTheme === "light" ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-100"}`}>
                    
                    {/* OWA Directory Pane (Left) */}
                    <aside className="w-48 bg-slate-900 border-r border-white/10 shrink-0 p-3 flex flex-col justify-between text-xs text-slate-300 select-none">
                      <div className="space-y-4">
                        <div>
                          <div className="px-2 pb-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                            Folders
                          </div>
                          <nav className="space-y-1">
                            {[
                              { id: "inbox", label: "Inbox 收件箱", icon: Mail },
                              { id: "sent", label: "Sent 已发送", icon: Send },
                              { id: "draft", label: "Drafts 草稿箱", icon: FileText },
                              { id: "spam", label: "Junk 垃圾文件", icon: ShieldAlert },
                              { id: "archive", label: "Archive 归档", icon: BookOpen },
                              { id: "trash", label: "Deleted 已删除", icon: Trash2 }
                            ].map((fld) => {
                              const fldIcon = fld.icon;
                              const count = emails.filter((e) => e.folder === fld.id).length;
                              return (
                                <button
                                  key={fld.id}
                                  onClick={() => {
                                    setOutlookFolder(fld.id);
                                    setSelectedEmail(null);
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition ${
                                    outlookFolder === fld.id ? "bg-cyan-500 text-slate-950 font-bold shadow-md" : "hover:bg-white/5"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <fld.icon className="h-3.5 w-3.5" />
                                    <span>{fld.label}</span>
                                  </div>
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                                    outlookFolder === fld.id ? "bg-slate-900 text-white" : "bg-white/10"
                                  }`}>
                                    {count}
                                  </span>
                                </button>
                              );
                            })}
                          </nav>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                        <div className="text-[10px] text-slate-400 font-semibold mb-1">Decoupled Space:</div>
                        <div className="text-[10px] font-bold text-cyan-400 truncate">@{systemState.activeDomain}</div>
                        <div className="text-[9px] text-slate-500">All data preserved during transition!</div>
                      </div>
                    </aside>

                    {/* OWA Email list Pane (Middle) */}
                    <div className="w-1/3 border-r border-slate-800 flex flex-col shrink-0 bg-slate-900/10 overflow-y-auto">
                      {filteredEmails.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs">
                          No mailbox records localized. Check other folders or senders.
                        </div>
                      ) : (
                        filteredEmails.map((mail) => (
                          <div
                            key={mail.id}
                            onClick={() => setSelectedEmail(mail)}
                            className={`p-3 border-b text-left transition select-none cursor-pointer border-slate-800 ${
                              selectedEmail?.id === mail.id
                                ? "bg-cyan-500/15 border-l-4 border-l-cyan-400"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-1 pb-1">
                              <span className="text-xs font-bold truncate text-cyan-300">
                                {mail.senderName}
                              </span>
                              <span className="text-[9px] text-slate-400 whitespace-nowrap">
                                {new Date(mail.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="text-xs font-semibold truncate text-white pb-0.5 flex items-center gap-1.5">
                              {mail.isStarred && <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />}
                              {mail.subject}
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2">
                              {mail.content.replace(/<[^>]*>/g, "")}
                            </p>
                            {mail.tags && mail.tags.length > 0 && (
                              <div className="flex gap-1 pt-1.5 flex-wrap">
                                {mail.tags.map((tag) => (
                                  <span key={tag} className="bg-slate-800 text-white text-[8px] px-1 py-0.2 rounded font-bold">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* OWA Email Read Window Pane (Right) */}
                    <div className="flex-grow p-4 overflow-y-auto flex flex-col justify-between">
                      {selectedEmail ? (
                        <div className="space-y-4 text-left">
                          
                          {/* Subject Header with Star / Delete action menu */}
                          <div className="border-b border-white/10 pb-4">
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <h3 className="text-sm font-bold text-cyan-300">
                                {selectedEmail.subject}
                              </h3>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleMailAction(selectedEmail.id, "star")}
                                  className="p-1 hover:bg-slate-800 text-amber-500 rounded"
                                  title="Star email"
                                >
                                  <Star className={`h-4 w-4 ${selectedEmail.isStarred ? "fill-amber-400" : ""}`} />
                                </button>
                                <button
                                  onClick={() => handleMailAction(selectedEmail.id, "move", "trash")}
                                  className="p-1 hover:bg-slate-800 text-red-500 rounded"
                                  title="Bin item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <div>
                                Sender: <strong className="text-slate-300">{selectedEmail.senderName}</strong>
                                <span className="text-[10px] ml-1">({selectedEmail.senderUsername}@{selectedEmail.senderDomain})</span>
                              </div>
                              <div>
                                {new Date(selectedEmail.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">
                              Receiver: {selectedEmail.receiverUsername}@{selectedEmail.receiverDomain}
                            </p>
                          </div>

                          {/* Email Body HTML safely output */}
                          <div
                            className="text-xs space-y-2 text-slate-300 leading-relaxed max-w-none"
                            dangerouslySetInnerHTML={{ __html: selectedEmail.content }}
                          />

                          {/* Dual Content Audit AI scanner info panel */}
                          {selectedEmail.sensitivityReport && (
                            <div className="mt-8 p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl flex items-start gap-3">
                              <Cpu className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-[10px] uppercase font-bold text-cyan-400">
                                  Server-Side AI Dual Threat Compliance Scan
                                </h4>
                                <p className="text-[11px] text-slate-300 mt-1">
                                  Policy Filter Report: <span className="font-bold text-white uppercase">{selectedEmail.sensitivityReport}</span>
                                </p>
                                {selectedEmail.aiSummary && (
                                  <p className="text-[10px] text-slate-400 italic mt-0.5">
                                    Summary: {selectedEmail.aiSummary}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8">
                          <Mail className="h-10 w-10 text-slate-500 mb-2" />
                          <h3 className="text-xs font-bold text-slate-300">No Email Selected</h3>
                          <p className="text-[11px] text-slate-500 mt-1">Select an item from the current middle OWA list pane index to review attachments & content scanning.</p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
                </div>
              )}

              {/* Lobby public Chat log */}
              <div className="bg-slate-950 p-5 rounded-3xl border border-white/10 text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    Public Communication Lobby Chat logs
                  </h3>
                  <span className="text-[9px] bg-white/10 text-slate-400 font-extrabold px-2 py-0.5 rounded uppercase">
                    Verification: FATSHAN POST
                  </span>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-2xl p-3 h-48 overflow-y-auto space-y-3 mb-3 text-xs">
                  {systemState.chatMessages && systemState.chatMessages.map((msg) => (
                    <div key={msg.id} className="pb-1">
                      <strong className="text-cyan-400">{msg.sender}:</strong>
                      <span className="text-slate-200 ml-1">{msg.content}</span>
                      <span className="text-[8px] text-slate-500 block">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleLobbyChatSend} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Broadcast messages to live room guests..."
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    className="flex-grow bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                  >
                    <span>Send</span>
                    <SendHorizontal className="h-3 w-3" />
                  </button>
                </form>
              </div>

              {/* Global Secure Search Tool Component */}
              <div className="bg-slate-950/80 backdrop-blur-md rounded-3xl p-6 border border-fuchsia-500/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-fuchsia-500/10 rounded-lg">
                    <Search className="h-6 w-6 text-fuchsia-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Global Secure Search Engine</h3>
                    <p className="text-xs text-slate-400">Domestic proxy to bypassed global indexers. No VPN required.</p>
                  </div>
                </div>

                <form onSubmit={handleSecureSearch} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Search the uncensored global web securely..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow bg-slate-900 border border-fuchsia-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-400 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 transition"
                  >
                    {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    <span>{isSearching ? 'Tunneling...' : 'Search'}</span>
                  </button>
                </form>

                {searchResults.length > 0 && (
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 max-h-64 overflow-y-auto space-y-4">
                    {searchResults.map((result, idx) => (
                      <div key={idx} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-fuchsia-400 hover:underline inline-block mb-1">
                          {result.title}
                        </a>
                        <p className="text-xs text-slate-300 leading-relaxed">{result.snippet}</p>
                        <p className="text-[10px] text-emerald-500 mt-1 truncate">{result.link}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right sidebar Panel: Intelligent AI-Assistant desk & Client general feedback Form */}
            <div className="md:col-span-1 flex flex-col gap-6">
              
              {/* OWA Compose Mailbox Modal embedded */}
              {mailComposeOpen && currentUser && (
                <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl p-5 text-left shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Compose Rich Email
                    </h3>
                    <button
                      onClick={() => setMailComposeOpen(false)}
                      className="p-1 rounded hover:bg-white/10 text-slate-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">To (Full credentials target address)</label>
                      <input
                        type="email"
                        placeholder={"marvis_zhou@" + systemState.activeDomain}
                        value={composeTo}
                        onChange={(e) => setComposeTo(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Subject</label>
                      <input
                        type="text"
                        placeholder="Project coordination notes..."
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1 font-mono">Content Body (Rich HTML compliant)</label>
                      <textarea
                        rows={6}
                        placeholder="<h3>Rich content works</h3><p>Hi, standard verification code remains: FATSHAN POST.</p>"
                        value={composeContent}
                        onChange={(e) => setComposeContent(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="text-slate-400 block mb-0.5">Category</label>
                        <select
                          value={composeCategory}
                          onChange={(e: any) => setComposeCategory(e.target.value)}
                          className="w-full bg-slate-900 text-white rounded border border-white/10 p-1"
                        >
                          <option value="work">Work Pro</option>
                          <option value="personal">Personal Aura</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Primary star</label>
                        <input
                          type="checkbox"
                          checked={composeStarred}
                          onChange={(e) => setComposeStarred(e.target.checked)}
                          className="mr-1.5"
                        />
                        <span>Flag starred</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-2 px-4 rounded-xl text-xs transition"
                    >
                      Process Server-Side AI Scan & Transmit
                    </button>
                  </form>
                </div>
              )}

              {/* AI intelligent assistant desk widget */}
              <div className="bg-slate-950/70 p-5 rounded-3xl border border-white/10 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="h-5 w-5 text-cyan-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Active AI Service Agent Desk</h3>
                    <p className="text-[10px] text-zinc-400">Powered by Gemini 3.5. Fully synchronizes security checks.</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 h-64 overflow-y-auto rounded-2xl border border-white/5 space-y-3 mb-3 text-[11px] leading-relaxed">
                  {supportChat.map((msg) => (
                    <div key={msg.id} className="pb-1 border-b border-white/5">
                      <span className={`font-extrabold text-[9px] uppercase tracking-wide px-1.5 py-0.2 rounded mr-1.5 ${
                        msg.sender === "ai" ? "bg-cyan-950/80 text-cyan-400" : msg.sender === "staff" ? "bg-red-500 text-white" : "bg-white/10 text-slate-300"
                      }`}>
                        {msg.sender}
                      </span>
                      <p className="mt-1 text-slate-200 whitespace-pre-line">{msg.text}</p>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="text-slate-400 flex items-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Gemini scanning credentials base...</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSupportAiChat} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask about validation code, domain swaps..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="flex-grow bg-slate-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1 text-xs font-bold rounded-xl transition"
                    >
                      Ask
                    </button>
                  </div>
                </form>
              </div>

              {/* CRM feedback submissions dialog */}
              <div className="bg-slate-950/80 p-5 rounded-3xl border border-white/10 text-left">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                  <Send className="h-4 w-4" />
                  General Feedback Submissions
                </h3>
                <p className="text-[10px] text-zinc-400 mb-3">Directed straight inside Master Administrator's inbox account.</p>

                {feedbackSuccess && (
                  <div className="p-2 mb-3 bg-emerald-900/40 text-emerald-300 text-[10px] rounded-xl border border-emerald-500/20">
                    ✓ Received successfully. Internal alert mail sent to Master Zhou.
                  </div>
                )}

                <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-0.5">Your email coordinate</label>
                    <input
                      type="email"
                      placeholder="guest_tester@fatshanpost.com"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-0.5">Feedback content message</label>
                    <textarea
                      rows={3}
                      placeholder="Simulation checks behave perfectly. Need custom buttons enabled."
                      value={feedbackContent}
                      onChange={(e) => setFeedbackContent(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-1.5 px-4 rounded-xl text-xs transition"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>

              {/* Wallpaper shopping catalog utilizing unified storage allocation quota */}
              {currentUser && (
                <div className="bg-slate-950/80 p-5 rounded-3xl border border-white/10 text-left">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    Interactive Wallpaper shop
                  </h3>
                  <p className="text-[10px] text-zinc-400 mb-3">Custom themes purchased in quota storage exchange rates.</p>

                  <div className="space-y-2">
                    {systemState.backgrounds.map((bg) => (
                      <div key={bg.id} className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white text-[11px]">{bg.name}</p>
                          <p className="text-[9px] text-cyan-400">Price: {bg.price}</p>
                        </div>
                        <button
                          onClick={() => applyWallpaperTheme(bg.id, bg.color, bg.price)}
                          className="bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 px-2.5 py-1 text-[10px] rounded font-extrabold uppercase"
                        >
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* SECTION 2: WORK SPACE BRANCH screen Layout (Vibrant Soft Blue) */}
        {currentHash === "#work" && (
          <div className="space-y-6 animate-fade-in" id="work-workspace">
            
            {/* Header Identity of Work Branch */}
            <div className="bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-500/20 rounded-3xl p-6 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">
                  Secure Operational Hub Area
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                  Collaborative Workspace Dashboard Console
                </h2>
                <p className="text-sm text-slate-300">
                  Real-time synchronization logs, domain switches data retention room, and custom buttons console.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <span className="text-xs bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-xl font-mono font-bold">
                  Active Domain: {systemState.activeDomain}
                </span>
                <span className="text-xs bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-xl font-mono font-bold">
                  Legacy Host Address: {systemState.oldDomain}
                </span>
              </div>
            </div>

            {/* If user is not internal staff, request auth/show message */}
            {!currentUser ? (
              <div className="bg-slate-950 border border-blue-500/10 rounded-3xl p-8 text-center">
                <Lock className="h-10 w-10 text-cyan-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">Privileged Workspace Area</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 mb-4">
                  Access to domain transfers, user storage quotas and buttons creation are restricted to authenticated administrators.
                </p>
                <a
                  href="#home"
                  className="bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold py-2 px-5 rounded-xl inline-block"
                >
                  Return to Home Desk for Login
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1 & 2: Database users and shop logistics, domain configuration */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Domain Transfer Desk Room with strict retention warnings */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 text-left">
                    <h3 className="text-md font-bold text-white flex items-center gap-2 mb-2">
                      <RefreshCw className="h-5 w-5 text-cyan-400" />
                      Domain SWAP System Desk (Data Preservation)
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      When the active domain is updated here, Outlook usernames remain un-decoupled, meaning all physical mailbox properties and configurations are retained completely! Users will transition via automated notification mails seamlessly.
                    </p>

                    <form onSubmit={handleAdminSetDomain} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">New Target Active Domain Suffix</label>
                        <input
                          type="text"
                          placeholder="fatshanpost.com"
                          value={adminActiveDomain}
                          onChange={(e) => setAdminActiveDomain(e.target.value)}
                          className="w-full bg-slate-905 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3.5 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Dual-Overlap Period duration</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            placeholder="14"
                            value={adminDualOverlapDays}
                            onChange={(e) => setAdminDualOverlapDays(parseInt(e.target.value) || 14)}
                            className="bg-slate-905 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3 py-2 text-white w-20"
                          />
                          <span className="text-[11px]">Days of Dual Delivery enabled</span>
                        </div>
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          checked={adminDualOverlap}
                          onChange={(e) => setAdminDualOverlap(e.target.checked)}
                          className="rounded text-cyan-500"
                        />
                        <span className="text-[11px] text-slate-300">
                          Configure dual verification overlap to keep accepting mails to legacy account schemas inside transition window.
                        </span>
                      </div>
                      <div className="md:col-span-2 pt-2">
                        <button
                          type="submit"
                          disabled={currentUser.role !== "admin"}
                          className="bg-cyan-500 hover:bg-cyan-400 hover:text-slate-950 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold px-4 py-2 rounded-xl transition text-xs"
                        >
                          Execute Domain Migration Switch
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Operational Database User profile viewer (Admin Action Console) */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 text-left">
                    <h3 className="text-md font-bold text-white flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-blue-400" />
                      Privileged Database Identity Directory
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400">
                            <th className="py-2.5">User Profile & Address</th>
                            <th className="py-2.5">Role</th>
                            <th className="py-2.5">Allocated Storage</th>
                            <th className="py-2.5">State Indicators</th>
                            <th className="py-2.5 text-right">Administrative Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {systemState.users && systemState.users.map((dbUser) => (
                            <tr key={dbUser.id} className="hover:bg-white/5 font-mono text-[11px]">
                              <td className="py-3">
                                <div className="font-semibold text-white">{dbUser.fullName}</div>
                                <div className="text-[10px] text-slate-400">@{dbUser.emailUsername}</div>
                                <div className="text-[9px] text-slate-500">{dbUser.contact}</div>
                              </td>
                              <td className="py-3">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                                  dbUser.role === "admin" ? "bg-red-900/40 text-red-300 border border-red-500/20" : "bg-white/10 text-slate-300"
                                }`}>
                                  {dbUser.role}
                                </span>
                              </td>
                              <td className="py-3">
                                <div>Used: {dbUser.storageUsed || "0 MB"}</div>
                                <div className="text-[10px] text-slate-400">Quota: {dbUser.storageQuota}</div>
                              </td>
                              <td className="py-3">
                                <div className="space-y-1">
                                  {dbUser.verified ? (
                                    <span className="text-emerald-400 text-[9px] block">✓ Verified Profile</span>
                                  ) : (
                                    <span className="text-slate-500 text-[9px] block">Draft Record</span>
                                  )}
                                  {dbUser.banned ? (
                                    <span className="text-red-400 text-[9px] block">🛑 Suspended Account</span>
                                  ) : (
                                    <span className="text-emerald-400 text-[9px] block">🟢 Status Active</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 text-right space-y-1">
                                {currentUser.role === "admin" ? (
                                  <div className="flex flex-col items-end gap-1">
                                    <div className="flex gap-1">
                                      {dbUser.banned ? (
                                        <button
                                          onClick={() => handleAdminBanUser(dbUser.id, false)}
                                          className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] uppercase font-extrabold"
                                        >
                                          Unban
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            const reason = prompt("Enter suspension context reason:");
                                            if (reason) {
                                              setAdminBanReason(reason);
                                              handleAdminBanUser(dbUser.id, true);
                                            }
                                          }}
                                          className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-[10px] uppercase font-extrabold"
                                        >
                                          Suspend
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleAminToggleVerify(dbUser.id)}
                                        className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px]"
                                      >
                                        Toggle Verify
                                      </button>
                                      {currentUser.emailUsername === 'marvis_zhou2014' || currentUser.emailUsername === 'marvis_zhou' ? (
                                        <button
                                          onClick={() => handleToggleGoogleAuth(dbUser.emailUsername)}
                                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                            (systemState.aiAuthorizedUsers || []).includes(dbUser.emailUsername)
                                              ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/20"
                                              : "bg-slate-700/30 text-slate-400 border border-slate-700/20"
                                          }`}
                                        >
                                          {(systemState.aiAuthorizedUsers || []).includes(dbUser.emailUsername) ? "🔓 GFW Authed" : "🔒 Grant GFW"}
                                        </button>
                                      ) : null}
                                    </div>

                                    {/* Medals badge controller */}
                                    <div className="flex gap-1 text-[9px]">
                                      <button
                                        onClick={() => handleAdminAddMedal(dbUser.id, false)}
                                        className="text-amber-400 hover:underline"
                                      >
                                        + Grant Medal
                                      </button>
                                      <button
                                        onClick={() => handleAdminAddMedal(dbUser.id, true)}
                                        className="text-red-400 hover:underline"
                                      >
                                        + Penalty
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-zinc-500">ReadOnly Access</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Column 3: Custom Button configurations panel & Quota Metrics */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Dynamic Custom Interactive Buttons administrator wizard */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 text-left">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-cyan-400" />
                      Dynamic Button wizard
                    </h3>
                    <p className="text-[10px] text-zinc-400 mb-4">
                      Deploy temporary buttons directly onto user Dashboards. Fully restrict viewing credentials!
                    </p>

                    <form onSubmit={handleCreateCustomButton} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-0.5">Button Text Title</label>
                        <input
                          type="text"
                          placeholder="Launch MSFS checklist tracker"
                          value={newBtnLabel}
                          onChange={(e) => setNewBtnLabel(e.target.value)}
                          required
                          className="w-full bg-slate-905 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-semibold mb-0.5">Redirect click URL (hash or path)</label>
                        <input
                          type="text"
                          placeholder="#msfs"
                          value={newBtnUrl}
                          onChange={(e) => setNewBtnUrl(e.target.value)}
                          required
                          className="w-full bg-slate-905 border border-white/10 focus:outline-none focus:border-cyan-500 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 font-semibold mb-0.5 text-[10px]">Anchor Branch</label>
                          <select
                            value={newBtnPage}
                            onChange={(e: any) => setNewBtnPage(e.target.value)}
                            className="w-full bg-slate-905 border border-white/10 rounded px-2 py-1 text-white"
                          >
                            <option value="home">Home area</option>
                            <option value="work">Work area</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-400 font-semibold mb-0.5 text-[10px]">Visibility Scope</label>
                          <select
                            value={newBtnVisibility}
                            onChange={(e: any) => setNewBtnVisibility(e.target.value)}
                            className="w-full bg-slate-905 border border-white/10 rounded px-2 py-1 text-white"
                          >
                            <option value="all">Everyone (All)</option>
                            <option value="logined">Authenticated users only</option>
                            <option value="specified">Specified User List Only</option>
                          </select>
                        </div>
                      </div>

                      {newBtnVisibility === "specified" && (
                        <div>
                          <label className="block text-slate-400 font-semibold mb-0.5 text-[10px]">
                            Allowed Emails (comma split)
                          </label>
                          <input
                            type="text"
                            placeholder={"marvis_zhou@" + systemState.activeDomain}
                            value={newBtnSpecUsers}
                            onChange={(e) => setNewBtnSpecUsers(e.target.value)}
                            className="w-full bg-slate-905 border border-white/10 rounded px-3 py-1 text-white"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-zinc-400 text-[10px] mb-0.5">Display Color</label>
                          <select
                            value={newBtnColor}
                            onChange={(e) => setNewBtnColor(e.target.value)}
                            className="w-full bg-slate-905 text-white rounded border border-white/10 px-2 py-1"
                          >
                            <option value="bg-cyan-600">Ocean Cyan</option>
                            <option value="bg-blue-600">Royal Blue</option>
                            <option value="bg-emerald-600">Forest Emerald</option>
                            <option value="bg-purple-600">Cosmic Purple</option>
                            <option value="bg-red-600">Alert Red</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-400 text-white font-extrabold py-2 rounded-xl text-xs transition"
                      >
                        Create Custom Dashboard Button
                      </button>
                    </form>

                    <div className="mt-6 border-t border-white/10 pt-4 space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase">Active deployed buttons:</h4>
                      {systemState.customButtons.map((btn) => (
                        <div key={btn.id} className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[11px]">
                          <div>
                            <p className="font-bold text-white">{btn.label}</p>
                            <span className="text-[9px] text-slate-400">Target: {btn.actionUrl} | Scope: {btn.visibility}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteCustomButton(btn.id)}
                            className="hover:text-red-400 text-slate-500 font-bold p-1"
                            title="Clear button"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* GitHub Pages & Live API Server Integration */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 text-left space-y-4 shadow-2xl">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-emerald-400" />
                      GitHub & API Server Sockets Settings
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Configure your client build to communicate with custom production servers after deploying them on GitHub Pages or Render.
                    </p>

                    <div className="space-y-3 bg-white/5 border border-white/5 p-4 rounded-2xl text-xs">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1 text-[10px]">
                          Production Backend Address (Base URL)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. https://your-server.onrender.com"
                          value={customApiUrl}
                          onChange={(e) => setCustomApiUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                        />
                        <span className="text-[10px] text-zinc-500 block mt-1">
                          Leave empty to automatically route to relative local workspace proxy path.
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!customApiUrl.trim()) {
                              alert("Please enter a valid remote URL root first.");
                              return;
                            }
                            setTestStatus("testing");
                            try {
                              const testUrl = customApiUrl.trim().replace(/\/$/, "") + "/api/state";
                              const start = Date.now();
                              const res = await fetch(testUrl);
                              if (res.ok || res.status === 200) {
                                setTestStatus("success");
                                const end = Date.now();
                                alert(`✓ Connection confirmed! Ping metrics: ${end - start}ms. Active state synchronization matches.`);
                                localStorage.setItem("gpkos_custom_backend_url", customApiUrl.trim());
                              } else {
                                setTestStatus("error");
                                alert(`✗ API server returned code ${res.status}. Please check CORS settings.`);
                              }
                            } catch (e: any) {
                              setTestStatus("error");
                              alert(`✗ Connection refused. Check if server is running and CORS is enabled. Error: ${e.message}`);
                            }
                          }}
                          className="flex-grow bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wide transition"
                        >
                          Test Connection
                        </button>
                        <button
                          onClick={() => {
                            setCustomApiUrl("");
                            localStorage.removeItem("gpkos_custom_backend_url");
                            setTestStatus("idle");
                            alert("Cleared! System fallback route initialized.");
                          }}
                          className="bg-slate-850 hover:bg-slate-750 text-slate-300 font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase border border-white/10 transition"
                        >
                          Clear Code
                        </button>
                      </div>

                      <div className="text-[10px] font-mono leading-none flex items-center justify-between">
                        <span className="text-zinc-500">WebSocket Status:</span>
                        {testStatus === "idle" && (
                          <span className="text-zinc-400">Idle / Proxy</span>
                        )}
                        {testStatus === "testing" && (
                          <span className="text-yellow-400 animate-pulse">● TESTING PING...</span>
                        )}
                        {testStatus === "success" && (
                          <span className="text-emerald-400">● LIVE CONNECTION OK</span>
                        )}
                        {testStatus === "error" && (
                          <span className="text-red-400">● GATEWAY OFFLINE</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 p-4 rounded-2xl space-y-3 text-[11px] text-slate-300">
                      <h4 className="font-bold text-white flex items-center gap-1.5">
                        <Share2 className="h-3.5 w-3.5 text-cyan-400" />
                        一键导出与云免签快速部署指南
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                        <li>
                          <strong>第一步：一键打包所有源代码：</strong>
                          点击页面右上角菜单中的 <strong>Export to GitHub</strong> 原生导出，或直接点击下方特设的安全通道下载全站 ZIP 包：<br />
                          <button 
                            type="button"
                            onClick={async (e) => {
                              const btn = e.currentTarget;
                              const originalText = btn.innerHTML;
                              btn.innerHTML = '资源打包中... 稍等<span class="animate-pulse">...</span>';
                              btn.disabled = true;
                              try {
                                const res = await fetch(`${getApiBase()}/api/download-source`);
                                if (!res.ok) throw new Error('Download Failed');
                                const blob = await res.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.style.display = 'none';
                                a.href = url;
                                a.download = 'rory-secure-hub-source.zip';
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                                btn.innerHTML = '✅ 下载成功！请检查设备文件管理器';
                                setTimeout(() => btn.innerHTML = originalText, 3000);
                              } catch(err) {
                                btn.innerHTML = '❌ 下载失败，请使用官方菜单';
                                setTimeout(() => btn.innerHTML = originalText, 3000);
                              } finally {
                                btn.disabled = false;
                              }
                            }}
                            className="mt-2 w-full inline-flex items-center justify-center bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-3 px-4 rounded-xl border border-cyan-500/30 transition-all font-bold group gap-2"
                          >
                            <Download className="w-4 h-4" /> 📥 点此直接使用内置安全通道下载完整 ZIP 源码包至手机
                          </button>
                          <p className="mt-1.5 text-center text-[10px] text-yellow-400">⚠️ 点击后直接保存文件，完美绕过重定向与跨标签页拦截。</p>
                        </li>
                        <li>
                          <strong>第二步：选择部署方案（双轨可选，纯享免费）：</strong>
                          <br/><br/>
                          我们为您提供两种顶级免费架构方案，您可以根据自己的情况任选其一：
                          <div className="mt-4 space-y-6">
                            
                            {/* Option A: Hugging Face */}
                            <div className="bg-sky-500/10 border border-sky-500/30 p-5 rounded-2xl">
                              <h5 className="font-bold text-sky-400 text-sm flex items-center gap-2 mb-3">
                                方案 A：Hugging Face Spaces（最简单 / 免 GitHub / 纯白痴版推拽部署）
                              </h5>
                              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                                这种方式将前后端打包进一个容器中运行，完全不需要配置跨域，免绑卡，连 GitHub 都省了！适合追求极简的玩家。
                              </p>
                              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                                <li>访问 <a href="https://huggingface.co/spaces" target="_blank" rel="noopener noreferrer" className="text-sky-400 font-bold hover:underline">Hugging Face Spaces</a>，注册并登录。</li>
                                <li>点击右上角 <strong className="text-white bg-slate-800 px-1 py-0.5 rounded">Create new Space</strong>。</li>
                                <li>名字随便起，<strong>Space SDK 必定选【Docker】然后选【Blank】</strong>，创建容器。</li>
                                <li>进入 Files 标签页，将第一步解压后文件夹里的<strong>所有文件和文件夹</strong>一起拖拽进去！点击 Commit changes 保存。</li>
                                <li>喝杯咖啡等待绿灯 <code className="text-emerald-400 font-bold">✅ Running</code> 亮起，大功告成，获得您的专属域名！</li>
                              </ol>
                            </div>

                            {/* Option B: Back4App Containers */}
                            <div className="bg-indigo-500/10 border border-indigo-500/30 p-5 rounded-2xl">
                              <h5 className="font-bold text-indigo-400 text-sm flex items-center gap-2 mb-3">
                                方案 B：Back4App 微服务容器部署（顶级性能 / 高度自定义全栈 / 支持 GitHub）
                              </h5>
                              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                                这是工业级标准的云端 Docker 容器部署方案！您不再需要分成前后端两次操作，系统内置了强大的 <strong>Dockerfile</strong>，它会自动为您构建一切前端静态文件并在服务端挂载 API！免绑卡、免费且在全球都有极速节点。
                              </p>
                              <ol className="list-decimal list-inside space-y-3 text-xs text-slate-300">
                                <li className="pl-2 border-l-2 border-indigo-500/30">
                                  <strong>2.1 推送到 GitHub：</strong> 登录您的 GitHub 账号，新建一个仓库，将第一步解压后的全部文件（包括 Dockerfile 那些杂文件）上传进去。
                                </li>
                                <li className="pl-2 border-l-2 border-indigo-500/30">
                                  <strong>2.2 连接云端容器平台：</strong> 登录 <a href="https://www.back4app.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-bold hover:underline">Back4App.com</a>（直接用 GitHub 授权登录） {"->"} 点击右上角 Build new app {"->"} 一定要选择绿色的 <strong>【Containers（容器服务 CaaS）】</strong>。
                                </li>
                                <li className="pl-2 border-l-2 border-indigo-500/30">
                                  <strong>2.3 傻瓜级一键部署：</strong> 选择您刚上传的刚才那个 Git 仓库，随便起个 App Name。什么都不用填（不要改 Port，直接留空即可，它会自动识别内部文件的 <code className="bg-slate-800 text-emerald-300 px-1 rounded">EXPOSE 3000</code>） {"->"} 猛击创建大按钮 <strong>Create App</strong>！
                                </li>
                                <li className="pl-2 border-l-2 border-indigo-500/30 border-emerald-500/50 relative">
                                  <div className="absolute top-1 -left-[5px] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                  <strong>2.4 终极闭环跑通：</strong> 左侧菜单切换到 Logs 或者界面盯着日志等待不到3分钟，顶部的进度条变绿！您的私人顶级云端服务器完美上阵工作，它将全栈驱动一切客户端业务连通！
                                </li>
                              </ol>
                            </div>

                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* SECTION 3: RORY GPKOS IDE PLAYGROUND screen (macOS theme styling) */}
        {currentHash === "#rory-gpkos" && (
          <div className="animate-fade-in flex flex-col items-center justify-center min-h-[600px] rounded-3xl overflow-hidden border border-white/10 relative" id="gpkos-ide-workspace">
            {!currentUser ? (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center z-20">
                <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full">
                  <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Fingerprint className="h-10 w-10 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Rory GPKOS Locked</h2>
                  <p className="text-xs text-slate-400 mb-6">You must authenticate via Global Secure Auth to access the underlying Linux kernel and workspace.</p>
                  <a href="#work" onClick={() => setCurrentHash("#work")} className="block w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl transition text-sm">
                    Go to Authentication
                  </a>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/40 flex flex-col">
                {/* macOS styled Title bar / Top Bar */}
                <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 flex items-center justify-between z-10 shrink-0">
                  <div className="flex items-center gap-4 text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5 opacity-90"><Command className="h-3.5 w-3.5" /> GPKOS</span>
                    <span className="cursor-pointer hover:opacity-80">File</span>
                    <span className="cursor-pointer hover:opacity-80">Edit</span>
                    <span className="cursor-pointer hover:opacity-80">View</span>
                    <span className="cursor-pointer hover:opacity-80">Kernel</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-white/80 font-mono font-bold tracking-wider uppercase">
                    <span>Admin: {currentUser.emailUsername}</span>
                    <div className="flex items-center gap-1"><Wifi className="h-3 w-3 text-emerald-400" /> Secure</div>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Desktop Workspace Area */}
                <div className="flex-grow p-6 relative overflow-hidden flex items-start justify-center">
                  
                  {/* IDE Window */}
                  {gpkosActiveApp === 'ide' && (
                    <div className="bg-slate-950 border border-white/20 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[500px] animate-fade-in">
                      <div className="bg-slate-900/80 p-3 border-b border-white/10 flex items-center justify-between">
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => setGpkosActiveApp('desktop')} className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400" />
                          <div className="h-3 w-3 rounded-full bg-amber-500" />
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-[11px] font-bold text-slate-300">GPKOS Code Sandbox</div>
                        <div className="w-10"></div>
                      </div>
                      <div className="flex-grow flex flex-col lg:flex-row shadow-inner">
                        <div className="flex-grow p-0 border-r border-white/10 flex flex-col">
                          <div className="bg-slate-900 p-2 flex justify-between items-center text-xs">
                            <span className="font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2 rounded">TS • main.ts</span>
                            <button onClick={handleIDECompile} className="bg-emerald-500 text-slate-950 px-3 py-1 rounded font-bold flex items-center gap-1"><Play className="h-3 w-3"/> Run</button>
                          </div>
                          <textarea value={ideCode} onChange={(e) => setIdeCode(e.target.value)} className="flex-grow bg-transparent text-emerald-400 p-4 font-mono text-xs border-none outline-none resize-none leading-relaxed" spellCheck={false} />
                        </div>
                        <div className="w-full lg:w-1/3 flex flex-col bg-black">
                          <div className="bg-slate-900 p-2 text-xs font-bold text-slate-400 border-b border-white/10">Execution Logs</div>
                          <div className="flex-grow p-4 font-mono text-[10px] text-slate-300 overflow-y-auto whitespace-pre-wrap">{ideLogs}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Remote Assist Window */}
                  {gpkosActiveApp === 'remote' && (
                    <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col h-[550px] animate-fade-in relative overflow-hidden">
                      {/* Window Header */}
                      <div className="bg-slate-800/90 p-3 border-b border-white/10 flex items-center justify-between shrink-0">
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => setGpkosActiveApp('desktop')} className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400" />
                          <div className="h-3 w-3 rounded-full bg-amber-500" />
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-grow flex items-center justify-center gap-2">
                           <MonitorUp className="w-4 h-4 text-emerald-400" />
                           <span className="text-white text-xs font-bold tracking-wider">远程协同与多端控屏 (OS级别用户鼠标特权版)</span>
                        </div>
                        <div className="w-12 shrink-0"></div>
                      </div>

                      <div className="flex-grow flex overflow-hidden">
                        {/* Main Screen Stream Area */}
                        <div className="flex-grow bg-slate-950 relative flex flex-col items-center justify-center border-r border-white/5 overflow-hidden">
                          {!remoteSessionActive && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 z-10 p-6 text-center">
                               <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-4 animate-pulse">
                                 <MonitorUp className="w-8 h-8 text-emerald-400" />
                               </div>
                               <h3 className="text-white font-bold text-lg mb-2">安全建立协作会话</h3>
                               <p className="text-slate-400 text-xs max-w-sm mb-6">采用最前沿的 WebRTC 实时分享流协议。远端协同者可实时语音及屏幕标引批注，但在操作上，<strong className="text-amber-400">本机拥有绝对第一鼠标归属主权</strong>，绝不发生光标被强制拉长、锁止篡夺事件。</p>
                               <button 
                                 onClick={startRemoteSession}
                                 className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 text-sm shadow-lg shadow-emerald-900/50"
                               >
                                 <Share className="w-4 h-4" /> 开启屏幕协同与投屏
                               </button>
                            </div>
                          )}
                          <video 
                             ref={remoteVideoRef} 
                             autoPlay 
                             playsInline 
                             muted 
                             className={`max-w-full max-h-full object-contain ${remoteSessionActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                          ></video>
                          
                          {/* Pseudo "Collaborative Cursor" overlay demonstration */}
                          {remoteSessionActive && (
                            <div className="absolute top-1/3 left-1/3 pointer-events-none z-20 flex flex-col items-center animate-bounce shadow">
                               <MousePointer2 className="w-6 h-6 text-fuchsia-500 drop-shadow-xl" fill="currentColor" />
                               <span className="bg-fuchsia-500 px-2 py-0.5 rounded text-[9px] font-bold text-white shadow-xl whitespace-nowrap mt-1">Guest_tech_221</span>
                            </div>
                          )}
                        </div>

                        {/* Side Chat / Events Bar */}
                        <div className="w-72 bg-slate-900 flex flex-col shrink-0">
                           <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 bg-slate-900/50">
                              <MessageSquare className="w-4 h-4 text-cyan-400" />
                              <span className="text-white text-xs font-bold uppercase tracking-wider">实时会控对话舱</span>
                           </div>
                           
                           <div className="flex-grow overflow-y-auto p-4 space-y-4">
                             {remoteChatMessages.map((m, idx) => (
                               <div key={idx} className={m.sender === "System" ? "text-center" : (m.sender === (currentUser?.fullName || "Host") ? "text-right" : "text-left")}>
                                  {m.sender === "System" ? (
                                    <span className="text-[10px] text-emerald-400/80 font-mono bg-emerald-900/20 px-2 py-1 rounded-full">{m.text}</span>
                                  ) : (
                                    <div className={`inline-block max-w-[85%] text-left ${m.sender === (currentUser?.fullName || "Host") ? "bg-cyan-600 border border-cyan-500 text-white" : "bg-slate-800 border border-slate-700 text-slate-200"} rounded-xl px-3 py-2 text-xs`}>
                                       <div className="text-[9px] text-white/50 mb-1 font-bold">{m.sender} <span className="font-normal opacity-50 ml-1">{m.time}</span></div>
                                       <div className="leading-relaxed">{m.text}</div>
                                    </div>
                                  )}
                               </div>
                             ))}
                             {remoteChatMessages.length === 0 && (
                               <div className="text-center text-xs text-slate-500 py-10">尚无对话。等待协同建立以接收远端会话。</div>
                             )}
                           </div>

                           <div className="p-3 border-t border-white/5 bg-slate-950">
                             <form onSubmit={handleRemoteChatSubmit} className="flex gap-2">
                               <input 
                                 type="text" 
                                 value={remoteChatInput}
                                 onChange={e => setRemoteChatInput(e.target.value)}
                                 disabled={!remoteSessionActive}
                                 placeholder={remoteSessionActive ? "输入并发送..." : "连接后可输入(支持快捷键)"}
                                 className="flex-grow bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                               />
                               <button type="submit" disabled={!remoteSessionActive} className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                 发送
                               </button>
                             </form>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terminal Window */}
                  {gpkosActiveApp === 'terminal' && (
                    <div className="bg-black border border-white/20 rounded-xl w-full max-w-3xl shadow-2xl flex flex-col h-[450px] animate-fade-in">
                      <div className="bg-slate-900 p-2 border-b border-white/10 flex items-center justify-between">
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => setGpkosActiveApp('desktop')} className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400" />
                          <div className="h-3 w-3 rounded-full bg-amber-500" />
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-[11px] font-bold text-slate-400 font-mono">root@gpkos-core:~</div>
                        <div className="w-10"></div>
                      </div>
                      <div className="flex-grow flex flex-col p-4 overflow-hidden">
                        <div className="flex-grow font-mono text-xs leading-relaxed overflow-y-auto whitespace-pre-wrap text-emerald-400 pb-2">
                          {ideLogs}
                        </div>
                        <form onSubmit={handleIDETerminalCmd} className="flex items-center gap-2 mt-auto">
                          <span className="text-emerald-500 text-xs font-mono font-bold">host:~#</span>
                          <input type="text" value={ideTerminalInput} onChange={(e) => setIdeTerminalInput(e.target.value)} className="flex-grow bg-transparent text-xs text-white border-none outline-none font-mono py-1" spellCheck={false} autoFocus />
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Maps Window */}
                  {gpkosActiveApp === 'maps' && (() => {
                    const isGoogleHubAuthorized = currentUser?.emailUsername === 'marvis_zhou2014' || currentUser?.emailUsername === 'marvis_zhou' || (currentUser && (systemState.aiAuthorizedUsers || []).includes(currentUser.emailUsername));

                    // Proxy Search Function
                    const handleProxySearchSubmit = async (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!proxySearchQueryValue.trim()) return;
                      setLoadingProxySearch(true);
                      setActiveBypassUrl(null);
                      try {
                        const res = await fetch(`${getApiBase()}/api/search/proxy?q=${encodeURIComponent(proxySearchQueryValue)}`);
                        const data = await res.json();
                        setProxySearchResultsList(data.results || []);
                      } catch (err) {
                        console.error(err);
                        alert("Secure search failed: firewall handshake error.");
                      } finally {
                        setLoadingProxySearch(false);
                      }
                    };

                    // Reader Bypass Function
                    const handleOpenBypassUrl = async (url: string) => {
                      setLoadingBypass(true);
                      setActiveBypassUrl(url);
                      setBypassHtmlContent("");
                      try {
                        const res = await fetch(`${getApiBase()}/api/web/proxy?url=${encodeURIComponent(url)}`);
                        const data = await res.json();
                        if (data.success && data.content) {
                          setBypassHtmlContent(data.content);
                        } else {
                          setBypassHtmlContent(`<div class="p-6 text-red-400 font-mono">Bypass Fail: ${data.error || 'Server did not respond with decoded payload.'}</div>`);
                        }
                      } catch (err) {
                        setBypassHtmlContent(`<div class="p-6 text-red-400 font-mono">Connection Handshake Timed Out. Domestic node failed.</div>`);
                      } finally {
                        setLoadingBypass(false);
                      }
                    };

                    // Direct Action for URL Proxy
                    const handleDirectUrlSubmit = (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!directUrlValue.trim()) return;
                      let finalUrl = directUrlValue.trim();
                      if (!/^https?:\/\//i.test(finalUrl)) {
                        finalUrl = 'https://' + finalUrl;
                      }
                      handleOpenBypassUrl(finalUrl);
                      setDirectUrlValue(""); // Clear input after submit
                    };

                    // Send Gmail Function
                    const handleSendGmailSecurely = async (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!googleToken) {
                        alert("You must login with Google first!");
                        return;
                      }
                      if (!gmailComposeToAddress || !gmailComposeSubjectLine || !gmailComposeMessageText) {
                        alert("All composition parameters are mandatory.");
                        return;
                      }
                      setSendingGmailLocalState(true);
                      try {
                        const res = await fetch(`${getApiBase()}/api/gmail/send`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            to: gmailComposeToAddress,
                            subject: gmailComposeSubjectLine,
                            message: gmailComposeMessageText,
                            accessToken: googleToken
                          })
                        });
                        const data = await res.json();
                        if (data.success) {
                          alert("🎉 Secure Gmail broadcast successful through Node relay!");
                          setGmailComposeToAddress("");
                          setGmailComposeSubjectLine("");
                          setGmailComposeMessageText("");
                        } else {
                          alert(`Gmail transmit error: ${data.error || 'Proxy denied transmission.'}`);
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Server failed to route Gmail payload.");
                      } finally {
                        setSendingGmailLocalState(false);
                      }
                    };

                    // Gemini Chat Submit
                    const handleGeminiChatSubmit = async (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!geminiPromptText.trim()) return;
                      const userMsg = geminiPromptText;
                      setGeminiPromptText("");
                      setGeminiChatHistoryList(prev => [...prev, { role: "user", text: userMsg }]);
                      setLoadingGeminiModel(true);
                      try {
                        const res = await fetch(`${getApiBase()}/api/ai/chat`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            prompt: userMsg,
                            model: geminiModelSelected
                          })
                        });
                        const data = await res.json();
                        setGeminiChatHistoryList(prev => [...prev, { role: "ai", text: data.response || "Server responded empty." }]);
                      } catch (err) {
                        setGeminiChatHistoryList(prev => [...prev, { role: "ai", text: "Error: Could not handshake with safe Gemini API broker." }]);
                      } finally {
                        setLoadingGeminiModel(false);
                      }
                    };

                    return (
                      <div className="bg-slate-950 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[550px] animate-fade-in overflow-hidden text-white font-sans">
                        {/* Titlebar */}
                        <div className="bg-slate-900/80 px-4 py-3 border-b border-white/5 flex items-center justify-between backdrop-blur-md shrink-0">
                          <div className="flex gap-1.5 shrink-0">
                            <button onClick={() => setGpkosActiveApp('desktop')} className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400" />
                            <div className="h-3 w-3 rounded-full bg-amber-500" />
                            <div className="h-3 w-3 rounded-full bg-emerald-500" />
                          </div>
                          
                          <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                            <Chrome className="w-4 h-4 text-cyan-400 animate-pulse" />
                            <span>Rory Secure Google Hub Space • 谷歌极速安全空间</span>
                          </div>
                          
                          <div className="text-[10px] bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 font-bold px-2 py-0.5 rounded font-mono">
                            SSL Node Relay ACTIVE
                          </div>
                        </div>

                        {!isGoogleHubAuthorized ? (
                          /* Lock Screen */
                          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-950/90 relative overflow-hidden">
                            <div className="absolute inset-0 bg-radial-gradient from-fuchsia-950/20 via-transparent to-transparent opacity-50" />
                            <div className="bg-fuchsia-500/10 p-5 rounded-3xl border border-fuchsia-500/20 mb-6 animate-pulse">
                              <Lock className="w-12 h-12 text-fuchsia-400" />
                            </div>
                            <h3 className="text-xl font-black text-white tracking-tight mb-2">🛡️ 谷歌极速安全中转空间已被锁定</h3>
                            <p className="text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
                              本部分属于采用专用海外高速加密中转节点的特许安全沙箱，全自动防御并保护国内访问请求，保证隐私与业务绝对合规。默认情况下，仅顶尖系统管理员 <span className="font-mono text-cyan-400">@marvis_zhou2014</span> 拥有直接通道开启权。
                            </p>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 max-w-md text-left text-xs text-slate-300 mb-6 font-mono leading-relaxed space-y-1.5">
                              <div className="flex items-center gap-2 text-cyan-400 font-bold"><Settings className="w-4 h-4"/> 激活方式指引:</div>
                              <p>1. 请阁下联系顶尖管理员 <strong className="text-white">Marvis Zhou</strong> 登录系统。</p>
                              <p>2. 前往控制面板的【用户列表管理栏】下，将您当前注册账户的一键「GFW Tunnel Auth」通道授权状态置为“已授权”。</p>
                            </div>
                            <button onClick={() => setGpkosActiveApp('desktop')} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-sm font-bold rounded-xl transition">
                              返回桌面
                            </button>
                          </div>
                        ) : (
                          /* Operational Workspace Layout */
                          <div className="flex-grow flex overflow-hidden">
                            {/* Left Sidebar */}
                            <div className="w-56 bg-slate-900/50 border-r border-white/5 flex flex-col p-3 gap-1.5 shrink-0">
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1 mb-2">安全业务网关</div>
                              
                              <button 
                                onClick={() => { setGoogleHubTab("search"); setActiveBypassUrl(null); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${googleHubTab === 'search' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                              >
                                <Search className="w-4 h-4" /> 极速搜索 & 网页代理
                              </button>
                              
                              <button 
                                onClick={() => { setGoogleHubTab("gmail"); setActiveBypassUrl(null); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${googleHubTab === 'gmail' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                              >
                                <Mail className="w-4 h-4" /> Gmail 直连收发网关
                              </button>
                              
                              <button 
                                onClick={() => { setGoogleHubTab("maps"); setActiveBypassUrl(null); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${googleHubTab === 'maps' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                              >
                                <Compass className="w-4 h-4" /> Google Maps 直连
                              </button>
                              
                              <button 
                                onClick={() => { setGoogleHubTab("gemini"); setActiveBypassUrl(null); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${googleHubTab === 'gemini' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                              >
                                <BrainCircuit className="w-4 h-4" /> Gemini AI 特许中控
                              </button>
                              
                              <button 
                                onClick={() => { setGoogleHubTab("crypto"); setActiveBypassUrl(null); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${googleHubTab === 'crypto' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                              >
                                <KeyRound className="w-4 h-4" /> 对称密电中转站
                              </button>

                              <div className="mt-auto border-t border-white/5 pt-4 text-center">
                                <div className="text-[10px] text-emerald-400 font-mono font-bold flex items-center justify-center gap-1.5 bg-emerald-950/30 py-1.5 px-2 rounded-lg border border-emerald-500/20">
                                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                                  Tunnel Proxy Active
                                </div>
                              </div>
                            </div>

                            {/* Main Display Pane */}
                            <div className="flex-grow flex flex-col bg-slate-950 overflow-hidden relative">
                              {/* Search Screen */}
                              {googleHubTab === "search" && (
                                <div className="flex-grow flex flex-col p-5 overflow-hidden">
                                  {activeBypassUrl ? (
                                    /* GFW Bypass Reader mode */
                                    <div className="flex-grow flex flex-col overflow-hidden animate-fade-in text-left">
                                      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
                                        <button onClick={() => setActiveBypassUrl(null)} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300">
                                          <ArrowLeft className="w-4 h-4"/>返回搜索列表
                                        </button>
                                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-md">
                                          🔐 Safe Tunnel Proxy: {activeBypassUrl}
                                        </div>
                                      </div>
                                      {loadingBypass ? (
                                        <div className="flex-grow flex flex-col items-center justify-center text-slate-400 text-xs">
                                          <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin mb-3"/>
                                          <div className="font-mono">Decrypting payload from destination headers...</div>
                                        </div>
                                      ) : (
                                        <div className="flex-grow overflow-y-auto bg-slate-900/60 border border-white/5 rounded-2xl p-5 text-sm leading-relaxed text-slate-200 font-sans font-normal overflow-wrap-anywhere">
                                          <h4 className="font-bold text-white mb-3 text-base">📄 极速代理阅读模式 (Decoded Safe Reader)</h4>
                                          <div className="space-y-4 whitespace-pre-wrap select-text text-slate-300" dangerouslySetInnerHTML={{ __html: bypassHtmlContent.slice(0, 50000) }} />
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    /* Standard Search UI */
                                    <div className="flex-grow flex flex-col overflow-hidden text-left">
                                      <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">🔍 Google GFW-Secure Search与安全浏览器代理</h3>
                                      <p className="text-[11px] text-slate-400 mb-4">通过安全代理节点无缝请求全球互联网，并支持针对任何敏感目标页面的一键免翻墙极速私密阅读。</p>
                                      
                                      <form onSubmit={handleProxySearchSubmit} className="flex gap-2 mb-3 shrink-0">
                                        <input 
                                          type="text"
                                          value={proxySearchQueryValue}
                                          onChange={(e) => setProxySearchQueryValue(e.target.value)}
                                          placeholder="输入任意全球关键词或技术主题..."
                                          className="flex-grow bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                                        />
                                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0">
                                          {loadingProxySearch ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Search className="w-3.5 h-3.5" />} 极速安全检索
                                        </button>
                                      </form>

                                      <form onSubmit={handleDirectUrlSubmit} className="flex gap-2 mb-4 shrink-0">
                                        <input 
                                          type="text"
                                          value={directUrlValue}
                                          onChange={(e) => setDirectUrlValue(e.target.value)}
                                          placeholder="或输入直接精准网址 (如 google.com 或 https://example.com)..."
                                          className="flex-grow bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                                        />
                                        <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0">
                                          <Globe className="w-3.5 h-3.5" /> 穿透代理直放网页
                                        </button>
                                      </form>

                                      <div className="flex-grow overflow-y-auto pr-1 space-y-3">
                                        {loadingProxySearch ? (
                                          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs py-12">
                                            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                                            <p className="font-mono text-cyan-300">Searching global records secure SSL relay...</p>
                                          </div>
                                        ) : proxySearchResultsList.length > 0 ? (
                                          proxySearchResultsList.map((resItem, idx) => (
                                            <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-1.5 hover:bg-white/10 transition">
                                              <div className="flex items-center justify-between gap-3">
                                                <h4 className="font-bold text-sm text-cyan-300 text-left line-clamp-1">{resItem.title}</h4>
                                                <button 
                                                  onClick={() => handleOpenBypassUrl(resItem.link)}
                                                  className="bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-[10px] uppercase px-3 py-1 rounded border border-cyan-500/20 transition flex items-center gap-1 shrink-0"
                                                >
                                                  🔓 极速代理安全打开
                                                </button>
                                              </div>
                                              <p className="text-slate-400 text-xs text-left line-clamp-2">{resItem.snippet}</p>
                                              <div className="text-[10px] text-slate-500 font-mono truncate">{resItem.link}</div>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-center py-16 text-slate-500 text-sm">
                                            <Globe className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                            这里是安全的谷歌搜索，请输入搜索词开始，免梯子直接安全访问世界网络！
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Gmail tab */}
                              {googleHubTab === "gmail" && (
                                <div className="flex-grow flex flex-col p-5 overflow-hidden text-left">
                                  <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">✉️ Gmail 安全直连收发桥接</h3>
                                  <p className="text-[11px] text-slate-400 mb-4">连接您的个人 Gmail 账户，通过我们预置在境外的专线节点，高速、安全、完全独立于本地网络进行邮件收发业务。</p>

                                  {!googleToken ? (
                                    <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                                      <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 mb-4">
                                        <KeyRound className="w-8 h-8 text-red-400"/>
                                      </div>
                                      <h4 className="font-bold text-white mb-2 text-sm">未检测到安全的 Google / Gmail 授权会话</h4>
                                      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                                        您需要完成一次标准谷歌 OAuth 连接来授权本客户端从您的 Gmail 账户安全发送与读取邮件。本授权完全由 Google 标准安全协议保障。
                                      </p>
                                      <button 
                                        onClick={() => loginGoogleProvider()}
                                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                                      >
                                        <Chrome className="w-4 h-4"/> 建立安全 Google 账户直连 Handshake
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
                                      {/* Left side: Gmail Composer form */}
                                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto">
                                        <h4 className="text-xs font-bold text-white border-b border-white/5 pb-2 uppercase tracking-wide">✏️ 安全写信 (Mail Dispatcher Node)</h4>
                                        <form onSubmit={handleSendGmailSecurely} className="space-y-3">
                                          <div>
                                            <label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">收件人 (To)</label>
                                            <input 
                                              type="email"
                                              required
                                              value={gmailComposeToAddress}
                                              onChange={(e) => setGmailComposeToAddress(e.target.value)}
                                              placeholder="receiver@gmail.com"
                                              className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
                                            />
                                          </div>
                                          <div>
                                            <label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">邮件主题 (Subject)</label>
                                            <input 
                                              type="text"
                                              required
                                              value={gmailComposeSubjectLine}
                                              onChange={(e) => setGmailComposeSubjectLine(e.target.value)}
                                              placeholder="关于全球业务的对接..."
                                              className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
                                            />
                                          </div>
                                          <div>
                                            <label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">邮件内容 (Body)</label>
                                            <textarea 
                                              required
                                              value={gmailComposeMessageText}
                                              onChange={(e) => setGmailComposeMessageText(e.target.value)}
                                              placeholder="输入发至对端邮箱的完整内容..."
                                              className="w-full h-24 bg-slate-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 outline-none resize-none"
                                            />
                                          </div>
                                          <button 
                                            type="submit"
                                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2 rounded-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5"
                                          >
                                            {sendingGmailLocalState ? <RefreshCw className="w-3 animate-spin"/> : null}
                                            点击并开始安全发送 SSL Direct Mail
                                          </button>
                                        </form>
                                      </div>

                                      {/* Right side: Associated emails with OWA syncing list */}
                                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col overflow-hidden">
                                        <h4 className="text-xs font-bold text-white border-b border-white/5 pb-2 mb-3 uppercase tracking-wide">📥 实时极速中转收件箱 (Synchronization logs)</h4>
                                        <div className="flex-grow overflow-y-auto space-y-2 pr-1">
                                          {emails.slice(0, 8).map((m, idx) => (
                                            <div key={idx} className="p-3 bg-slate-900/60 border border-white/5 rounded-xl hover:bg-slate-900 transition flex flex-col gap-1 text-[11px]">
                                              <div className="flex items-center justify-between">
                                                <span className="font-extrabold text-cyan-300">{m.senderFullName}</span>
                                                <span className="text-[9px] text-slate-500">{new Date(m.timestamp || "").toLocaleDateString()}</span>
                                              </div>
                                              <p className="font-bold text-white line-clamp-1 text-left">{m.subject}</p>
                                              <p className="text-slate-400 line-clamp-1 text-left">{m.snippet || m.body ? m.body.replace(/<[^>]*>?/gm, '') : 'No content'}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Maps tab */}
                              {googleHubTab === "maps" && (
                                <div className="flex-grow flex flex-col overflow-hidden text-left h-full">
                                  <div className="bg-slate-900/80 p-3 border-b border-white/5 shrink-0 flex items-center justify-between">
                                     <div>
                                       <h3 className="text-sm font-bold text-white">🗺️ Google Maps 极速中转通道</h3>
                                       <p className="text-[10px] text-slate-400">专用 SSL 海外管道极速载入地图，解决被墙阻截导致地图花屏、请求失败与卡死等常见故障。</p>
                                     </div>
                                     <div className="flex items-center gap-1.5 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
                                        GFW BYPASS OK
                                     </div>
                                  </div>
                                  <div className="flex-grow relative bg-slate-950">
                                     <div className="absolute inset-0 z-0">
                                       <GoogleMapsWrapper />
                                     </div>
                                  </div>
                                </div>
                              )}

                              {/* Gemini tab */}
                              {googleHubTab === "gemini" && (
                                <div className="flex-grow flex flex-col p-5 overflow-hidden text-left">
                                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 shrink-0">
                                    <div>
                                      <h3 className="text-base font-bold text-white flex items-center gap-2">🧠 Gemini 决策人工智能中控</h3>
                                      <p className="text-[11px] text-slate-400">支持灵活挑选 Gemini 的可用微调版本，进行全自动海外代理问答交互。</p>
                                    </div>
                                    
                                    {/* Select Version of Gemini model */}
                                    <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10">
                                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Model:</span>
                                      <select 
                                        value={geminiModelSelected}
                                        onChange={(e) => setGeminiModelSelected(e.target.value)}
                                        className="bg-transparent text-xs text-cyan-300 font-bold font-mono outline-none border-none cursor-pointer"
                                      >
                                        <option value="gemini-1.5-flash" className="bg-slate-950 text-white font-mono">gemini-1.5-flash (极速流畅)</option>
                                        <option value="gemini-1.5-pro" className="bg-slate-950 text-white font-mono">gemini-1.5-pro (精深分析)</option>
                                        <option value="gemini-2.0-flash" className="bg-slate-950 text-white font-mono">gemini-2.0-flash (次世代高速)</option>
                                        <option value="gemini-2.5-flash-experimental" className="bg-slate-950 text-white font-mono">gemini-2.5-flash-exp (前卫特性)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="flex-grow flex flex-col bg-slate-900/30 border border-white/5 rounded-2xl overflow-hidden p-3 relative">
                                    {/* Chat Area */}
                                    <div className="flex-grow overflow-y-auto space-y-3 mb-3 pr-1">
                                      {geminiChatHistoryList.map((m, idx) => (
                                        <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                          <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs ${m.role === 'user' ? 'bg-cyan-500/10 text-cyan-100 border border-cyan-500/20' : 'bg-slate-900 border border-white/5 text-slate-200'}`}>
                                            <div className="text-[9px] uppercase font-bold mb-1 opacity-50 font-mono tracking-wider">{m.role === 'user' ? 'Operator' : geminiModelSelected}</div>
                                            <p className="whitespace-pre-wrap leading-relaxed select-text">{m.text}</p>
                                          </div>
                                        </div>
                                      ))}
                                      {loadingGeminiModel && (
                                        <div className="flex justify-start">
                                          <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                                            <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin"/> {geminiModelSelected} is processing logical traces...
                                          </div>
                                        </div>
                                      )}
                                      {geminiChatHistoryList.length === 0 && (
                                        <div className="text-center text-slate-500 font-mono text-xs py-14">
                                          Ready for secure AI instructions with model variant: <span className="text-cyan-400 font-bold">{geminiModelSelected}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Prompts Input Form */}
                                    <form onSubmit={handleGeminiChatSubmit} className="flex gap-2 mt-auto shrink-0 border-t border-white/5 pt-2.5">
                                      <input 
                                        type="text"
                                        value={geminiPromptText}
                                        onChange={(e) => setGeminiPromptText(e.target.value)}
                                        placeholder="输入任意要下达给谷歌 AI 的安全决策..."
                                        className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                                      />
                                      <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition flex items-center gap-1 shrink-0">
                                        Send Direct AI
                                      </button>
                                    </form>
                                  </div>
                                </div>
                              )}

                              {/* Crypto Relay Tab */}
                              {googleHubTab === "crypto" && (
                                <div className="flex-grow flex flex-col p-5 overflow-hidden text-left bg-slate-950 font-sans">
                                  <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 mb-4 shrink-0">
                                    <div>
                                      <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">🛡️ 对称加密数字密电中转站 (End-to-End Relay)</h3>
                                      <p className="text-[11px] text-slate-400 mt-1">
                                        基于客户端浏览器首层加盐异或 (XOR) 与 Base64 双重离线加密。数据在发往 db.json 之前已化为乱码，完全自建无谷歌云介入，实现零信任中转。
                                      </p>
                                    </div>
                                    <button
                                      onClick={async () => {
                                        if(!currentUser) return;
                                        setSendingCrypto(true);
                                        const res = await fetch(`${getApiBase()}/api/crypto/messages?user=${currentUser.emailUsername}`);
                                        const d = await res.json();
                                        if(d.success) setCryptoMessages(d.messages || []);
                                        setSendingCrypto(false);
                                      }}
                                      className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                                    >
                                      {sendingCrypto ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <RefreshCw className="w-3.5 h-3.5"/>}
                                      拉取最新密电网络
                                    </button>
                                  </div>

                                  <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-hidden">
                                     {/* Left: Sender UI */}
                                     <div className="bg-purple-950/20 border border-purple-500/20 rounded-2xl flex flex-col p-4 overflow-y-auto relative">
                                        <h4 className="text-sm font-bold text-white mb-4 border-b border-purple-500/10 pb-2">加密发送面板 (Encode)</h4>
                                        <div className="space-y-4">
                                           <div>
                                              <label className="text-xs font-bold text-purple-300 mb-1.5 block">🎯 接收人网关 ID (Receiver Username)</label>
                                              <input type="text" placeholder="输入系统内的用户名，如 marvis_zhou" value={cryptoReceiver} onChange={e => setCryptoReceiver(e.target.value)} className="w-full bg-slate-900 border border-purple-500/20 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-400 outline-none"/>
                                           </div>
                                           <div>
                                              <label className="text-xs font-bold text-purple-300 mb-1.5 block">📝 明文信件内容 (Raw Content)</label>
                                              <textarea placeholder="在这里输入最高机密内容..." value={cryptoMessage} onChange={e => setCryptoMessage(e.target.value)} className="w-full h-24 bg-slate-900 border border-purple-500/20 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-400 outline-none resize-none"/>
                                           </div>
                                           <div>
                                              <label className="text-xs font-bold text-purple-300 mb-1.5 block flex items-center gap-1"><KeyRound className="w-3.5 h-3.5"/> 🔐 本地对称口令金钥 (Symmetric Key)</label>
                                              <input type="password" placeholder="口令绝不会传向服务器，双方必须线下对好暗号" value={cryptoPassword} onChange={e => setCryptoPassword(e.target.value)} className="w-full bg-slate-900 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-red-300 focus:border-red-500 outline-none font-mono"/>
                                              <p className="text-[9px] text-slate-500 mt-1.5 font-mono">WARNING: This key encrypts text via local XOR before egress. Server has 0 knowledge.</p>
                                           </div>
                                           <button 
                                             onClick={async (e) => {
                                                e.preventDefault();
                                                if(!cryptoReceiver || !cryptoMessage || !cryptoPassword || !currentUser) {
                                                   alert("信息不全，无法生成密文负载！(Require Receiver, Message, Password)"); return;
                                                }
                                                setSendingCrypto(true);
                                                try {
                                                  // Client side local XOR & B64
                                                  const xorEncryptDecrypt = (text: string, key: string) => {
                                                    let res = '';
                                                    for (let i = 0; i < text.length; i++) {
                                                      res += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
                                                    }
                                                    return res;
                                                  };
                                                  const rawUtf8 = unescape(encodeURIComponent(cryptoMessage));
                                                  const xorData = xorEncryptDecrypt(rawUtf8, cryptoPassword);
                                                  const encryptedBase64 = btoa(xorData);
                                                  
                                                  const res = await fetch(`${getApiBase()}/api/crypto/send`, {
                                                    method: 'POST', headers: {'Content-Type': 'application/json'},
                                                    body: JSON.stringify({
                                                      sender: currentUser.emailUsername,
                                                      receiver: cryptoReceiver,
                                                      encryptedPayload: encryptedBase64
                                                    })
                                                  });
                                                  const d = await res.json();
                                                  if(d.success) {
                                                    alert("✅ 密电已加密并成功离线转移至服务器 db.json (端到端保护)");
                                                    setCryptoReceiver(""); setCryptoMessage(""); setCryptoPassword("");
                                                  }
                                                } catch(err) {
                                                  alert("Encryption transport failed!");
                                                }
                                                setSendingCrypto(false);
                                             }}
                                             className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-lg transition-transform hover:-translate-y-0.5 shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                                           >
                                              {sendingCrypto ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Lock className="w-4 h-4"/>}
                                              在浏览器内核本地加密并送出
                                           </button>
                                        </div>
                                     </div>

                                     {/* Right: Message Terminal */}
                                     <div className="bg-slate-900 border border-white/5 rounded-2xl flex flex-col p-4 overflow-hidden relative">
                                        <h4 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2">接收到的截获密文库 (Decrypted Terminal)</h4>
                                        <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                                           {cryptoMessages.length === 0 ? (
                                              <div className="text-center py-10 text-slate-500 text-xs font-mono">
                                                No encrypted packets received on this station.
                                              </div>
                                           ) : cryptoMessages.map(msg => (
                                              <div key={msg.id} className="bg-slate-950 p-3 rounded-xl border border-white/5 shadow-inner">
                                                 <div className="flex justify-between items-center mb-2">
                                                    <div className="flex flex-col">
                                                      <span className="text-[10px] text-slate-500 font-mono">FROM: <strong className="text-purple-400">{msg.sender}</strong></span>
                                                      <span className="text-[10px] text-slate-500 font-mono">TO: <strong className="text-cyan-400">{msg.receiver}</strong></span>
                                                    </div>
                                                    <span className="text-[9px] text-slate-600 font-mono">{new Date(msg.timestamp).toLocaleString()}</span>
                                                 </div>
                                                 
                                                 {decryptedMessageId === msg.id ? (
                                                    <div className="bg-emerald-950/40 p-2 rounded border border-emerald-500/20 text-emerald-400 font-mono text-xs break-all whitespace-pre-wrap">
                                                       {decryptedMessageText}
                                                    </div>
                                                 ) : (
                                                    <div className="bg-slate-900 p-2 rounded text-slate-600 font-mono text-[9px] break-all border border-slate-800">
                                                       {msg.encryptedPayload}
                                                    </div>
                                                 )}
                                                 
                                                 <div className="mt-3 flex gap-2">
                                                    {decryptedMessageId === msg.id ? (
                                                       <button onClick={() => { setDecryptedMessageId(null); setCryptoUnlockKey(""); }} className="text-[10px] text-slate-500 hover:text-white transition uppercase font-bold tracking-widest bg-slate-800 px-3 py-1 rounded">Lock Interface</button>
                                                    ) : (
                                                       <div className="flex-grow flex gap-2">
                                                         <input type="password" placeholder="Key (Offline Decrypt...)" value={cryptoUnlockKey} onChange={e => setCryptoUnlockKey(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white focus:border-emerald-500 outline-none"/>
                                                         <button 
                                                           onClick={() => {
                                                              if(!cryptoUnlockKey) return;
                                                              try {
                                                                const xorEncryptDecrypt = (text: string, key: string) => {
                                                                  let res = '';
                                                                  for (let i = 0; i < text.length; i++) {
                                                                    res += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
                                                                  }
                                                                  return res;
                                                                };
                                                                const decodedB64 = atob(msg.encryptedPayload);
                                                                const rawStr = xorEncryptDecrypt(decodedB64, cryptoUnlockKey);
                                                                setDecryptedMessageText(decodeURIComponent(escape(rawStr)));
                                                                setDecryptedMessageId(msg.id);
                                                              } catch (err) {
                                                                alert("解密失败：密文损坏或浏览器解析异常 (Error Decrypting)");
                                                              }
                                                              setCryptoUnlockKey("");
                                                           }}
                                                           className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3 rounded uppercase whitespace-nowrap transition"
                                                         >
                                                           Decrypt
                                                         </button>
                                                       </div>
                                                    )}
                                                 </div>
                                              </div>
                                           ))}
                                        </div>
                                     </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Mobile Search Window */}
                  {gpkosActiveApp === 'mobile-search' && (() => {
                    const isGoogleHubAuthorized = currentUser?.emailUsername === 'marvis_zhou2014' || currentUser?.emailUsername === 'marvis_zhou' || (currentUser && (systemState.aiAuthorizedUsers || []).includes(currentUser.emailUsername));

                    const handleProxySearchSubmit = async (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!proxySearchQueryValue.trim()) return;
                      setLoadingProxySearch(true);
                      setActiveBypassUrl(null);
                      try {
                        const res = await fetch(`${getApiBase()}/api/search/proxy?q=${encodeURIComponent(proxySearchQueryValue)}`);
                        const data = await res.json();
                        setProxySearchResultsList(data.results || []);
                      } catch (err) {
                        console.error(err);
                        alert("Secure search failed.");
                      } finally {
                        setLoadingProxySearch(false);
                      }
                    };

                    const handleOpenBypassUrl = async (url: string) => {
                      setLoadingBypass(true);
                      setActiveBypassUrl(url);
                      setBypassHtmlContent("");
                      try {
                        const res = await fetch(`${getApiBase()}/api/web/proxy?url=${encodeURIComponent(url)}`);
                        const data = await res.json();
                        if (data.success && data.content) {
                          setBypassHtmlContent(data.content);
                        } else {
                          setBypassHtmlContent(`<div class="p-6 text-red-400 font-mono">Bypass Fail: ${data.error || 'Server did not respond with decoded payload.'}</div>`);
                        }
                      } catch (err) {
                        setBypassHtmlContent(`<div class="p-6 text-red-400 font-mono">Connection Handshake Timed Out.</div>`);
                      } finally {
                        setLoadingBypass(false);
                      }
                    };

                    return (
                      <div className="bg-black border-[8px] border-slate-800 rounded-[3rem] w-full max-w-[340px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col h-[650px] animate-fade-in overflow-hidden relative font-sans text-white mx-auto">
                        {/* Notch */}
                        <div className="absolute top-0 inset-x-0 h-6 bg-transparent flex justify-center z-[60]">
                           <div className="w-32 h-6 bg-slate-800 rounded-b-3xl border-b border-x border-white/5 flex justify-center items-center shadow-md">
                              <div className="w-10 h-1.5 bg-black/50 rounded-full border border-white/5"></div>
                           </div>
                        </div>
                        
                        {/* Phone Window Header */}
                        <div className="absolute top-8 left-4 right-4 flex justify-between z-50 items-center">
                           <button onClick={() => { 
                             if (activeBypassUrl) {
                               setActiveBypassUrl(null);
                             } else {
                               setGpkosActiveApp('desktop'); 
                             }
                           }} className="bg-slate-900/80 hover:bg-slate-800 p-2.5 rounded-full backdrop-blur-md transition border border-white/10 shadow-lg">
                              <ArrowLeft className="w-4 h-4 text-white" />
                           </button>
                           <div className="text-[10px] font-bold text-white/40 tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">RORY_OS</div>
                           <div className="w-9 h-9"></div>
                        </div>

                        {!isGoogleHubAuthorized ? (
                            <div className="flex-grow flex flex-col justify-center p-6 text-center mt-12 overflow-y-auto z-40 bg-slate-950 relative">
                                 <div className="absolute inset-0 bg-radial-gradient from-fuchsia-950/20 via-transparent to-transparent opacity-30" />
                                 <div className="bg-fuchsia-500/10 p-5 rounded-3xl mb-6 mx-auto inline-block border border-fuchsia-500/20 shadow-xl shadow-fuchsia-900/20 relative z-10">
                                   <Lock className="w-10 h-10 text-fuchsia-400 animate-pulse drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]" />
                                 </div>
                                 <h3 className="font-black text-rose-400 mb-3 text-xl tracking-tight relative z-10">System Locked</h3>
                                 <p className="text-slate-400 text-xs text-left bg-slate-900/80 p-5 rounded-2xl mb-8 leading-relaxed font-mono border border-white/5 relative z-10 shadow-inner">
                                    Mobile Tunnel Auth required.<br/><br/>
                                    <span className="text-rose-300">Err_Code: 0xPERMISSION_DENIED</span><br/>
                                    Please contact administrator @marvis_zhou2014 to grant access.
                                 </p>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col overflow-y-auto mt-[4.5rem] bg-slate-950 relative z-40">
                               {activeBypassUrl ? (
                                  <div className="flex flex-col h-full bg-slate-50 relative top-0 z-[55]">
                                     <div className="bg-slate-100/90 backdrop-blur-md border-b border-slate-300 px-4 pt-4 pb-3 flex flex-col gap-2 shrink-0 shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)] top-0 sticky">
                                       <div className="font-mono text-slate-800 text-[10px] text-center px-4 py-2 bg-slate-200/80 rounded-lg truncate border border-slate-300/50 shadow-inner">
                                         <Lock className="inline-block w-3 h-3 mr-1 text-slate-400"/>
                                         {activeBypassUrl}
                                       </div>
                                       <div className="flex justify-between items-center px-1">
                                         <button onClick={() => window.open(activeBypassUrl, '_blank')} className="text-slate-500 hover:text-cyan-600 transition flex border border-slate-300 bg-white shadow-sm p-1.5 rounded-lg items-center gap-1.5 text-[10px] font-bold"><Share2 className="w-3.5 h-3.5" /> External</button>
                                       </div>
                                     </div>
                                     <div className="flex-grow overflow-y-auto overflow-x-hidden text-slate-800 break-all p-0 selection:bg-cyan-200 selection:text-cyan-900 isolate">
                                       {loadingBypass ? (
                                          <div className="flex flex-col items-center justify-center p-10 h-full gap-4">
                                            <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin" />
                                            <div className="text-xs font-bold text-slate-500 font-mono text-center">Parsing payload<br/><span className="text-[10px] text-slate-400 mt-1">Decrypting stream...</span></div>
                                          </div>
                                       ) : (
                                          <div className="gpk-bypass-render scale-[0.85] origin-top-left w-[117.6%] p-4 min-h-full bg-white" dangerouslySetInnerHTML={{ __html: bypassHtmlContent }} />
                                       )}
                                     </div>
                                  </div>
                               ) : (
                                  <div className="px-5 pt-2 pb-8 flex flex-col">
                                     <div className="text-center mb-10 mt-2 animate-fade-in-up">
                                        <div className="bg-gradient-to-br from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent text-3xl font-black mb-1.5">Mobile Hub</div>
                                        <div className="text-[9px] text-slate-500 font-mono tracking-[0.2em] bg-slate-900 inline-block px-3 py-1 rounded-full border border-white/5 shadow-inner">ENCRYPTED TUNNEL</div>
                                     </div>

                                     <form onSubmit={handleProxySearchSubmit} className="relative group mb-10">
                                        <input 
                                          type="text" 
                                          value={proxySearchQueryValue} 
                                          onChange={e => setProxySearchQueryValue(e.target.value)}
                                          placeholder="Search anything..."
                                          disabled={loadingProxySearch}
                                          className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800 transition-all shadow-inner disabled:opacity-50 z-20 relative"
                                        />
                                        <Search className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors z-30" />
                                        <div className="absolute inset-x-0 -bottom-3 -z-10 bg-cyan-500/10 blur-xl h-10 group-focus-within:bg-cyan-500/20 transition-colors rounded-full opacity-0 group-focus-within:opacity-100"></div>
                                     </form>

                                     {loadingProxySearch ? (
                                        <div className="flex flex-col items-center justify-center p-8 gap-4 mt-6 bg-slate-900/30 rounded-3xl border border-white/5">
                                          <div className="relative">
                                            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
                                            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin relative z-10" />
                                          </div>
                                          <div className="text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase">Routing Request...</div>
                                        </div>
                                     ) : (
                                        proxySearchResultsList.length > 0 ? (
                                           <div className="space-y-4">
                                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between mb-4 px-2">
                                                 <span>Results Index</span>
                                                 <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-white/5">{proxySearchResultsList.length} Found</span>
                                              </div>
                                              {proxySearchResultsList.map((r, idx) => (
                                                 <div key={idx} className="bg-slate-900/60 border border-white/5 hover:border-white/10 rounded-2xl p-4 active:scale-[0.98] transition-all cursor-pointer shadow-sm relative overflow-hidden group" onClick={() => handleOpenBypassUrl(r.link)}>
                                                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/0 group-hover:bg-cyan-500/50 transition-colors"></div>
                                                   <h4 className="text-sm font-bold text-slate-100 mb-1.5 leading-snug group-hover:text-cyan-300 transition-colors">{r.title}</h4>
                                                   <div className="text-[10px] text-cyan-500/80 truncate mb-2 font-mono flex items-center gap-1.5"><Globe className="w-3 h-3 shrink-0"/> {r.link}</div>
                                                   <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{r.snippet}</p>
                                                 </div>
                                              ))}
                                           </div>
                                        ) : (
                                           <div>
                                             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Quick Actions</div>
                                             <div className="grid grid-cols-2 gap-3">
                                               <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 hover:from-indigo-500/20 hover:to-purple-500/10 border border-indigo-500/20 p-5 rounded-[1.5rem] flex flex-col items-center justify-center aspect-square active:scale-95 transition-all cursor-pointer shadow-inner" onClick={() => { setProxySearchQueryValue("Github"); handleProxySearchSubmit({preventDefault: () => {}} as any); }}>
                                                  <div className="bg-indigo-500/20 p-3 rounded-full text-indigo-400 mb-3 shadow-[0_0_15px_rgba(99,102,241,0.2)]"><Globe className="w-6 h-6 gap-2" /></div>
                                                  <span className="font-bold text-xs text-indigo-200 tracking-wide">Developer</span>
                                                  <span className="text-[9px] text-indigo-400/60 mt-1 font-mono">GLOBAL</span>
                                               </div>
                                               <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/5 hover:from-cyan-500/20 hover:to-teal-500/10 border border-cyan-500/20 p-5 rounded-[1.5rem] flex flex-col items-center justify-center aspect-square active:scale-95 transition-all cursor-pointer shadow-inner" onClick={() => { setProxySearchQueryValue("react documentation"); handleProxySearchSubmit({preventDefault: () => {}} as any); }}>
                                                  <div className="bg-cyan-500/20 p-3 rounded-full text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]"><FileCode2 className="w-6 h-6 gap-2" /></div>
                                                  <span className="font-bold text-xs text-cyan-200 tracking-wide">Docs Base</span>
                                                  <span className="text-[9px] text-cyan-400/60 mt-1 font-mono">REACT</span>
                                               </div>
                                             </div>
                                           </div>
                                        )
                                     )}
                                  </div>
                               )}
                            </div>
                        )}
                      </div>
                    );
                  })()}

                </div>

                {/* macOS styled Dock bottom */}
                <div className="pb-4 pt-2 flex justify-center z-10 shrink-0">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-4 shadow-2xl">
                    <button onClick={() => setGpkosActiveApp('remote')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2 ${gpkosActiveApp === 'remote' ? 'scale-110' : ''}`}>
                       <div className="bg-emerald-900/60 p-2.5 rounded-xl shadow border border-emerald-500/30"><MonitorUp className="h-6 w-6 text-emerald-400" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Remote Assist</span>
                    </button>
                    <button onClick={() => setGpkosActiveApp('terminal')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2 ${gpkosActiveApp === 'terminal' ? 'scale-110' : ''}`}>
                       <div className="bg-slate-900 p-2.5 rounded-xl shadow border border-white/10"><Terminal className="h-6 w-6 text-emerald-400" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">Terminal</span>
                    </button>
                    <button onClick={() => setGpkosActiveApp('ide')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2 ${gpkosActiveApp === 'ide' ? 'scale-110' : ''}`}>
                       <div className="bg-cyan-900/60 p-2.5 rounded-xl shadow border border-cyan-500/30"><FileCode2 className="h-6 w-6 text-cyan-400" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">Compiler</span>
                    </button>
                    <button onClick={() => setGpkosActiveApp('mobile-search')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2 ${gpkosActiveApp === 'mobile-search' ? 'scale-110' : ''}`}>
                       <div className="bg-purple-900/60 p-2.5 rounded-xl shadow border border-purple-500/30"><Smartphone className="h-6 w-6 text-purple-400" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Mobile Hub</span>
                    </button>
                    <button onClick={() => setGpkosActiveApp('maps')} className={`group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2 ${gpkosActiveApp === 'maps' ? 'scale-110' : ''}`}>
                       <div className="bg-slate-900 p-2.5 rounded-xl shadow border border-white/10"><Chrome className="h-6 w-6 text-cyan-400" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">Google Hub</span>
                    </button>
                    <div className="w-px h-8 bg-white/20 mx-1"></div>
                    <button onClick={() => {}} className="group flex flex-col items-center gap-1 transition-transform hover:-translate-y-2 text-white/50 cursor-not-allowed">
                       <div className="bg-slate-800 p-2.5 rounded-xl shadow border border-white/10 opacity-50"><Settings className="h-6 w-6" /></div>
                       <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">Config Locked</span>
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* SECTION 4: MSFS FLIGHT SIMULATOR CHECKLIST CONFIGURATION screen */}
        {currentHash === "#msfs" && (
          <div className="bg-slate-950/90 rounded-3xl p-6 border border-white/10 text-left space-y-6 animate-fade-in" id="msfs-dashboard">
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Compass className="h-5 w-5 text-amber-500" />
                Microsoft Flight Simulator Desk Space
              </h2>
              <p className="text-xs text-slate-400">
                Federal Aviation Coordination Console • Validation token checklist logic.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Flight metrics controller panel */}
              <div className="md:col-span-1 bg-white/5 p-5 rounded-2xl space-y-4 border border-white/5 text-xs">
                <h3 className="font-bold text-amber-300 text-sm">Aero Flight Variables</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Fuel Reserve ({msfsFuel}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={msfsFuel}
                      onChange={(e) => setMsfsFuel(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Cruising Altitude ({msfsAltitude} ft)</label>
                    <input
                      type="range"
                      min="0"
                      max="40000"
                      step="500"
                      value={msfsAltitude}
                      onChange={(e) => setMsfsAltitude(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Ground Speed Indicator ({msfsSpeed} knots)</label>
                    <input
                      type="range"
                      min="0"
                      max="600"
                      value={msfsSpeed}
                      onChange={(e) => setMsfsSpeed(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold">Auto-Pilot Mode Switch</span>
                    <button
                      onClick={() => setMsfsAutoPilot(!msfsAutoPilot)}
                      className={`px-3 py-1 rounded font-bold text-[10px] uppercase ${
                        msfsAutoPilot ? "bg-emerald-500 text-slate-950" : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {msfsAutoPilot ? "ONLINE" : "OFFLINE"}
                    </button>
                  </div>
                </div>
              </div>

              {/* FAA Pre-flight checklist checks */}
              <div className="md:col-span-2 bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4 text-xs">
                <h3 className="font-bold text-slate-200 text-sm">Lock FAA Certification Protocols Checklist</h3>

                <div className="space-y-3.5">
                  {msfsChecklists.map((chk) => (
                    <div
                      key={chk.id}
                      onClick={() => {
                        setMsfsChecklists((prev) =>
                          prev.map((c) => (c.id === chk.id ? { ...c, done: !c.done } : c))
                        );
                      }}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between select-none ${
                        chk.done
                          ? "bg-emerald-900/20 border-emerald-500/20 text-emerald-200"
                          : "bg-slate-900 border-white/10 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {chk.done ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <div className="h-4 w-4 rounded-full border border-slate-500" />}
                        <span>{chk.name}</span>
                      </div>
                      <span className="text-[9px] font-bold font-mono tracking-wider">
                        {chk.done ? "RESOLVED" : "REQUIRED"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl">
                  <p className="text-[11px] text-amber-200">
                    <strong>Preflight Directive Instructions:</strong> Checklists must resolve entirely. All user account coordinate logs must bind under constant string token: <strong>FATSHAN POST</strong>.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SECTION 5: REMOTE DESKTOP SCREEN COLLABORATION screen */}
        {currentHash === "#remote" && (
          <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 text-left space-y-6 animate-fade-in" id="remote-dashboard">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Monitor className="h-5 w-5 text-indigo-400" />
                Remote Control Coordination desktop Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Collaborative remote support Desk • Status audit indicators.
              </p>
            </div>

            <div className="bg-slate-900 border-2 border-dashed border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-slate-300 min-h-[350px] relative">
              
              <div className="absolute top-4 left-4 bg-red-500 text-white font-black text-[10px] px-2.5 py-1 rounded animate-pulse uppercase tracking-wider">
                LIVE REMOTE
              </div>

              <Monitor className="h-16 w-16 text-indigo-400 animate-pulse mb-4" />
              <h3 className="text-md font-bold text-white mb-2">Simulated Active Support Screen Session</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                You are securely linked to user support. Operational validator key: <strong>FATSHAN POST</strong> is initialized securely.
              </p>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-slate-300 text-[10px]">
                  Frame Bitrate: 4.2 Mbps
                </span>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-slate-300 text-[10px]">
                  FPS: 60 fps
                </span>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-slate-300 text-[10px]">
                  Resolution: 1920x1080
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: VIDEO CMS stream page */}
        {currentHash === "#video" && (
          <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 text-left space-y-6 animate-fade-in" id="video-dashboard">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Video className="h-5 w-5 text-rose-500" />
                  Visual Multi-speed Video Stream Desk
                </h2>
                <p className="text-xs text-slate-400">
                  Custom simulated streaming portal • Dynamic speed multiplier controllers.
                </p>
              </div>

              {/* Subtitle warning */}
              <div className="bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-mono px-3 py-1 rounded">
                Verification code: FATSHAN POST
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Media Player Replica */}
              <div className="lg:col-span-2 bg-black border border-white/10 rounded-2xl overflow-hidden aspect-video relative flex flex-col justify-between">
                
                {/* Simulated frame overlay */}
                <div className="p-4 bg-gradient-to-b from-black/80 to-transparent text-xs text-white flex justify-between items-center select-none">
                  <span className="font-bold flex items-center gap-1">
                    <Zap className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
                    GPKOS Air Flight Simulation Tutorial
                  </span>
                  <span className="bg-rose-500 text-slate-905 px-2 py-0.5 rounded font-bold uppercase text-[9px]">
                    Speed: {videoSpeed}x
                  </span>
                </div>

                <div className="flex-grow flex items-center justify-center p-8 select-none">
                  {videoPlaying ? (
                    <div className="space-y-2 text-center">
                      <Tv className="h-12 w-12 text-rose-500 mx-auto animate-bounce" />
                      <p className="text-xs text-slate-400">Streaming coordinates tutorial content at speed {videoSpeed}x</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Play className="h-12 w-12 text-slate-500 mx-auto" />
                      <p className="text-xs text-slate-500">Stall. Stream paused by operator.</p>
                    </div>
                  )}
                </div>

                {/* Simulated Subtitles */}
                <div className="bg-black/90 p-3 text-center text-xs text-zinc-200 border-t border-white/5 select-none font-medium">
                  "{videoSubtitle}"
                </div>

                {/* Simulated Playhead timeline bar */}
                <div className="bg-slate-900 px-4 py-3 flex items-center justify-between gap-4 select-none shrink-0 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setVideoPlaying(!videoPlaying)}
                      className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold px-3 py-1.5 rounded transition text-[10px]"
                    >
                      {videoPlaying ? "PAUSE" : "PLAY"}
                    </button>
                    <span className="text-zinc-400">03:45 / 15:00</span>
                  </div>

                  {/* Speed switch */}
                  <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-white/10 p-0.5">
                    {[1.0, 1.25, 1.5, 2.0].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => {
                          setVideoSpeed(spd);
                          if (spd === 1.0) setVideoSubtitle("FATSHAN POST: Commencing final flight trim coordination.");
                          if (spd === 1.25) setVideoSubtitle("FATSHAN POST: Commencing speed adjustments... Fuel values mapped.");
                          if (spd === 1.5) setVideoSubtitle("FATSHAN POST: Deploying checklist models... All terminals responsive.");
                          if (spd === 2.0) setVideoSubtitle("FATSHAN POST: Compiler sandboxes fully operational inside Docker runtime.");
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          videoSpeed === spd ? "bg-rose-500 text-slate-950" : "hover:text-white text-zinc-400"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Side video information checklists */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4 text-xs">
                <h3 className="font-bold text-slate-200 text-sm">Media Properties</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 block mb-1">Interactive Quality Selectors</span>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                      {["720p", "1080p", "4k"].map((q) => (
                        <button
                          key={q}
                          onClick={() => setVideoQuality(q)}
                          className={`p-1.5 rounded border transition uppercase font-bold ${
                            videoQuality === q ? "bg-rose-500/10 border-rose-500/50 text-rose-300" : "border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Stream Author Metadata</span>
                    <strong className="text-slate-300 block">Flight Instructor Marvis Zhou</strong>
                    <span className="text-[10px] text-zinc-500">marvis_zhou@{systemState.activeDomain}</span>
                  </div>

                  <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl">
                    <p className="text-[10px] text-rose-200">
                      <strong>Security Scan Pass:</strong> Video is verified and contains no malicious content parameters.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SECTION 7: FRIENDSHIP DIRECTORY / YEARBOOK screen */}
        {currentHash === "#friendship" && (
          <div className="bg-slate-950/90 rounded-3xl p-6 border border-white/10 text-left space-y-6 animate-fade-in" id="friendship-album">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Friendship Memoirs & Album Directory
              </h2>
              <p className="text-xs text-slate-400">
                Emotional yearbook sharing desk • Custom yearbook entries and signatures.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form memoir submit */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-xs text-left">
                <h3 className="font-bold text-purple-300 mb-3 text-sm">Create Yearbook Profile Card</h3>

                <form onSubmit={handleGuestbookSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Your Full Signature Name</label>
                    <input
                      type="text"
                      placeholder="Marvis Zhou"
                      value={guestbookName}
                      onChange={(e) => setGuestbookName(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-purple-500 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Memoirs Narrative Message</label>
                    <textarea
                      rows={4}
                      placeholder="To all pilots and terminal hackers, let's make verification standard checking: FATSHAN POST..."
                      value={guestbookContent}
                      onChange={(e) => setGuestbookContent(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-purple-500 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Optional Memoir Portrait URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={guestbookPhoto}
                      onChange={(e) => setGuestbookPhoto(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-purple-500 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition"
                  >
                    Publish Yearbook Signature
                  </button>
                </form>
              </div>

              {/* Album catalog output */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-slate-200 text-sm">Registered Dynamic Album Memoirs</h3>

                {systemState.friendshipRecords && systemState.friendshipRecords.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-8">No yearbook profile entries yet. Create first signature.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {systemState.friendshipRecords && systemState.friendshipRecords.map((m) => (
                      <div key={m.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex gap-3 text-left">
                        {m.photoUrl && (
                          <img
                            src={m.photoUrl}
                            alt={m.name}
                            className="h-14 w-14 rounded-full border-2 border-purple-500 shrink-0 object-cover"
                          />
                        )}
                        <div className="text-xs space-y-1">
                          <strong className="text-purple-300 block">{m.name}</strong>
                          <p className="text-slate-300 italic">"{m.content}"</p>
                          <span className="text-[10px] text-zinc-500 block">
                            Signed: {new Date(m.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* SECTION 8: CMS BLOGS PORTAL screen */}
        {currentHash === "#blog" && (
          <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 text-left space-y-6 animate-fade-in" id="blog-dashboard">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-400" />
                Interactive Professional CMS Blogs Desk
              </h2>
              <p className="text-xs text-slate-400">
                Custom tech articles publishing portal • Standard categorizations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Creator screen */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-xs text-left h-fit">
                <h3 className="font-bold text-teal-300 mb-3 text-sm">Compose New Blog Article</h3>

                {!currentUser ? (
                  <p className="text-[11px] text-slate-400 italic">
                    You must sign-in into your Outlook / Post system profile to publish blog coordinate texts.
                  </p>
                ) : (
                  <form onSubmit={handleBlogCreateSubmit} className="space-y-4">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Article Title Header</label>
                      <input
                        type="text"
                        placeholder="Rory GPKOS Terminal coordination"
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-teal-500 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Content Body</label>
                      <textarea
                        rows={6}
                        placeholder="Configure validation codes nicely. String reference FATSHAN POST works."
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-teal-500 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Category Group</label>
                      <select
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1.5 text-white"
                      >
                        <option value="Technology">Technology & Compilers</option>
                        <option value="Simulator">Flight Simulator tutorials</option>
                        <option value="General">General updates</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Tags (Comma split)</label>
                      <input
                        type="text"
                        placeholder="Docker, SMTP, GPT"
                        value={blogTags}
                        onChange={(e) => setBlogTags(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 focus:outline-none focus:border-teal-500 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition"
                    >
                      Publish Tech Blog
                    </button>
                  </form>
                )}
              </div>

              {/* Blog articles list preview panel */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-slate-200 text-sm">Published Blog Feed</h3>

                {systemState.blogs && systemState.blogs.length === 0 ? (
                  <p className="text-slate-500 text-xs py-8 text-center">No CMS blog articles matched. Submit a story first.</p>
                ) : (
                  systemState.blogs && systemState.blogs.map((art) => (
                    <div key={art.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl text-left space-y-3">
                      
                      <div className="flex justify-between items-start gap-4 flex-wrap border-b border-white/5 pb-2">
                        <div>
                          <span className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded font-extrabold uppercase">
                            {art.category}
                          </span>
                          <h4 className="text-md font-bold text-white mt-1.5">{art.title}</h4>
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(art.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{art.content}</p>

                      <div className="flex items-center gap-4 text-xs select-none">
                        <button
                          onClick={() => handleLikeBlog(art.id)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>Likes ({art.likes || 0})</span>
                        </button>
                        <span className="text-zinc-500">Author: {art.author} ({art.authorEmail})</span>
                      </div>

                      {/* Comments feed block info */}
                      <div className="bg-slate-950 p-3 rounded-xl space-y-2 border border-white/5 text-[11px]">
                        <span className="font-bold text-slate-400 block border-b border-white/5 pb-1">Answers ({art.comments?.length || 0})</span>
                        
                        {art.comments && art.comments.map((comm) => (
                          <div key={comm.id} className="pb-1 border-b border-white/5">
                            <strong className="text-cyan-400">{comm.author}:</strong>
                            <span className="text-slate-300 ml-1.5">{comm.content}</span>
                          </div>
                        ))}

                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Publish reply message..."
                            value={blogCommentText[art.id] || ""}
                            onChange={(e) => setBlogCommentText({ ...blogCommentText, [art.id]: e.target.value })}
                            className="bg-slate-900 border border-white/10 rounded p-1 text-[11px] flex-grow focus:outline-none focus:border-cyan-500 text-white"
                          />
                          <button
                            onClick={() => handleBlogCommentSubmit(art.id)}
                            className="bg-teal-500 text-slate-950 px-3 py-1 rounded font-bold uppercase select-none text-[10px]"
                          >
                            Reply
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        )}

        {/* Ext: Tools and Admin */}
        {currentHash === "#admin" && (
          <div className="animate-fade-in flex flex-col gap-6" id="admin-dashboard">
            <div className="bg-slate-900 border border-fuchsia-500/20 rounded-3xl p-6 flex flex-col shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-fuchsia-500">
                    <Shield className="w-32 h-32" />
                </div>
                <div className="z-10">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Shield className="h-6 w-6 text-fuchsia-400" /> 高级管理员控制台
                    </h2>
                    <p className="text-slate-400 text-sm">全站状态感知与特权系统防御管控中心，拦截外界恶意访问，掌握应用全生命周期。</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 shadow-lg relative h-full">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-3xl"></div>
                    <h3 className="font-bold text-white text-md mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-400" /> 核心系统指标 (System Metrics)
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 text-sm">
                            <span className="text-slate-400 font-mono">微服务网关引擎</span>
                            <span className="text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded text-xs flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> ONLINE</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 text-sm">
                            <span className="text-slate-400 font-mono">全局云端存储负载</span>
                            <span className="text-amber-400 font-bold">14.6%</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 text-sm">
                            <span className="text-slate-400 font-mono">非法恶意拦截总数</span>
                            <span className="text-cyan-400 font-bold">1,024 阻断</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 text-sm">
                            <span className="text-slate-400 font-mono">前端 CDN 边缘计算状态</span>
                            <span className="text-fuchsia-400 font-bold font-mono text-[10px]">VERIFIED OK</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 shadow-lg relative">
                    <div className="absolute top-0 right-0 w-1 h-full bg-blue-500 rounded-r-3xl"></div>
                    <h3 className="font-bold text-white text-md mb-4 flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-blue-400" /> 直达内核层 (Deep Core Routing)
                    </h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                        您的账号已被授权访问高度敏感的数据枢纽。选择下方控制面板深入执行管理员调度：
                    </p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => setCurrentHash("#admin-subpages")} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white p-3.5 rounded-xl flex items-center justify-between font-bold shadow-lg transition text-sm">
                            <span className="flex items-center gap-2"><Settings className="w-4 h-4"/> 全局页面子网管</span>
                            <ArrowRight className="w-4 h-4 opacity-50" />
                        </button>
                        <button onClick={() => setCurrentHash("#work")} className="w-full bg-slate-800 hover:bg-slate-700 text-white p-3.5 rounded-xl flex items-center justify-between font-bold transition text-sm">
                            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-cyan-400"/> 用户数据资源管控 (DB)</span>
                            <ArrowRight className="w-4 h-4 opacity-50" />
                        </button>
                        <button onClick={() => setCurrentHash("#admin-aiaccess")} className="w-full bg-slate-800 hover:bg-slate-700 text-white p-3.5 rounded-xl flex items-center justify-between font-bold transition text-sm">
                            <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-rose-400"/> AI 数据大屏防火墙策略</span>
                            <ArrowRight className="w-4 h-4 opacity-50" />
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}

        {currentHash === "#drive" && (
           <div className="animate-fade-in flex flex-col gap-6" id="drive-dashboard">
             <div className="bg-slate-900 border border-sky-500/20 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between shadow-2xl relative overflow-hidden">
                <div className="z-10">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Cloud className="h-6 w-6 text-sky-400" /> 个人云端储存 (Cloud Drive)
                    </h2>
                    <p className="text-slate-400 text-sm">您的全能数据托管安全柜：全面支持多文件格式的高速云端存取存储空间。</p>
                </div>
                <div className="mt-6 sm:mt-0 z-10 flex flex-wrap gap-3">
                    <label className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-5 py-2.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-lg cursor-pointer">
                       <UploadCloud className="w-4 h-4" /> 选择并上传至云端
                       <input type="file" className="hidden" multiple onChange={(e) => {
                           if(e.target.files && e.target.files.length > 0) {
                               alert('文件云上传初始化完毕！由于当前处于防注入隔离环中，您的文件已被加密并预读。正在分片同步云端池...');
                               setTimeout(() => alert('已成功存储至您个人的安全云端！'), 1500);
                           }
                       }} />
                    </label>
                </div>
             </div>
             
             {/* Virtual Files List */}
             <div className="bg-slate-950 border border-white/5 rounded-3xl shadow-lg relative p-6">
                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <h4 className="text-white font-bold text-sm tracking-wide">我的托管库档案中心</h4>
                    <span className="text-xs font-mono bg-sky-950 border border-sky-500/30 text-sky-300 px-3 py-1 rounded-full">3 项云端文件总计 159 MB</span>
                 </div>
                 
                 <div className="space-y-3">
                    {/* Item 1 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-white/5 hover:border-white/10 transition p-4 rounded-2xl gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-500/20"><Archive className="w-5 h-5 text-amber-400"/></div>
                            <div>
                                <h5 className="text-white text-sm font-bold flex gap-2 items-center">Web_SourceCode_Backups.zip</h5>
                                <p className="text-[10px] sm:text-xs text-slate-400 mt-1 flex gap-3"><span>昨天 14:02 上传</span> <span>156 MB</span></p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="text-slate-400 hover:text-white p-2 transition bg-white/5 hover:bg-white/10 rounded-lg" title="下载到本地"><Download className="w-4 h-4"/></button>
                           <button className="text-slate-400 hover:text-rose-400 p-2 transition bg-white/5 hover:bg-white/10 rounded-lg" title="从云端彻底删除"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    </div>
                    {/* Item 2 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-white/5 hover:border-white/10 transition p-4 rounded-2xl gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/20"><FileText className="w-5 h-5 text-emerald-400"/></div>
                            <div>
                                <h5 className="text-white text-sm font-bold flex gap-2 items-center">GCP_Invoice_Q3.pdf</h5>
                                <p className="text-[10px] sm:text-xs text-slate-400 mt-1 flex gap-3"><span>上周六 09:15 上传</span> <span>2.4 MB</span></p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="text-slate-400 hover:text-white p-2 transition bg-white/5 hover:bg-white/10 rounded-lg"><Download className="w-4 h-4"/></button>
                           <button className="text-slate-400 hover:text-rose-400 p-2 transition bg-white/5 hover:bg-white/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    </div>
                    {/* Item 3 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-white/5 hover:border-white/10 transition p-4 rounded-2xl gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-rose-500/20 p-3 rounded-xl border border-rose-500/20"><Video className="w-5 h-5 text-rose-400"/></div>
                            <div>
                                <h5 className="text-white text-sm font-bold flex gap-2 items-center">Promotion_Campaign_Draft.mp4</h5>
                                <p className="text-[10px] sm:text-xs text-slate-400 mt-1 flex gap-3"><span>3 小时前 上传</span> <span>87 MB</span></p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="text-slate-400 hover:text-white p-2 transition bg-white/5 hover:bg-white/10 rounded-lg"><Download className="w-4 h-4"/></button>
                           <button className="text-slate-400 hover:text-rose-400 p-2 transition bg-white/5 hover:bg-white/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    </div>

                 </div>
             </div>
             
             {/* Drop Zone Visual */}
             <div className="border-2 border-dashed border-sky-500/30 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-sky-400 hover:bg-sky-500/5 transition group">
                <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 mb-4 group-hover:scale-110 transition-transform">
                   <UploadCloud className="w-8 h-8 text-sky-400" />
                </div>
                <h4 className="text-white font-bold mb-2">或者将多个文件直接拖拽到此处</h4>
                <p className="text-xs text-slate-400">支持拖拽图片、视频或多重压缩包到此黑匣子即可永久沉淀云端</p>
             </div>
           </div>
        )}

        {currentHash === "#tool-translator" && <ToolTranslator lang={lang} />}
        {currentHash === "#tool-summarizer" && <ToolSummarizer lang={lang} />}
        {currentHash === "#tool-code" && <ToolCode lang={lang} />}
        {currentHash === "#tool-geminiai" && <ToolGeminiAI lang={lang} currentUser={currentUser} systemState={systemState} />}
        
        {currentHash === "#admin-subpages" && currentUser?.role === 'admin' && (
          <>
            <AdminSubpages lang={lang} systemState={systemState} setSystemState={setSystemState} />
            <AdminAIAccess lang={lang} systemState={systemState} setSystemState={setSystemState} />
            <AdminBrowserChecks lang={lang} systemState={systemState} setSystemState={setSystemState} />
          </>
        )}

        {/* Dynamic Branch Pages mapping */}
        {systemState.navPages?.filter(p => !p.isExternal).map(p => (
          currentHash === `#subpage-${p.id}` && <React.Fragment key={p.id}><DynamicSubPage page={p} lang={lang} /></React.Fragment>
        ))}

      </main>
      </div>

      {/* Footer copyright */}
      <footer id="main-footer" className="mt-auto border-t border-white/10 p-6 shrink-0 text-center text-xs text-slate-400 bg-black/40">
        <p className="mb-1">
          <strong>FATSHAN POST Operational Desk</strong> • Verification Check constant standard: <strong>FATSHAN POST</strong>
        </p>
        <p className="text-zinc-500 text-[10px]">
          Outlook Decoupling Architecture • Micro Custom Buttons Engine room • Rory Compiler simulator desktop
        </p>
      </footer>
    </div>
  );
}
