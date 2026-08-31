import { GoogleGenAI } from '@google/genai';
import { generateTextChatResponse, generateSpokenVoiceResponse, cleanTextForSpeech } from '../utils/aiPortfolioKnowledge';

// Lazy GoogleGenAI client helper
export function getGeminiClient(): GoogleGenAI {
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
export const AVNISH_PORTFOLIO_SYSTEM_PROMPT = `
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

export async function processChatRequest(options: {
  messages: Array<{ role: string; content: string }>;
  model?: string;
  role?: string;
  customInstruction?: string;
}) {
  const { messages, model = 'gemini-3.7-flash', role = 'assistant', customInstruction = '' } = options;

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Invalid or empty messages array provided.');
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
  const contents = messages.map((m) => ({
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
    const errMessage = apiErr?.message || '';
    const is503OrHighDemand = errMessage.includes('503') || errMessage.includes('high demand') || errMessage.includes('UNAVAILABLE');
    
    if (is503OrHighDemand) {
      console.log(`[Gemini API] High demand on ${targetModel}, seamlessly switching to gemini-3.1-flash-lite.`);
    } else {
      console.warn(`[Gemini API] Primary model (${targetModel}) notice:`, errMessage);
    }

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
        console.warn('[Gemini API] Fallback model notice:', fallbackErr?.message);
      }
    }

    // If still empty (e.g. quota limit 429 or missing key), generate contextual portfolio answer
    if (!replyText) {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
      replyText = generateTextChatResponse(lastUserMsg, role);
      usedModel = 'gemini-assistant (portfolio intelligence)';
    }
  }

  if (!replyText) {
    replyText = generateTextChatResponse('', role);
  }

  return {
    text: replyText,
    modelUsed: usedModel,
    roleUsed: role,
  };
}
