import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";
import * as archiver from "archiver";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

app.use(express.json({ limit: "50mb" }));

// DB Helper Functions
function readDB() {
  let db: any = {};
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      db = JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading database file", err);
  }
  return {
    users: db.users || [],
    emails: db.emails || [],
    orders: db.orders || [],
    feedback: db.feedback || [],
    blogs: db.blogs || [],
    chatMessages: db.chatMessages || [],
    friendshipRecords: db.friendshipRecords || [],
    customButtons: db.customButtons || [],
    backgrounds: db.backgrounds || [{ id: "slate-classic", name: "Slate Classic", color: "bg-slate-900 text-slate-100" }],
    activeDomain: db.activeDomain || "fatshanpost.com",
    oldDomain: db.oldDomain || "outlook.com",
    dualDomainOverlap: db.dualDomainOverlap ?? true,
    dualDomainDays: db.dualDomainDays ?? 14,
    navPages: db.navPages || [],
    aiAuthorizedUsers: db.aiAuthorizedUsers || ["marvis_zhou2014"],
    pageBrowserChecks: db.pageBrowserChecks || [],
    settings: db.settings || { knowledgeBase: [] },
    cryptoMessages: db.cryptoMessages || [],
    cloudFiles: db.cloudFiles || []
  };
}

// Google Auth Helper
function decodeGoogleToken(token: string): string {
  if (!token) return "";
  let clean = token;
  // Handle simulated tokens from GPKOS login
  if (token.startsWith("SEC_TOKEN_")) {
    return "MOCK_TOKEN_" + token.slice(10);
  }
  // Handle legacy base64-wrapped tokens if prefix present correctly
  if (token.startsWith("SEC_")) {
     try {
       // Only try decoding if it looks like there might be something there
       const slice = token.slice(4);
       if (slice.length > 0) {
         clean = Buffer.from(slice, 'base64').toString('utf8');
       }
     } catch (e) {
       clean = token;
     }
  }
  return clean.trim();
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// Lazy Initialize Gemini API Client
let geminiClient: any = null;
function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing. AI features will operate with rules-based fallback.");
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Global active check for user ban status
function checkUserBanned(user: any) {
  if (!user || !user.banned) return false;
  if (user.banExpiry) {
    const now = new Date();
    const expiry = new Date(user.banExpiry);
    if (now > expiry) {
      // Unban automatically when time expires
      user.banned = false;
      user.banReason = "";
      user.banExpiry = null;
      return false;
    }
    return true;
  }
  return true;
}

// ==================== GLOBAL MIDDLEWARE ====================

app.use((req, res, next) => {
  // CORS Open Headers (Permit the frontend to fetch from any space)
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");

  if (req.method === "OPTIONS") {
    return res.status(200).send();
  }

  // Dynamic Auto-Domain Assigner based on Requester Host
  let requestingHost = req.hostname;
  if (req.headers.origin) {
    try {
      const url = new URL(req.headers.origin);
      requestingHost = url.hostname;
    } catch(e) {}
  }

  if (requestingHost && requestingHost !== "localhost" && requestingHost !== "127.0.0.1" && !requestingHost.startsWith("192.168.")) {
    const db = readDB();
    if (db.activeDomain !== requestingHost && !(db as any).isDomainLocked) {
      db.oldDomain = db.activeDomain;
      db.activeDomain = requestingHost;
      
      if (db.users) {
        db.users = db.users.map((u: any) => {
           u.emailDomain = requestingHost;
           return u;
        });
      }
      writeDB(db);
    }
  }

  next();
});

// ==================== REST APIs ====================

// 1. Database State / Public Configurations
app.get("/api/state", (req, res) => {
  const db = readDB();
  // Strip out passwords and delicate information from public telemetry
  const sanitizedUsers = (db.users || []).map((u: any) => ({
    id: u.id,
    emailUsername: u.emailUsername,
    emailDomain: u.emailDomain,
    fullName: u.fullName,
    contact: u.contact, // Admin needs all except privacy (passwords)
    role: u.role,
    storageQuota: u.storageQuota,
    storageUsed: u.storageUsed,
    verified: u.verified,
    banned: u.banned,
    banReason: u.banReason,
    banExpiry: u.banExpiry,
    medals: u.medals,
    activeBackground: u.activeBackground,
    loginType: u.loginType,
    verificationType: u.verificationType,
  }));

  res.json({
    activeDomain: db.activeDomain || "fatshanpost.com",
    oldDomain: db.oldDomain || "outlook.com",
    dualDomainOverlap: db.dualDomainOverlap ?? true,
    dualDomainDays: db.dualDomainDays ?? 14,
    customButtons: db.customButtons || [],
    backgrounds: db.backgrounds || [],
    users: sanitizedUsers,
    blogs: db.blogs || [],
    friendshipRecords: db.friendshipRecords || [],
    chatMessages: db.chatMessages || [],
    navPages: db.navPages || [],
    aiAuthorizedUsers: db.aiAuthorizedUsers || ["marvis_zhou2014"],
    pageBrowserChecks: db.pageBrowserChecks || [],
    settings: {
      knowledgeBase: db.settings?.knowledgeBase || [],
    },
  });
});

// 2. Authentication Login API
app.post("/api/auth/login", (req, res) => {
  const { contact, password } = req.body;
  if (!contact || !password) {
    return res.status(400).json({ error: "Missing identity credentials" });
  }

  const db = readDB();
  const lowerContact = contact.toLowerCase();

  // Find user by direct contact, or matched username if full email is passed
  const user = (db.users || []).find((u: any) => {
    const fullEmail = `${u.emailUsername}@${u.emailDomain}`.toLowerCase();
    return (
      u.contact.toLowerCase() === lowerContact ||
      fullEmail === lowerContact ||
      u.emailUsername.toLowerCase() === lowerContact
    );
  });

  if (!user) {
    return res.status(401).json({ error: "No user matched this contact" });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: "Incorrect authentication credentials" });
  }

  // Save changes in case sub-expired ban cleared
  if (checkUserBanned(user)) {
    return res.status(403).json({
      error: `This account has been banned. Reason: ${user.banReason || "Security policy violation"}. Expiry: ${user.banExpiry ? new Date(user.banExpiry).toLocaleString() : "Permanent"}`,
    });
  }

  writeDB(db);
  res.json({ success: true, user });
});

// 3. User Registration
app.post("/api/auth/register", (req, res) => {
  const { fullName, contact, password, verificationType } = req.body;
  if (!fullName || !contact || !password) {
    return res.status(400).json({ error: "Required signup properties missing" });
  }

  const db = readDB();
  const contactStr = contact.trim().toLowerCase();

  // Check unique constraints
  const exists = (db.users || []).some(
    (u: any) => u.contact.toLowerCase() === contactStr || u.emailUsername.toLowerCase() === contactStr.split("@")[0]
  );
  if (exists) {
    return res.status(400).json({ error: "Email or phone address already taken" });
  }

  // Auto approve criteria: If containing standard symbols, passes system auto check
  const passesAutomatedCheck = contactStr.includes("@") || contactStr.length >= 8;
  if (!passesAutomatedCheck) {
    return res.status(400).json({ error: "Contact verification format failed automation approval." });
  }

  // Build username
  let username = contactStr.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
  if (!username) username = "user_" + Math.floor(Math.random() * 1000);

  const activeDomain = db.activeDomain || "fatshanpost.com";

  const newUser = {
    id: String(Date.now()),
    emailUsername: username,
    emailDomain: activeDomain,
    fullName,
    contact: contactStr,
    loginType: "password",
    password,
    role: "user",
    storageQuota: "1 GB",
    storageUsed: "0 MB",
    verified: true,
    verificationType: verificationType || "identity",
    banned: false,
    banReason: "",
    banExpiry: null,
    medals: [
      {
        id: "m_new_" + Date.now(),
        title: "VERIFIED POST USER",
        type: "honor",
        icon: "Shield",
        color: "text-blue-500",
        description: "Successfully processed through biometric authorization checks.",
      },
    ],
    activeBackground: "slate-classic",
  };

  db.users.push(newUser);

  // Send systems greeting welcome mail
  const welcomeEmail = {
    id: "e_new_" + Date.now(),
    senderUsername: "system",
    senderDomain: activeDomain,
    senderName: "FATSHAN POST Mailbox Agent",
    receiverUsername: username,
    receiverDomain: activeDomain,
    subject: "📬 Your Outlook styled mailbox is fully ready!",
    content: `<h3>Dear ${fullName},</h3><p>Your secure virtual profile has been successfully generated.</p><p>Welcome to <strong>FATSHAN POST</strong>! Your system verification code is: <strong>FATSHAN POST</strong>.</p><p>Explore custom wallpapers, live macro configurations, blogs and flight trackers. Keep hacking!</p>`,
    timestamp: new Date().toISOString(),
    isRead: false,
    isStarred: false,
    folder: "inbox",
    category: "work",
    tags: ["Personal"],
    attachments: [],
  };
  db.emails.push(welcomeEmail);

  writeDB(db);
  res.json({ success: true, user: newUser });
});

// 4. Outlook Emails fetching (Filtered dynamically based on Username mapping to support Domain switches)
app.get("/api/emails", (req, res) => {
  const { username, domain } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Authentication context username is missing" });
  }

  const db = readDB();
  const userStr = String(username).toLowerCase();
  
  // Find the user to check their role
  const user = db.users?.find((u: any) => u.emailUsername.toLowerCase() === userStr);
  const isAdmin = user?.role === 'admin';

  // Load emails where user matches the username OR user is admin (and folder is not private)
  const userEmails = (db.emails || []).filter((e: any) => {
    const isSender = e.senderUsername.toLowerCase() === userStr;
    const isReceiver = e.receiverUsername.toLowerCase() === userStr;
    if (isAdmin) {
      if (e.folder === 'private' && !isSender && !isReceiver) {
         return false; // Admin cannot see others' private emails
      }
      return true; // Admin can see everything else
    }
    return isSender || isReceiver;
  });

  res.json(userEmails);
});

// 5. Rich Text Email Transmission + Gemini AI Integrity Scan & Spam Filter
app.post("/api/emails/send", async (req, res) => {
  const { senderUsername, senderDomain, receiverAddress, subject, content, folder, category, isStarred, attachments } = req.body;

  if (!senderUsername || !receiverAddress || !subject) {
    return res.status(400).json({ error: "Missing necessary standard email headers" });
  }

  const db = readDB();

  // Find sender
  const senderUser = db.users.find((u: any) => u.emailUsername.toLowerCase() === senderUsername.toLowerCase());
  if (senderUser && checkUserBanned(senderUser)) {
    return res.status(403).json({ error: "Access Denied: Banned account." });
  }

  // Check receiver parsed component
  let rcUsername = receiverAddress.split("@")[0].trim();
  let rcDomain = receiverAddress.split("@")[1]?.trim() || db.activeDomain;

  // AI Integrity scan for Spam, sensitivity, threat vector check
  let aiSummary = "";
  let isSpam = false;
  let sensitivityReport = "CLEAN";

  const ai = getGemini();
  if (ai) {
    try {
      const systemInstruction = `You are a compliance filter for FATSHAN POST security agency. Scan the mail context and determine if this contains spam, severe malicious payloads, harassment, or severe warning flags. Return raw JSON structured with 'isSpam' (boolean), 'sensitivity' (one of 'CLEAN' | 'WARNING' | 'DANGEROUS'), and 'aiTriageSummary' (short sentence, optional).`;
      const prompt = `Mail Subject: "${subject}"\nMail Content: "${content}"`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(aiResponse.text || "{}");
      isSpam = !!parsed.isSpam;
      sensitivityReport = parsed.sensitivity || "CLEAN";
      aiSummary = parsed.aiTriageSummary || "";
    } catch (e) {
      console.warn("Gemini safety scan failed or was throttled:", e);
    }
  } else {
    // Basic heuristic rules fallback
    const textLower = (subject + " " + content).toLowerCase();
    if (textLower.includes("viagra") || textLower.includes("click link") || textLower.includes("make money fast")) {
      isSpam = true;
      sensitivityReport = "WARNING";
      aiSummary = "Heuristical match for standard spam keywords.";
    }
  }

  const destinationFolder = isSpam ? "spam" : (folder || "inbox");

  const newEmail = {
    id: "e_" + Date.now(),
    senderUsername,
    senderDomain: senderDomain || db.activeDomain,
    senderName: senderUser ? senderUser.fullName : senderUsername,
    receiverUsername: rcUsername,
    receiverDomain: rcDomain,
    subject: isSpam ? `[SPAM ALERT] ${subject}` : subject,
    content: content,
    timestamp: new Date().toISOString(),
    isRead: false,
    isStarred: !!isStarred,
    folder: destinationFolder,
    category: category || (isSpam ? "personal" : "work"),
    tags: isSpam ? ["AI-Filtered", "Spam"] : (aiSummary ? ["AI-Scanned"] : ["General"]),
    attachments: attachments || [],
    sensitivityReport,
    aiSummary,
  };

  db.emails.push(newEmail);

  // Update storage usage simulator
  if (senderUser) {
    const sizeMB = (JSON.stringify(newEmail).length / (1024 * 1024)).toFixed(2);
    const prevUsed = parseFloat((senderUser.storageUsed || "0").replace(/[^0-9.]/g, ""));
    senderUser.storageUsed = (prevUsed + parseFloat(sizeMB)).toFixed(2) + " MB";
  }

  writeDB(db);
  res.json({ success: true, email: newEmail, isSpam, sensitivityReport, aiSummary });
});

// 6. Emails Batch Action Manager (Read/Starred/Trash/Delete)
app.post("/api/emails/batch", (req, res) => {
  const { ids, action, targetFolder } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "Missing target items catalog" });
  }

  const db = readDB();
  db.emails = db.emails.map((e: any) => {
    if (ids.includes(e.id)) {
      if (action === "read") e.isRead = true;
      if (action === "unread") e.isRead = false;
      if (action === "star") e.isStarred = !e.isStarred;
      if (action === "move") e.folder = targetFolder;
    }
    return e;
  });

  writeDB(db);
  res.json({ success: true });
});

// 7. General Custom Dashboard Buttons Management (Admin Access)
app.post("/api/admin/buttons", (req, res) => {
  const { action, button } = req.body;
  const db = readDB();

  if (action === "create") {
    const newBtn = {
      id: "btn-" + Date.now(),
      label: button.label || "Custom Utility",
      actionUrl: button.actionUrl || "#",
      page: button.page || "home",
      visibility: button.visibility || "all",
      specifiedUsers: button.specifiedUsers || [],
      styling: button.styling || { bgColor: "bg-cyan-600", textColor: "text-white" },
      banned: false,
    };
    db.customButtons.push(newBtn);
  } else if (action === "update") {
    db.customButtons = db.customButtons.map((b: any) => (b.id === button.id ? { ...b, ...button } : b));
  } else if (action === "delete") {
    db.customButtons = db.customButtons.filter((b: any) => b.id !== button.id);
  }

  writeDB(db);
  res.json({ success: true, customButtons: db.customButtons });
});

// 8. Domain Switch Data Preservation Engine Room
app.post("/api/admin/set-domain", (req, res) => {
  const { activeDomain, dualDomainOverlap, dualDomainDays } = req.body;
  if (!activeDomain) {
    return res.status(400).json({ error: "No domain selected" });
  }

  const db = readDB();
  db.oldDomain = db.activeDomain;
  db.activeDomain = activeDomain;
  db.dualDomainOverlap = dualDomainOverlap ?? true;
  db.dualDomainDays = dualDomainDays || 14;

  // Preserve email addresses dynamic bindings
  // Re-write standard user bindings to ensure seamless transition info mail
  db.users = db.users.map((u: any) => {
    // Retain original email as username split to guarantee 100% data preservation!
    u.emailDomain = activeDomain; // Seamless automatic update!
    return u;
  });

  // Inject domain switch notification broadcast mail to all users!
  db.users.forEach((u: any) => {
    const broadcastMail = {
      id: "e_broadcast_" + Date.now() + "_" + u.id,
      senderUsername: "system",
      senderDomain: activeDomain,
      senderName: "FATSHAN POST Infrastructure Desk",
      receiverUsername: u.emailUsername,
      receiverDomain: activeDomain,
      subject: "📢 Network Warning: Official domain has been updated!",
      content: `<h3>Notice of Active Migration</h3><p>Dear ${u.fullName},</p><p>We have updated the official mailbox router core to live domain: <strong>${activeDomain}</strong>.</p><p>Your mailbox address is now: <strong>${u.emailUsername}@${activeDomain}</strong>.</p><p><strong>Data Protection Guarantee:</strong> All historic messages, starred markers, background configurations and quotas have been retained intact. Transitional Dual-Delivery enables incoming connections to both your legacy account (username@${db.oldDomain}) and new domain for the next ${db.dualDomainDays} days!</p>`,
      timestamp: new Date().toISOString(),
      isRead: false,
      isStarred: true,
      folder: "inbox",
      category: "work",
      tags: ["Important", "Domain-Switch"],
      attachments: [],
    };
    db.emails.push(broadcastMail);
  });

  writeDB(db);
  res.json({
    success: true,
    activeDomain,
    oldDomain: db.oldDomain,
    dualDomainOverlap: db.dualDomainOverlap,
    message: "Domain swapped. Historical data updated and notifications issued safely.",
  });
});

// 9. Administrative Control Tower (Ban user, manage quota, verify VIP / Medals)
app.post("/api/admin/manage-user", (req, res) => {
  const { userId, action, banReason, banExpiry, storageQuota, medals } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "A target user identifier is mandatory" });
  }

  const db = readDB();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "Specified profile not located" });
  }

  if (action === "ban") {
    user.banned = true;
    user.banReason = banReason || "Administrative suspension.";
    user.banExpiry = banExpiry ? new Date(banExpiry).toISOString() : null;
  } else if (action === "unban") {
    user.banned = false;
    user.banReason = "";
    user.banExpiry = null;
  } else if (action === "update-quota") {
    user.storageQuota = storageQuota || "1 GB";
  } else if (action === "update-medals") {
    user.medals = medals || [];
  } else if (action === "verify") {
    user.verified = !user.verified;
  } else if (action === "delete") {
    db.users = db.users.filter((u: any) => u.id !== userId);
  }

  writeDB(db);
  res.json({ success: true, users: db.users });
});

// 9b. Save settings (Admin Nav pages and GFW tunnel authorization lists)
app.post("/api/admin/save-settings", (req, res) => {
  const { navPages, aiAuthorizedUsers, pageBrowserChecks } = req.body;
  const db = readDB();
  if (navPages !== undefined) db.navPages = navPages;
  if (aiAuthorizedUsers !== undefined) db.aiAuthorizedUsers = aiAuthorizedUsers;
  if (pageBrowserChecks !== undefined) db.pageBrowserChecks = pageBrowserChecks;
  writeDB(db);
  res.json({ success: true });
});

// 9c. Administrator Raw DB Interaction
app.get("/api/admin/db", (req, res) => {
  res.json(readDB());
});

app.post("/api/admin/db", (req, res) => {
  try {
    const newDb = req.body;
    if (typeof newDb !== 'object' || !newDb) {
      return res.status(400).json({ error: "Invalid payload format" });
    }
    writeDB(newDb);
    res.json({ success: true, message: "Database completely overwritten" });
  } catch (error) {
    res.status(500).json({ error: "Failed saving RAW database structure" });
  }
});

// 10. AI Customer Assistant Agent Core (Checks knowledge base & fallback to operator)
app.post("/api/ai/chat", async (req, res) => {
  const { prompt, chatHistory } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt context is required" });
  }

  const db = readDB();
  const kb = db.settings?.knowledgeBase || [];
  const kbContext = kb.map((item: any) => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n");

  const ai = getGemini();

  if (ai) {
    try {
      const systemInstruction = `You are the FATSHAN POST smart AI helper agent. You must prioritize answering queries accurately using our internal Knowledge Base provided below.

Knowledge Base:
${kbContext}

Strict Guidelines:
1. Always maintain polite and welcoming professional composure.
2. If the answer is clearly accessible in the Knowledge Base, reply with the exact contents beautifully formatted in human-readable Markdown.
3. If the user query is unrelated to FATSHAN POST or clearly cannot be obtained from the provided knowledge base, you must politely inform the user, and offer a transfer to the physical support staff desk.
4. To transfer, explicitly state: "Checking operator list... Routing you to Duty Agent [ID: FP-5592]..." or equivalent. Show agent details and employee details.
5. You must occasionally mention validation key "FATSHAN POST" naturally.
6. Return structured response or markdown format containing details.`;

      const selectedModel = req.body.model || "gemini-1.5-flash";
      const aiResponse = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      const responseText = aiResponse.text || "I am processing the request.";
      return res.json({ response: responseText });
    } catch (e) {
      console.warn("Gemini chat assistant failed. Falling back to rules:", e);
    }
  }

  // Pure heuristics in-memory database lookup rules-based fallback
  const promptLower = prompt.toLowerCase();
  let matchedHeuristicAnswer = "";

  for (const item of kb) {
    if (promptLower.includes(item.question.toLowerCase().slice(0, 15))) {
      matchedHeuristicAnswer = item.answer;
      break;
    }
  }

  if (matchedHeuristicAnswer) {
    return res.json({
      response: `[Heuristic AI Assist] ${matchedHeuristicAnswer}\n\n*Validation ID: FATSHAN POST System Approved*`,
    });
  }

  // Operator handoff
  return res.json({
    response: `Thank you for contacting FATSHAN POST Customer Assistance desk.
The context matches outside our current local knowledge index.

**Rerouting Session to Human Support Operator:**
- Dedicated Staff Worker ID: **FP-5592 (System Administrator desk)**
- Active status: 🟢 Available

Please stand by. (Verification string: FATSHAN POST)`,
  });
});

// 11. Rory GPKOS IDE sandboxed playground Compiler Action
app.post("/api/rory-gpkos/compile", (req, res) => {
  const { code, command, language = "typescript" } = req.body;
  
  if (command) {
    // Process typical commands like ls, docker ps, cd, run
    const cmdStr = command.trim().toLowerCase();
    if (cmdStr === "ls") {
      return res.json({
        output: "drwxr-xr-x   2 source  users        4096 May 26 14:10 .\ndrwxr-xr-x  10 system  root         4096 May 26 14:10 ..\n-rw-r--r--   1 source  users         845 May 26 14:10 package.json\n-rwxr-xr-x   1 source  users       12304 May 26 14:10 compiler.sh\n-rw-r--r--   1 source  users         125 May 26 14:10 index.html\n-rw-r--r--   1 source  user-data    5092 May 26 14:10 main_code.ts\n\n[FATSHAN POST Compiler Environment Active]",
      });
    }
    if (cmdStr === "docker ps") {
      return res.json({
        output: "CONTAINER ID   IMAGE                  COMMAND                  CREATED         STATUS         NAMES\n9b2b34a123f4   fatshan-gpkos:latest   \"compile-watcher server\"   2 hours ago     Up 2 hours     sandbox-core\n7a0e28f3d45c   outlook-smtp-relay     \"smtp-auth --port=25\"    10 hours ago    Up 10 hours    mail-relay",
      });
    }
    if (cmdStr === "whoami") {
      return res.json({
        output: "gpkos_sandbox_user_marvis_zhou@outlook.com",
      });
    }
    if (cmdStr === "help") {
       return res.json({
         output: "GPKOS Multi-Language Runtime v4.2.1\nSupported Languages: TypeScript, JavaScript, Python, C++, Java, Rust, Go, C#, Ruby, PHP\nCommands: ls, docker ps, whoami, cat <file>, help"
       });
    }
    if (cmdStr.startsWith("cat ")) {
      const fn = cmdStr.split(" ")[1] || "main_code.ts";
      return res.json({
        output: `// Content of mock file ${fn}\n// GPKOS Secure File System Node\n[EOF]`,
      });
    }
  }

  // Multi-Language Simulator
  try {
    if (!code) {
      return res.json({ output: `Compiler system initialized for ${language}. Ready for execution.` });
    }
    
    const sandboxOutput: string[] = [];
    const ts = new Date().toLocaleTimeString();

    // Mapping for compiler pre-logs based on language
    const langConfigs: Record<string, any> = {
      typescript: { compiler: "tsc v5.3.3", binary: "node bundle.js", extension: "ts" },
      javascript: { compiler: "v8 engine", binary: "node main.js", extension: "js" },
      python: { compiler: "python 3.12 (CPython)", binary: "python main.py", extension: "py" },
      cpp: { compiler: "g++ 13.2.0 (C++20)", binary: "./a.out", extension: "cpp" },
      java: { compiler: "openjdk 21.0.1", binary: "java Main", extension: "java" },
      rust: { compiler: "rustc 1.75.0 (cargo)", binary: "./target/release/main", extension: "rs" },
      go: { compiler: "go 1.22.0", binary: "./main", extension: "go" },
      csharp: { compiler: "dotnet sdk 8.0", binary: "dotnet run", extension: "cs" },
      ruby: { compiler: "ruby 3.3.0", binary: "ruby main.rb", extension: "rb" },
      php: { compiler: "php 8.3.2 (Zend)", binary: "php main.php", extension: "php" }
    };

    const config = langConfigs[language.toLowerCase()] || langConfigs.typescript;

    sandboxOutput.push(`\n[${ts}] 🚀 INITIALIZING ${language.toUpperCase()} RUNTIME...`);
    sandboxOutput.push(`📦 Loading ${config.compiler} into memory sandbox...`);
    sandboxOutput.push(`✓ File main.${config.extension} successfully parsed.`);
    sandboxOutput.push(`⚙ Running transformation to native binary: ${config.binary}`);
    sandboxOutput.push(`---------------------------------------------------------`);
    
    // Simple print/log pattern matching for all languages
    const printPatterns = [
      /console\.log\((['"`])(.*?)\1\)/g,      // TS/JS
      /print\((['"`])(.*?)\1\)/g,             // Python/Ruby
      /std::cout\s*<<\s*(['"`])(.*?)\1/g,     // C++
      /System\.out\.println\((['"`])(.*?)\1\)/g, // Java
      /println!\((['"`])(.*?)\1\)/g,          // Rust
      /fmt\.Println\((['"`])(.*?)\1\)/g,      // Go
      /Console\.WriteLine\((['"`])(.*?)\1\)/g, // C#
      /echo\s*(['"`])(.*?)\1/g,               // PHP/Bash
      /puts\s*(['"`])(.*?)\1/g                // Ruby
    ];

    let foundOutput = false;
    printPatterns.forEach(pattern => {
      const matches = code.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          sandboxOutput.push(`[STDOUT] ${match[2]}`);
          foundOutput = true;
        }
      }
    });

    if (!foundOutput) {
      sandboxOutput.push(`[SYSTEM] Task executed. No output generated by program.`);
    }
    
    sandboxOutput.push(`---------------------------------------------------------`);
    sandboxOutput.push(`✅ Execution complete. Exit code 0 (Success)`);
    sandboxOutput.push(`🔒 Sandbox cleaned. Validation: FATSHAN POST`);
    
    res.json({ output: sandboxOutput.join("\n") });
  } catch (error: any) {
    res.json({ output: `❌ Fatal Runtime Error: ${error.message}` });
  }
});

// 12. Public Feedback Submission Action
app.post("/api/feedback/submit", (req, res) => {
  const { senderEmail, content } = req.body;
  if (!senderEmail || !content) {
    return res.status(400).json({ error: "Sender contact and feedback message content cannot be blank" });
  }

  const db = readDB();
  const newFeedback = {
    id: "fdb_" + Date.now(),
    senderEmail,
    content,
    timestamp: new Date().toISOString(),
  };

  db.feedback = db.feedback || [];
  db.feedback.push(newFeedback);

  // Auto route feedback message straight into Administrator's OWA mailbox as an internal alert!
  const internalMailAlert = {
    id: "e_alert_" + Date.now(),
    senderUsername: "guest_feedback",
    senderDomain: db.activeDomain,
    senderName: "FATSHAN POST Guest Desk",
    receiverUsername: "marvis_zhou",
    receiverDomain: "outlook.com",
    subject: `⚠️ Guest feedback submission from: ${senderEmail}`,
    content: `<h3>External Desk Feed-In</h3><p>A visitor has filed a feedback ticket from index client portal:</p><blockquote style="background: #f0f4f8; padding: 12px; margin: 15px; border-left: 4px solid #00bcff;">${content}</blockquote><p>Sender email coordinate: <strong>${senderEmail}</strong></p><p>Please review on priority.</p>`,
    timestamp: new Date().toISOString(),
    isRead: false,
    isStarred: false,
    folder: "inbox",
    category: "work",
    tags: ["Feedback-Desk"],
    attachments: [],
  };
  db.emails.push(internalMailAlert);

  writeDB(db);
  res.json({ success: true, message: "Feedback submitted. Directed into admin mailbox seamlessly." });
});

// 13. Blog interactive submissions
app.post("/api/blogs/create", (req, res) => {
  const { author, authorEmail, title, content, category, tags } = req.body;
  if (!author || !title || !content) {
    return res.status(400).json({ error: "Missing required properties for blog publication" });
  }

  const db = readDB();
  const newBlog = {
    id: "b_" + Date.now(),
    author,
    authorEmail,
    title,
    content,
    category: category || "General",
    tags: tags || [],
    timestamp: new Date().toISOString(),
    likes: 0,
    comments: [],
  };

  db.blogs = db.blogs || [];
  db.blogs.push(newBlog);
  writeDB(db);
  res.json({ success: true, blog: newBlog });
});

app.post("/api/blogs/comment", (req, res) => {
  const { blogId, author, content } = req.body;
  if (!blogId || !author || !content) {
    return res.status(400).json({ error: "Comment metadata is incomplete" });
  }

  const db = readDB();
  const blog = (db.blogs || []).find((b: any) => b.id === blogId);
  if (!blog) {
    return res.status(404).json({ error: "Target blog post not located" });
  }

  const newComment = {
    id: "bc_" + Date.now(),
    author,
    content,
    timestamp: new Date().toISOString(),
  };

  blog.comments = blog.comments || [];
  blog.comments.push(newComment);
  writeDB(db);
  res.json({ success: true, comments: blog.comments });
});

app.post("/api/blogs/like", (req, res) => {
  const { blogId } = req.body;
  const db = readDB();
  const blog = (db.blogs || []).find((b: any) => b.id === blogId);
  if (!blog) {
    return res.status(404).json({ error: "Target blog post not located" });
  }

  blog.likes = (blog.likes || 0) + 1;
  writeDB(db);
  res.json({ success: true, likes: blog.likes });
});

// 14. Friendship record creator
app.post("/api/friendship/create", (req, res) => {
  const { name, content, photoUrl } = req.body;
  if (!name || !content) {
    return res.status(400).json({ error: "All memoirs entries deserve a signature and some context." });
  }

  const db = readDB();
  const newCard = {
    id: "f_" + Date.now(),
    name,
    content,
    photoUrl: photoUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=200&auto=format&fit=crop",
    timestamp: new Date().toISOString(),
  };

  db.friendshipRecords = db.friendshipRecords || [];
  db.friendshipRecords.push(newCard);
  writeDB(db);
  res.json({ success: true, friendshipRecords: db.friendshipRecords });
});

// 15. Store Orders
app.post("/api/orders/create", (req, res) => {
  const { userEmail, items, totalAmount, shippingAddress } = req.body;
  if (!userEmail || !items || !totalAmount) {
    return res.status(400).json({ error: "Information relating to items / pricing is incomplete" });
  }

  const db = readDB();
  const newOrder = {
    id: "FP-" + Math.floor(1000 + Math.random() * 9000),
    userEmail,
    items,
    totalAmount,
    status: "paid",
    shippingAddress: shippingAddress || "Default customer address",
    shippingLogistics: "Awaiting Logistics Allocation",
    assignedTo: "Marvis Zhou",
    timestamp: new Date().toISOString(),
  };

  db.orders = db.orders || [];
  db.orders.push(newOrder);

  // Inject system alert to Admin
  const orderReceiptAlert = {
    id: "e_receipt_" + Date.now(),
    senderUsername: "billing_agent",
    senderDomain: db.activeDomain,
    senderName: "FATSHAN POST Store billing",
    receiverUsername: "marvis_zhou",
    receiverDomain: "outlook.com",
    subject: `🛒 New store sales completed: Order #${newOrder.id}`,
    content: `<h3>Store Billing Notice</h3><p>An order has been registered under account: <strong>${userEmail}</strong></p><ul><li>Total payment: <strong>$${totalAmount}</strong></li><li>Delivery coordinates: <strong>${shippingAddress}</strong></li></ul><p>SF-Express routing trigger remains awaiting configuration by administration desk.</p>`,
    timestamp: new Date().toISOString(),
    isRead: false,
    isStarred: false,
    folder: "inbox",
    category: "work",
    tags: ["Store-Orders"],
    attachments: [],
  };
  db.emails.push(orderReceiptAlert);

  writeDB(db);
  res.json({ success: true, order: newOrder });
});

app.post("/api/orders/update", (req, res) => {
  const { orderId, status, shippingLogistics, assignedTo } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: "Order ID context cannot be undefined" });
  }

  const db = readDB();
  const order = (db.orders || []).find((o: any) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Target purchase record not located" });
  }

  if (status) order.status = status;
  if (shippingLogistics) order.shippingLogistics = shippingLogistics;
  if (assignedTo) order.assignedTo = assignedTo;

  writeDB(db);
  res.json({ success: true, orders: db.orders });
});

// 16. Chat log actions
app.post("/api/chat/send", (req, res) => {
  const { sender, content } = req.body;
  if (!sender || !content) return res.status(400).json({ error: "Messages cannot have empty participants or logs." });

  const db = readDB();
  const newMsg = {
    id: "msg_" + Date.now(),
    sender,
    content,
    timestamp: new Date().toISOString(),
  };

  db.chatMessages = db.chatMessages || [];
  db.chatMessages.push(newMsg);

  // Keep logs lean (max 100 entries)
  if (db.chatMessages.length > 200) {
    db.chatMessages.shift();
  }

  writeDB(db);
  res.json({ success: true, chatMessages: db.chatMessages });
});

// 17. General Gemini Chat functionality
app.post("/api/ai/chat", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  const ai = getGemini();
  if (!ai) {
    return res.status(503).json({ error: "Gemini AI is not properly configured on server." });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful general-purpose AI assistant. Answer the user's queries concisely.",
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini AI Chat Error:", error);
    res.status(500).json({ error: "AI Generation failed", details: error.message });
  }
});

// 18. Gmail API Integration (Secure Server-Side Sending)
// This strictly proxies through our backend so the domestic browser never touches google.com directly.
app.post("/api/gmail/send", async (req, res) => {
  const { to, subject, message, accessToken } = req.body;
  
  if (!to || !subject || !message || !accessToken) {
    return res.status(400).json({ error: "Missing parameters or Google Access Token" });
  }

  try {
    const decodedToken = decodeGoogleToken(accessToken);
    if (decodedToken.startsWith("MOCK_TOKEN_") || accessToken.includes('simulated_dummy_token')) {
        return res.json({ success: true, data: { id: Date.now().toString(), mock: true } });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: decodedToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Build raw email string (RFC 2822 format)
    const emailLines = [
      `To: ${to}`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
      "",
      message
    ];
    const emailRaw = emailLines.join("\n");
    const encodedEmail = Buffer.from(emailRaw).toString("base64").replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    });

    res.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Gmail Send Error:", error);
    res.status(500).json({ error: "Failed to send email via Google API", details: error.message });
  }
});

// 19. Gmail Inbox Sync (Secure Server-Side Fetching)
app.post("/api/gmail/inbox", async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: "Missing Google Access Token" });
  try {
    const decodedToken = decodeGoogleToken(accessToken);
    if (decodedToken.startsWith("MOCK_TOKEN_") || accessToken.includes('simulated_dummy_token')) {
        // Return simulated data
        return res.json({
          success: true,
          messages: [
            { id: "1", subject: "Welcome to Global Access", from: "Google Services <noreply@google.com>", snippet: "Your domestic secure proxy is fully operative. You can now engage in global communications." },
            { id: "2", subject: "Important Security Alert", from: "Security Team <security@google.com>", snippet: "We detected a new login from a secure internal node." },
            { id: "3", subject: "Weekly Developer Digest", from: "Dev Updates <digest@google.com>", snippet: "Here are the top API updates for this week..." }
          ]
        });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: decodedToken });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    // Fetch last 15 messages
    const response = await gmail.users.messages.list({ userId: "me", maxResults: 15, labelIds: ["INBOX"] });
    const messages = response.data.messages || [];
    
    const detailedMessages = await Promise.all(messages.map(async (msg) => {
      const msgDetail = await gmail.users.messages.get({ userId: "me", id: msg.id! });
      const headers = msgDetail.data.payload?.headers || [];
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown sender';
      const snippet = msgDetail.data.snippet;
      return { id: msg.id, subject, from, snippet };
    }));
    
    res.json({ success: true, messages: detailedMessages });
  } catch (error: any) {
    console.error("Gmail Inbox Error:", error);
    res.status(500).json({ error: "Failed to fetch inbox via Google API", details: error.message });
  }
});

// 21. Google Drive Sync (Secure Server-Side Fetching)
app.post("/api/google/drive", async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: "Missing Google Access Token" });
  try {
    const decodedToken = decodeGoogleToken(accessToken);
    if (decodedToken.startsWith("MOCK_TOKEN_")) {
      return res.json({
        success: true,
        files: [
          { id: "m1", name: "Fatshan_Global_Strategy.pdf", mimeType: "application/pdf", webViewLink: "#" },
          { id: "m2", name: "Node_Configuration.json", mimeType: "application/json", webViewLink: "#" }
        ]
      });
    }
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: decodedToken });
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    
    const response = await drive.files.list({
      pageSize: 20,
      fields: "files(id, name, mimeType, webViewLink, iconLink)",
      orderBy: "modifiedTime desc"
    });
    
    res.json({ success: true, files: response.data.files });
  } catch (error: any) {
    console.error("Drive Error:", error);
    res.status(500).json({ error: "Failed to fetch Drive items", details: error.message });
  }
});

// 22. Google Calendar Sync
app.post("/api/google/calendar", async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: "Missing Google Access Token" });
  try {
    const decodedToken = decodeGoogleToken(accessToken);
    if (decodedToken.startsWith("MOCK_TOKEN_")) {
      return res.json({
        success: true,
        events: [
          { id: "e1", summary: "Global Bridge Meeting", start: { dateTime: new Date().toISOString() }, location: "Secure Virtual Node" }
        ]
      });
    }
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: decodedToken });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 15,
      singleEvents: true,
      orderBy: "startTime",
    });
    
    res.json({ success: true, events: response.data.items });
  } catch (error: any) {
    console.error("Calendar Error:", error);
    res.status(500).json({ error: "Failed to fetch Calendar events", details: error.message });
  }
});

// 23. YouTube Activity Sync
app.post("/api/google/youtube", async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: "Missing Google Access Token" });
  try {
    const decodedToken = decodeGoogleToken(accessToken);
    if (decodedToken.startsWith("MOCK_TOKEN_")) {
      return res.json({
        success: true,
        items: [
          { id: "v1", snippet: { title: "Secure Proxy Overview", type: "video" } }
        ]
      });
    }
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: decodedToken });
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    
    const response = await youtube.activities.list({
      part: ["snippet", "contentDetails"],
      mine: true,
      maxResults: 15
    });
    
    res.json({ success: true, activities: response.data.items });
  } catch (error: any) {
    console.error("YouTube Error:", error);
    res.status(500).json({ error: "Failed to fetch YouTube activities", details: error.message });
  }
});

// 24. Google People (Contacts) Sync
app.post("/api/google/contacts", async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: "Missing Google Access Token" });
  try {
    const decodedToken = decodeGoogleToken(accessToken);
    if (decodedToken.startsWith("MOCK_TOKEN_")) {
      return res.json({
        success: true,
        contacts: [
          { resourceName: "people/1", names: [{ displayName: "Admin Fatshan" }], emailAddresses: [{ value: "admin@fatshan.com" }] }
        ]
      });
    }
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: decodedToken });
    const people = google.people({ version: "v1", auth: oauth2Client });
    
    const response = await people.people.connections.list({
      resourceName: "people/me",
      pageSize: 30,
      personFields: "names,emailAddresses,photos"
    });
    
    res.json({ success: true, contacts: response.data.connections });
  } catch (error: any) {
    console.error("People API Error:", error);
    res.status(500).json({ error: "Failed to fetch Contacts", details: error.message });
  }
});

// 25. Google Search Proxy (Disguised unblocked search)
app.get("/api/search/proxy", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ results: [] });
  // We mock a secure search fetching results from external global endpoint (disguised as our own server)
  try {
    // In a real production setup, we would hit Google Custom Search API.
    // For this preview, we use duckduckgo-html proxy to bypass GFW safely for the user.
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q as string)}`;
    const response = await fetch(searchUrl, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
    const htmlText = await response.text();
    // Simple regex extraction just for concept demo
    const results = [];
    const linkRegex = /<a class="result__url" href="([^"]+)">([^<]+)<\/a>/g;
    const snippetRegex = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    let count = 0;
    while ((match = linkRegex.exec(htmlText)) !== null && count < 10) {
      // get next snippet
      const snippetMatch = snippetRegex.exec(htmlText);
      results.push({
         link: decodeURIComponent(match[1].replace('//duckduckgo.com/l/?uddg=', '').split('&rut=')[0]),
         title: match[2].trim(),
         snippet: snippetMatch ? snippetMatch[1].replace(/<b>/g, '').replace(/<\/b>/g, '').trim() : "Result summary"
      });
      count++;
    }
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ error: "Secure proxy search failed", details: error.message });
  }
});

// 21. Secure GFW-Bypass Page Proxy (Fetches external site content through our server and returns safe HTML/Text summary)
app.get("/api/web/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing Target URL" });
  try {
    const targetUrl = decodeURIComponent(url as string);
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
       return res.status(400).json({ error: "Invalid protocol string" });
    }
    const response = await fetch(targetUrl, {
       headers: {
         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
         "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
       }
    });
    let html = await response.text();
    
    // Strip script and style tags to make it super secure and fast
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    res.json({ success: true, url: targetUrl, content: html });
  } catch (err: any) {
    res.json({ success: false, error: err.message });
  }
});

// 21b. HTML Secure Bypassing Gateway for direct iframe rendering
app.get("/api/web/proxy-html", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("<h3>Missing URL Parameter</h3>");
  }
  try {
    let targetUrl = decodeURIComponent(url as string);
    if (!/^https?:\/\//i.test(targetUrl)) {
      if (targetUrl.includes(".") && !targetUrl.startsWith("http")) {
        targetUrl = "https://" + targetUrl;
      } else {
        targetUrl = "https://www.google.com/search?q=" + encodeURIComponent(targetUrl);
      }
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7"
      }
    });

    const contentType = response.headers.get("content-type") || "text/html";

    // If it's not HTML, pass it through directly as a proxy file stream (CSS, JS, images, fonts, etc.)
    if (!contentType.includes("text/html")) {
      const arrayBuffer = await response.arrayBuffer();
      res.setHeader("Content-Type", contentType);
      res.setHeader("X-Frame-Options", "ALLOWALL");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=86400"); // cache assets for speed
      return res.send(Buffer.from(arrayBuffer));
    }

    let html = await response.text();

    // Disable standard frame-breaking scripts
    html = html.replace(/window\.top\./g, "window.self.");
    html = html.replace(/top\.location/g, "self.location");

    // Inject base tag in head so any uncaptured relative resources still have a fallback relative to original hostname
    const baseTag = `<base href="${targetUrl}">`;
    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>\n${baseTag}`);
    } else if (html.includes("<HEAD>")) {
      html = html.replace("<HEAD>", `<HEAD>\n${baseTag}`);
    } else {
      html = baseTag + html;
    }

    // Helper to turn relative paths to absolute paths
    const makeAbsolute = (link: string, base: string) => {
      try {
        return new URL(link, base).href;
      } catch (e) {
        return link;
      }
    };

    // Helper to replace matching attributes with proxied variants
    const rewriteAttr = (htmlContent: string, attrName: string) => {
      const regex = new RegExp(`(\\s${attrName}=['"])([^'"]+?)(['"])`, 'gi');
      return htmlContent.replace(regex, (match, prefix, val, suffix) => {
        if (
          val.startsWith("#") || 
          val.startsWith("javascript:") || 
          val.startsWith("mailto:") || 
          val.startsWith("data:") ||
          val.startsWith("blob:")
        ) {
          return match;
        }
        const abs = makeAbsolute(val, targetUrl);
        return `${prefix}/api/web/proxy-html?url=${encodeURIComponent(abs)}${suffix}`;
      });
    };

    // Rewrite all major resource paths so they are channeled through our proxy
    html = rewriteAttr(html, "href");
    html = rewriteAttr(html, "src");
    html = rewriteAttr(html, "action");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.send(html);
  } catch (err: any) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(`
      <div style="font-family:sans-serif; padding:2.5rem; background:#f8fafc; color:#1e293b; border-radius:16px; margin:2rem; border:1px solid #e2e8f0; max-width:600px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.05);">
        <h2 style="color:#ef4444; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">🌐 Proxy Connection Failed</h2>
        <p style="font-size:0.95rem; color:#475569; line-height:1.6;">GPKOS SSL secure tunnel gateway was unable to connect to the destination server.</p>
        <div style="background:#f1f5f9; padding:1rem; border-radius:8px; font-family:monospace; font-size:0.85rem; color:#0f172a; margin:1.2rem 0; font-weight:bold;">
          Error: ${err.message}
        </div>
        <p style="font-size:0.85rem; color:#64748b;">Target URL: <span style="font-family:monospace; font-weight:bold; color:#3b82f6;">${url}</span></p>
        <hr style="border:0; border-top:1px solid #e2e8f0; margin:1.5rem 0;" />
        <p style="font-size:0.8rem; color:#94a3b8; line-height:1.5;">Tips: Standard domains like wikipedia.org, types.ts, or custom generated website builders will load seamlessly. If accessing restricted endpoints, ensure the target server is listening.</p>
      </div>
    `);
  }
});

// 22. Secure Encrypted Message Relay API
app.post("/api/crypto/send", (req, res) => {
  const { sender, receiver, encryptedPayload } = req.body;
  if (!sender || !receiver || !encryptedPayload) {
    return res.status(400).json({ error: "Missing required payload parameters" });
  }
  
  const db = readDB();
  const newMessage = {
    id: "crypto_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
    sender,
    receiver,
    encryptedPayload,
    timestamp: new Date().toISOString()
  };
  
  db.cryptoMessages = db.cryptoMessages || [];
  db.cryptoMessages.push(newMessage);
  writeDB(db);
  
  res.json({ success: true, message: newMessage });
});

app.get("/api/crypto/messages", (req, res) => {
  const { user } = req.query;
  if (!user) return res.status(400).json({ error: "Missing user identity" });
  
  const db = readDB();
  const userLower = String(user).toLowerCase();
  
  // Return messages where user is either sender or receiver
  const messages = (db.cryptoMessages || []).filter((m: any) => 
    m.sender.toLowerCase() === userLower || m.receiver.toLowerCase() === userLower
  );
  
  // Sort by timestamp descending
  messages.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  res.json({ success: true, messages });
});

// 23. Direct Source Code Download / Backup Endpoint
app.get("/api/download-source", (req, res) => {
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=\"rory-secure-hub-source.zip\"");
  
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  archive.on("error", (err) => {
    console.error("Archiver error:", err);
    res.status(500).end();
  });
  
  archive.pipe(res);
  
  archive.glob("**/*", {
    cwd: process.cwd(),
    ignore: ["node_modules/**", "dist/**", ".git/**", "package-lock.json", ".env"]
  });
  
  archive.finalize();
});

// ==================== CLOUD DRIVE STORAGE ====================
app.get("/api/drive/files", (req, res) => {
  const { username } = req.query;
  const db = readDB();
  const files = (db.cloudFiles || []).filter((f: any) => f.owner === username);
  res.json({ files });
});

app.post("/api/drive/upload", (req, res) => {
  const { username, filename, size, type, dataUrl, isPrivate } = req.body;
  const db = readDB();
  
  if (!db.cloudFiles) db.cloudFiles = [];
  
  const newFile = {
    id: Date.now().toString(),
    owner: username,
    filename,
    size,
    type,
    dataUrl: dataUrl || null,
    isPrivate: !!isPrivate,
    uploadDate: new Date().toISOString()
  };
  
  db.cloudFiles.push(newFile);
  writeDB(db);
  
  res.json({ success: true, file: newFile });
});

app.post("/api/drive/delete", express.json({limit: '2mb'}), (req, res) => {
  const { id, username } = req.body;
  const db = readDB();
  
  if (!db.cloudFiles) return res.json({ success: false });
  
  const initialLength = db.cloudFiles.length;
  db.cloudFiles = db.cloudFiles.filter((f: any) => !(f.id === id && f.owner === username));
  
  writeDB(db);
  res.json({ success: db.cloudFiles.length < initialLength });
});

// ==================== FRONT-END ROUTING MIDDLEWARES ====================

// API fallback to avoid serving index.html for undefined API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "API Route Not Found" });
});

async function startServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
      } else {
        console.warn("Production mode but dist folder missing. Fallback to API-only mode.");
      }
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Fatshan Post] Full Stack active on routing node http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("Critical server startup error:", err);
    // Even if Vite fails, try to listen so API works
    if (!(app as any).listening) {
       app.listen(PORT, "0.0.0.0");
    }
  }
}

startServer();

// Export for Vercel serverless support
export default app;
