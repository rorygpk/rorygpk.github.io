import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Mock Database for domain switching feature
let currentDomain = "fatshanpost.com";
const users = [
  { id: "1", username: "marvis_zhou", domain: "outlook.com", role: "admin" },
  { id: "2", username: "employee", domain: "fatshanpost.com", role: "worker" }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // 1. Get system config
  app.get("/api/config", (req, res) => {
    res.json({ currentDomain, adminEmail: "marvis_zhou@outlook.com" });
  });

  // 2. Mock Admin action: Change global domain
  app.post("/api/admin/change-domain", (req, res) => {
    const { newDomain } = req.body;
    if (!newDomain) {
      return res.status(400).json({ error: "Missing newDomain" });
    }
    currentDomain = newDomain;
    
    // In a real DB, the user rows would just compute their email as ${username}@${currentDomain}
    // and historical data assigned to user ID remains perfectly intact.
    // Here we update the mock data domain for users not holding special legacy domains 
    users.forEach(u => {
      if (u.role !== 'admin') {
         u.domain = currentDomain;
      }
    });

    res.json({ success: true, message: `Global domain updated to @${currentDomain}`, currentDomain });
  });

  // 3. User authentication status
  app.get("/api/auth/me", (req, res) => {
    // Mock user session
    res.json({
      user: {
        id: "1",
        email: `marvis_zhou@outlook.com`, // Fixed admin email as requested
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marvis"
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Current Domain: ${currentDomain}`);
  });
}

startServer();
