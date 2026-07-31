import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Settings,
  Globe,
  ShieldAlert,
  CloudRain,
  User,
  Cloud,
  CloudLightning,
  Loader2,
  MapPin,
  ThermometerSun,
  Snowflake,
  Menu,
} from "lucide-react";
import { Language } from "../types";

interface HeaderProps {
  isOnline: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  pendingSyncCount: number;
  onTriggerSync: () => void;
  onToggleMobileMenu?: () => void;
  userAvatarUrl?: string;
  userName?: string;
  isProfileIncomplete?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isOnline,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenSettings,
  onOpenProfile,
  pendingSyncCount,
  onTriggerSync,
  onToggleMobileMenu,
  userAvatarUrl,
  userName,
  isProfileIncomplete,
}) => {
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    condition: string;
    city: string;
    alert: string | null;
    icon: React.ReactNode;
  } | null>(null);

  const [greeting, setGreeting] = useState("🌅 Good Morning");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("🌅 Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("☀️ Good Afternoon");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("🌇 Good Evening");
      } else {
        setGreeting("🌙 Good Night");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    let mounted = true;
    let intervalId: any;

    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        let lat = 28.6139; // Default latitude (New Delhi)
        let lon = 77.2090; // Default longitude (New Delhi)
        
        // Attempt to get user location
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
          });
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        } catch (err) {
          console.warn("Geolocation permission denied or timed out. Using default location.");
        }

        // Fetch city name using BigDataCloud reverse geocoding
        let city = "Unknown City";
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          if (res.ok) {
            const data = await res.json();
            city = data.city || data.locality || data.principalSubdivision || "Unknown City";
          }
        } catch (e) {
          console.warn("Reverse geocoding failed", e);
        }

        // Fetch Weather from Open-Meteo
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        if (!weatherRes.ok) throw new Error("Weather fetch failed");
        
        const weatherJson = await weatherRes.json();
        
        if (!mounted) return;

        const current = weatherJson.current_weather;
        const temp = current.temperature;
        const code = current.weathercode;
        
        let condition = "Clear";
        let alert: string | null = null;
        let icon = <Sun className="w-4 h-4 text-amber-500" />;

        // WMO Weather interpretation codes
        if (code === 0) {
          condition = "Clear";
        } else if (code >= 1 && code <= 3) {
          condition = "Partly Cloudy";
          icon = <Cloud className="w-4 h-4 text-slate-400" />;
        } else if (code === 45 || code === 48) {
          condition = "Fog";
          icon = <Cloud className="w-4 h-4 text-slate-400" />;
        } else if (code >= 51 && code <= 57) {
          condition = "Drizzle";
          icon = <CloudRain className="w-4 h-4 text-[#5B7CFA]" />;
        } else if (code >= 61 && code <= 65) {
          condition = "Rain";
          icon = <CloudRain className="w-4 h-4 text-blue-500" />;
          if (code === 65) alert = "Flood Risk Alert";
        } else if (code === 66 || code === 67) {
          condition = "Freezing Rain";
          icon = <CloudRain className="w-4 h-4 text-cyan-500" />;
          alert = "Severe Weather Alert";
        } else if (code >= 71 && code <= 77) {
          condition = "Snow";
          icon = <Snowflake className="w-4 h-4 text-cyan-400" />;
        } else if (code >= 80 && code <= 82) {
          condition = "Rain Showers";
          icon = <CloudRain className="w-4 h-4 text-blue-600" />;
          if (code === 82) alert = "Flood Risk Alert";
        } else if (code >= 85 && code <= 86) {
          condition = "Snow Showers";
          icon = <Snowflake className="w-4 h-4 text-cyan-400" />;
        } else if (code >= 95 && code <= 99) {
          condition = "Thunderstorm";
          icon = <CloudLightning className="w-4 h-4 text-amber-500 animate-pulse" />;
          alert = code >= 96 ? "Severe Thunderstorm" : "Thunderstorm Warning";
        }

        if (temp > 40) {
          alert = "Heatwave Warning";
          icon = <ThermometerSun className="w-4 h-4 text-red-500 animate-pulse" />;
        }

        setWeatherData({ temp, condition, city, alert, icon });
        setWeatherError(false);
      } catch (err) {
        console.error("Failed to fetch weather", err);
        setWeatherError(true);
      } finally {
        if (mounted) setWeatherLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh every 5 minutes
    intervalId = setInterval(fetchWeather, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors backdrop-blur-xl border-b ${
        isDarkMode
          ? "bg-[#15161B]/85 border-white/10 text-slate-100"
          : "bg-white/70 border-white/60 text-[#2D2D2D] shadow-xs"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand & Time Greeting */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2.5 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#E53935] to-[#FF6B6B] shadow-md shadow-red-500/20 text-white font-bold shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight leading-none font-sans">
                AI Emergency Assistant
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/20">
                LIVE
              </span>
            </div>
            <p className="text-xs text-[#757575] mt-0.5">
              {greeting} • Disaster Response Hub
            </p>
          </div>
        </div>

        {/* Center: Live Dynamic Weather Widget */}
        <div className="flex-1 flex justify-center mx-2 overflow-hidden">
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-full text-xs font-semibold max-w-full overflow-x-auto scrollbar-none whitespace-nowrap ${
              isDarkMode
                ? "bg-[#22252D]/90 border border-white/10 text-slate-200"
                : "bg-white/90 border border-purple-200/60 text-[#2D2D2D] shadow-xs"
            }`}
          >
            {weatherLoading && !weatherData ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#5B7CFA]" />
                <span>Locating & fetching weather...</span>
              </div>
            ) : weatherError && !weatherData ? (
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-4 h-4" />
                <span>Unable to fetch live weather.</span>
              </div>
            ) : weatherData ? (
              <>
                <div className="flex items-center gap-1.5" title="Current Location">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{weatherData.city}</span>
                </div>
                <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
                <div className="flex items-center gap-1.5" title="Current Weather">
                  {weatherData.icon}
                  <span>{weatherData.temp}°C • {weatherData.condition}</span>
                </div>
                {weatherData.alert && (
                  <>
                    <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
                    <div className="flex items-center gap-1.5 text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded-md animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{weatherData.alert}</span>
                    </div>
                  </>
                )}
                {!weatherData.alert && (
                  <>
                    <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
                    <span className="text-emerald-500">No Active Weather Alerts</span>
                  </>
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Online/Offline Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              isOnline
                ? "bg-[#46C37B]/10 text-[#46C37B] border border-[#46C37B]/30"
                : "bg-[#F4A261]/10 text-[#F4A261] border border-[#F4A261]/30 animate-pulse"
            }`}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-[#46C37B]" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-[#F4A261]" />
            )}
            <span className="hidden md:inline">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          {/* Pending Sync Button if offline items exist */}
          {pendingSyncCount > 0 && (
            <button
              onClick={onTriggerSync}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F4A261] text-white hover:bg-[#e08e4d] transition-all shadow-sm animate-bounce cursor-pointer"
              title="Click to sync offline emergency items"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Sync ({pendingSyncCount})</span>
            </button>
          )}

          {/* Language Switcher Dropdown */}
          <div
            className={`relative flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
              isDarkMode
                ? "bg-[#22252D] border border-white/10 text-slate-200"
                : "bg-white/90 border border-purple-200/60 text-[#2D2D2D] shadow-xs"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#5B7CFA] mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent focus:outline-none cursor-pointer pr-1 text-xs font-semibold"
            >
              <option value="English" className="bg-[#22252D] text-white">
                English
              </option>
              <option value="Kannada" className="bg-[#22252D] text-white">
                Kannada (ಕನ್ನಡ)
              </option>
              <option value="Hindi" className="bg-[#22252D] text-white">
                Hindi (हिंदी)
              </option>
              <option value="Tamil" className="bg-[#22252D] text-white">
                Tamil (தமிழ்)
              </option>
              <option value="Telugu" className="bg-[#22252D] text-white">
                Telugu (తెలుగు)
              </option>
              <option value="Malayalam" className="bg-[#22252D] text-white">
                Malayalam (മലയാളം)
              </option>
              <option value="Marathi" className="bg-[#22252D] text-white">
                Marathi (मराठी)
              </option>
              <option value="Bengali" className="bg-[#22252D] text-white">
                Bengali (বাংলা)
              </option>
              <option value="Gujarati" className="bg-[#22252D] text-white">
                Gujarati (ગુજરાતી)
              </option>
              <option value="Spanish" className="bg-[#22252D] text-white">
                Spanish (Español)
              </option>
              <option value="French" className="bg-[#22252D] text-white">
                French (Français)
              </option>
            </select>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2.5 rounded-full transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isDarkMode
                ? "bg-[#22252D] text-amber-400 hover:text-amber-300 border border-white/10"
                : "bg-white/90 text-[#2D2D2D] hover:bg-purple-50 border border-purple-200/60 shadow-xs"
            }`}
            title="Toggle Dark / Light Theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className={`p-2.5 rounded-full transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isDarkMode
                ? "bg-[#22252D] text-slate-300 hover:text-white border border-white/10"
                : "bg-white/90 text-[#2D2D2D] hover:bg-purple-50 border border-purple-200/60 shadow-xs"
            }`}
            title="Emergency Settings & Contacts"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Profile Avatar & Name Button */}
          <button
            onClick={onOpenProfile}
            className={`flex items-center gap-2 pl-1 pr-3 py-1.5 min-h-[44px] rounded-full transition-all cursor-pointer border ${
              isDarkMode
                ? "bg-[#22252D] border-white/10 hover:border-white/20 text-white"
                : "bg-white/90 border-slate-200/80 hover:bg-purple-50/50 text-slate-800 shadow-xs"
            }`}
            title="User Profile & Location Management"
          >
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#5B7CFA] to-[#B89AE7] p-0.5 shrink-0 flex items-center justify-center text-white overflow-hidden">
              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt="Profile Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold leading-none truncate max-w-[100px]">
                {userName || "Profile"}
              </span>
              {!isProfileIncomplete && (
                <span className="text-[9px] font-bold text-emerald-500 leading-tight">
                  🟢 Active
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};


