import React, { useState } from "react";
import {
  MessageSquareCode,
  Send,
  Mic,
  Volume2,
  Sparkles,
  RefreshCw,
  User,
  Bot,
  HelpCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { ChatMessage, Language } from "../types";
import { sendChatApi } from "../services/api";
import { speakText, startVoiceRecognition } from "../services/speech";

interface EmergencyChatbotProps {
  currentLanguage: Language;
}

export const EmergencyChatbot: React.FC<EmergencyChatbotProps> = ({
  currentLanguage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      text: "Hello, I am Gemma, your AI Emergency & Disaster Safety Assistant. Ask me anything about flood survival, earthquake drop-cover-hold, first aid, or cyclone preparedness.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const presetQuestions = [
    "What should I do during a flood?",
    "Is it safe to evacuate right now?",
    "First aid instructions for severe burns?",
    "Earthquake safety precautions indoors",
    "Cyclone emergency kit checklist",
    "How to prepare safe drinking water?",
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const reply = await sendChatApi(textToSend, history, currentLanguage);

      const botMsg: ChatMessage = {
        id: "msg-reply-" + Date.now(),
        role: "assistant",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat Error:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    startVoiceRecognition({
      lang: currentLanguage,
      onResult: (transcript) => {
        setInput(transcript);
        setIsRecording(false);
        handleSend(transcript);
      },
      onError: () => setIsRecording(false),
      onEnd: () => setIsRecording(false),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Top Header */}
      <div className="glass-card-light dark:glass-card-dark p-6 rounded-[24px] border border-white/60 dark:border-white/10 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemma Powered AI Emergency Assistant</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            24/7 Disaster Survival & Safety Chatbot
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Instant step-by-step guidance for floods, earthquakes, fires, cyclones, and first aid emergencies in {currentLanguage}.
          </p>
        </div>
      </div>

      {/* Preset Question Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#2A6F97]" />
          <span>Quick Emergency Questions:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="glass-card-light dark:glass-card-dark rounded-[24px] p-4 md:p-6 shadow-lg flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 border ${
                  msg.role === "user"
                    ? "bg-[#E53935] border-red-400 text-white shadow-sm"
                    : "bg-[#2A6F97] border-blue-400 text-white shadow-sm"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                translate={msg.role === "assistant" ? "no" : undefined}
                className={`max-w-[80%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed space-y-2 border ${
                  msg.role === "assistant" ? "notranslate" : ""
                } ${
                  msg.role === "user"
                    ? "bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800/80 text-slate-800 dark:text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                  <span>{msg.timestamp}</span>
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => speakText(msg.text, currentLanguage)}
                      className="text-[#2A6F97] dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-[#2A6F97] dark:text-cyan-400 font-semibold bg-white dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Gemma is composing emergency instructions...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
              isRecording
                ? "bg-red-500 text-white border-red-400 animate-pulse"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-red-500"
            }`}
            title="Speak your emergency question"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Gemma emergency questions or search survival steps..."
            className="flex-1 bg-white/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2A6F97]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isSending}
            className="p-3 rounded-2xl bg-[#2A6F97] hover:bg-[#014F86] disabled:opacity-50 text-white font-bold transition-all shadow-md cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
