import React from 'react';
import { Bot, Sparkles, Radio, MessageSquare } from 'lucide-react';

interface AiFloatingWidgetProps {
  onOpenChat: () => void;
  onOpenVoice: () => void;
}

export const AiFloatingWidget: React.FC<AiFloatingWidgetProps> = ({
  onOpenChat,
  onOpenVoice,
}) => {
  return (
    <div
      id="ai-floating-launcher"
      className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 animate-bounce-subtle"
    >
      {/* Voice Quick Action Pill */}
      <button
        onClick={onOpenVoice}
        id="quick-live-voice-trigger"
        title="Start Real-Time Voice Conversation with Gemini Live"
        className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/95 hover:bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-mono font-medium shadow-xl shadow-purple-950/40 backdrop-blur-xl transition-all hover:scale-105 hover:border-purple-400 active:scale-95 cursor-pointer"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
        </span>
        <Radio className="w-3.5 h-3.5 text-purple-300" />
        <span className="hidden sm:inline">Live Voice</span>
      </button>

      {/* Main Chatbot Launcher Button */}
      <button
        onClick={onOpenChat}
        id="main-gemini-chat-trigger"
        title="Open Gemini AI Portfolio Assistant"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-semibold shadow-xl shadow-indigo-600/30 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50 active:scale-95 cursor-pointer border border-indigo-400/30"
      >
        <div className="relative">
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="font-mono tracking-tight">Ask Gemini</span>
        <span className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-white/20 rounded-full">
          AI
        </span>
      </button>
    </div>
  );
};
