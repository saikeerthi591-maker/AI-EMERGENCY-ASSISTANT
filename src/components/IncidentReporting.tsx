import React, { useState } from "react";
import { Camera, MapPin, Upload, AlertTriangle, Sparkles, CheckCircle2, ShieldAlert, Image as ImageIcon, RefreshCw } from "lucide-react";
import { IncidentReport } from "../types";
import { classifyIncidentApi, assessDamageApi } from "../services/api";
import { saveToStore } from "../services/db";

interface IncidentReportingProps {
  incidents: IncidentReport[];
  onAddNewIncident: (inc: IncidentReport) => void;
  userLocation: { lat: number; lng: number; address: string } | null;
}

export const IncidentReporting: React.FC<IncidentReportingProps> = ({
  incidents,
  onAddNewIncident,
  userLocation,
}) => {
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [damageAssessment, setDamageAssessment] = useState<any | null>(null);

  const samplePhoto = "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80";

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // 1. AI Categorization
      const classification = await classifyIncidentApi(description, photoUrl || undefined);
      
      // 2. AI Damage Assessment if photo or detailed description
      let damageRes = null;
      if (description.length > 20 || photoUrl) {
        damageRes = await assessDamageApi(description);
        setDamageAssessment(damageRes);
      }

      const newReport: IncidentReport = {
        id: "inc-" + Date.now(),
        title: classification.title || `${classification.category} Reported`,
        category: classification.category || "Flood",
        severity: classification.severity || "High",
        description: description,
        location: userLocation?.address || "MG Road Sector 4 Corridor",
        lat: userLocation?.lat || 12.9716,
        lng: userLocation?.lng || 77.5946,
        photoUrl: photoUrl || samplePhoto,
        timestamp: new Date().toLocaleString(),
        reportedBy: "Citizen Reporter",
        status: "Verified",
      };

      await saveToStore("incidents", newReport);
      onAddNewIncident(newReport);
      setDescription("");
      setPhotoUrl(null);
    } catch (err) {
      console.error("Incident submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Camera className="w-4 h-4" />
            <span>Community Incident & Damage Reporting</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Report Hazards & Disaster Incidents
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Upload photos and descriptions. Gemma automatically categorizes incidents into Floods, Fires, Road Blocks, Landslides, or Power Failures and assesses structural damage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            New Community Hazard Report
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Incident Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Fallen electrical pole sparking near flooded underpass at Sector 4 junction..."
              rows={4}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Attach Incident Photo (Optional):</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer border border-slate-700">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Choose Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => setPhotoUrl(samplePhoto)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-medium"
              >
                Use Sample Photo
              </button>
            </div>

            {photoUrl && (
              <div className="mt-3 relative w-32 h-24 rounded-2xl overflow-hidden border border-slate-700">
                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  className="absolute top-1 right-1 bg-black/80 text-white rounded-full p-1 text-[10px]"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Location Badge */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>GPS Location Attached: <strong className="text-white">{userLocation?.address || "Sector 4 Junction Zone"}</strong></span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !description.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-900/40 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Categorizing & Assessing Damage...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Submit Report to Live Map</span>
              </>
            )}
          </button>
        </form>

        {/* AI Damage Assessment Feedback */}
        <div className="space-y-4">
          {damageAssessment && (
            <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Gemma AI Damage Assessment
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                  {damageAssessment.riskLevel} Risk ({damageAssessment.damageSeverityPercent}% Damage)
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-200">
                <div><strong>Structural Status:</strong> {damageAssessment.structuralIntegrityStatus}</div>
                <div><strong>Urgency:</strong> {damageAssessment.estimatedRepairUrgency}</div>
                <div><strong>Hazards Detected:</strong> {damageAssessment.detectedHazards?.join(", ")}</div>
                <div className="text-cyan-300 pt-1"><strong>Action:</strong> {damageAssessment.recommendedAction}</div>
              </div>
            </div>
          )}

          {/* List of Community Reports */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Community Incident Feed ({incidents.length})
            </h3>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                      {inc.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{inc.timestamp}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                  <p className="text-xs text-slate-300">{inc.description}</p>
                  <div className="text-[11px] text-slate-400">📍 {inc.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
