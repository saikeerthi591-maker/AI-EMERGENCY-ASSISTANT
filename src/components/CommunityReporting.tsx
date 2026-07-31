import React, { useState } from "react";
import {
  Camera,
  MapPin,
  Upload,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { motion } from "motion/react";
import { IncidentReport } from "../types";
import { classifyIncidentApi } from "../services/api";
import { saveToStore, queueOfflineSync } from "../services/db";

interface CommunityReportingProps {
  incidents: IncidentReport[];
  onAddNewIncident: (inc: IncidentReport) => void;
  userLocation: { lat: number; lng: number; address: string } | null;
  isOnline: boolean;
}

export const CommunityReporting: React.FC<CommunityReportingProps> = ({
  incidents,
  onAddNewIncident,
  userLocation,
  isOnline,
}) => {
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportedBy, setReportedBy] = useState("");

  const samplePhotos = [
    {
      name: "Flood Water",
      url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Fallen Tree",
      url: "https://images.unsplash.com/photo-1511497584788-8767610419ea?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Building Structural Hazard",
      url: "https://images.unsplash.com/photo-1590059300538-232128e08d13?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    try {
      let aiData: any = null;

      if (isOnline) {
        aiData = await classifyIncidentApi(description, photoUrl || undefined);
      } else {
        aiData = {
          category: description.toLowerCase().includes("fire")
            ? "Fire"
            : "Flood",
          severity: "High",
          title: "Offline Incident Report",
          hazardSummary: description,
          recommendedImmediateAction: "Notify local authorities when online.",
        };
      }

      const newIncident: IncidentReport = {
        id: "inc-" + Date.now(),
        title: aiData.title || `${aiData.category} Hazard Reported`,
        category: aiData.category || "Flood",
        severity: aiData.severity || "High",
        description,
        location: userLocation?.address || "MG Road Sector 4 Zone",
        lat: userLocation?.lat || 12.9716,
        lng: userLocation?.lng || 77.5946,
        photoUrl: photoUrl || undefined,
        timestamp: new Date().toLocaleString(),
        reportedBy: reportedBy || "Community Citizen",
        status: "Verified",
        isOfflineQueued: !isOnline,
      };

      await saveToStore("incidents", newIncident);

      if (!isOnline) {
        await queueOfflineSync({
          id: "INCIDENT-QUEUE-" + Date.now(),
          type: "INCIDENT",
          payload: newIncident,
          createdAt: new Date().toISOString(),
        });
      }

      onAddNewIncident(newIncident);

      // Reset
      setDescription("");
      setPhotoUrl(null);
      setReportedBy("");
    } catch (err) {
      console.error("Incident submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Community Crowdsourced Hazard Map</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Community Incident Reporting & AI Categorization
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
            Upload photos, describe hazards, and tag GPS coordinates. Gemma automatically classifies incidents into Flood, Fire, Road Block, Landslide, Fallen Tree, Building Collapse, or Power Failure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-1 glass-card-light dark:glass-card-dark rounded-[24px] p-6 shadow-lg space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <AlertTriangle className="w-4 h-4 text-[#E53935]" />
            <span>Report New Hazard / Incident</span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Your Name / Handle
            </label>
            <input
              type="text"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              placeholder="e.g. Priya N. (Local Resident)"
              className="w-full bg-white/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2A6F97]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Incident Description & Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Water logging 3 feet high near underground metro entrance. Electric wires submerged."
              rows={3}
              required
              className="w-full bg-white/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2A6F97]"
            />
          </div>

          {/* Photo Upload / Sample Select */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Attach Photo Evidence:
            </label>

            <div className="flex items-center gap-2 mb-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/80 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#2A6F97] cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                <Upload className="w-4 h-4 text-[#2A6F97]" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Sample Photo selector */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-medium">
                Or pick sample disaster photo:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {samplePhotos.map((s, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setPhotoUrl(s.url)}
                    className={`relative rounded-xl overflow-hidden border h-14 transition-all cursor-pointer ${
                      photoUrl === s.url
                        ? "border-[#2A6F97] ring-2 ring-[#2A6F97]/40"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={s.url}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {photoUrl && (
              <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-28">
                <img
                  src={photoUrl}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full px-2 py-0.5 text-[10px] font-bold cursor-pointer"
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !description.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#2A6F97] hover:bg-[#014F86] text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gemma Categorizing Hazard...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Submit Incident Report</span>
              </>
            )}
          </button>
        </form>

        {/* Live Community Feed */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Verified Community Incident Feed ({incidents.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="glass-card-light dark:glass-card-dark rounded-[24px] p-5 shadow-lg space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {inc.photoUrl && (
                  <div className="w-full h-36 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img
                      src={inc.photoUrl}
                      alt={inc.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 text-[10px] font-black uppercase border border-amber-200 dark:border-amber-800">
                      {inc.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-1.5 leading-tight">
                      {inc.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {inc.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {inc.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#2A6F97]" />{" "}
                    {inc.location}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    By: {inc.reportedBy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
