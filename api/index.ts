import express from "express";

let currentDomain = "fatshanpost.com";
const users = [
  { id: "1", username: "marvis_zhou", domain: "outlook.com", role: "admin" },
  { id: "2", username: "employee", domain: "fatshanpost.com", role: "worker" }
];

const app = express();
app.use(express.json());

// API Routes
app.get("/api/config", (req, res) => {
  res.json({ currentDomain, adminEmail: "marvis_zhou@outlook.com" });
});

app.post("/api/admin/change-domain", (req, res) => {
  const { newDomain } = req.body;
  if (!newDomain) {
    return res.status(400).json({ error: "Missing newDomain" });
  }
  currentDomain = newDomain;
  users.forEach(u => {
    if (u.role !== 'admin') {
       u.domain = currentDomain;
    }
  });

  res.json({ success: true, message: `Global domain updated to @${currentDomain}`, currentDomain });
});

app.get("/api/auth/me", (req, res) => {
  res.json({
    user: {
      id: "1",
      email: `marvis_zhou@outlook.com`,
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marvis"
    }
  });
});

export default app;
