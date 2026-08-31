export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hasApiKey = Boolean(process.env.GEMINI_API_KEY);

  return res.status(200).json({
    status: 'ok',
    environment: 'vercel-serverless',
    timestamp: new Date().toISOString(),
    hasApiKey,
    supportedModels: ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-flash-live-preview']
  });
}
