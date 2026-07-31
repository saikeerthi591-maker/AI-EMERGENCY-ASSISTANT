import React from "react";
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  LifeBuoy,
  MessageSquareCode,
  Camera,
  HeartPulse,
  ShieldAlert,
  MapPin,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Activity,
  Users,
  Compass,
} from "lucide-react";
import { motion } from "motion/react";
import { TabType } from "./Navigation";
import {
  DisasterAlert,
  SafeShelter,
  RescueRequest,
  IncidentReport,
} from "../types";

import { Language } from "../types";
import { getTranslation } from "../services/translations";

interface HomeScreenProps {
  onSelectTab: (tab: TabType) => void;
  alerts: DisasterAlert[];
  shelters: SafeShelter[];
  rescues: RescueRequest[];
  incidents: IncidentReport[];
  isOnline: boolean;
  userLocation: { lat: number; lng: number; address: string } | null;
  isDarkMode?: boolean;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  onOpenProfile?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectTab,
  alerts,
  shelters,
  rescues,
  incidents,
  isOnline,
  userLocation,
  isDarkMode = false,
  language = "English",
  onLanguageChange,
  onOpenProfile,
}) => {
  const primaryAlert = alerts[0];
  const t = getTranslation((language as Language) || "English");

  const quickActions = [
    {
      id: "shelters",
      title: t.findShelter,
      desc: t.findShelterDesc,
      icon: Building2,
      color: "bg-[#5B7CFA]/10 text-[#5B7CFA] border-[#5B7CFA]/20",
    },
    {
      id: "sos",
      title: t.sosButton,
      desc: "Instant alert to emergency contacts & rescue squads",
      icon: AlertCircle,
      color: "bg-[#E53935]/10 text-[#E53935] border-[#E53935]/20",
      highlight: true,
    },
    {
      id: "reporting",
      title: t.reportHazard,
      desc: t.reportHazardDesc,
      icon: Camera,
      color: "bg-[#F4A261]/10 text-[#F4A261] border-[#F4A261]/20",
    },
    {
      id: "firstaid",
      title: t.firstAidGuide,
      desc: t.firstAidDesc,
      icon: HeartPulse,
      color: "bg-[#46C37B]/10 text-[#46C37B] border-[#46C37B]/20",
    },
    {
      id: "rescue",
      title: t.rescueTriage,
      desc: t.rescueDesc,
      icon: LifeBuoy,
      color: "bg-[#B89AE7]/10 text-[#B89AE7] border-[#B89AE7]/20",
    },
    {
      id: "chat",
      title: t.aiChatbot,
      desc: t.aiChatbotDesc,
      icon: MessageSquareCode,
      color: "bg-[#5B7CFA]/10 text-[#5B7CFA] border-[#5B7CFA]/20",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Hero Floating Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`relative overflow-hidden rounded-[28px] p-6 sm:p-8 backdrop-blur-2xl transition-all ${
          isDarkMode
            ? "bg-gradient-to-br from-[#1E2028]/95 via-[#22252D]/90 to-[#15161B] border border-white/10 shadow-2xl text-white"
            : "bg-white/85 border border-white/80 text-[#2D2D2D] shadow-xl shadow-purple-900/5"
        }`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/20 text-xs font-bold tracking-wide">
              <ShieldAlert className="w-4 h-4 animate-pulse text-[#E53935]" />
              <span>AI EMERGENCY RESPONSE PLATFORM</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
              {t.heroTitle}
            </h1>

            <p className="text-xs sm:text-sm text-[#757575] dark:text-slate-300 leading-relaxed font-medium">
              {t.heroSub}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-semibold text-[#757575] dark:text-slate-400">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[#5B7CFA] border border-slate-200/50 dark:border-white/10 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Manage Location in Profile"
              >
                <MapPin className="w-3.5 h-3.5 text-[#5B7CFA]" />
                <span>📍 {userLocation?.address || "Bengaluru, Karnataka"}</span>
              </button>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[#46C37B] border border-slate-200/50 dark:border-white/10">
                <Activity className="w-3.5 h-3.5 text-[#46C37B]" />
                {isOnline ? t.online : t.offline}
              </span>
            </div>
          </div>

          {/* Quick Hero Floating SOS Launcher */}
          <div
            className={`p-5 rounded-[24px] text-center space-y-3 min-w-[260px] w-full lg:w-auto ${
              isDarkMode
                ? "bg-[#15161B]/90 border border-red-500/30"
                : "bg-red-50/60 border border-red-200/80 shadow-xs"
            }`}
          >
            <span className="text-xs font-extrabold text-[#E53935] uppercase tracking-wider block">
              Emergency Signal
            </span>
            <button
              onClick={() => onSelectTab("sos")}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E53935] to-[#FF6B6B] hover:from-[#d32f2f] hover:to-[#e53935] text-white font-extrabold text-base shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <AlertCircle className="w-5 h-5 animate-bounce" />
              <span>ACTIVATE SOS</span>
            </button>
            <span className="text-[11px] text-[#757575] font-medium block">
              Dispatches GPS location to contacts
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. Active Disaster Spotlight Banner */}
      {primaryAlert && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className={`p-6 rounded-[24px] border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg ${
            isDarkMode
              ? "bg-[#22252D]/90 border-[#E53935]/40 text-white"
              : "bg-white/90 border-red-300/80 text-[#2D2D2D] shadow-red-900/5"
          }`}
        >
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#E53935]/10 text-[#E53935] text-xs font-extrabold uppercase border border-[#E53935]/20">
                🔴 {primaryAlert.disasterType} • {primaryAlert.severity} Severity
              </span>
              <span className="text-xs text-[#757575] font-semibold">
                {primaryAlert.timestamp}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold">
              {primaryAlert.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#757575] dark:text-slate-300 leading-relaxed line-clamp-2">
              {primaryAlert.summaryText}
            </p>
          </div>

          <button
            onClick={() => onSelectTab("alerts")}
            className="px-5 py-2.5 rounded-full bg-[#5B7CFA] hover:bg-[#4665E0] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Full AI Alert</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* 3. Quick Action Grid (SaaS Floating Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#757575] uppercase tracking-wider">
            Quick Action Modules
          </h2>
          <span className="text-xs text-[#5B7CFA] font-bold cursor-pointer hover:underline">
            View All
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onSelectTab(action.id as TabType)}
                className={`p-6 rounded-[24px] cursor-pointer transition-all flex flex-col justify-between space-y-4 group ${
                  isDarkMode
                    ? "glass-card-dark"
                    : "glass-card-light"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-2xl border flex items-center justify-center ${action.color}`}
                  >
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#757575] group-hover:text-[#5B7CFA] group-hover:translate-x-1 transition-all" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#2D2D2D] dark:text-white group-hover:text-[#5B7CFA] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-[#757575] dark:text-slate-400 mt-1 leading-relaxed font-medium">
                    {action.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. Shelter & Community Incident Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Nearby Shelters Mini-Card */}
        <div
          className={`p-6 rounded-[24px] space-y-4 ${
            isDarkMode ? "glass-card-dark" : "glass-card-light"
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-200/20">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#46C37B]" />
              <h3 className="font-extrabold text-sm text-[#2D2D2D] dark:text-white">
                Nearest Evacuation Shelters
              </h3>
            </div>
            <button
              onClick={() => onSelectTab("shelters")}
              className="text-xs font-bold text-[#5B7CFA] hover:underline"
            >
              Open Map →
            </button>
          </div>

          <div className="space-y-3">
            {shelters.slice(0, 2).map((shelter) => (
              <div
                key={shelter.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-[#2D2D2D] dark:text-white">
                    {shelter.name}
                  </h4>
                  <p className="text-[11px] text-[#757575] mt-0.5">
                    {shelter.address} • {shelter.distanceKm} km away
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#46C37B]/10 text-[#46C37B]">
                  {shelter.capacity - shelter.occupied} Open Slots
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Preparedness Tips Mini-Card */}
        <div
          className={`p-6 rounded-[24px] space-y-4 ${
            isDarkMode ? "glass-card-dark" : "glass-card-light"
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-200/20">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-[#B89AE7]" />
              <h3 className="font-extrabold text-sm text-[#2D2D2D] dark:text-white">
                First Aid & Preparedness
              </h3>
            </div>
            <button
              onClick={() => onSelectTab("firstaid")}
              className="text-xs font-bold text-[#5B7CFA] hover:underline"
            >
              Manual →
            </button>
          </div>

          <div className="space-y-2.5 text-xs text-[#757575] dark:text-slate-300">
            <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-white/5 border border-purple-100 dark:border-white/10 flex items-start gap-2">
              <span className="p-1 rounded-full bg-[#5B7CFA] text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p className="font-medium">
                Keep emergency food, 3L drinking water per person, flashlight, and medical kit near exit doors.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-white/5 border border-purple-100 dark:border-white/10 flex items-start gap-2">
              <span className="p-1 rounded-full bg-[#5B7CFA] text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p className="font-medium">
                In floods, disconnect main circuit breaker immediately and move to higher floors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

