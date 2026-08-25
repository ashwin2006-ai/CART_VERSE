export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CartVerse Node.js + Vercel Serverless Backend',
    version: '2.0.0',
    database: 'In-Memory (Serverless)',
  });
}
