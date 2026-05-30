// api/config.ts - Vercel Serverless Function
export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    res.status(200).json({
      currentDomain: process.env.CURRENT_DOMAIN || "fatshanpost.com",
      adminEmail: process.env.ADMIN_EMAIL || "marvis_zhou@outlook.com"
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
