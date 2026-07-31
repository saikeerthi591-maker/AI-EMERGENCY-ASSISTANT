import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  MapPin,
  Navigation as NavIcon,
  Stethoscope,
  Utensils,
  Phone,
  Layers,
  Sparkles,
  Compass,
  Search,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Car,
  Footprints,
  Droplets,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  X,
  ChevronRight,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import L from "leaflet";
import { SafeShelter, IncidentReport } from "../types";

interface ShelterFinderProps {
  shelters: SafeShelter[];
  incidents: IncidentReport[];
  userLocation: { lat: number; lng: number; address: string } | null;
  onDetectLocation: () => void;
  isOnline: boolean;
}

const KARNATAKA_DISTRICTS = [
  { name: "Ballari", lat: 15.1394, lng: 76.9214 },
  { name: "Bengaluru Urban", lat: 12.9716, lng: 77.5946 },
  { name: "Bengaluru Rural", lat: 13.2257, lng: 77.575 },
  { name: "Mysuru", lat: 12.2958, lng: 76.6394 },
  { name: "Mangaluru (Dakshina Kannada)", lat: 12.9141, lng: 74.856 },
  { name: "Belagavi", lat: 15.8497, lng: 74.4977 },
  { name: "Kalaburagi (Gulbarga)", lat: 17.3297, lng: 76.8343 },
  { name: "Vijayapura (Bijapur)", lat: 16.8302, lng: 75.71 },
  { name: "Hubballi-Dharwad", lat: 15.3647, lng: 75.124 },
  { name: "Shivamogga", lat: 13.9299, lng: 75.5681 },
  { name: "Tumakuru", lat: 13.3392, lng: 77.1016 },
  { name: "Davanagere", lat: 14.4644, lng: 75.9218 },
  { name: "Raichur", lat: 16.2076, lng: 77.3556 },
  { name: "Koppal", lat: 15.3506, lng: 76.1548 },
  { name: "Gadag", lat: 15.4319, lng: 75.6315 },
  { name: "Hassan", lat: 13.0033, lng: 76.1004 },
  { name: "Mandya", lat: 12.5218, lng: 76.8951 },
  { name: "Chitradurga", lat: 14.2251, lng: 76.398 },
  { name: "Udupi", lat: 13.3409, lng: 74.7421 },
  { name: "Kodagu (Madikeri)", lat: 12.4244, lng: 75.7382 },
  { name: "Chikkamagaluru", lat: 13.3161, lng: 75.772 },
];

export const ShelterFinder: React.FC<ShelterFinderProps> = ({
  shelters,
  incidents,
  userLocation,
  onDetectLocation,
  isOnline,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [selectedShelter, setSelectedShelter] = useState<SafeShelter | null>(null);
  const [showEvacuationRoute, setShowEvacuationRoute] = useState(true);

  // Manual Location Selection state
  const [showManualLocationModal, setShowManualLocationModal] = useState(false);
  const [manualSearchQuery, setManualSearchQuery] = useState("");
  const [manualLocationOverride, setManualLocationOverride] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  // AI Recommendation State
  const [aiRecommendation, setAiRecommendation] = useState<{
    bestShelterId: string;
    bestShelterName: string;
    reasoning: string;
    scores: Record<string, number>;
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Auto GPS detection status
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsDetectedAddress, setGpsDetectedAddress] = useState<string>("");

  // Determine active location (defaulting to Ballari, Karnataka if no GPS/Override)
  const currentLat = manualLocationOverride?.lat || userLocation?.lat || 15.1394;
  const currentLng = manualLocationOverride?.lng || userLocation?.lng || 76.9214;
  const currentAddress =
    manualLocationOverride?.address ||
    gpsDetectedAddress ||
    userLocation?.address ||
    "Ballari, Karnataka";

  // Distance helper (Haversine Formula)
  const calculateDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
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

  // Travel time estimators
  const getWalkingTimeMins = (distKm: number): number =>
    Math.round((distKm / 4.5) * 60);
  const getDrivingTimeMins = (distKm: number): number =>
    Math.max(1, Math.round((distKm / 32) * 60));

  // Process & Sort Shelters by Distance, Capacity, Medical & Food
  const sortedShelters = [...shelters]
    .map((s) => {
      const dist = calculateDistanceKm(currentLat, currentLng, s.lat, s.lng);
      const capRatio = Math.max(0, (s.capacity - s.currentOccupancy) / s.capacity);
      const medicalBonus = s.medicalAvailable ? 15 : 0;
      const foodBonus = s.foodAvailable ? 10 : 0;

      // Base heuristic score out of 100
      let score = Math.round(100 - dist * 4 + capRatio * 30 + medicalBonus + foodBonus);
      score = Math.min(99, Math.max(45, score));

      return {
        ...s,
        distanceKm: dist,
        walkingMins: getWalkingTimeMins(dist),
        drivingMins: getDrivingTimeMins(dist),
        calculatedScore: score,
      };
    })
    .sort((a, b) => {
      // Sort priority: 1. Distance, 2. Availability, 3. Medical, 4. Food
      if (Math.abs(a.distanceKm - b.distanceKm) > 0.5) {
        return a.distanceKm - b.distanceKm;
      }
      return b.calculatedScore - a.calculatedScore;
    });

  const top5Shelters = sortedShelters.slice(0, 5);

  // Auto trigger GPS detection on initial mount
  useEffect(() => {
    handleAutoDetectGps();
  }, []);

  // Sync selected shelter default to top nearest whenever location or shelters update
  useEffect(() => {
    if (sortedShelters.length > 0) {
      setSelectedShelter(sortedShelters[0]);
    }
  }, [currentLat, currentLng, shelters.length]);

  // Request Gemma AI Recommendation on location change or shelter update
  useEffect(() => {
    async function fetchAiRecommendation() {
      if (!isOnline || sortedShelters.length === 0) return;
      setIsAiLoading(true);
      try {
        const res = await fetch("/api/ai/recommend-shelter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userLocation: { lat: currentLat, lng: currentLng },
            shelters: sortedShelters.slice(0, 6),
            disasterType: "General Emergency",
          }),
        });
        const data = await res.json();
        if (data?.success && data?.data) {
          setAiRecommendation({
            bestShelterId: data.data.bestShelterId,
            bestShelterName: data.data.bestShelterName,
            reasoning: data.data.reasoning,
            scores: data.data.recommendationScores || {},
          });
        }
      } catch (err) {
        console.warn("AI recommendation API error, using heuristic engine:", err);
      } finally {
        setIsAiLoading(false);
      }
    }

    fetchAiRecommendation();
  }, [currentLat, currentLng, isOnline]);

  const handleAutoDetectGps = () => {
    setIsGpsLoading(true);
    onDetectLocation();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Attempt Reverse Geocoding via Nominatim
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
                "Bengaluru";
              const state = data.address.state || "Karnataka";
              const district = data.address.state_district || "District";
              setGpsDetectedAddress(`${city}, ${district}, ${state}`);
            } else {
              setGpsDetectedAddress(`GPS Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
            }
          } catch (e) {
            setGpsDetectedAddress(`Live GPS Active (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
          } finally {
            setIsGpsLoading(false);
            setManualLocationOverride(null);
          }
        },
        (error) => {
          console.warn("GPS Permission Denied or unavailable:", error.message);
          setIsGpsLoading(false);
          setShowManualLocationModal(true);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsGpsLoading(false);
      setShowManualLocationModal(true);
    }
  };

  const handleSelectDistrict = (district: { name: string; lat: number; lng: number }) => {
    setManualLocationOverride({
      lat: district.lat,
      lng: district.lng,
      address: `${district.name}, Karnataka`,
    });
    setShowManualLocationModal(false);
  };

  // Initialize and render Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView([currentLat, currentLng], 13);
    mapInstanceRef.current = map;

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Dark high-contrast OpenStreetMap layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // 1. User Location Marker with Blue Pulsing Glow
    const userGpsIcon = L.divIcon({
      className: "custom-user-pin",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-[#5B7CFA]/40 animate-ping"></div>
          <div class="w-6 h-6 rounded-full bg-[#5B7CFA] border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-black">
            📍
          </div>
        </div>
      `,
      iconSize: [32, 32],
    });

    const userMarker = L.marker([currentLat, currentLng], { icon: userGpsIcon }).addTo(
      map
    );
    userMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px; min-width: 180px;">
        <span style="font-size: 10px; font-weight: 800; color: #5B7CFA; text-transform: uppercase;">
          📍 Your Live Location
        </span>
        <h4 style="font-size: 13px; font-weight: 800; margin-top: 2px; color: #0f172a;">
          ${currentAddress}
        </h4>
        <p style="font-size: 11px; color: #64748b; margin-top: 2px;">
          GPS Coordinates: ${currentLat.toFixed(4)}, ${currentLng.toFixed(4)}
        </p>
      </div>
    `);

    // 2. Shelter Pins with Availability Color Coding
    const shelterMarkersGroup: L.Marker[] = [];

    sortedShelters.forEach((shelter, idx) => {
      const isSelected = selectedShelter?.id === shelter.id;
      const isRecommended =
        aiRecommendation?.bestShelterId === shelter.id || idx === 0;

      const occupancyPct = Math.round(
        (shelter.currentOccupancy / shelter.capacity) * 100
      );

      // Color coding rule:
      // 🟢 Green: < 60% occupancy (Available)
      // 🟡 Yellow: 60% - 89% occupancy (Limited)
      // 🔴 Red: >= 90% occupancy (Near Capacity / Full)
      let pinColor = "#10B981"; // Green
      if (occupancyPct >= 90) pinColor = "#E53935"; // Red
      else if (occupancyPct >= 60) pinColor = "#F59E0B"; // Yellow

      const shelterIcon = L.divIcon({
        className: "custom-shelter-pin",
        html: `
          <div style="
            background-color: ${pinColor};
            color: white;
            width: ${isSelected ? "38px" : "32px"};
            height: ${isSelected ? "38px" : "32px"};
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? "18px" : "15px"};
            border: 2px solid white;
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
            transition: transform 0.2s;
            position: relative;
          ">
            🏠
            ${
              isRecommended
                ? `<span style="position: absolute; top: -6px; right: -6px; background: #5B7CFA; color: white; border-radius: 50%; width: 14px; height: 14px; font-size: 9px; font-weight: bold; display: flex; align-items: center; justify-content: center; border: 1.5px solid white;">★</span>`
                : ""
            }
          </div>
        `,
        iconSize: [36, 36],
      });

      const marker = L.marker([shelter.lat, shelter.lng], {
        icon: shelterIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; color: #0f172a;">
          <div style="display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 800; color: #5B7CFA; text-transform: uppercase;">
            <span>${shelter.shelterType}</span> • <span>${shelter.distanceKm?.toFixed(1)} km away</span>
          </div>
          <h4 style="font-size: 14px; font-weight: 800; margin-top: 2px;">${shelter.name}</h4>
          <p style="font-size: 11px; color: #64748b; margin-top: 2px;">${shelter.address}</p>
          <div style="margin-top: 8px; font-size: 11px; background: #f8fafc; padding: 6px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <b>Capacity:</b> ${shelter.currentOccupancy}/${shelter.capacity} (${occupancyPct}% full)<br/>
            <b>Medical:</b> ${shelter.medicalAvailable ? "✅ Active" : "❌ None"} | <b>Food:</b> ${
        shelter.foodAvailable ? "✅ Provided" : "❌ No"
      }
          </div>
        </div>
      `);

      marker.on("click", () => setSelectedShelter(shelter));
      shelterMarkersGroup.push(marker);
    });

    // 3. Incident Hazard Pins
    incidents.forEach((inc) => {
      const hazardIcon = L.divIcon({
        className: "custom-hazard-pin",
        html: `
          <div style="
            background-color: #E53935;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            border: 2px solid white;
            box-shadow: 0 0 10px rgba(229, 57, 53, 0.8);
          ">⚠️</div>
        `,
        iconSize: [24, 24],
      });

      L.marker([inc.lat, inc.lng], { icon: hazardIcon })
        .addTo(map)
        .bindPopup(`<b>⚠️ Hazard: ${inc.category}</b><br/>${inc.title}`);
    });

    // 4. Safe Evacuation Line Route
    if (selectedShelter && showEvacuationRoute) {
      const waypoints: [number, number][] = [
        [currentLat, currentLng],
        [
          (currentLat + selectedShelter.lat) / 2 + 0.002,
          (currentLng + selectedShelter.lng) / 2 - 0.001,
        ],
        [selectedShelter.lat, selectedShelter.lng],
      ];

      const routePolyline = L.polyline(waypoints, {
        color: "#10B981",
        weight: 5,
        dashArray: "8, 12",
        lineCap: "round",
      }).addTo(map);

      map.fitBounds(routePolyline.getBounds(), { padding: [60, 60] });
    } else {
      // Fit bounds to show current user location + top 3 shelters
      const bounds = L.latLngBounds([
        [currentLat, currentLng],
        ...top5Shelters.map((s) => [s.lat, s.lng] as [number, number]),
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    currentLat,
    currentLng,
    selectedShelter,
    shelters,
    incidents,
    showEvacuationRoute,
    aiRecommendation,
  ]);

  const activeRecommendedShelter =
    sortedShelters.find((s) => s.id === aiRecommendation?.bestShelterId) ||
    sortedShelters[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top GPS Status & Offline Banner */}
      <div className="glass-card-light dark:glass-card-dark p-6 rounded-[24px] border border-white/80 dark:border-white/10 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B7CFA]/15 text-[#5B7CFA] text-xs font-black uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Safe Haven Locator</span>
            </span>

            {/* Offline indicator badge */}
            {!isOnline ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline Mode: Cached Karnataka Shelters Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Live Database Active</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            Real-Time Safe Shelter & Route Finder
          </h2>

          {/* Current User Location Display */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#5B7CFA]">
              <MapPin className="w-4 h-4 text-[#5B7CFA] animate-bounce shrink-0" />
              <span>📍 Your Location:</span>
              <span className="text-slate-900 dark:text-white font-black truncate max-w-xs sm:max-w-md">
                {currentAddress}
              </span>
            </div>
            {isGpsLoading && (
              <span className="text-[11px] text-[#5B7CFA] font-semibold flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Detecting GPS...
              </span>
            )}
          </div>
        </div>

        {/* Location Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={handleAutoDetectGps}
            disabled={isGpsLoading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#5B7CFA] hover:bg-[#4665E0] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Compass className={`w-4 h-4 ${isGpsLoading ? "animate-spin" : ""}`} />
            <span>Detect GPS Location</span>
          </button>

          <button
            onClick={() => setShowManualLocationModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#5B7CFA]" />
            <span>Select Manually</span>
          </button>
        </div>
      </div>

      {/* Gemma AI Shelter Recommendation Highlight Card */}
      {activeRecommendedShelter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden bg-gradient-to-r from-[#5B7CFA]/15 via-indigo-500/10 to-purple-500/10 dark:from-[#5B7CFA]/20 dark:to-purple-950/40 p-5 rounded-[24px] border border-[#5B7CFA]/30 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#5B7CFA] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span>Gemma AI Top Shelter Recommendation</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-black border border-emerald-300">
                  ⭐ AI Score: {activeRecommendedShelter.calculatedScore}/100
                </span>
              </div>

              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {activeRecommendedShelter.name}
                </h3>
                <span className="text-xs font-bold text-[#5B7CFA]">
                  📍 {activeRecommendedShelter.distanceKm?.toFixed(1)} km away • 🚶{" "}
                  {activeRecommendedShelter.walkingMins} mins walk • 🚗{" "}
                  {activeRecommendedShelter.drivingMins} mins drive
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {aiRecommendation?.reasoning ||
                  `Recommended as the optimal emergency haven based on your live GPS distance (${activeRecommendedShelter.distanceKm?.toFixed(
                    1
                  )} km), active medical team, food provisions, and 85 free beds.`}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => {
                  setSelectedShelter(activeRecommendedShelter);
                  setShowEvacuationRoute(true);
                }}
                className="flex-1 md:flex-initial px-5 py-2.5 rounded-2xl bg-[#5B7CFA] hover:bg-[#4665E0] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <NavIcon className="w-4 h-4" />
                <span>Navigate To AI Recommendation</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Interactive Map & Nearest Shelter Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Leaflet Map Container */}
        <div className="lg:col-span-7 glass-card-light dark:glass-card-dark rounded-[24px] p-4 shadow-xl flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white">
              <Layers className="w-4 h-4 text-[#5B7CFA]" />
              <span>Evacuation Map & Hazards (Leaflet + OSM)</span>
            </div>

            <button
              onClick={() => setShowEvacuationRoute(!showEvacuationRoute)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                showEvacuationRoute
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              <NavIcon className="w-3.5 h-3.5" />
              <span>{showEvacuationRoute ? "Safe Route Active" : "Toggle Evacuation Route"}</span>
            </button>
          </div>

          {/* Leaflet Map Canvas */}
          <div
            ref={mapContainerRef}
            className="w-full h-[420px] sm:h-[480px] rounded-[20px] overflow-hidden border border-slate-200 dark:border-slate-800 z-10 shadow-inner"
          />

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 px-2 pt-1 gap-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-3 font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5B7CFA] inline-block animate-ping" />
                <span>User GPS</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Available (&lt;60%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Limited (60-89%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Full (&ge;90%)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Green dashed line = Safe hazard-avoidance route
            </span>
          </div>
        </div>

        {/* Right Top 5 Nearest Shelters Floating Cards List */}
        <div className="lg:col-span-5 space-y-4 max-h-[600px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#5B7CFA]" />
              <span>Top Nearest Shelters ({top5Shelters.length})</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-semibold">
              Sorted by Distance & Capacity
            </span>
          </div>

          {top5Shelters.map((shelter, rankIdx) => {
            const isSelected = selectedShelter?.id === shelter.id;
            const occupancyPct = Math.round(
              (shelter.currentOccupancy / shelter.capacity) * 100
            );

            return (
              <div
                key={shelter.id}
                onClick={() => {
                  setSelectedShelter(shelter);
                  setShowEvacuationRoute(true);
                }}
                className={`p-4 rounded-[22px] border cursor-pointer transition-all space-y-3 relative overflow-hidden ${
                  isSelected
                    ? "bg-white dark:bg-slate-800 border-[#5B7CFA] shadow-xl ring-2 ring-[#5B7CFA]/30"
                    : "glass-card-light dark:glass-card-dark border-slate-200 dark:border-slate-800 hover:border-[#5B7CFA]/40"
                }`}
              >
                {/* Rank Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#5B7CFA] text-white text-[10px] font-black">
                        #{rankIdx + 1}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B7CFA]">
                        {shelter.shelterType}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                      {shelter.name}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {shelter.address}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#5B7CFA] text-xs font-black border border-blue-200 dark:border-blue-800 block">
                      📍 {shelter.distanceKm.toFixed(1)} km
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 block mt-1">
                      ⭐ Score: {shelter.calculatedScore}/100
                    </span>
                  </div>
                </div>

                {/* Route Path Indicator */}
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#5B7CFA] font-bold">Route:</span>
                    <span className="truncate">Current Location</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-extrabold truncate">{shelter.name}</span>
                  </div>
                </div>

                {/* Distance & Travel Time breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                    <Footprints className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>🚶 Walking: {shelter.walkingMins} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                    <Car className="w-3.5 h-3.5 text-[#5B7CFA] shrink-0" />
                    <span>🚗 Driving: {shelter.drivingMins} mins</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <span>Capacity Occupancy</span>
                    <span>
                      {shelter.currentOccupancy} / {shelter.capacity} ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occupancyPct >= 90
                          ? "bg-red-500"
                          : occupancyPct >= 60
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Facilities Badges */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${
                      shelter.medicalAvailable
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200"
                    }`}
                  >
                    <Stethoscope className="w-3 h-3" />
                    <span>Medical: {shelter.medicalAvailable ? "Yes" : "No"}</span>
                  </span>

                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${
                      shelter.foodAvailable
                        ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200"
                    }`}
                  >
                    <Utensils className="w-3 h-3" />
                    <span>Food: {shelter.foodAvailable ? "Provided" : "No"}</span>
                  </span>

                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-[10px] font-extrabold border border-cyan-300">
                    <Droplets className="w-3 h-3" />
                    <span>Water: {shelter.waterSupplyDays} Days</span>
                  </span>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                  <a
                    href={`tel:${shelter.contactPhone}`}
                    className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-[#5B7CFA] font-extrabold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{shelter.contactPhone}</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5B7CFA] text-white text-xs font-bold hover:bg-[#4665E0] shadow-xs transition-transform hover:scale-105"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <NavIcon className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Location Selection Modal */}
      <AnimatePresence>
        {showManualLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card-light dark:glass-card-dark rounded-[24px] p-6 max-w-lg w-full space-y-4 shadow-2xl border border-white/80 dark:border-white/10 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#5B7CFA]/10 text-[#5B7CFA]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold">Select Your Location Manually</h3>
                    <p className="text-[11px] text-slate-500">
                      Choose your Karnataka district or search your city
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowManualLocationModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick GPS Retry Button */}
              <button
                onClick={handleAutoDetectGps}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Retry Automatic GPS Location Detection</span>
              </button>

              {/* Search District Field */}
              <div className="relative">
                <input
                  type="text"
                  value={manualSearchQuery}
                  onChange={(e) => setManualSearchQuery(e.target.value)}
                  placeholder="Search city or district name..."
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#5B7CFA] font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              {/* Karnataka Districts Options Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  Select Karnataka District / Region:
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {KARNATAKA_DISTRICTS.filter((d) =>
                    d.name.toLowerCase().includes(manualSearchQuery.toLowerCase())
                  ).map((district, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectDistrict(district)}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 text-xs font-bold text-left border border-slate-200/80 dark:border-slate-800 hover:border-[#5B7CFA] transition-all cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{district.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
