// api/admin/change-domain.ts - Vercel Serverless Function
// Note: In production, use a database to persist domain changes
// This is a simple in-memory implementation for demo purposes

let currentDomain = process.env.CURRENT_DOMAIN || "fatshanpost.com";

export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { newDomain } = req.body;
    
    if (!newDomain) {
      return res.status(400).json({ error: 'Missing newDomain' });
    }
    
    currentDomain = newDomain;
    
    res.status(200).json({
      success: true,
      message: `Global domain updated to @${currentDomain}`,
      currentDomain
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
