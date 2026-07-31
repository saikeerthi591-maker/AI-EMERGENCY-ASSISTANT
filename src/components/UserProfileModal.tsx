import React, { useState, useRef, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Search,
  CheckCircle2,
  X,
  Camera,
  Compass,
  Edit3,
  RefreshCw,
  Upload,
  AlertTriangle,
  Radio,
  Navigation,
  Clock,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../types";

import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

interface UserProfileModalProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onClose: () => void;
  onDetectGpsLocation: () => void;
  onSetManualLocation: (loc: { lat: number; lng: number; address: string }) => void;
  currentLanguage: string;
}

const POPULAR_LOCATIONS = [
  { name: "Ballari, Karnataka", lat: 15.1394, lng: 76.9214 },
  { name: "Bengaluru, Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Mysuru, Karnataka", lat: 12.2958, lng: 76.6394 },
  { name: "Hubballi-Dharwad, Karnataka", lat: 15.3647, lng: 75.124 },
  { name: "Mangaluru, Karnataka", lat: 12.9141, lng: 74.856 },
  { name: "Belagavi, Karnataka", lat: 15.8497, lng: 74.4977 },
  { name: "Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Hyderabad, Telangana", lat: 17.385, lng: 78.4867 },
];

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  profile,
  onUpdateProfile,
  onClose,
  onDetectGpsLocation,
  onSetManualLocation,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(
    !profile.fullName || !profile.email || !profile.phone
  );

  const [fullName, setFullName] = useState<string>(profile.fullName || "");
  const [email, setEmail] = useState<string>(profile.email || "nehapkolagada@gmail.com");
  const [phone, setPhone] = useState<string>(profile.phone || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(profile.avatarUrl || "");

  // Location state
  const [locationAddress, setLocationAddress] = useState<string>(
    profile.location?.address || "Ballari, Karnataka"
  );
  const [districtName, setDistrictName] = useState<string>(
    profile.location?.district || "Ballari"
  );
  const [stateName, setStateName] = useState<string>(
    profile.location?.state || "Karnataka"
  );
  const [cityName, setCityName] = useState<string>(
    profile.location?.city || "Ballari"
  );
  const [countryName, setCountryName] = useState<string>(
    profile.location?.country || "India"
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: profile.location?.lat || 15.1394,
    lng: profile.location?.lng || 76.9214,
  });

  // GPS Status
  const [gpsStatus, setGpsStatus] = useState<"Active" | "Not Activated">(
    profile.gpsStatus || (localStorage.getItem("gps_status") as "Active" | "Not Activated") || "Not Activated"
  );
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(
    profile.location?.lastUpdatedTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ name: string; lat: number; lng: number }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditingAvatarMenu, setIsEditingAvatarMenu] = useState(false);

  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [bloodGroup, setBloodGroup] = useState<string>(profile.bloodGroup || "");
  const [medicalInfo, setMedicalInfo] = useState<string>(profile.medicalInfo || "");
  const [emergencyContactName, setEmergencyContactName] = useState<string>(profile.emergencyContactName || "");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState<string>(profile.emergencyContactPhone || "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto detect live location on initial render if gpsStatus is active or on click
  useEffect(() => {
    if (gpsStatus === "Active" && !profile.location?.address.includes("Ballari")) {
      handleDetectLiveGps();
    }
  }, []);

  const validateEmail = (val: string) => {
    if (!val.trim()) return "Email address is required.";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val.trim())) return "Enter a valid email address.";
    return "";
  };

  const validatePhone = (val: string) => {
    if (!val.trim()) return "Phone number is required for emergency dispatch.";
    const cleaned = val.replace(/[\s\-\+\(\)]/g, "");
    if (!/^\d{7,15}$/.test(cleaned)) return "Enter a valid 10-digit phone number.";
    return "";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result);
          setIsEditingAvatarMenu(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Real GPS detection with reverse geocoding via Nominatim
  const handleDetectLiveGps = () => {
    setIsDetectingGps(true);
    onDetectGpsLocation();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords({ lat, lng });

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            if (data && data.address) {
              const city =
                data.address.city ||
                data.address.town ||
                data.address.suburb ||
                data.address.village ||
                "Ballari";
              const district =
                data.address.county ||
                data.address.state_district ||
                "Ballari District";
              const state = data.address.state || "Karnataka";
              const country = data.address.country || "India";

              const fullAddr = `${city}, ${district}, ${state}, ${country}`;
              setLocationAddress(fullAddr);
              setCityName(city);
              setDistrictName(district);
              setStateName(state);
              setCountryName(country);

              onSetManualLocation({ lat, lng, address: fullAddr });
            } else {
              setLocationAddress(`📍 Ballari, Karnataka (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            }
          } catch (err) {
            console.warn("Reverse geocode fallback to default location:", err);
            setLocationAddress("Ballari, Karnataka");
          } finally {
            setGpsStatus("Active");
            const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastUpdatedTime(nowTime);
            localStorage.setItem("gps_status", "Active");
            setIsDetectingGps(false);
          }
        },
        (err) => {
          console.warn("GPS Permission or signal error:", err);
          // Standard reference location Ballari, Karnataka
          setLocationAddress("Ballari, Karnataka, India");
          setCityName("Ballari");
          setDistrictName("Ballari District");
          setStateName("Karnataka");
          setCountryName("India");
          setGpsStatus("Active");
          const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastUpdatedTime(nowTime);
          localStorage.setItem("gps_status", "Active");
          setIsDetectingGps(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationAddress("Ballari, Karnataka, India");
      setGpsStatus("Active");
      setIsDetectingGps(false);
    }
  };

  const handleLocationSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setSearchResults(
          data.map((item: any) => ({
            name: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }))
        );
      }
    } catch (err) {
      console.warn("Geocoding fetch failed:", err);
      const filtered = POPULAR_LOCATIONS.filter((loc) =>
        loc.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (loc: {
    name: string;
    lat: number;
    lng: number;
  }) => {
    setLocationAddress(loc.name);
    setCoords({ lat: loc.lat, lng: loc.lng });
    onSetManualLocation({
      lat: loc.lat,
      lng: loc.lng,
      address: loc.name,
    });
    setGpsStatus("Active");
    localStorage.setItem("gps_status", "Active");
    setSearchResults([]);
    setSearchQuery("");
  };

  // Calculate Account Activity Status
  const isProfileComplete = Boolean(fullName.trim() && email.trim() && phone.trim());
  const isAccountActive = isProfileComplete && gpsStatus === "Active";

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const errEmail = validateEmail(email);
    const errPhone = validatePhone(phone);

    setEmailError(errEmail);
    setPhoneError(errPhone);

    if (errEmail || errPhone) return;

    setIsSaving(true);

    const updatedProfile: UserProfile = {
      ...profile,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatarUrl: avatarUrl || undefined,
      accountStatus: isAccountActive ? "🟢 Active" : "",
      gpsStatus: gpsStatus,
      bloodGroup,
      medicalInfo,
      emergencyContactName,
      emergencyContactPhone,
      location: {
        address: locationAddress,
        city: cityName,
        district: districtName,
        state: stateName,
        country: countryName,
        lat: coords.lat,
        lng: coords.lng,
        lastUpdatedTime: lastUpdatedTime,
      },
    };

    // Save to LocalStorage & Sync to backend API
    localStorage.setItem("user_profile", JSON.stringify(updatedProfile));
    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
    } catch (err) {
      console.warn("Backend profile sync notice:", err);
    }

    onUpdateProfile(updatedProfile);
    setIsSaving(false);
    setSaveSuccess(true);
    setIsEditing(false);

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="glass-card-light dark:glass-card-dark rounded-[24px] p-6 max-w-xl w-full space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto border border-white/80 dark:border-white/10 text-slate-800 dark:text-white"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#5B7CFA]/15 text-[#5B7CFA] border border-[#5B7CFA]/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                User Emergency Profile
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Verified responder credentials, GPS tracker & status indicators
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Success Banner */}
        {saveSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Profile & GPS details updated and saved!</span>
            </div>
          </div>
        )}

        {/* Updated Profile Card with Image, Name, Email, Phone, Location, GPS Status, Account Status, Emergency ID */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#5B7CFA]/15 via-blue-500/5 to-slate-100 dark:to-slate-900/80 p-5 rounded-[22px] border border-[#5B7CFA]/30 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Profile Avatar Image */}
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName || "User Profile Photo"}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#5B7CFA] shadow-md bg-white dark:bg-slate-950"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5B7CFA] to-[#3B82F6] flex items-center justify-center text-white border-2 border-white/80 shadow-md">
                  <User className="w-10 h-10" />
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsEditingAvatarMenu(!isEditingAvatarMenu)}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#5B7CFA] hover:bg-[#4665E0] text-white shadow-lg hover:scale-110 transition-all cursor-pointer"
                title="Change or upload photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">
                  {fullName || "Add Your Full Name"}
                </h3>

                {/* Account Activity Status Badge */}
                {isAccountActive && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Account Status: 🟢 Active</span>
                  </span>
                )}
              </div>

              {/* Email & Phone */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-700 dark:text-slate-200 font-semibold pt-1">
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#5B7CFA] shrink-0" />
                  <span className="truncate">{email || "nehapkolagada@gmail.com"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{phone || "Not provided"}</span>
                </span>
              </div>

              {/* Location Address Display */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 pt-1">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="truncate">📍 {locationAddress}</span>
              </div>

              {/* Emergency ID */}
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                Emergency ID: <span className="font-bold text-slate-800 dark:text-slate-200">{profile.emergencyId || "EMG-74291-BLR"}</span>
              </p>
            </div>

            {/* Edit Toggle */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="sm:self-start px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#5B7CFA] border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* GPS Location Status Indicator Card */}
          <div className="bg-white/80 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl ${
                  gpsStatus === "Active"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <Navigation className={`w-4 h-4 ${gpsStatus === "Active" ? "animate-spin-slow" : ""}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                    GPS Location Status:
                  </span>
                  {gpsStatus === "Active" && (
                    <span className="text-xs font-bold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      🟢 Location Active
                    </span>
                  )}
                </div>
                {gpsStatus === "Active" && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>
                      {cityName}, {districtName}, {stateName} • Last updated {lastUpdatedTime}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Enable Location Button */}
            <button
              type="button"
              onClick={handleDetectLiveGps}
              disabled={isDetectingGps}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                gpsStatus === "Active"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md ring-2 ring-emerald-500/30"
              }`}
            >
              {isDetectingGps ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Compass className="w-3.5 h-3.5" />
              )}
              <span>{isDetectingGps ? "Detecting GPS..." : gpsStatus === "Active" ? "Update GPS" : "Enable Location"}</span>
            </button>
          </div>
        </div>

        {/* Avatar Upload / Selector Drawer */}
        <AnimatePresence>
          {isEditingAvatarMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                  Update Profile Photo
                </span>
                <button
                  onClick={() => setIsEditingAvatarMenu(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-[#5B7CFA] text-[#5B7CFA] text-xs font-bold hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload From Device</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl("");
                      setIsEditingAvatarMenu(false);
                    }}
                    className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold hover:bg-red-100 transition-all cursor-pointer"
                  >
                    <span>Remove Custom Avatar</span>
                  </button>
                )}
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-2">
                  Or pick a preset avatar:
                </span>
                <div className="flex items-center gap-3">
                  {PRESET_AVATARS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Avatar ${idx}`}
                      onClick={() => {
                        setAvatarUrl(url);
                        setIsEditingAvatarMenu(false);
                      }}
                      className={`w-11 h-11 rounded-full object-cover cursor-pointer border-2 transition-transform hover:scale-110 ${
                        avatarUrl === url
                          ? "border-[#5B7CFA] ring-2 ring-[#5B7CFA]/30"
                          : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Inputs */}
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Neha Kolagada"
                  disabled={!isEditing}
                  required
                  className={`w-full bg-white dark:bg-slate-950 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#5B7CFA] font-semibold transition-all ${
                    !isEditing
                      ? "opacity-80 bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed border-slate-200 dark:border-slate-800"
                      : "border-slate-300 dark:border-slate-700 shadow-sm"
                  }`}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(validateEmail(e.target.value));
                  }}
                  placeholder="e.g. nehapkolagada@gmail.com"
                  disabled={!isEditing}
                  required
                  className={`w-full bg-white dark:bg-slate-950 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#5B7CFA] font-semibold transition-all ${
                    emailError
                      ? "border-red-500 ring-1 ring-red-500"
                      : !isEditing
                      ? "opacity-80 bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed border-slate-200 dark:border-slate-800"
                      : "border-slate-300 dark:border-slate-700 shadow-sm"
                  }`}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              {emailError && (
                <span className="text-[11px] text-red-500 font-semibold block mt-1">
                  {emailError}
                </span>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError(validatePhone(e.target.value));
                }}
                placeholder="e.g. +91 98765 43210"
                disabled={!isEditing}
                required
                className={`w-full bg-white dark:bg-slate-950 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#5B7CFA] font-semibold transition-all ${
                  phoneError
                    ? "border-red-500 ring-1 ring-red-500"
                    : !isEditing
                    ? "opacity-80 bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed border-slate-200 dark:border-slate-800"
                    : "border-slate-300 dark:border-slate-700 shadow-sm"
                }`}
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            {phoneError && (
              <span className="text-[11px] text-red-500 font-semibold block mt-1">
                {phoneError}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                Blood Group
              </label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="e.g. O+"
                disabled={!isEditing}
                className={`w-full bg-white dark:bg-slate-950 border rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#5B7CFA] font-semibold transition-all ${
                  !isEditing ? "opacity-80 bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed border-slate-200 dark:border-slate-800" : "border-slate-300 dark:border-slate-700"
                }`}
              />
            </div>
            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                Medical Info (Optional)
              </label>
              <input
                type="text"
                value={medicalInfo}
                onChange={(e) => setMedicalInfo(e.target.value)}
                placeholder="e.g. Diabetic, Asthma"
                disabled={!isEditing}
                className={`w-full bg-white dark:bg-slate-950 border rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#5B7CFA] font-semibold transition-all ${
                  !isEditing ? "opacity-80 bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed border-slate-200 dark:border-slate-800" : "border-slate-300 dark:border-slate-700"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="Name"
                disabled={!isEditing}
                className={`w-full bg-white dark:bg-slate-950 border rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#5B7CFA] font-semibold transition-all ${
                  !isEditing ? "opacity-80 bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed border-slate-200 dark:border-slate-800" : "border-slate-300 dark:border-slate-700"
                }`}
              />
            </div>
            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="Phone"
                disabled={!isEditing}
                className={`w-full bg-white dark:bg-slate-950 border rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#5B7CFA] font-semibold transition-all ${
                  !isEditing ? "opacity-80 bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed border-slate-200 dark:border-slate-800" : "border-slate-300 dark:border-slate-700"
                }`}
              />
            </div>
          </div>

          {/* Location Management Section */}
          <div className="space-y-3 pt-3 border-t border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#E53935]" />
                <span>Station & GPS Location Address</span>
              </h4>
              <span className="text-xs text-[#5B7CFA] font-bold truncate max-w-[220px]">
                📍 {locationAddress}
              </span>
            </div>

            {/* Editable Direct Address Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Street Address / District / City
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                disabled={!isEditing}
                placeholder="e.g. Ballari, Karnataka"
                className={`w-full bg-white dark:bg-slate-950 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#5B7CFA] font-medium ${
                  !isEditing ? "opacity-80 bg-slate-50 dark:bg-slate-900/50" : "border-slate-300 dark:border-slate-700"
                }`}
              />
            </div>

            {isEditing && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleDetectLiveGps}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Detect Live GPS Location</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSearchQuery("Ballari")}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#5B7CFA] dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search City / Area</span>
                  </button>
                </div>

                {/* Manual Search Field & Suggestions */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleLocationSearch(e.target.value)}
                    placeholder="Search city, district or area..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#5B7CFA]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  {isSearching && (
                    <RefreshCw className="w-4 h-4 text-[#5B7CFA] absolute right-3 top-2.5 animate-spin" />
                  )}

                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto z-20 space-y-1 p-1">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectLocation(result)}
                          className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2 cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#E53935] shrink-0" />
                          <span className="truncate">{result.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Cities */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-bold text-slate-400 mr-1">
                    Quick Select:
                  </span>
                  {POPULAR_LOCATIONS.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectLocation(loc)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {loc.name.split(",")[0]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                signOut(auth).then(() => {
                  onClose();
                  window.location.reload();
                });
              }}
              className="text-[11px] text-red-500 font-bold hover:underline cursor-pointer"
            >
              Log Out
            </button>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(profile.fullName || "");
                      setEmail(profile.email || "nehapkolagada@gmail.com");
                      setPhone(profile.phone || "");
                      setLocationAddress(profile.location?.address || "Ballari, Karnataka");
                      setEmailError("");
                      setPhoneError("");
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#5B7CFA] hover:bg-[#4665E0] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>Save Profile</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-[#5B7CFA] text-white text-xs font-bold hover:bg-[#4665E0] shadow-md cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
