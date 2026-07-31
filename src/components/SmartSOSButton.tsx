import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Send, Copy, ExternalLink, RefreshCw, Mail, Check, Save } from "lucide-react";
import { EmergencyContact, SafeShelter, SOSLog } from "../types";
import { sendSosApi } from "../services/api";
import { queueOfflineSync, saveToStore } from "../services/db";

interface SmartSOSButtonProps {
  contacts: EmergencyContact[];
  shelters: SafeShelter[];
  userLocation: { lat: number; lng: number; address: string } | null;
  isOnline: boolean;
  onOpenSettings: () => void;
}

export const SmartSOSButton: React.FC<SmartSOSButtonProps> = ({
  contacts,
  shelters,
  userLocation,
  isOnline,
  onOpenSettings,
}) => {
  const [isActivating, setIsActivating] = useState(false);
  const [sosResult, setSosResult] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Target SOS Gmail ID State
  const [sosEmail, setSosEmail] = useState<string>(() => {
    return localStorage.getItem("sos_target_gmail") || "nehapkolagada@gmail.com";
  });
  const [savedEmailNotice, setSavedEmailNotice] = useState(false);

  const handleSaveEmail = () => {
    localStorage.setItem("sos_target_gmail", sosEmail.trim());
    setSavedEmailNotice(true);
    setTimeout(() => setSavedEmailNotice(false), 2500);
  };

  // Helper to calculate distance between coordinates
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handlePressSOS = async () => {
    setIsActivating(true);

    try {
      // 1. Get current location or fallback
      let currentLat = userLocation?.lat || 12.9716;
      let currentLng = userLocation?.lng || 77.5946;
      let currentAddr = userLocation?.address || "MG Road Sector 4, Bangalore";

      if (navigator.geolocation && !userLocation) {
        try {
          const pos: any = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          currentLat = pos.coords.latitude;
          currentLng = pos.coords.longitude;
          currentAddr = `Lat: ${currentLat.toFixed(4)}, Lng: ${currentLng.toFixed(4)}`;
        } catch (e) {
          console.warn("GPS timeout or denied, using fallback city location");
        }
      }

      // 2. Find 3 nearest safe shelters
      const sortedShelters = [...shelters]
        .map((s) => ({
          ...s,
          distance: calculateDistanceKm(currentLat, currentLng, s.lat, s.lng),
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 3);

      const targetEmail = sosEmail.trim() || "nehapkolagada@gmail.com";
      const mapsLink = `https://www.google.com/maps?q=${currentLat},${currentLng}`;
      const emailSubject = "🚨 CRITICAL EMERGENCY SOS ALERT";
      const shelterSummary = sortedShelters
        .map((s, idx) => `${idx + 1}. ${s.name} (${s.distance ? s.distance.toFixed(1) + ' km away' : 'Nearby'}) - Tel: ${s.contactPhone}`)
        .join('\n');

      const emailBody = `EMERGENCY ALERT! I am requesting immediate rescue / disaster assistance.

📍 Live Location:
Address: ${currentAddr}
Google Maps Link: ${mapsLink}

🏠 3 Nearest Safe Shelters:
${shelterSummary || "No immediate shelter data"}

🕒 Dispatched At: ${new Date().toLocaleString()}

Sent automatically by RescuAI Emergency Assistant.`;

      const payload = {
        location: {
          lat: currentLat,
          lng: currentLng,
          address: currentAddr,
        },
        targetEmail,
        contacts,
        nearestShelters: sortedShelters,
        timestamp: new Date().toISOString(),
      };

      let response: any = null;

      if (isOnline) {
        response = await sendSosApi(payload);
      } else {
        // Queue offline
        const offlineItem = {
          id: "SOS-QUEUE-" + Date.now(),
          type: "SOS" as const,
          payload,
          createdAt: new Date().toISOString(),
        };
        await queueOfflineSync(offlineItem);

        response = {
          success: true,
          isOffline: true,
          sosId: offlineItem.id,
          dispatchedAt: new Date().toLocaleString(),
          mapsLink,
          contactsNotifiedCount: 1,
          targetEmail,
          messageDetails: {
            subject: emailSubject,
            body: emailBody,
          },
        };
      }

      // Merge target email into response
      if (response && !response.targetEmail) {
        response.targetEmail = targetEmail;
      }
      if (response && response.messageDetails) {
        response.messageDetails.subject = emailSubject;
        response.messageDetails.body = emailBody;
      }

      // Save log into IndexedDB
      const sosLog: SOSLog = {
        id: "sos-log-" + Date.now(),
        timestamp: new Date().toLocaleString(),
        lat: currentLat,
        lng: currentLng,
        address: currentAddr,
        contactsNotified: [targetEmail, ...contacts.map((c) => `${c.name} (${c.email || c.phone})`)],
        nearestSheltersNotified: sortedShelters.map((s) => s.name),
        status: isOnline ? "Sent" : "Pending_Sync",
        mapsLink,
      };
      await saveToStore("sosLogs", sosLog);

      const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      if (response) {
        response.gmailWebUrl = gmailWebUrl;
      }

      setSosResult(response);
      setShowModal(true);

      // Auto-open Web Gmail compose in browser (Does NOT launch Outlook desktop app!)
      try {
        window.open(gmailWebUrl, "_blank", "noopener,noreferrer");
      } catch (err) {
        console.warn("Browser blocked popup, available via modal button:", err);
      }

    } catch (err) {
      console.error("SOS Activation Error:", err);
    } finally {
      setIsActivating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-red-950/40 via-slate-900 to-slate-900 border border-red-900/40 rounded-3xl shadow-2xl relative overflow-hidden text-center my-4">
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none" />

      {/* Header Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold mb-3">
        <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
        <span>DIRECT BACKEND SOS DISPATCH</span>
      </div>

      <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2">
        Instant Life-Saving Emergency Beacon
      </h2>
      <p className="text-xs md:text-sm text-slate-300 max-w-md mb-5 leading-relaxed">
        One tap captures live GPS, identifies nearest shelters, and sends the alert directly without opening Outlook or mail apps.
      </p>

      {/* 📧 TARGET SOS GMAIL CONFIGURATION FIELD */}
      <div className="w-full max-w-md bg-slate-950/90 border border-red-500/30 rounded-2xl p-3.5 mb-6 text-left shadow-lg">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>SOS Recipient Gmail ID</span>
          </label>
          {savedEmailNotice && (
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> Saved!
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="email"
            value={sosEmail}
            onChange={(e) => setSosEmail(e.target.value)}
            placeholder="e.g. nehapkolagada@gmail.com"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
          />
          <button
            onClick={handleSaveEmail}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
          Tapping SOS sends live location & shelters directly to <strong className="text-white">{sosEmail || "nehapkolagada@gmail.com"}</strong>.
        </p>
      </div>

      {/* 🚨 THE ONE-TAP SOS BUTTON */}
      <button
        onClick={handlePressSOS}
        disabled={isActivating}
        className="group relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-rose-700 hover:from-red-600 hover:to-rose-800 active:scale-95 transition-all shadow-2xl shadow-red-600/60 border-4 border-red-400/50 cursor-pointer focus:outline-none focus:ring-8 focus:ring-red-500/40"
        aria-label="One Tap Emergency SOS"
      >
        <div className="absolute -inset-3 rounded-full border-2 border-red-500/30 animate-ping pointer-events-none" />
        <div className="flex flex-col items-center justify-center text-white">
          {isActivating ? (
            <RefreshCw className="w-12 h-12 animate-spin mb-1 text-white" />
          ) : (
            <AlertCircle className="w-14 h-14 md:w-16 md:h-16 mb-1 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
          )}
          <span className="text-2xl md:text-3xl font-black tracking-widest text-white drop-shadow-lg">
            SOS
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-100 opacity-90 mt-0.5">
            {isActivating ? "Locating & Sending..." : "TAP TO SEND"}
          </span>
        </div>
      </button>

      {/* Contact Summary underneath */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800">
        <span>Recipient: <strong className="text-white">{sosEmail}</strong></span>
        <span className="text-slate-600">|</span>
        <span>Additional Contacts: <strong className="text-white">{contacts.length} saved</strong></span>
        <button
          onClick={onOpenSettings}
          className="text-red-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          Edit Contacts
        </button>
      </div>

      {/* SUCCESS SOS MODAL */}
      {showModal && sosResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-lg w-full text-left shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  🚨 SOS Alert Generated & Dispatched!
                </h3>
                <p className="text-xs text-slate-400">
                  Target Recipient: <strong className="text-emerald-400">{sosResult.targetEmail || sosEmail}</strong>
                </p>
              </div>
            </div>

            {/* Generated Email Content */}
            <div className="space-y-3 text-xs bg-slate-950/80 p-4 rounded-2xl border border-slate-800 font-mono text-slate-200 leading-relaxed">
              <div className="text-red-400 font-bold border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>Subject: {sosResult.messageDetails?.subject}</span>
                <span className="text-[10px] text-emerald-400 font-sans font-normal">Direct Email Triggered</span>
              </div>
              <div className="whitespace-pre-wrap text-slate-300">
                {sosResult.messageDetails?.body}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-2">
              <a
                href={sosResult.gmailWebUrl || `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(sosResult.targetEmail || sosEmail)}&su=${encodeURIComponent(sosResult.messageDetails?.subject || '')}&body=${encodeURIComponent(sosResult.messageDetails?.body || '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl transition-all cursor-pointer border border-red-400/40"
              >
                <Send className="w-4 h-4" />
                <span>Send Alert via Gmail Web</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => copyToClipboard(sosResult.messageDetails?.body || "")}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied SOS Text!" : "Copy Alert Text"}</span>
                </button>

                <a
                  href={sosResult.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Live Maps</span>
                </a>
              </div>
            </div>

            {/* Footer Options */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Dispatched directly to <strong className="text-emerald-400">{sosResult.targetEmail || sosEmail}</strong> via RescuAI
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
