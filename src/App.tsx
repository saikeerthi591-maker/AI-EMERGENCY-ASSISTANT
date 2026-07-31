import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Navigation, TabType } from "./components/Navigation";
import { HomeScreen } from "./components/HomeScreen";
import { SmartSOSButton } from "./components/SmartSOSButton";
import { AlertSummarizer } from "./components/AlertSummarizer";
import { ShelterFinder } from "./components/ShelterFinder";
import { RescuePrioritization } from "./components/RescuePrioritization";
import { EmergencyChatbot } from "./components/EmergencyChatbot";
import { CommunityReporting } from "./components/CommunityReporting";
import { FirstAidGuide } from "./components/FirstAidGuide";
import { VolunteerRegistration } from "./components/VolunteerRegistration";
import { LiveEmergencyFeed } from "./components/LiveEmergencyFeed";
import { SettingsModal } from "./components/SettingsModal";
import { UserProfileModal } from "./components/UserProfileModal";
import {
  DisasterAlert,
  SafeShelter,
  EmergencyContact,
  RescueRequest,
  IncidentReport,
  FirstAidGuide as FirstAidType,
  Language,
  UserProfile,
} from "./types";
import {
  initOfflineDB,
  getAllFromStore,
  getPendingSyncQueue,
  clearPendingSyncItem,
} from "./services/db";
import { sendSosApi, classifyIncidentApi } from "./services/api";
import { DEFAULT_FIRST_AID } from "./data/initialData";
import { AlertCircle } from "lucide-react";

import { AuthWrapper } from "./components/AuthWrapper";
import { auth, db } from "./lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

export function AppContent({ user, initialProfile }: { user: User, initialProfile: UserProfile | null }) {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("preferred_language") as Language) || "English";
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(!initialProfile || !initialProfile.fullName);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // User Profile state with local storage fallback & backend API sync
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (initialProfile && initialProfile.fullName) {
      return initialProfile;
    }
    return {
      fullName: initialProfile?.fullName || "",
      email: user.email || "",
      phone: initialProfile?.phone || "",
      location: initialProfile?.location || {
        address: "Bengaluru, Karnataka",
        city: "Bengaluru",
        state: "Karnataka",
        lat: 12.9716,
        lng: 77.5946,
      },
      accountStatus: "Active",
      emergencyId: initialProfile?.emergencyId || `EMG-${Math.floor(Math.random() * 100000)}`,
      avatarUrl: initialProfile?.avatarUrl || user.photoURL || "",
      emergencyContactName: initialProfile?.emergencyContactName || "",
      emergencyContactPhone: initialProfile?.emergencyContactPhone || "",
      bloodGroup: initialProfile?.bloodGroup || "",
      medicalInfo: initialProfile?.medicalInfo || "",
      preferredLanguage: initialProfile?.preferredLanguage || language,
      sosContacts: initialProfile?.sosContacts || [],
    };
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("preferred_language", lang);
    
    // Trigger Google Translate Widget
    const langCodeMap: Record<string, string> = {
      English: 'en',
      Kannada: 'kn',
      Hindi: 'hi',
      Tamil: 'ta',
      Telugu: 'te',
      Malayalam: 'ml',
      Marathi: 'mr',
      Bengali: 'bn',
      Gujarati: 'gu',
      Spanish: 'es',
      French: 'fr'
    };
    
    const targetLang = langCodeMap[lang] || 'en';
    const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleSelect) {
      googleSelect.value = targetLang;
      googleSelect.dispatchEvent(new Event('change'));
    }
  };

  // Restore translation on initial load
  useEffect(() => {
    const restoreTranslation = () => {
      const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (googleSelect) {
        const langCodeMap: Record<string, string> = {
          English: 'en',
          Kannada: 'kn',
          Hindi: 'hi',
          Tamil: 'ta',
          Telugu: 'te',
          Malayalam: 'ml',
          Marathi: 'mr',
          Bengali: 'bn',
          Gujarati: 'gu',
          Spanish: 'es',
          French: 'fr'
        };
        const targetLang = langCodeMap[language] || 'en';
        if (googleSelect.value !== targetLang) {
          googleSelect.value = targetLang;
          googleSelect.dispatchEvent(new Event('change'));
        }
      } else {
        setTimeout(restoreTranslation, 500);
      }
    };
    restoreTranslation();
  }, [language]);

  const handleUpdateProfile = async (updated: UserProfile) => {
    setUserProfile(updated);
    
    // Sync with Firebase Firestore
    try {
      await setDoc(doc(db, "users", user.uid), updated, { merge: true });
    } catch (err) {
      console.warn("Firebase profile sync notice:", err);
    }

    // Also update current active user location
    if (updated.location) {
      setUserLocation({
        lat: updated.location.lat,
        lng: updated.location.lng,
        address: updated.location.address,
      });
    }
  };

  const handleSetManualLocation = (loc: { lat: number; lng: number; address: string }) => {
    setUserLocation(loc);
    const updatedProf: UserProfile = {
      ...userProfile,
      location: {
        ...userProfile.location,
        lat: loc.lat,
        lng: loc.lng,
        address: loc.address,
      },
    };
    setUserProfile(updatedProf);
    localStorage.setItem("user_profile", JSON.stringify(updatedProf));

    // Recalculate shelter distances
    setShelters((prevShelters) =>
      prevShelters.map((shelter) => {
        const R = 6371;
        const dLat = ((shelter.lat - loc.lat) * Math.PI) / 180;
        const dLng = ((shelter.lng - loc.lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((loc.lat * Math.PI) / 180) *
            Math.cos((shelter.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = Math.round(R * c * 10) / 10;
        return { ...shelter, distanceKm };
      })
    );
  };

  // Core Data States
  const [shelters, setShelters] = useState<SafeShelter[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [firstAidGuides, setFirstAidGuides] = useState<FirstAidType[]>([]);
  const [rescues, setRescues] = useState<RescueRequest[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Live GPS User Location
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  // Initialize DB and load data on startup
  useEffect(() => {
    const loadAppData = async () => {
      await initOfflineDB();

      const loadedShelters = await getAllFromStore<SafeShelter>("shelters");
      const loadedContacts = await getAllFromStore<EmergencyContact>("contacts");
      const loadedAlerts = await getAllFromStore<DisasterAlert>("alerts");
      const loadedFirstAid = await getAllFromStore<FirstAidType>("firstAid");
      const loadedRescues = await getAllFromStore<RescueRequest>("rescues");
      const loadedIncidents = await getAllFromStore<IncidentReport>("incidents");
      const pendingQueue = await getPendingSyncQueue();

      setShelters(loadedShelters);
      setContacts(loadedContacts);
      setAlerts(loadedAlerts);
      setFirstAidGuides(
        loadedFirstAid && loadedFirstAid.length >= DEFAULT_FIRST_AID.length
          ? loadedFirstAid
          : DEFAULT_FIRST_AID
      );
      setRescues(loadedRescues);
      setIncidents(loadedIncidents);
      setPendingSyncCount(pendingQueue.length);
    };

    loadAppData();

    // Auto GPS Location Detection
    detectLocation();

    // Online/Offline Listeners
    const handleOnline = () => {
      setIsOnline(true);
      triggerAutoSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Detect Live Location via GPS with Reverse Geocoding
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let address = `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            if (data && data.address) {
              const place =
                data.address.city ||
                data.address.town ||
                data.address.suburb ||
                data.address.county ||
                data.address.state_district ||
                "Location";
              const state = data.address.state || "Karnataka";
              address = `${place}, ${state}`;
            }
          } catch (e) {
            console.warn("Reverse geocode warning:", e);
          }

          setUserLocation({ lat, lng, address });
        },
        (err) => {
          console.warn("GPS detection warning:", err);
          // Default to Ballari, Karnataka if GPS is unpermitted in dev preview iframe
          setUserLocation({
            lat: 15.1394,
            lng: 76.9214,
            address: "Ballari, Karnataka",
          });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setUserLocation({
        lat: 15.1394,
        lng: 76.9214,
        address: "Ballari, Karnataka",
      });
    }
  };

  // Auto Sync pending offline items when internet returns
  const triggerAutoSync = async () => {
    const queue = await getPendingSyncQueue();
    if (queue.length === 0) return;

    for (const item of queue) {
      try {
        if (item.type === "SOS") {
          await sendSosApi(item.payload);
        } else if (item.type === "INCIDENT") {
          await classifyIncidentApi(item.payload.description);
        }
        await clearPendingSyncItem(item.id);
      } catch (err) {
        console.error("Failed to sync item:", item, err);
      }
    }

    const updatedQueue = await getPendingSyncQueue();
    setPendingSyncCount(updatedQueue.length);
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 pb-24 lg:pb-12 ${
        isDarkMode
          ? "bg-dark-canvas text-slate-100"
          : "bg-soft-lavender text-[#2D2D2D]"
      }`}
    >
      {/* Top Header Navbar */}
      <Header
        isOnline={isOnline}
        language={language}
        onLanguageChange={handleLanguageChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenProfile={() => setShowProfile(true)}
        pendingSyncCount={pendingSyncCount}
        onTriggerSync={triggerAutoSync}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        userAvatarUrl={userProfile.avatarUrl}
        userName={userProfile.fullName}
        isProfileIncomplete={!userProfile.fullName || !userProfile.email || !userProfile.phone}
      />

      {/* Floating Left Navigation Sidebar for Desktop & Mobile bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
        isDarkMode={isDarkMode}
        onOpenSettings={() => setShowSettings(true)}
        onOpenProfile={() => setShowProfile(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container Layout */}
      <main className="lg:ml-72 max-w-[1500px] mx-auto px-4 sm:px-6 pt-6 pb-24 lg:pb-8">
        {/* TAB 1: HOME DASHBOARD */}
        {activeTab === "home" && (
          <HomeScreen
            onSelectTab={setActiveTab}
            alerts={alerts}
            shelters={shelters}
            rescues={rescues}
            incidents={incidents}
            isOnline={isOnline}
            userLocation={userLocation}
            isDarkMode={isDarkMode}
            language={language}
            onLanguageChange={handleLanguageChange}
            onOpenProfile={() => setShowProfile(true)}
          />
        )}

        {/* TAB 10: LIVE EMERGENCY FEED */}
        {activeTab === "livefeed" && (
          <LiveEmergencyFeed 
            isDarkMode={isDarkMode}
            isOnline={isOnline}
          />
        )}

        {/* TAB 2: ALERT SUMMARIZER */}
        {activeTab === "alerts" && (
          <AlertSummarizer
            alerts={alerts}
            onAddNewAlert={(newAlert) => setAlerts((prev) => [newAlert, ...prev])}
            currentLanguage={language}
          />
        )}

        {/* TAB 3: SHELTER FINDER */}
        {activeTab === "shelters" && (
          <ShelterFinder
            shelters={shelters}
            incidents={incidents}
            userLocation={userLocation}
            onDetectLocation={detectLocation}
            isOnline={isOnline}
          />
        )}

        {/* TAB 4: SMART SOS */}
        {activeTab === "sos" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <SmartSOSButton
              contacts={contacts}
              shelters={shelters}
              userLocation={userLocation}
              isOnline={isOnline}
              onOpenSettings={() => setShowSettings(true)}
            />
          </div>
        )}

        {/* TAB 5: RESCUE PRIORITIZATION */}
        {activeTab === "rescue" && (
          <RescuePrioritization
            rescues={rescues}
            onAddNewRescue={(newRescue) =>
              setRescues((prev) => [newRescue, ...prev])
            }
            userLocation={userLocation}
          />
        )}

        {/* TAB 6: AI CHATBOT */}
        {activeTab === "chat" && (
          <EmergencyChatbot currentLanguage={language} />
        )}

        {/* TAB 7: COMMUNITY REPORTING */}
        {activeTab === "reporting" && (
          <CommunityReporting
            incidents={incidents}
            onAddNewIncident={(newInc) =>
              setIncidents((prev) => [newInc, ...prev])
            }
            userLocation={userLocation}
            isOnline={isOnline}
          />
        )}

        {/* TAB 8: FIRST AID GUIDE */}
        {activeTab === "firstaid" && (
          <FirstAidGuide
            guides={firstAidGuides}
          />
        )}

        {/* TAB 9: VOLUNTEER REGISTRATION */}
        {activeTab === "volunteer" && (
          <VolunteerRegistration />
        )}
      </main>

      {/* Sticky Prominent Floating Circular SOS Button (Bottom Right) */}
      {activeTab !== "sos" && (
        <button
          onClick={() => setActiveTab("sos")}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#E53935] to-[#FF6B6B] text-white shadow-2xl shadow-red-600/50 hover:scale-110 active:scale-95 transition-all animate-sos-pulse cursor-pointer group border-2 border-white/60"
          title="Click to Activate Emergency SOS"
          aria-label="Activate Emergency SOS"
        >
          <div className="flex flex-col items-center justify-center">
            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">
              SOS
            </span>
          </div>
        </button>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          contacts={contacts}
          onUpdateContacts={setContacts}
          onClose={() => setShowSettings(false)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onTriggerSync={triggerAutoSync}
        />
      )}

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfileModal
          profile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setShowProfile(false)}
          onDetectGpsLocation={detectLocation}
          onSetManualLocation={handleSetManualLocation}
          currentLanguage={language}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <AuthWrapper>
      {(user, profile) => <AppContent user={user} initialProfile={profile} />}
    </AuthWrapper>
  );
}

export default App;
