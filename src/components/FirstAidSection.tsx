import React, { useState } from "react";
import { HeartPulse, Waves, Activity, Flame, Volume2, Search, CheckCircle2, XCircle } from "lucide-react";
import { FirstAidGuide } from "../types";
import { speakText } from "../services/speech";

interface FirstAidSectionProps {
  firstAidGuides: FirstAidGuide[];
}

export const FirstAidSection: React.FC<FirstAidSectionProps> = ({ firstAidGuides }) => {
  const [search, setSearch] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<FirstAidGuide>(firstAidGuides[0] || null);

  const filtered = firstAidGuides.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase()) ||
      g.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
            <HeartPulse className="w-4 h-4" />
            <span>Cached Offline First-Aid & Emergency Guides</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            First-Aid Instructions & Survival Protocols
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Step-by-step guidance for floods, earthquakes, burns, and CPR. Stored offline in IndexedDB for immediate access without internet.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides e.g. Flood, CPR, Burns..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guide Selector List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Survival Guide ({filtered.length})
          </h3>
          {filtered.map((guide) => {
            const isSelected = selectedGuide?.id === guide.id;
            return (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-slate-800 border-rose-500 shadow-xl shadow-rose-950/30"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase">
                    {guide.category}
                  </span>
                  <HeartPulse className={`w-4 h-4 ${isSelected ? "text-rose-400" : "text-slate-500"}`} />
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{guide.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{guide.summary}</p>
              </div>
            );
          })}
        </div>

        {/* Active Guide Content */}
        {selectedGuide && (
          <div className="lg:col-span-2 bg-slate-900 border-2 border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
                  {selectedGuide.category} Survival Protocol
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{selectedGuide.title}</h3>
              </div>

              <button
                onClick={() => speakText(`${selectedGuide.title}. ${selectedGuide.steps.join(". ")}`)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold border border-slate-700 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Read Steps Aloud</span>
              </button>
            </div>

            {/* Actionable Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Actionable Step-by-Step Instructions:
              </h4>
              <div className="space-y-2">
                {selectedGuide.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-100">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Do's and Dont's */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> DO'S:
                </h4>
                <ul className="space-y-1 text-xs text-slate-200">
                  {selectedGuide.emergencyDoList.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-950/30 border border-rose-500/30 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> DONT'S:
                </h4>
                <ul className="space-y-1 text-xs text-slate-200">
                  {selectedGuide.emergencyDontList.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
