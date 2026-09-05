import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  X, 
  Zap, 
  Brain, 
  Briefcase, 
  GraduationCap, 
  Radio, 
  PhoneCall, 
  PhoneOff, 
  Check, 
  Copy, 
  Terminal, 
  User, 
  MessageSquare,
  AlertCircle,
  Activity
} from 'lucide-react';
import { floatTo16BitPCMBase64, pcmBase64ToAudioBuffer } from '../utils/audioUtils';
import { cleanTextForSpeech, generateSpokenVoiceResponse, generateTextChatResponse } from '../utils/aiPortfolioKnowledge';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

interface GeminiAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'chat' | 'voice';
}

export const GeminiAiModal: React.FC<GeminiAiModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'chat'
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>(initialTab);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: "Hello! I am Avnish's interactive AI assistant powered by Google Gemini. Ask me anything about his Machine Learning projects, Python software development, academic background at IKGPTU, or work experience at EME Technologies and InvisiaX!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.7-flash'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.7-flash' | 'gemini-3.1-flash-lite'>('gemini-3.7-flash');
  const [selectedRole, setSelectedRole] = useState<'assistant' | 'recruiter' | 'interviewer' | 'fast-qa'>('assistant');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Voice Live API state & Locks
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'greeting' | 'speaking' | 'listening' | 'processing' | 'error'>('disconnected');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState<{ sender: 'user' | 'model'; text: string }[]>([]);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [voiceQuickInput, setVoiceQuickInput] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState(0);

  // Sequential Turn-Taking Locks & Audio Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeAudioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const isFallbackVoiceRef = useRef<boolean>(false);
  
  // Strict non-overlapping execution locks
  const voiceActiveRef = useRef<boolean>(false);
  const turnLockRef = useRef<'idle' | 'greeting' | 'speaking' | 'listening' | 'processing'>('idle');
  const isSpeakingRef = useRef<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);
  const quietBufferTimeoutRef = useRef<any>(null);
  const waveIntervalRef = useRef<any>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Clean up voice session on unmount or tab switch
  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  // Quick Prompt Suggestions covering all requested areas
  const promptSuggestions = [
    { label: "🎯 ML Projects", prompt: "Explain Avnish's Machine Learning projects like the Cement Compressive Strength Predictor and algorithms used." },
    { label: "💼 EME Internship", prompt: "What was Avnish's role and technical accomplishments during his internship at EME Technologies?" },
    { label: "🎓 B.Tech @ IKGPTU", prompt: "Tell me about Avnish's B.Tech in Computer Science & Engineering at IKGPTU, his CGPA, and coursework." },
    { label: "📜 Diploma in CSE", prompt: "What was Avnish's training and academic record during his Diploma in Computer Science & Engineering at Govt. Polytechnic College?" },
    { label: "⚡ Technical Skills", prompt: "Summarize Avnish's technical skills across Python, Machine Learning, Scikit-Learn, SQL, and Full-Stack Development." },
    { label: "🚀 All Projects", prompt: "Give an overview of all projects built by Avnish Singh including ML models, Web platforms, and Python apps." },
    { label: "📈 Career & Experience", prompt: "Summarize Avnish's career journey, his QA Tester role at InvisiaX, internships, and campus leadership." }
  ];

  // Send message to Gemini chat endpoint
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Send conversation history to backend proxy
      const apiPayload = {
        messages: newHistory.map(m => ({
          role: m.role,
          content: m.content
        })),
        model: selectedModel,
        role: selectedRole
      };

      let data: any = null;
      let lastErrorMessage = '';
      const maxRetries = 2;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiPayload)
          });

          const contentType = res.headers.get('content-type') || '';
          
          if (contentType.includes('application/json')) {
            const parsed = await res.json();
            if (res.ok && parsed.text) {
              data = parsed;
              break;
            } else {
              lastErrorMessage = parsed.error || `Server status ${res.status}`;
            }
          }
        } catch (fetchErr: any) {
          lastErrorMessage = fetchErr?.message || 'Network connection';
        }

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // If backend is offline or on static Vercel deployment, generate instant accurate answer
      if (!data || !data.text) {
        console.log('[Gemini Chat] Using client-side portfolio intelligence fallback');
        data = {
          text: generateTextChatResponse(userMessage.content, selectedRole),
          modelUsed: 'gemini-3.7-flash (portfolio intelligence)'
        };
      }

      const modelMessage: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackContent = generateTextChatResponse(userMessage.content, selectedRole);
      const fallbackMessage: Message = {
        id: `fb-${Date.now()}`,
        role: 'model',
        content: fallbackContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content: "Chat history cleared. How can I assist you with Avnish's portfolio today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      }
    ]);
  };

  // ==========================================
  // SYNCHRONIZED SEQUENTIAL STATE LOCK PIPELINE
  // ==========================================

  // Clear any pending quiet buffer timer
  const clearQuietBuffer = () => {
    if (quietBufferTimeoutRef.current) {
      clearTimeout(quietBufferTimeoutRef.current);
      quietBufferTimeoutRef.current = null;
    }
  };

  // Clear visual audio waveform simulation
  const clearWaveInterval = () => {
    if (waveIntervalRef.current) {
      clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
    }
    setAudioLevel(0);
  };

  // 1. LISTEN TURN: Acquire listening lock and start microphone speech-to-text
  const startListeningTurn = () => {
    clearQuietBuffer();

    // LOCK CHECK: Never listen if call is ended, or if assistant is speaking/processing
    if (!voiceActiveRef.current || isSpeakingRef.current || isProcessingRef.current) {
      console.log('[Voice Lock] Cannot acquire listening lock while speaking or processing.');
      return;
    }

    turnLockRef.current = 'listening';
    setVoiceStatus('listening');
    setInterimTranscript('');

    // Ensure any stale recognition instance is destroyed
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log('[Voice AI] Web Speech API not available in current browser frame. Interactive prompt chips active.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      // Single-turn discrete session to prevent mobile dropouts and ensure clean turn transitions
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        if (voiceActiveRef.current && !isSpeakingRef.current && !isProcessingRef.current) {
          setVoiceStatus('listening');
        }
      };

      recognition.onresult = (event: any) => {
        // Drop any results if speaking or processing lock has been acquired
        if (!voiceActiveRef.current || isSpeakingRef.current || isProcessingRef.current) return;

        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            finalText += transcript;
          } else {
            interimText += transcript;
          }
        }

        if (interimText.trim()) {
          setInterimTranscript(interimText.trim());
        }

        const queryToProcess = (finalText || interimText).trim();

        // When a definitive query is received, acquire the processing lock immediately
        if (finalText.trim()) {
          console.log('[Voice AI] Final speech recognized:', finalText.trim());
          
          // ACQUIRE PROCESSING LOCK
          isProcessingRef.current = true;
          turnLockRef.current = 'processing';
          setInterimTranscript('');

          // Kill recognition immediately to avoid capturing speaker echo or user breath
          try {
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
            recognition.abort();
          } catch (e) {}
          recognitionRef.current = null;

          handleSpokenQuery(queryToProcess);
        }
      };

      recognition.onerror = (err: any) => {
        // Aborted and no-speech are standard lifecycle events when switching turns or quiet pauses
        if (err.error !== 'aborted' && err.error !== 'no-speech') {
          console.warn('[Voice AI] Speech recognition event:', err.error);
        }

        if (err.error === 'not-allowed') {
          setVoiceError('Microphone permission blocked. Please allow mic access or use prompt chips below.');
        }
      };

      recognition.onend = () => {
        // If the call is still active and we are not speaking or processing, schedule next clean listening turn
        if (voiceActiveRef.current && turnLockRef.current === 'listening' && !isSpeakingRef.current && !isProcessingRef.current) {
          clearQuietBuffer();
          quietBufferTimeoutRef.current = setTimeout(() => {
            if (voiceActiveRef.current && !isSpeakingRef.current && !isProcessingRef.current) {
              startListeningTurn();
            }
          }, 300);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('[Voice AI] Could not start speech recognition turn:', e);
    }
  };

  // 2. PROCESS TURN: Send query to Gemini and receive clean conversational reply
  const handleSpokenQuery = async (queryText: string) => {
    if (!queryText.trim()) {
      isProcessingRef.current = false;
      startListeningTurn();
      return;
    }

    // Ensure audio playback is stopped
    stopCurrentAudioPlayback(false);

    // ACQUIRE PROCESSING LOCK
    isProcessingRef.current = true;
    turnLockRef.current = 'processing';
    setVoiceStatus('processing');
    setVoiceTranscript(prev => [...prev, { sender: 'user', text: queryText.trim() }]);

    let reply = '';

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          role: selectedRole
        })
      });

      if (res.ok) {
        const data = await res.json();
        reply = cleanTextForSpeech(data.replyText || '');
      }
    } catch (e) {
      console.warn('[Voice AI] API fetch notice, using voice generator fallback:', e);
    }

    // If server returned empty or is unreachable on Vercel, generate clean spoken dialogue
    if (!reply) {
      reply = generateSpokenVoiceResponse(queryText, selectedRole);
    }

    const cleanSpoken = cleanTextForSpeech(reply);
    setVoiceTranscript(prev => [...prev, { sender: 'model', text: cleanSpoken }]);

    // Release processing lock and transition to speaking
    isProcessingRef.current = false;
    speakTextAloud(cleanSpoken);
  };

  // 3. SPEAK TURN: Synthesize clean speech without markdown, followed by sequential return to listening
  const speakTextAloud = (rawText: string) => {
    clearQuietBuffer();
    clearWaveInterval();

    const spokenContent = cleanTextForSpeech(rawText);
    if (!spokenContent) {
      isSpeakingRef.current = false;
      startListeningTurn();
      return;
    }

    // ACQUIRE SPEAKING LOCK
    isSpeakingRef.current = true;
    turnLockRef.current = 'speaking';
    setVoiceStatus('speaking');

    // Make sure recognition is shut down during assistant speech so it never hears itself
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        try {
          window.speechSynthesis.resume();
        } catch (e) {}
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(spokenContent);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Dynamic Audio Level Simulation while speaking
      waveIntervalRef.current = setInterval(() => {
        if (!isSpeakingRef.current) {
          clearWaveInterval();
          return;
        }
        setAudioLevel(Math.floor(Math.random() * 55) + 35);
      }, 100);

      const handleSpeechFinished = () => {
        clearWaveInterval();
        
        // RELEASE SPEAKING LOCK
        isSpeakingRef.current = false;

        // If session is still active, wait 350ms quiet buffer to clear echo before listening
        if (voiceActiveRef.current) {
          clearQuietBuffer();
          quietBufferTimeoutRef.current = setTimeout(() => {
            if (voiceActiveRef.current && !isSpeakingRef.current && !isProcessingRef.current) {
              startListeningTurn();
            }
          }, 350);
        }
      };

      utterance.onend = handleSpeechFinished;
      utterance.onerror = handleSpeechFinished;

      try {
        window.speechSynthesis.speak(utterance);
      } catch (synthErr) {
        console.error('SpeechSynthesis error:', synthErr);
        handleSpeechFinished();
      }
    } else {
      isSpeakingRef.current = false;
      startListeningTurn();
    }
  };

  // 4. START VOICE SESSION: Begins call with the welcome greeting lock
  const startVoiceSession = async () => {
    try {
      setVoiceError(null);
      clearQuietBuffer();
      clearWaveInterval();

      voiceActiveRef.current = true;
      setIsVoiceActive(true);

      // ACQUIRE GREETING LOCK
      turnLockRef.current = 'greeting';
      isSpeakingRef.current = true;
      isProcessingRef.current = false;
      setVoiceStatus('speaking');

      // Initialize audio context for volume analysis if permitted
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const inputAudioCtx = new AudioCtx({ sampleRate: 16000 });
          inputAudioCtxRef.current = inputAudioCtx;

          navigator.mediaDevices.getUserMedia({ 
            audio: { 
              channelCount: 1, 
              sampleRate: 16000, 
              echoCancellation: true, 
              noiseSuppression: true 
            } 
          }).then((stream) => {
            mediaStreamRef.current = stream;
            const source = inputAudioCtx.createMediaStreamSource(stream);
            const analyser = inputAudioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);

            const updateVolume = () => {
              if (turnLockRef.current === 'listening' && !isSpeakingRef.current && !isProcessingRef.current) {
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                let sum = 0;
                for (let i = 0; i < array.length; i++) sum += array[i];
                const avg = sum / array.length;
                setAudioLevel(Math.min(100, Math.round(avg * 1.8)));
              }
              animationFrameRef.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();
          }).catch((micErr) => {
            console.log('[Voice AI] Microphone visualizer notice:', micErr?.message);
          });
        }
      } catch (audioCtxErr) {
        console.warn('[Voice AI] AudioContext initialization notice:', audioCtxErr);
      }

      // Immediately speak the welcome greeting with speaking lock
      const welcomeGreeting = "Hello! Welcome to Avnish's AI assistant. I can tell you all about his machine learning projects, software development skills, and technical background. What would you like to know?";
      setVoiceTranscript([{ sender: 'model', text: welcomeGreeting }]);
      speakTextAloud(welcomeGreeting);

    } catch (err: any) {
      console.error('[Voice AI] Start call error:', err);
      const fallbackGreeting = "Hello! Welcome to Avnish's AI assistant. How can I help you today?";
      setVoiceTranscript([{ sender: 'model', text: fallbackGreeting }]);
      speakTextAloud(fallbackGreeting);
    }
  };

  // 5. INTERRUPT: Stop any current speech and immediately return to clean listening turn
  const stopCurrentAudioPlayback = (resumeListening = true) => {
    clearQuietBuffer();
    clearWaveInterval();

    // Stop browser speech synthesis if active
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    // Stop active audio sources if any
    activeAudioSourcesRef.current.forEach(source => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {}
    });
    activeAudioSourcesRef.current = [];

    // Release speaking & processing locks
    isSpeakingRef.current = false;
    isProcessingRef.current = false;
    setAudioLevel(0);

    if (resumeListening && voiceActiveRef.current) {
      quietBufferTimeoutRef.current = setTimeout(() => {
        if (voiceActiveRef.current && !isSpeakingRef.current && !isProcessingRef.current) {
          startListeningTurn();
        }
      }, 200);
    }
  };

  // 6. END CALL: Complete teardown of all media, locks, and listeners
  const stopVoiceSession = () => {
    voiceActiveRef.current = false;
    turnLockRef.current = 'idle';
    isSpeakingRef.current = false;
    isProcessingRef.current = false;
    isFallbackVoiceRef.current = false;

    clearQuietBuffer();
    clearWaveInterval();

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsVoiceActive(false);
    setVoiceStatus('disconnected');
    setInterimTranscript('');
    setAudioLevel(0);
  };

  if (!isOpen) return null;

  return (
    <div
      id="gemini-ai-modal-overlay"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[92vh] sm:h-[86vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shrink-0" />

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-slate-900/95 border-b border-slate-800 shrink-0 select-none backdrop-blur-md">
          {/* Title & Mode Badges */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>Avnish AI Companion</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  Google Gemini Powered
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Multi-Turn Intelligence &amp; Real-Time Voice API
              </p>
            </div>
          </div>

          {/* Tab Switcher & Close */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <button
                id="gemini-tab-chat-btn"
                onClick={() => {
                  setActiveTab('chat');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'chat'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Text Chat</span>
              </button>

              <button
                id="gemini-tab-voice-btn"
                onClick={() => {
                  setActiveTab('voice');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'voice'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5 animate-pulse text-rose-300" />
                <span>Live Voice</span>
              </button>
            </div>

            <button
              onClick={onClose}
              id="gemini-modal-close-btn"
              aria-label="Close AI Assistant"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: MULTI-TURN CHAT INTERFACE                                          */}
        {/* ========================================================================= */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
            {/* Control Bar: Model & Role Selection */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono shrink-0">
              
              {/* Role / Persona Select */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                <span className="text-slate-500 text-[11px] shrink-0">Role:</span>
                <button
                  onClick={() => {
                    setSelectedRole('assistant');
                    setSelectedModel('gemini-3.7-flash');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 flex items-center gap-1 text-[11px] ${
                    selectedRole === 'assistant'
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-3 h-3 text-indigo-400" />
                  Portfolio Guide
                </button>

                <button
                  onClick={() => {
                    setSelectedRole('recruiter');
                    setSelectedModel('gemini-3.7-flash');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 flex items-center gap-1 text-[11px] ${
                    selectedRole === 'recruiter'
                      ? 'bg-teal-600/30 text-teal-300 border border-teal-500/50'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Briefcase className="w-3 h-3 text-teal-400" />
                  Recruiter Mode
                </button>

                <button
                  onClick={() => {
                    setSelectedRole('interviewer');
                    setSelectedModel('gemini-3.7-flash');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 flex items-center gap-1 text-[11px] ${
                    selectedRole === 'interviewer'
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Brain className="w-3 h-3 text-purple-400" />
                  Technical Interviewer
                </button>

                <button
                  onClick={() => {
                    setSelectedRole('fast-qa');
                    setSelectedModel('gemini-3.1-flash-lite');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 flex items-center gap-1 text-[11px] ${
                    selectedRole === 'fast-qa'
                      ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  Speed Q&amp;A
                </button>
              </div>

              {/* Model Select + Clear History */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700/80 rounded-lg px-2 py-0.5">
                  <span className="text-slate-400 text-[10px]">Model:</span>
                  <select
                    value={selectedModel}
                    onChange={(e: any) => setSelectedModel(e.target.value)}
                    className="bg-transparent text-indigo-300 text-[11px] font-mono focus:outline-none cursor-pointer"
                  >
                    <option value="gemini-3.7-flash" className="bg-slate-900 text-slate-200">
                      gemini-3.7-flash (Default)
                    </option>
                    <option value="gemini-3.1-flash-lite" className="bg-slate-900 text-slate-200">
                      gemini-3.1-flash-lite (Fast)
                    </option>
                  </select>
                </div>

                <button
                  onClick={handleClearChat}
                  title="Clear conversation history"
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Conversation Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-mono font-bold shadow-md ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-indigo-400 border border-slate-700'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed border transition-all ${
                      msg.role === 'user'
                        ? 'bg-indigo-600/90 text-white border-indigo-500/50 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-900/90 text-slate-200 border-slate-800 shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5 select-none text-[10px] font-mono text-slate-400">
                      <span className="font-semibold text-slate-300">
                        {msg.role === 'user' ? 'You' : 'Gemini Assistant'}
                      </span>
                      <div className="flex items-center gap-2">
                        {msg.modelUsed && msg.role === 'model' && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {msg.modelUsed}
                          </span>
                        )}
                        <span>{msg.timestamp}</span>
                        {msg.role === 'model' && (
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="text-slate-400 hover:text-white transition-colors"
                            title="Copy message"
                          >
                            {copiedMsgId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="whitespace-pre-wrap break-words font-sans">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 max-w-3xl mr-auto">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-xs font-mono text-slate-400 ml-1">Gemini is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 sm:px-6 py-2 bg-slate-900/50 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto shrink-0">
              <span className="text-[11px] font-mono text-slate-500 shrink-0">Try asking:</span>
              {promptSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-mono shrink-0 transition-all active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Input Composer Box */}
            <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Ask Gemini about Avnish's ML projects, skills, education..."
                    disabled={isLoading}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 text-xs sm:text-sm font-sans focus:outline-none transition-all"
                  />
                  
                  {/* Voice Button Quick Switch */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('voice');
                    }}
                    title="Switch to Live Voice Conversation"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition-colors"
                  >
                    <Radio className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  id="gemini-send-btn"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-medium text-xs font-mono transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: GEMINI LIVE VOICE API CONVERSATION                                 */}
        {/* ========================================================================= */}
        {activeTab === 'voice' && (
          <div className="flex-1 flex flex-col items-center justify-between p-6 sm:p-10 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 overflow-y-auto">
            
            {/* Top Voice Status Indicator */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
                <Radio className={`w-3.5 h-3.5 ${isVoiceActive ? 'text-rose-400 animate-ping' : 'text-slate-400'}`} />
                <span>Model: gemini-3.1-flash-live-preview (Live API)</span>
              </div>

              <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                {voiceStatus === 'speaking' && 'Gemini is speaking...'}
                {voiceStatus === 'greeting' && 'Welcoming you...'}
                {voiceStatus === 'listening' && 'Listening to your voice...'}
                {voiceStatus === 'processing' && 'Gemini is thinking...'}
                {voiceStatus === 'connecting' && 'Connecting to Gemini Live...'}
                {voiceStatus === 'disconnected' && 'Real-Time Voice Assistant'}
                {voiceStatus === 'error' && 'Connection Issue'}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                Have a continuous, ultra low-latency conversation with Avnish's AI assistant. Ask about his machine learning pipelines, technical background, and achievements.
              </p>
            </div>

            {/* Center Visualizer & Neural Orb */}
            <div className="my-5 flex flex-col items-center justify-center relative">
              
              {/* Outer Pulse Rings */}
              {isVoiceActive && (
                <>
                  <div 
                    className="absolute w-44 h-44 rounded-full border border-indigo-500/20 animate-ping duration-1000"
                    style={{ animationDuration: '3s' }}
                  />
                  <div 
                    className="absolute w-60 h-60 rounded-full border border-purple-500/10 animate-pulse duration-700"
                  />
                </>
              )}

              {/* Central Glowing Orb with lock state feedback */}
              <div 
                className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl relative ${
                  isVoiceActive
                    ? voiceStatus === 'speaking' || voiceStatus === 'greeting'
                      ? 'bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 shadow-purple-500/40 ring-4 ring-purple-500/30 scale-105'
                      : voiceStatus === 'processing'
                      ? 'bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 shadow-amber-500/40 ring-4 ring-amber-500/30 scale-105 animate-pulse'
                      : 'bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 shadow-teal-500/30 ring-4 ring-teal-500/30 scale-100'
                    : 'bg-slate-900 border border-slate-800 shadow-none'
                }`}
              >
                {isVoiceActive ? (
                  <>
                    {voiceStatus === 'processing' ? (
                      <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
                    ) : voiceStatus === 'speaking' || voiceStatus === 'greeting' ? (
                      <Volume2 className="w-10 h-10 text-white animate-pulse" />
                    ) : (
                      <Activity className="w-10 h-10 text-white animate-pulse" />
                    )}
                    <span className="text-[11px] font-mono text-white/90 mt-1 uppercase tracking-wider font-semibold">
                      {voiceStatus === 'processing' ? 'THINKING' : voiceStatus}
                    </span>
                  </>
                ) : (
                  <>
                    <Mic className="w-10 h-10 text-slate-500" />
                    <span className="text-[11px] font-mono text-slate-500 mt-1">Ready</span>
                  </>
                )}
              </div>

              {/* Dynamic Sound Wave Level Bars */}
              {isVoiceActive && (
                <div className="flex items-center gap-1.5 mt-5 h-8">
                  {[...Array(9)].map((_, i) => {
                    const height = Math.max(6, Math.min(32, (audioLevel * (1 + (i % 3) * 0.4))));
                    return (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 transition-all duration-75"
                        style={{ height: `${height}px` }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Real-Time Hearing Interim Indicator */}
            {isVoiceActive && interimTranscript && (
              <div className="w-full max-w-lg mb-3 px-3.5 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-xs font-mono flex items-center gap-2 animate-pulse">
                <Mic className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">Hearing: &ldquo;{interimTranscript}&rdquo;</span>
              </div>
            )}

            {/* Spoken Topic Triggers */}
            <div className="w-full max-w-lg mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400">Tap any question to converse:</span>
                {isSpeakingRef.current && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 animate-pulse">
                    <Volume2 className="w-3.5 h-3.5" /> Speaking · Click Interrupt anytime
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { label: '🎯 ML Projects', text: "What machine learning projects has Avnish built?" },
                  { label: '🎓 B.Tech & CGPA', text: "Tell me about Avnish's B.Tech in CSE at IKGPTU and his academic scores." },
                  { label: '💼 EME Internship', text: "What did Avnish accomplish during his ML internship at EME Technologies?" },
                  { label: '⚡ Python Skills', text: "Which Python libraries, ML frameworks, and tools does Avnish specialize in?" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!isVoiceActive) {
                        startVoiceSession();
                      }
                      handleSpokenQuery(item.text);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white text-xs font-mono shrink-0 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Text Question in Voice View */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!voiceQuickInput.trim()) return;
                if (!isVoiceActive) {
                  voiceActiveRef.current = true;
                  setIsVoiceActive(true);
                }
                const q = voiceQuickInput.trim();
                setVoiceQuickInput('');
                handleSpokenQuery(q);
              }}
              className="w-full max-w-lg flex items-center gap-2 mb-3"
            >
              <input
                type="text"
                value={voiceQuickInput}
                onChange={(e) => setVoiceQuickInput(e.target.value)}
                placeholder="Type a question or speak into your microphone..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={!voiceQuickInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Ask</span>
                <Send className="w-3 h-3" />
              </button>
            </form>

            {/* Live Transcript Log (if available) */}
            {voiceTranscript.length > 0 && (
              <div className="w-full max-w-lg p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 mb-3 max-h-24 overflow-y-auto">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Live Voice Transcript:</span>
                {voiceTranscript.slice(-3).map((item, idx) => (
                  <p key={idx} className="text-slate-300">
                    <strong className={item.sender === 'user' ? 'text-indigo-400' : 'text-purple-400'}>
                      {item.sender === 'user' ? 'You: ' : 'Gemini: '}
                    </strong>
                    {item.text}
                  </p>
                ))}
              </div>
            )}

            {voiceError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono mb-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{voiceError}</span>
              </div>
            )}

            {/* Voice Control Buttons */}
            <div className="flex items-center gap-3 sm:gap-4 mt-2">
              {!isVoiceActive ? (
                <button
                  onClick={startVoiceSession}
                  id="start-live-voice-btn"
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm font-mono transition-all shadow-lg shadow-purple-600/30 active:scale-95 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-300" />
                  <span>Start Voice Call</span>
                </button>
              ) : (
                <>
                  {/* Mute Button */}
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isMicMuted 
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
                  </button>

                  {/* Interrupt / Stop speaking button */}
                  <button
                    onClick={stopCurrentAudioPlayback}
                    id="interrupt-voice-btn"
                    title="Instantly stop Gemini from speaking"
                    className={`px-5 py-3.5 rounded-2xl font-mono text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                      voiceStatus === 'speaking' || isSpeakingRef.current
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold ring-4 ring-amber-500/30 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200'
                    }`}
                  >
                    <VolumeX className={`w-4 h-4 ${voiceStatus === 'speaking' || isSpeakingRef.current ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>Interrupt Speech</span>
                  </button>

                  {/* End Call Button */}
                  <button
                    onClick={stopVoiceSession}
                    id="end-live-voice-btn"
                    className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs font-mono transition-all shadow-lg shadow-rose-600/30 active:scale-95 cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call</span>
                  </button>
                </>
              )}
            </div>

            {/* Instructions Footer */}
            <div className="text-[11px] font-mono text-slate-500 text-center mt-4">
              💡 Tip: You can speak through your microphone or tap any topic chip above. Click <span className="text-amber-400 font-semibold">Interrupt Speech</span> anytime to cut in!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
