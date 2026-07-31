import React, { useState } from "react";
import {
  LifeBuoy,
  Sparkles,
  ShieldAlert,
  Clock,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { RescueRequest } from "../types";
import { classifyRescueApi } from "../services/api";
import { saveToStore } from "../services/db";

interface RescuePrioritizationProps {
  rescues: RescueRequest[];
  onAddNewRescue: (rescue: RescueRequest) => void;
  userLocation: { lat: number; lng: number; address: string } | null;
}

export const RescuePrioritization: React.FC<RescuePrioritizationProps> = ({
  rescues,
  onAddNewRescue,
  userLocation,
}) => {
  const [headcount, setHeadcount] = useState(2);
  const [elderly, setElderly] = useState(false);
  const [children, setChildren] = useState(false);
  const [pregnant, setPregnant] = useState(false);
  const [disabilities, setDisabilities] = useState(false);
  const [medicalEmergencies, setMedicalEmergencies] = useState(false);
  const [trappedStatus] = useState(
    "Trapped on roof / upper story due to rising floodwaters."
  );
  const [description, setDescription] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "queue">("queue");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const details = {
      headcount,
      elderly,
      children,
      pregnant,
      disabilities,
      medicalEmergencies,
      trappedStatus,
      description,
      location: userLocation?.address || "MG Road Sector 4 Zone",
    };

    try {
      const aiData = await classifyRescueApi(details);

      const newRescue: RescueRequest = {
        id: "res-" + Date.now(),
        requesterName: requesterName || "Anonymous Citizen",
        headcount,
        elderly,
        children,
        pregnant,
        disabilities,
        medicalEmergencies,
        trappedStatus,
        description:
          description || "Trapped citizen requesting immediate rescue squad.",
        location: userLocation?.address || "MG Road Sector 4 Zone",
        lat: userLocation?.lat || 12.9716,
        lng: userLocation?.lng || 77.5946,
        priority: aiData.priority || "High",
        priorityScore: aiData.priorityScore || 85,
        reasoningExplanation:
          aiData.reasoningExplanation ||
          "AI classified based on headcount and medical vulnerability.",
        status: "Pending",
        timestamp: new Date().toLocaleString(),
        contactPhone: contactPhone || "+91 98000 00000",
      };

      await saveToStore("rescues", newRescue);
      onAddNewRescue(newRescue);

      // Reset form
      setRequesterName("");
      setDescription("");
      setContactPhone("");
      setActiveTab("queue");
    } catch (err) {
      console.error("Rescue submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort queue by priority score
  const sortedRescues = [...rescues].sort(
    (a, b) => b.priorityScore - a.priorityScore
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Banner */}
      <div className="glass-card-light dark:glass-card-dark p-6 rounded-[24px] border border-white/60 dark:border-white/10 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <LifeBuoy className="w-3.5 h-3.5 text-[#E53935]" />
            <span>AI Powered Emergency Rescue Triage</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            AI Rescue Request & Priority Classifier
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
            Gemma evaluates trapped citizens, medical conditions, elderly, pregnant women, and children to automatically classify and explain rescue priorities for first responders.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "queue"
                ? "bg-[#E53935] text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Rescue Queue ({rescues.length})
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "form"
                ? "bg-[#E53935] text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            + Request Rescue
          </button>
        </div>
      </div>

      {activeTab === "form" ? (
        /* Rescue Request Form */
        <form
          onSubmit={handleSubmit}
          className="glass-card-light dark:glass-card-dark rounded-[24px] p-6 shadow-lg space-y-6 max-w-2xl mx-auto"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <ShieldAlert className="w-5 h-5 text-[#E53935]" />
            <span>Submit Immediate Emergency Rescue Request</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Requester Full Name
              </label>
              <input
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                required
                className="w-full bg-white/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#E53935]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full bg-white/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#E53935]"
              />
            </div>
          </div>

          {/* Headcount */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>Total People Trapped / Needing Rescue:</span>
              <span className="text-[#E53935] font-bold text-sm">
                {headcount} People
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              value={headcount}
              onChange={(e) => setHeadcount(Number(e.target.value))}
              className="w-full accent-[#E53935] cursor-pointer"
            />
          </div>

          {/* Vulnerability Checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vulnerability Factors (Select all that apply):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                {
                  label: "👴 Elderly Present",
                  state: elderly,
                  setter: setElderly,
                },
                {
                  label: "👶 Children Present",
                  state: children,
                  setter: setChildren,
                },
                {
                  label: "🤰 Pregnant Woman",
                  state: pregnant,
                  setter: setPregnant,
                },
                {
                  label: "♿ Disabled Person",
                  state: disabilities,
                  setter: setDisabilities,
                },
                {
                  label: "🚑 Medical Emergency",
                  state: medicalEmergencies,
                  setter: setMedicalEmergencies,
                },
              ].map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => item.setter(!item.state)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                    item.state
                      ? "bg-rose-100 dark:bg-rose-950/80 border-[#E53935] text-rose-800 dark:text-rose-300 shadow-sm"
                      : "bg-white/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Situation Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Trapped Status & Details:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Floodwater reached 4ft inside living room. 1 elderly person on oxygen machine needs immediate boat evacuation."
              rows={3}
              required
              className="w-full bg-white/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#E53935]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab("queue")}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Classifying Priority with Gemma...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Rescue Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Rescue Queue */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Prioritized Rescue Queue ({sortedRescues.length} Requests)
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Sorted automatically by AI Priority Score
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sortedRescues.map((rescue) => (
              <div
                key={rescue.id}
                className="glass-card-light dark:glass-card-dark rounded-[24px] p-6 shadow-lg space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        rescue.priority === "High"
                          ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                          : rescue.priority === "Medium"
                          ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                          : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                      }`}
                    >
                      {rescue.priority} Priority (Score: {rescue.priorityScore}/100)
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                      Requester:{" "}
                      <strong className="text-slate-800 dark:text-white">
                        {rescue.requesterName}
                      </strong>
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {rescue.timestamp}
                  </span>
                </div>

                {/* AI Explanation Box */}
                <div className="bg-white/80 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E53935]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemma AI Priority Explanation:</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {rescue.reasoningExplanation}
                  </p>
                </div>

                {/* Factors & Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                      📍 Location:
                    </span>
                    <span>{rescue.location}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                      👥 Vulnerabilities:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold border border-slate-200 dark:border-slate-700">
                        {rescue.headcount} People
                      </span>
                      {rescue.elderly && (
                        <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                          Elderly
                        </span>
                      )}
                      {rescue.children && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          Children
                        </span>
                      )}
                      {rescue.pregnant && (
                        <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                          Pregnant
                        </span>
                      )}
                      {rescue.disabilities && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          Disability
                        </span>
                      )}
                      {rescue.medicalEmergencies && (
                        <span className="px-2 py-0.5 rounded bg-[#E53935] text-white font-bold">
                          Medical Emergency
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact & Status Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <a
                    href={`tel:${rescue.contactPhone}`}
                    className="text-xs font-bold text-[#2A6F97] dark:text-cyan-400 hover:underline"
                  >
                    📞 Call: {rescue.contactPhone}
                  </a>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Status:
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                      {rescue.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
