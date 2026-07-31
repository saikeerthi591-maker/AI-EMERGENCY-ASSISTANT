import React, { useState } from "react";
import {
  Settings,
  Users,
  Bell,
  Moon,
  Sun,
  Database,
  Eye,
  Info,
  Trash2,
  Mail,
  X,
  Check,
  RefreshCw,
  ShieldCheck,
  Volume2,
  Mic,
  Star,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import { EmergencyContact, NotificationSettings, AccessibilitySettings } from "../types";
import { saveToStore, deleteFromStore, clearAllStores } from "../services/db";

interface SettingsModalProps {
  onClose: () => void;
  contacts: EmergencyContact[];
  onUpdateContacts: (contacts: EmergencyContact[]) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onTriggerSync?: () => void;
}

type SettingCategory =
  | "contacts"
  | "notifications"
  | "appearance font"
  | "appearance"
  | "offline"
  | "accessibility"
  | "about";

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  contacts,
  onUpdateContacts,
  isDarkMode,
  onToggleDarkMode,
  onTriggerSync,
}) => {
  const [activeTab, setActiveTab] = useState<SettingCategory>("contacts");

  // Contacts Form state
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Family");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [targetGmail, setTargetGmail] = useState(() => {
    return localStorage.getItem("sos_target_gmail") || "nehapkolagada@gmail.com";
  });
  const [gmailSaved, setGmailSaved] = useState(false);

  // Notification Toggles State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    disasterAlerts: true,
    weatherAlerts: true,
    communityReports: true,
    browserNotifications: true,
    sosStatusUpdates: true,
  });

  // Accessibility Toggles State
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    voiceNavigation: false,
    textToSpeech: true,
    speechToText: false,
    highContrastMode: false,
    largeText: false,
  });

  const [cacheCleared, setCacheCleared] = useState(false);

  const handleSaveGmail = () => {
    localStorage.setItem("sos_target_gmail", targetGmail.trim());
    setGmailSaved(true);
    setTimeout(() => setGmailSaved(false), 2000);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newContact: EmergencyContact = {
      id: "c-" + Date.now(),
      name,
      relation,
      email,
      phone,
      isPrimary: contacts.length === 0,
    };

    await saveToStore("contacts", newContact);
    onUpdateContacts([...contacts, newContact]);

    setName("");
    setEmail("");
    setPhone("");
  };

  const handleDeleteContact = async (id: string) => {
    await deleteFromStore("contacts", id);
    onUpdateContacts(contacts.filter((c) => c.id !== id));
  };

  const handleSetPrimaryContact = async (id: string) => {
    const updated = contacts.map((c) => ({
      ...c,
      isPrimary: c.id === id,
    }));
    onUpdateContacts(updated);
    for (const c of updated) {
      await saveToStore("contacts", c);
    }
  };

  const handleClearCache = async () => {
    if (window.confirm("Clear offline storage cache? Local disaster data will reload on next online sync.")) {
      await clearAllStores();
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 3000);
    }
  };

  const toggleNotif = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAccess = (key: keyof AccessibilitySettings) => {
    setAccessibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="glass-card-light dark:glass-card-dark rounded-[24px] max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-white/80 dark:border-white/10"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg">
            <Settings className="w-5 h-5 text-[#E53935]" />
            <span>Emergency Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Sidebar Tabs */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navigation Category Sidebar */}
          <div className="w-full md:w-52 bg-slate-50/80 dark:bg-slate-950/60 p-3 border-r border-slate-200 dark:border-slate-800 space-y-1 flex md:flex-col overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab("contacts")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "contacts"
                  ? "bg-[#E53935] text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Contacts</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-[#E53935] text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "appearance"
                  ? "bg-[#E53935] text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
            >
              <Moon className="w-4 h-4 shrink-0" />
              <span>Appearance</span>
            </button>

            <button
              onClick={() => setActiveTab("offline")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "offline"
                  ? "bg-[#E53935] text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>Offline Data</span>
            </button>

            <button
              onClick={() => setActiveTab("accessibility")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "accessibility"
                  ? "bg-[#E53935] text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>Accessibility</span>
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "about"
                  ? "bg-[#E53935] text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
            >
              <Info className="w-4 h-4 shrink-0" />
              <span>About App</span>
            </button>
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* 1. EMERGENCY CONTACTS */}
            {activeTab === "contacts" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#E53935]" />
                    <span>👥 Emergency Contacts & Target SOS</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage trusted contacts who receive immediate GPS location signals when One-Tap SOS is fired.
                  </p>
                </div>

                {/* Primary SOS Target Email */}
                <div className="bg-rose-50/80 dark:bg-slate-950 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#E53935] uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span>Target SOS Email ID</span>
                    </label>
                    {gmailSaved && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        ✓ Saved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="email"
                      value={targetGmail}
                      onChange={(e) => setTargetGmail(e.target.value)}
                      placeholder="e.g. nehapkolagada@gmail.com"
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#E53935] font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSaveGmail}
                      className="px-4 py-2.5 bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                    >
                      Save Email
                    </button>
                  </div>
                </div>

                {/* Contacts List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Saved Contacts ({contacts.length})
                  </h4>

                  <div className="space-y-2">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs shadow-sm"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 dark:text-white">
                              {contact.name}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">
                              {contact.relation}
                            </span>
                            {contact.isPrimary && (
                              <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#E53935] text-[10px] font-bold">
                                ★ Primary SOS
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-3">
                            {contact.phone && <span>📞 {contact.phone}</span>}
                            {contact.email && <span>✉️ {contact.email}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!contact.isPrimary && (
                            <button
                              onClick={() => handleSetPrimaryContact(contact.id)}
                              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                            >
                              Make Primary
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 cursor-pointer"
                            title="Delete contact"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Contact Form */}
                <form
                  onSubmit={handleAddContact}
                  className="bg-white/90 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm"
                >
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    + Add New Emergency Contact
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name e.g. Priya Sharma"
                      required
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      placeholder="Relation e.g. Sister, Doctor"
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email for SOS alerts"
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      required
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Save Emergency Contact
                  </button>
                </form>
              </div>
            )}

            {/* 2. NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#E53935]" />
                    <span>🔔 Emergency Notifications</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Select which critical safety broadcasts and warnings you wish to receive.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      key: "disasterAlerts",
                      title: "Disaster Alerts",
                      desc: "Instant warning for floods, cyclones, landslides and severe weather.",
                    },
                    {
                      key: "weatherAlerts",
                      title: "Weather Alerts",
                      desc: "Monsoon forecasts, rainfall accumulation, and flood stage updates.",
                    },
                    {
                      key: "communityReports",
                      title: "Community Reports",
                      desc: "Verified local hazard reports from neighboring citizens.",
                    },
                    {
                      key: "browserNotifications",
                      title: "Browser Push Notifications",
                      desc: "Background desktop alert popups when app is minimized.",
                    },
                    {
                      key: "sosStatusUpdates",
                      title: "SOS Status Updates",
                      desc: "Confirmation when rescue team receives your emergency signal.",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      onClick={() => toggleNotif(item.key as keyof NotificationSettings)}
                      className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-[#5B7CFA]/50 transition-all"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>

                      <div
                        className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${
                          notifications[item.key as keyof NotificationSettings]
                            ? "bg-[#46C37B]"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            notifications[item.key as keyof NotificationSettings]
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. APPEARANCE */}
            {activeTab === "appearance" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                    <Moon className="w-4 h-4 text-[#5B7CFA]" />
                    <span>🌙 Appearance & Theme</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Choose visual contrast levels optimized for day or night emergency operations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      if (isDarkMode) onToggleDarkMode();
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      !isDarkMode
                        ? "bg-white border-[#5B7CFA] ring-2 ring-[#5B7CFA]/20 shadow-md"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                        Light Mode
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Clean soft lavender & white canvas
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      if (!isDarkMode) onToggleDarkMode();
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      isDarkMode
                        ? "bg-slate-900 border-[#5B7CFA] ring-2 ring-[#5B7CFA]/20 shadow-md text-white"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-300">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                        Dark Mode
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        High-contrast low-light dark theme
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. OFFLINE DATA */}
            {activeTab === "offline" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#46C37B]" />
                    <span>📶 Offline Data & Storage</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Cached local database ensures critical shelter coordinates and first aid guides remain accessible without internet.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Cached Shelters
                    </span>
                    <span className="text-xl font-black text-slate-800 dark:text-white mt-1 block">
                      12 Safe Havens
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      First Aid Guides
                    </span>
                    <span className="text-xl font-black text-slate-800 dark:text-white mt-1 block">
                      8 Medical Guides
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#46C37B] shrink-0" />
                  <span>Offline IndexedDB Storage Engine is Active & Synchronized.</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onTriggerSync}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#5B7CFA] hover:bg-[#4665E0] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Sync Data Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Cache</span>
                  </button>
                </div>

                {cacheCleared && (
                  <p className="text-xs font-bold text-rose-500 text-center">
                    Offline storage cache cleared. Reloading fresh data...
                  </p>
                )}
              </div>
            )}

            {/* 5. ACCESSIBILITY */}
            {activeTab === "accessibility" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#B89AE7]" />
                    <span>♿ Accessibility Options</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Custom voice navigation, speech synthesis, and high legibility features for emergency conditions.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      key: "voiceNavigation",
                      title: "Voice Navigation Support",
                      desc: "Hands-free voice prompt prompts during rescue operations.",
                    },
                    {
                      key: "textToSpeech",
                      title: "Text-to-Speech (TTS)",
                      desc: "Read aloud disaster alerts and emergency AI instructions.",
                    },
                    {
                      key: "speechToText",
                      title: "Speech-to-Text Input",
                      desc: "Speak directly into chatbot or rescue report forms.",
                    },
                    {
                      key: "highContrastMode",
                      title: "High Contrast Mode",
                      desc: "Maximum color separation for sunlight / smoke visibility.",
                    },
                    {
                      key: "largeText",
                      title: "Large Text Scaling",
                      desc: "Enlarge all headings and action buttons by +20%.",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      onClick={() => toggleAccess(item.key as keyof AccessibilitySettings)}
                      className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-[#B89AE7]/50 transition-all"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>

                      <div
                        className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${
                          accessibility[item.key as keyof AccessibilitySettings]
                            ? "bg-[#B89AE7]"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            accessibility[item.key as keyof AccessibilitySettings]
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. ABOUT */}
            {activeTab === "about" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#5B7CFA]" />
                    <span>ℹ️ About AI Emergency Assistant</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    AI-Powered Emergency Response & Disaster Management Infrastructure.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-400">
                      Application Version
                    </span>
                    <span className="font-mono font-bold text-[#5B7CFA]">
                      v2.4.0 (Live)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-900 pt-2">
                    <span className="font-bold text-slate-600 dark:text-slate-400">
                      Gemma AI Engine
                    </span>
                    <span className="font-mono font-bold text-[#46C37B]">
                      Gemma 2.0 Multi-lingual
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-900 pt-2">
                    <span className="font-bold text-slate-600 dark:text-slate-400">
                      Database Engine
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      IndexedDB + Memory Sync
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href="#privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Privacy Policy: Your emergency GPS location is processed locally and dispatches only to your designated emergency contacts.");
                    }}
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-center hover:bg-slate-200 cursor-pointer"
                  >
                    Privacy Policy
                  </a>

                  <a
                    href="#terms"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Terms of Service: This platform acts as an emergency assistance accelerator. Always contact official regional disaster helpline 112 when accessible.");
                    }}
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-center hover:bg-slate-200 cursor-pointer"
                  >
                    Terms & Disclaimer
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-right bg-slate-50/50 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold rounded-xl hover:opacity-90 cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
