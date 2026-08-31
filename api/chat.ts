import type { IncomingMessage, ServerResponse } from 'http';
import { processChatRequest } from '../src/server/geminiService.js';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

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
      } catch (e) {
        // use body as is
      }
    }

    const { messages, model = 'gemini-3.7-flash', role = 'assistant', customInstruction = '' } = body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty messages array provided.' });
    }

    const result = await processChatRequest({
      messages,
      model,
      role,
      customInstruction,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Vercel API /api/chat error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process AI chat request.',
    });
  }
}
