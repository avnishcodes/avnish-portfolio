export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // In Vercel serverless environments, persistent WebSockets are not maintained.
  // The client automatically uses /api/voice for conversational voice intelligence.
  return res.status(200).json({
    status: 'ok',
    service: 'gemini-live-voice',
    environment: 'vercel-serverless',
    voiceEndpoint: '/api/voice',
    message: 'For serverless environments, interactive voice speech is provided via /api/voice.'
  });
}
