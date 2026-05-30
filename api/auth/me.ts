// api/auth/me.ts - Vercel Serverless Function
export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    res.status(200).json({
      user: {
        id: "1",
        email: "marvis_zhou@outlook.com",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marvis"
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
