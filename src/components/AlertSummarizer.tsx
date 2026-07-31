import React, { useState } from "react";
import {
  AlertTriangle,
  Volume2,
  Mic,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Globe,
  ShieldAlert,
  Radio,
} from "lucide-react";
import { motion } from "motion/react";
import { DisasterAlert, Language } from "../types";
import { summarizeAlertApi } from "../services/api";
import { speakText, startVoiceRecognition, stopSpeaking } from "../services/speech";
import { saveToStore } from "../services/db";

interface AlertSummarizerProps {
  alerts: DisasterAlert[];
  onAddNewAlert: (alert: DisasterAlert) => void;
  currentLanguage: Language;
}

export const AlertSummarizer: React.FC<AlertSummarizerProps> = ({
  alerts,
  onAddNewAlert,
  currentLanguage,
}) => {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLanguage);
  const [activeAlert, setActiveAlert] = useState<DisasterAlert | null>(alerts[0] || null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // Sync selected language when global language prop changes
  React.useEffect(() => {
    if (currentLanguage && currentLanguage !== selectedLanguage) {
      setSelectedLanguage(currentLanguage);
      if (activeAlert) {
        translateActiveAlert(activeAlert, currentLanguage);
      }
    }
  }, [currentLanguage]);

  // Translate active alert into a specific language using AI
  const translateActiveAlert = async (alertToTranslate: DisasterAlert, lang: Language) => {
    const rawToUse = alertToTranslate.rawText || alertToTranslate.summaryText;
    if (!rawToUse) return;

    setIsTranslating(true);
    try {
      const summaryData = await summarizeAlertApi(rawToUse, lang);
      const translatedAlert: DisasterAlert = {
        ...alertToTranslate,
        disasterType: summaryData.disasterType || alertToTranslate.disasterType,
        title: (summaryData.disasterType || alertToTranslate.disasterType) + " Warning",
        affectedAreas: summaryData.affectedAreas || alertToTranslate.affectedAreas,
        importantSafetyInstructions:
          summaryData.importantSafetyInstructions || alertToTranslate.importantSafetyInstructions,
        summaryText: summaryData.summaryText || alertToTranslate.summaryText,
        language: lang,
      };

      setActiveAlert(translatedAlert);
    } catch (err) {
      console.error("Alert translation failed:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageSelect = (newLang: Language) => {
    setSelectedLanguage(newLang);
    if (activeAlert) {
      translateActiveAlert(activeAlert, newLang);
    }
  };

  // Sample raw alert templates for quick testing
  const sampleFeeds = [
    {
      title: "Flash Flood Surge Warning - Vrishabhavathi Basin",
      text: "URGENT FLASH FLOOD WARNING: Unprecedented heavy rainfall of 185mm recorded in 6 hours. Rivers overflowing in Sector 4 and surrounding lowlands. All residents on ground floors must move to higher levels or St. Jude Shelter immediately. Turn off electrical supply panels before leaving.",
    },
    {
      title: "Cyclone Advisory - Gusts 95 km/h",
      text: "SEVERE CYCLONE ALERT: Category 2 cyclone making landfall. Wind speeds exceeding 95 km/h with torrential rain and heavy lightning. Stay indoors away from glass windows and balcony doors. Charge flashlights now.",
    },
    {
      title: "Chemical Industrial Gas Leak Emergency",
      text: "INDUSTRIAL HAZARD NOTICE: Chlor-alkali leak reported at Phase 2 Industrial Corridor. Toxic plume spreading South-East. Cover nose and mouth with wet cloth immediately. Keep doors and windows tightly shut.",
    },
  ];

  const handleSummarize = async (textToUse?: string) => {
    const raw = textToUse || inputText;
    if (!raw.trim()) return;

    setIsAnalyzing(true);
    try {
      const summaryData = await summarizeAlertApi(raw, selectedLanguage);

      const newAlert: DisasterAlert = {
        id: "alert-" + Date.now(),
        title: summaryData.disasterType + " Warning",
        rawText: raw,
        disasterType: summaryData.disasterType || "Disaster Emergency",
        severity: summaryData.severity || "High",
        affectedAreas: summaryData.affectedAreas || ["Local Region"],
        importantSafetyInstructions:
          summaryData.importantSafetyInstructions || ["Follow local safety guidelines."],
        summaryText: summaryData.summaryText || raw.slice(0, 150),
        timestamp: new Date().toLocaleString(),
        source: "AI Disaster Analysis Engine",
        language: selectedLanguage,
      };

      await saveToStore("alerts", newAlert);
      onAddNewAlert(newAlert);
      setActiveAlert(newAlert);
      setInputText("");
    } catch (err) {
      console.error("Summarizer Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    startVoiceRecognition({
      lang: selectedLanguage,
      onResult: (text) => {
        setInputText(text);
        setIsRecording(false);
        // Automatically analyze & generate alert in the chosen language!
        if (text.trim()) {
          handleSummarize(text);
        }
      },
      onError: () => setIsRecording(false),
      onEnd: () => setIsRecording(false),
    });
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, selectedLanguage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Banner Header */}
      <div className="glass-card-light dark:glass-card-dark p-6 rounded-[24px] border border-white/60 dark:border-white/10 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemma Powered AI Alert Analyzer</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Disaster Alert Summarizer & Translator
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
            Paste raw weather alerts or news bulletins. Gemma condenses them into clear safety instructions under 100 words with multi-language support.
          </p>
        </div>

        {/* Language Selection Bar */}
        <div className="flex items-center gap-2.5 bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Globe className="w-4 h-4 text-[#2A6F97] dark:text-cyan-400 ml-1" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Translate To:
          </span>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageSelect(e.target.value as Language)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2A6F97]"
          >
            <option value="English">English</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Malayalam">Malayalam (മലയാളം)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Spanish">Spanish (Español)</option>
            <option value="French">French (Français)</option>
          </select>
        </div>
      </div>

      {/* Input Form & Quick Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card-light dark:glass-card-dark rounded-[24px] p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Paste Raw Disaster Alert or News Text:
            </label>
            <button
              onClick={handleVoiceInput}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                isRecording
                  ? "bg-red-500 text-white border-red-400 animate-pulse"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-red-500"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecording ? "Listening..." : "Voice Input"}</span>
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. URGENT FLASH FLOOD ALERT: Heavy rainfall of 180mm recorded over Vrishabhavathi basin. Residents in Sector 4 must move to St. Jude shelter..."
            rows={4}
            className="w-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#2A6F97] transition-colors shadow-inner"
          />

          <div className="flex justify-end">
            <button
              onClick={() => handleSummarize()}
              disabled={isAnalyzing || !inputText.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E53935] hover:bg-red-600 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing with Gemma...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Summarize Alert</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Sample Feeds */}
        <div className="glass-card-light dark:glass-card-dark rounded-[24px] p-6 shadow-lg space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-red-500" />
            <span>Simulate Live Feeds:</span>
          </h3>
          {sampleFeeds.map((feed, idx) => (
            <div
              key={idx}
              onClick={() => {
                setInputText(feed.text);
                handleSummarize(feed.text);
              }}
              className="p-3.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 hover:border-red-400 rounded-2xl cursor-pointer transition-all group shadow-sm hover:shadow-md"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-red-500 transition-colors">
                {feed.title}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {feed.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI SUMMARY DISPLAY CARD */}
      {activeAlert && (
        <div className="glass-card-light dark:glass-card-dark border-2 border-red-500/30 rounded-[24px] p-6 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  activeAlert.severity === "Critical"
                    ? "bg-red-100 text-red-600 border border-red-200 dark:bg-red-950/80 dark:text-red-400 animate-pulse"
                    : activeAlert.severity === "High"
                    ? "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-400"
                    : "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950/80 dark:text-blue-400"
                }`}
              >
                Severity: {activeAlert.severity}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Type: <strong className="text-slate-900 dark:text-white">{activeAlert.disasterType}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {isTranslating && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold border border-cyan-200 dark:border-cyan-800 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Translating AI Emergency Assistant...</span>
                </div>
              )}

              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <Globe className="w-3.5 h-3.5 text-[#2A6F97]" />
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Quick:</span>
                {(["English", "Kannada", "Hindi", "Tamil", "Telugu"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    disabled={isTranslating}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                      (activeAlert.language || selectedLanguage) === lang
                        ? "bg-[#2A6F97] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  handleSpeak(
                    activeAlert.summaryText +
                      ". " +
                      activeAlert.importantSafetyInstructions.join(". ")
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-[#2A6F97] dark:text-cyan-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? "Stop Voice" : "Read Aloud"}</span>
              </button>
            </div>
          </div>

          {/* Core Summary Text (< 100 words) */}
          <div className="bg-white/80 dark:bg-slate-950/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-inner">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              AI Summary (&lt; 100 Words - {activeAlert.language || selectedLanguage}):
            </h4>
            <p className="text-sm md:text-base text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
              {activeAlert.summaryText}
            </p>
          </div>

          {/* Affected Areas & Instructions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Affected Areas */}
            <div className="bg-white/60 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                📍 Affected Zones / Areas:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeAlert.affectedAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Safety Instructions */}
            <div className="bg-white/60 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                🛡️ Important Safety Instructions:
              </h4>
              <ul className="space-y-1.5">
                {activeAlert.importantSafetyInstructions.map((instruction, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-500 font-mono">
            Analyzed: {activeAlert.timestamp} | Source: {activeAlert.source}
          </div>
        </div>
      )}

      {/* Historical Alert Feed */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Active Disaster Alert History ({alerts.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setActiveAlert(alert)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeAlert?.id === alert.id
                  ? "bg-white dark:bg-slate-800 border-red-500 shadow-md"
                  : "glass-card-light dark:glass-card-dark border-slate-200 dark:border-slate-800 hover:border-slate-400"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-500">{alert.disasterType}</span>
                <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">
                {alert.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                {alert.summaryText}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
