import { processChatRequest } from '../src/server/geminiService.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is supported.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }

    const { prompt, conversationHistory = [], role = 'assistant' } = body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body.' });
    }

    const messages = [
      ...conversationHistory,
      { role: 'user', content: prompt }
    ];

    const result = await processChatRequest({
      messages,
      model: 'gemini-3.7-flash',
      role,
      customInstruction: 'You are speaking via interactive voice. Keep your answer natural, spoken-style, and concise (under 2-3 sentences) so it sounds smooth when spoken aloud.'
    });

    return res.status(200).json({
      replyText: result.text,
      modelUsed: result.modelUsed,
      roleUsed: result.roleUsed
    });
  } catch (error: any) {
    console.error('Vercel API /api/voice error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process voice request.'
    });
  }
}
