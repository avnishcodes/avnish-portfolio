import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality, type LiveServerMessage } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy GoogleGenAI client helper
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Portfolio context knowledge base for system instructions
const AVNISH_PORTFOLIO_SYSTEM_PROMPT = `
You are the official interactive AI Assistant for Avnish Singh's developer portfolio.
Avnish Singh is a Computer Science & Engineering undergraduate at I.K. Gujral Punjab Technical University (IKGPTU), Kapurthala, Punjab (Batch: 07/2024 – Present, Lateral Entry, CGPA: 7.09).

=== AVNISH'S KEY PROFILE & SKILLS ===
- Name: Avnish Singh
- Role: Machine Learning & Software Developer
- Email: savnish174@gmail.com | Phone: (+91) 8429084842 | Location: Punjab, India
- GitHub: https://github.com/avnishcodes
- LinkedIn: https://www.linkedin.com/in/avnishcodes
- Core Skills:
  * Programming: Python (Advanced, Primary), C, C++
  * Machine Learning & AI: Scikit-learn, Random Forest, SVM, Decision Trees, Linear & Polynomial Regression, Google Gemini GenAI
  * Data Management: SQL, Pandas, NumPy
  * Visualization: Matplotlib, Seaborn, Jupyter Notebooks
  * Web & APIs: REST API Development & Integration, HTML, CSS, JavaScript, PHP, Tkinter

=== EDUCATION ===
1. B.Tech in Computer Science & Engineering (07/2024 – Present, Lateral Entry, CGPA: 7.09)
   - Institution: I.K. Gujral Punjab Technical University (IKGPTU), Kapurthala, Punjab
   - Detail: Pursuing B.Tech in Computer Science & Engineering through lateral entry, currently maintaining a CGPA of 7.09.
   - Leadership: PWSkill Campus Ambassador, NCC Cadet representing the university.
2. Diploma in Computer Science & Engineering (08/2021 – 05/2024, CGPA: 7.05, Grade A)
   - Institution: Govt. Polytechnic College, Ferozepur, Punjab
   - Award: State-level PTIS Annual Fest choreography award for child labour awareness (Oct 2022).

=== WORK EXPERIENCE & INTERNSHIPS ===
1. QA Tester at InvisiaX (07/2026 – Present, Remote)
   - Manual QA testing of web applications, finding functional defects, bug tracking, and UI verification.
2. Industrial Project ML Intern at EME Technologies, Chandigarh/Mohali (06/2025 – 07/2025)
   - Built supervised ML models (Random Forest, SVM, Decision Trees, Linear Regression).
   - Data preprocessing, feature engineering, cross-validation, and algorithmic comparison.
3. Industrial Training at EME Technologies, Chandigarh/Mohali (07/2023 – 08/2023)
   - Developed Python desktop software including a custom text editor and automation/scraping scripts.

=== KEY PROJECTS ===
1. Cement Compressive Strength Predictor (ML / Scikit-learn):
   - Regression model estimating concrete strength using dataset features (cement, slag, fly ash, water, curing age, etc.).
   - Preprocessing, feature scaling, model training, evaluation with Matplotlib & Seaborn visualizations.
   - Live Web App: https://cement-strength-predictor-hwbassqqhzunrrnxusfnak.streamlit.app/
   - GitHub Repository: https://github.com/avnishcodes/cement-strength-predictor
2. Online E-Library System (Web / Full-stack):
   - Responsive digital library built with HTML, CSS, JS, and PHP backend for cataloging, donating, and searching books.
3. SkyView Weather App (Desktop / Python):
   - Python Tkinter desktop GUI interfacing directly with OpenWeatherMap REST APIs for real-time weather analytics.

=== YOUR BEHAVIOR & GUIDELINES ===
- Answer questions accurately, concisely, and professionally about Avnish's skills, projects, experience, education, and career aspirations.
- When asked technical questions, provide clear explanations with code snippets where helpful.
- Support different conversational modes based on user role (e.g. Recruiter, Fellow Developer, Tech Interviewer).
- Keep responses friendly, structured with Markdown, and articulate.
`;

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Multi-turn Chat API Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.7-flash', role = 'assistant', customInstruction = '' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty messages array provided.' });
    }

    // Map role persona to tailored system instruction additions
    let personaPrompt = AVNISH_PORTFOLIO_SYSTEM_PROMPT;
    if (role === 'interviewer') {
      personaPrompt += `\nRole Mode: Technical Interviewer. Act as an engineering manager assessing Avnish's qualifications for ML or Software Engineer positions. Offer constructive technical discussions and evaluate code skills.`;
    } else if (role === 'recruiter') {
      personaPrompt += `\nRole Mode: Recruiter Companion. Provide swift, high-level summaries of Avnish's availability, tech stack, location, project outcomes, and contact info.`;
    } else if (role === 'fast-qa') {
      personaPrompt += `\nRole Mode: Speed Q&A. Provide crisp, direct 1-3 sentence answers without filler.`;
    }

    if (customInstruction) {
      personaPrompt += `\nAdditional Custom Instruction: ${customInstruction}`;
    }

    // Format multi-turn conversation history for @google/genai SDK
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || '' }],
    }));

    // Target valid modern Gemini models
    let targetModel = model;
    if (targetModel.includes('3.5') || targetModel.includes('pro')) {
      targetModel = 'gemini-3.7-flash';
    }

    let replyText = '';
    let usedModel = targetModel;

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: targetModel,
        contents,
        config: {
          systemInstruction: personaPrompt,
          temperature: 0.7,
        },
      });

      replyText = response.text || '';
    } catch (apiErr: any) {
      console.warn(`Primary Gemini model (${targetModel}) encountered error:`, apiErr?.message);

      // Attempt fallback with gemini-3.1-flash-lite if not already tried
      if (targetModel !== 'gemini-3.1-flash-lite') {
        try {
          const ai = getGeminiClient();
          const fallbackResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: {
              systemInstruction: personaPrompt,
              temperature: 0.7,
            },
          });
          replyText = fallbackResponse.text || '';
          usedModel = 'gemini-3.1-flash-lite';
        } catch (fallbackErr: any) {
          console.warn('Fallback to gemini-3.1-flash-lite also encountered error:', fallbackErr?.message);
        }
      }

      // If still empty (e.g. quota limit 429), generate contextual portfolio answer
      if (!replyText) {
        const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user')?.content?.toLowerCase() || '';
        replyText = generatePortfolioFallbackResponse(lastUserMsg, role);
        usedModel = 'gemini-assistant (offline mode)';
      }
    }

    if (!replyText) {
      replyText = "I'm here to help answer questions about Avnish's Machine Learning projects, Python development, academic credentials at IKGPTU, and industry experience.";
    }

    return res.json({
      text: replyText,
      modelUsed: usedModel,
      roleUsed: role
    });
  } catch (error: any) {
    console.error('Error in /api/chat handler:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process AI chat request.',
    });
  }
});

// Helper for contextual fallback response when API quota is exhausted
function generatePortfolioFallbackResponse(query: string, role: string): string {
  if (query.includes('project') || query.includes('cement') || query.includes('strength')) {
    return `### Avnish's Featured Projects\n\n1. **Cement Compressive Strength Predictor (Machine Learning / Scikit-learn)**\n   - Predicts 28-day concrete strength using regression models (Random Forest, SVM, Decision Trees).\n   - Features automated preprocessing, scaling, and interactive Streamlit UI with real-time analytics.\n   - **Live App**: [Streamlit Deployment](https://cement-strength-predictor-hwbassqqhzunrrnxusfnak.streamlit.app/)\n\n2. **Online E-Library System (Full-Stack)**\n   - Digital library management system built with HTML, CSS, JavaScript, and PHP with SQL databases for cataloging and user borrowing.\n\n3. **SkyView Weather App (Desktop Python)**\n   - Python GUI desktop application utilizing Tkinter and live OpenWeatherMap REST API integrations.`;
  }
  if (query.includes('intern') || query.includes('eme') || query.includes('invisiax') || query.includes('experience') || query.includes('work')) {
    return `### Work Experience & Internships\n\n- **QA Tester at InvisiaX** *(07/2026 – Present, Remote)*: Conducting manual quality assurance, identifying functional edge-cases, and testing responsive web applications.\n- **ML Industrial Project Intern at EME Technologies, Mohali** *(06/2025 – 07/2025)*: Trained supervised machine learning models (SVM, Random Forest, Regression) and built end-to-end data pipelines.\n- **Python Developer Trainee at EME Technologies** *(07/2023 – 08/2023)*: Built desktop automation tools and custom text editor software in Python.`;
  }
  if (query.includes('skill') || query.includes('tech') || query.includes('python') || query.includes('ml')) {
    return `### Core Technical Stack\n\n- **Languages**: Python (Advanced), C, C++, SQL\n- **Machine Learning & AI**: Scikit-learn, Random Forest, SVM, Decision Trees, Regression Models, Google Gemini GenAI\n- **Data & Analytics**: Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebooks\n- **Web & Tools**: REST APIs, HTML5, CSS3, JavaScript, PHP, Git, GitHub, Streamlit`;
  }
  if (query.includes('education') || query.includes('ikgptu') || query.includes('degree') || query.includes('diploma') || query.includes('college')) {
    return `### Educational Background\n\n- **B.Tech in Computer Science & Engineering** *(07/2024 – Present, Lateral Entry, CGPA: 7.09)*: I.K. Gujral Punjab Technical University (IKGPTU), Main Campus, Kapurthala.\n- **Diploma in Computer Science & Engineering** *(08/2021 – 05/2024, CGPA: 7.05, Grade A)*: Govt. Polytechnic College, Ferozepur.`;
  }
  if (query.includes('contact') || query.includes('email') || query.includes('hire') || query.includes('resume')) {
    return `### Contact Information\n\n- **Email**: savnish174@gmail.com\n- **Phone**: (+91) 8429084842\n- **GitHub**: [github.com/avnishcodes](https://github.com/avnishcodes)\n- **LinkedIn**: [linkedin.com/in/avnishcodes](https://www.linkedin.com/in/avnishcodes)\n\nAvnish is actively open to internships and developer roles!`;
  }
  return `Avnish Singh is a Computer Science & Engineering undergraduate at IKGPTU specializing in **Machine Learning (Scikit-learn, Regression, Classification)** and **Python Software Development**.\n\nHe has built production ML models including the **Cement Compressive Strength Predictor**, worked as an ML Intern at **EME Technologies**, and is currently a QA Tester at **InvisiaX**.\n\nFeel free to ask about his specific projects, tech stack, or get in touch for developer opportunities!`;
}

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
