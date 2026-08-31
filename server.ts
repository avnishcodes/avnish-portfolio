import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { Modality, type LiveServerMessage } from '@google/genai';
import dotenv from 'dotenv';
import { processChatRequest, getGeminiClient } from './src/server/geminiService.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Enable CORS for API routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    hasApiKey,
    supportedModels: ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-flash-live-preview']
  });
});

// Multi-turn Chat API Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.7-flash', role = 'assistant', customInstruction = '' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty messages array provided.' });
    }

    const result = await processChatRequest({
      messages,
      model,
      role,
      customInstruction
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/chat handler:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process AI chat request.',
    });
  }
});

// Voice API Endpoint (Spoken format endpoint)
app.post('/api/voice', async (req, res) => {
  try {
    const { prompt, conversationHistory = [], role = 'assistant' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body.' });
    }

    const messages = [
      ...conversationHistory,
      { role: 'user', content: prompt }
    ];

    const result = await processChatRequest({
      messages,
      model: 'gemini-3.1-flash-lite',
      role,
      customInstruction: 'You are speaking via interactive voice. Keep your answer natural, spoken-style, and concise (under 2-3 sentences) so it sounds smooth when spoken aloud.'
    });

    return res.json({
      replyText: result.text,
      modelUsed: result.modelUsed,
      roleUsed: result.roleUsed
    });
  } catch (error: any) {
    console.error('Error in /api/voice handler:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process voice request.'
    });
  }
});

// Setup WebSocket Server for Live API Voice conversations
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : '';
  
  if (pathname === '/api/live' || pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[Gemini Live] Client connected for voice conversation.');
  let liveSession: any = null;

  try {
    const ai = getGeminiClient();

    liveSession = await ai.live.connect({
      model: 'gemini-3.1-flash-live-preview',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
        systemInstruction: `You are Avnish Singh's voice AI assistant on his developer portfolio. Speak conversationally, warmly, and concisely in natural voice. Describe his skills in Machine Learning, Python, Scikit-learn, and his academic projects at IKGPTU. Keep spoken answers under 2-3 sentences per turn for natural spoken interaction.`,
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          if (clientWs.readyState !== WebSocket.OPEN) return;

          // Model Audio chunk
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ type: 'audio', audio }));
          }

          // Model text / transcription if available
          const textPart = message.serverContent?.modelTurn?.parts?.find((p: any) => p.text);
          if (textPart?.text) {
            clientWs.send(JSON.stringify({ type: 'text', text: textPart.text }));
          }

          // User interruption flag
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: 'interrupted', interrupted: true }));
          }

          // Turn complete
          if (message.serverContent?.turnComplete) {
            clientWs.send(JSON.stringify({ type: 'turnComplete' }));
          }
        },
        onclose: () => {
          console.log('[Gemini Live] Live session closed.');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'status', status: 'closed' }));
          }
        },
        onerror: (err: any) => {
          console.error('[Gemini Live] Error in Live session:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'error', error: err?.message || 'Live session error' }));
          }
        },
      },
    });

    clientWs.send(JSON.stringify({ type: 'status', status: 'connected' }));

    clientWs.on('message', (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data.type === 'audio' && data.audio && liveSession) {
          liveSession.sendRealtimeInput({
            audio: {
              data: data.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (data.type === 'text' && data.text && liveSession) {
          liveSession.sendRealtimeInput({
            text: data.text,
          });
        } else if (data.type === 'interrupt') {
          // Acknowledge client interruption
          clientWs.send(JSON.stringify({ type: 'interrupted', interrupted: true }));
        }
      } catch (err) {
        console.error('[Gemini Live] Error parsing client message:', err);
      }
    });

    clientWs.on('close', () => {
      console.log('[Gemini Live] Client disconnected.');
      if (liveSession && typeof liveSession.close === 'function') {
        try {
          liveSession.close();
        } catch (e) {
          // ignore cleanup error
        }
      }
    });
  } catch (error: any) {
    console.error('[Gemini Live] Failed to connect Live API:', error);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ 
        type: 'error', 
        error: error?.message || 'Failed to initialize Gemini Live Voice session.' 
      }));
    }
  }
});

// Vite middleware in dev / static server in prod
async function setupFrontendMiddleware() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupFrontendMiddleware().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Avnish Portfolio Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
});
