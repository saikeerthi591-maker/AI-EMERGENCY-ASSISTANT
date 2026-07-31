import React, { useState, useEffect, useMemo } from "react";
import {
  HeartPulse,
  Volume2,
  Search,
  CheckCircle2,
  XCircle,
  Globe,
  ShieldAlert,
  Flame,
  AlertTriangle,
  Zap,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { FirstAidGuide as FirstAidType, Language } from "../types";
import { speakText, stopSpeaking } from "../services/speech";
import {
  FIRST_AID_TRANSLATIONS,
  FIRST_AID_GUIDES_TRANSLATIONS,
} from "../services/firstAidTranslations";
import { translateFirstAidApi } from "../services/api";

interface FirstAidGuideProps {
  guides: FirstAidType[];
}

export const FirstAidGuide: React.FC<FirstAidGuideProps> = ({
  guides,
}) => {
  const [firstAidLanguage, setFirstAidLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("firstAidLanguage");
    return (saved as Language) || "English";
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeGuideId, setActiveGuideId] = useState<string>(
    guides[0]?.id || "fa-flood"
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [dynamicTranslations, setDynamicTranslations] = useState<
    Record<string, Record<string, FirstAidType>>
  >({});

  const availableLanguages: Language[] = [
    "English",
    "Kannada",
    "Hindi",
    "Tamil",
    "Telugu",
  ];

  const t =
    FIRST_AID_TRANSLATIONS[firstAidLanguage] || FIRST_AID_TRANSLATIONS.English;

  const handleLanguageSelect = (lang: Language) => {
    setFirstAidLanguage(lang);
    localStorage.setItem("firstAidLanguage", lang);
  };

  // Categories list for filter bar
  const categories = ["All", "Flood", "Cyclone", "Earthquake", "Fire", "Burns", "CPR", "Bleeding", "Landslide"];

  // Effect to handle Gemma AI dynamic translation for custom/untranslated guides
  useEffect(() => {
    if (firstAidLanguage === "English") return;

    let isMounted = true;
    async function translateMissingGuides() {
      for (const guide of guides) {
        const hasStatic =
          FIRST_AID_GUIDES_TRANSLATIONS[firstAidLanguage]?.[guide.id];
        const hasDynamic = dynamicTranslations[guide.id]?.[firstAidLanguage];

        if (!hasStatic && !hasDynamic) {
          if (isMounted) setIsTranslating(true);
          try {
            const translated = await translateFirstAidApi(
              guide,
              firstAidLanguage
            );
            if (isMounted && translated) {
              setDynamicTranslations((prev) => ({
                ...prev,
                [guide.id]: {
                  ...(prev[guide.id] || {}),
                  [firstAidLanguage]: translated,
                },
              }));
            }
          } catch (e) {
            console.warn("Dynamic translation error:", e);
          } finally {
            if (isMounted) setIsTranslating(false);
          }
        }
      }
    }

    translateMissingGuides();

    return () => {
      isMounted = false;
    };
  }, [firstAidLanguage, guides]);

  // Compute translated guides
  const translatedGuides = useMemo(() => {
    return guides.map((guide) => {
      if (firstAidLanguage === "English") return guide;

      // 1. Static high-accuracy translation dictionary
      const staticTrans =
        FIRST_AID_GUIDES_TRANSLATIONS[firstAidLanguage]?.[guide.id];
      if (staticTrans) return staticTrans;

      // 2. Dynamic Gemma AI translation fallback
      const dynamicTrans = dynamicTranslations[guide.id]?.[firstAidLanguage];
      if (dynamicTrans) return dynamicTrans;

      return guide;
    });
  }, [guides, firstAidLanguage, dynamicTranslations]);

  // Active guide
  const activeGuide = useMemo(() => {
    return (
      translatedGuides.find((g) => g.id === activeGuideId) ||
      translatedGuides[0] ||
      null
    );
  }, [translatedGuides, activeGuideId]);

  // Filtered guides based on search & category
  const filteredGuides = useMemo(() => {
    return translatedGuides.filter((g) => {
      const matchesSearch =
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryKey = g.category.toLowerCase();
      let matchesCategory = selectedCategory === "All";
      
      if (selectedCategory === "Flood") {
        matchesCategory = g.id === "fa-flood" || categoryKey.includes("flood") || categoryKey.includes("ಪ್ರವಾಹ") || categoryKey.includes("बाढ़") || categoryKey.includes("வெள்ளம்") || categoryKey.includes("వరద");
      } else if (selectedCategory === "Cyclone") {
        matchesCategory = g.id === "fa-cyclone" || categoryKey.includes("cyclone") || categoryKey.includes("ಚಂಡಮಾರುತ") || categoryKey.includes("चक्रवात") || categoryKey.includes("சூறாவளி") || categoryKey.includes("తుఫాను");
      } else if (selectedCategory === "Earthquake") {
        matchesCategory = g.id === "fa-earthquake" || categoryKey.includes("earthquake") || categoryKey.includes("ಭೂಕಂಪ") || categoryKey.includes("भूकंप") || categoryKey.includes("நிலநடுக்கம்") || categoryKey.includes("భూకంపం");
      } else if (selectedCategory === "Fire") {
        matchesCategory = g.id === "fa-fire" || categoryKey.includes("fire") || categoryKey.includes("ಬೆಂಕಿ") || categoryKey.includes("आग") || categoryKey.includes("தீ") || categoryKey.includes("అగ్ని");
      } else if (selectedCategory === "Burns") {
        matchesCategory = g.id === "fa-burns" || categoryKey.includes("burn") || categoryKey.includes("ಸುಟ್ಟ") || categoryKey.includes("जलन") || categoryKey.includes("தீக்காய") || categoryKey.includes("కాలిన");
      } else if (selectedCategory === "CPR") {
        matchesCategory = g.id === "fa-cpr" || categoryKey.includes("cpr") || categoryKey.includes("ಸಿಪಿಆರ್") || categoryKey.includes("सीपीआर") || categoryKey.includes("சிபிஆர்") || categoryKey.includes("సిపిఆర్");
      } else if (selectedCategory === "Bleeding") {
        matchesCategory = g.id === "fa-bleeding" || categoryKey.includes("bleed") || categoryKey.includes("ರಕ್ತಸ್ರಾವ") || categoryKey.includes("रक्तस्राव") || categoryKey.includes("ரத்தப்போக்கு") || categoryKey.includes("రక్తస్రావం");
      } else if (selectedCategory === "Landslide") {
        matchesCategory = g.id === "fa-landslide" || categoryKey.includes("landslide") || categoryKey.includes("ಭೂಕುಸಿತ") || categoryKey.includes("भूस्खलन") || categoryKey.includes("நிலச்சரிவு") || categoryKey.includes("కొండచరియలు");
      }

      return matchesSearch && matchesCategory;
    });
  }, [translatedGuides, searchTerm, selectedCategory]);

  const handleSpeakGuide = (guide: FirstAidType) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      let script = `${guide.title}. ${guide.summary}. ${t.labels.actionPlanLabel}: ${guide.steps.join(". ")}.`;
      if (guide.emergencyDoList?.length) {
        script += ` ${t.labels.alwaysDo}: ${guide.emergencyDoList.join(". ")}.`;
      }
      if (guide.emergencyDontList?.length) {
        script += ` ${t.labels.neverDo}: ${guide.emergencyDontList.join(". ")}.`;
      }
      speakText(script, firstAidLanguage);
    }
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat !== "All") {
      const match = translatedGuides.find((g) => {
        if (cat === "Flood") return g.id === "fa-flood";
        if (cat === "Cyclone") return g.id === "fa-cyclone";
        if (cat === "Earthquake") return g.id === "fa-earthquake";
        if (cat === "Fire") return g.id === "fa-fire";
        if (cat === "Burns") return g.id === "fa-burns";
        if (cat === "CPR") return g.id === "fa-cpr";
        if (cat === "Bleeding") return g.id === "fa-bleeding";
        if (cat === "Landslide") return g.id === "fa-landslide";
        return true;
      });
      if (match) setActiveGuideId(match.id);
    }
  };

  // Category determination helpers for specialized rendering blocks
  const isBeforeDuringAfter =
    activeGuide?.id === "fa-flood" ||
    activeGuide?.id === "fa-earthquake" ||
    activeGuide?.id === "fa-cyclone" ||
    activeGuide?.id === "fa-fire" ||
    activeGuide?.id === "fa-landslide" ||
    activeGuide?.category.toLowerCase().includes("flood") ||
    activeGuide?.category.toLowerCase().includes("earthquake") ||
    activeGuide?.category.toLowerCase().includes("cyclone") ||
    activeGuide?.category.toLowerCase().includes("fire") ||
    activeGuide?.category.toLowerCase().includes("landslide");

  const isBurns =
    activeGuide?.id === "fa-burns" ||
    activeGuide?.category.toLowerCase().includes("burn") ||
    activeGuide?.category.toLowerCase().includes("ಸುಟ್ಟ") ||
    activeGuide?.category.toLowerCase().includes("जलन");

  const isCPR =
    activeGuide?.id === "fa-cpr" ||
    activeGuide?.category.toLowerCase().includes("cpr") ||
    activeGuide?.category.toLowerCase().includes("ಸಿಪಿಆರ್");

  const isBleeding =
    activeGuide?.id === "fa-bleeding" ||
    activeGuide?.category.toLowerCase().includes("bleed") ||
    activeGuide?.category.toLowerCase().includes("ರಕ್ತಸ್ರಾವ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Banner with Multilingual Selector */}
      <div className="glass-card-light dark:glass-card-dark p-6 rounded-[24px] border border-white/60 dark:border-white/10 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>100% Offline Disaster Medical Guide</span>
            {isTranslating && (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold ml-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                {t.labels.gemmaTranslating}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            {t.labels.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
            {t.labels.subtitle}
          </p>
        </div>

        {/* Top-Right Controls: Language Selector & Search */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Multilingual Selector Dropdown */}
          <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-950 border border-emerald-500/40 rounded-2xl px-3.5 py-2 shadow-sm ring-2 ring-emerald-500/10">
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 hidden sm:inline">
              {t.labels.selectLanguage}:
            </span>
            <select
              value={firstAidLanguage}
              onChange={(e) => {
                const lang = e.target.value as Language;
                handleLanguageSelect(lang);
              }}
              className="bg-transparent text-xs font-black text-emerald-700 dark:text-emerald-400 focus:outline-none cursor-pointer pr-1"
            >
              {availableLanguages.map((lang) => (
                <option
                  key={lang}
                  value={lang}
                  className="text-slate-800 dark:bg-slate-900 font-bold"
                >
                  {lang === "Kannada"
                    ? "ಕನ್ನಡ (Kannada)"
                    : lang === "Hindi"
                    ? "हिंदी (Hindi)"
                    : lang === "Tamil"
                    ? "தமிழ் (Tamil)"
                    : lang === "Telugu"
                    ? "తెలుగు (Telugu)"
                    : "English"}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.labels.searchPlaceholder}
              className="w-full bg-white/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              selectedCategory === cat
                ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/30"
                : "bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t.categoryNames[cat] || cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Active Guide & Sidebar List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeGuide ? (
          <div className="lg:col-span-2 glass-card-light dark:glass-card-dark border-2 border-emerald-500/40 rounded-[24px] p-6 shadow-xl space-y-6">
            {/* Guide Title Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-black uppercase border border-emerald-200 dark:border-emerald-800">
                  {activeGuide.category} {t.labels.protocolSuffix}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mt-1.5 tracking-tight">
                  {activeGuide.title}
                </h3>
              </div>

              <button
                onClick={() => handleSpeakGuide(activeGuide)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 text-xs font-black transition-colors cursor-pointer shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>
                  {isSpeaking ? t.labels.stopVoice : t.labels.readAloud}
                </span>
              </button>
            </div>

            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 bg-emerald-50/50 dark:bg-slate-950 p-4 rounded-2xl border border-emerald-100 dark:border-slate-800 leading-relaxed font-medium">
              {activeGuide.summary}
            </p>

            {/* 🌊 Flood & 🌎 Earthquake Disaster Sections (Before, During, After, Emergency Steps) */}
            {isBeforeDuringAfter && (
              <div className="space-y-6">
                {/* Before, During, After Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Before */}
                  <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> {t.labels.beforeLabel}
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                      {(activeGuide.beforeList || activeGuide.steps.slice(0, 2)).map(
                        (item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* During */}
                  <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-black text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> {t.labels.duringLabel}
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                      {(activeGuide.duringList || activeGuide.steps.slice(1, 3)).map(
                        (item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-600 dark:text-rose-400 font-bold">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* After */}
                  <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-black text-blue-800 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> {t.labels.afterLabel}
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                      {(activeGuide.afterList || activeGuide.steps.slice(3)).map(
                        (item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Emergency Steps (Drowning / Water Safety / Hypothermia or Trapped Rescue) */}
                {activeGuide.emergencySteps && (
                  <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 border border-slate-800">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>{t.labels.emergencyStepsLabel}</span>
                    </h4>
                    <div className="space-y-2">
                      {activeGuide.emergencySteps.map((stepItem, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-200 font-medium leading-relaxed"
                        >
                          {stepItem}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 🔥 Burns Emergency Section (Types, First Aid, Warning Signs) */}
            {isBurns && (
              <div className="space-y-6">
                {/* Burn Types */}
                {activeGuide.burnTypes && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4 rounded-2xl space-y-2">
                      <h4 className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-amber-500" />
                        <span>{t.labels.minorBurnsLabel}</span>
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-200 font-medium">
                        {activeGuide.burnTypes.minor.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 p-4 rounded-2xl space-y-2">
                      <h4 className="text-xs font-black text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-rose-600" />
                        <span>{t.labels.severeBurnsLabel}</span>
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-200 font-medium">
                        {activeGuide.burnTypes.severe.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* First Aid Steps */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t.labels.actionPlanLabel}:
                  </h4>
                  <div className="space-y-2">
                    {activeGuide.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-white/90 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                      >
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warning Signs */}
                {activeGuide.warningSigns && (
                  <div className="bg-rose-100/80 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-black text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t.labels.warningSignsLabel}</span>
                    </h4>
                    <ul className="space-y-1 text-xs text-rose-900 dark:text-rose-200 font-medium">
                      {activeGuide.warningSigns.map((ws, idx) => (
                        <li key={idx}>⚠️ {ws}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ❤️ CPR Emergency Section (Adult, Child, Infant visual step cards) */}
            {isCPR && (
              <div className="space-y-6">
                {/* Step Cards for Adult, Child, Infant CPR */}
                {activeGuide.cprVariants && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeGuide.cprVariants.map((variant, idx) => (
                      <div
                        key={idx}
                        className="bg-white/90 dark:bg-slate-950 border border-emerald-500/30 p-4 rounded-2xl space-y-3 shadow-md"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                          <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            {variant.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {variant.target}
                          </span>
                        </div>
                        <div className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300 bg-emerald-50 dark:bg-slate-900 p-2 rounded-xl text-center">
                          Ratio: {variant.ratio}
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                          {variant.instructions.map((inst, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{inst}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step-by-Step Overview */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t.labels.actionPlanLabel}:
                  </h4>
                  <div className="space-y-2">
                    {activeGuide.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-white/90 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                      >
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 🩸 Bleeding Emergency Section */}
            {isBleeding && (
              <div className="space-y-6">
                {/* Steps */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t.labels.actionPlanLabel}:
                  </h4>
                  <div className="space-y-2">
                    {activeGuide.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-white/90 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                      >
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Severe Bleeding Warnings */}
                {activeGuide.severeWarnings && (
                  <div className="bg-rose-100/80 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-black text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t.labels.severeWarningsLabel}</span>
                    </h4>
                    <ul className="space-y-1 text-xs text-rose-900 dark:text-rose-200 font-medium">
                      {activeGuide.severeWarnings.map((sw, idx) => (
                        <li key={idx}>🚨 {sw}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Fallback for standard steps if no specific category component matched */}
            {!isBeforeDuringAfter && !isBurns && !isCPR && !isBleeding && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.labels.actionPlanLabel}:
                </h4>
                <div className="space-y-2">
                  {activeGuide.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-white/90 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DOs & DON'Ts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {t.labels.alwaysDo}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {activeGuide.emergencyDoList.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> {t.labels.neverDo}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {activeGuide.emergencyDontList.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 text-center p-12 text-slate-500 glass-card-light dark:glass-card-dark rounded-[24px] border border-slate-200 dark:border-slate-800">
            Select a topic to view first aid instructions.
          </div>
        )}

        {/* Sidebar List of All Survival Guides */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t.labels.allGuides} ({filteredGuides.length})
          </h3>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => setActiveGuideId(guide.id)}
                className={`p-4 rounded-[20px] border cursor-pointer transition-all ${
                  activeGuide?.id === guide.id
                    ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                    : "glass-card-light dark:glass-card-dark border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {guide.category}
                  </span>
                  <HeartPulse className="w-4 h-4 text-emerald-500" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">
                  {guide.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {guide.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
