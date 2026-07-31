import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Flame,
  CloudRain,
  Wind,
  MapPin,
  Clock,
  Navigation as NavigationIcon,
  Phone,
  ChevronRight,
  Activity,
  HeartPulse,
  Filter,
  ThermometerSun,
  Zap,
  Car,
  Cross,
  Radio,
  WifiOff
} from "lucide-react";

export type DisasterType = "Flood" | "Earthquake" | "Cyclone" | "Fire" | "Landslide" | "Heatwave" | "Thunderstorm" | "Heavy Rain" | "Road Accident" | "Medical Emergency" | "Rescue Operations" | "Weather Alerts";
export type Severity = "Low" | "Medium" | "High" | "Critical";
export type Status = "Active" | "Resolved" | "Ongoing";

export interface FeedEvent {
  id: string;
  type: DisasterType;
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  severity: Severity;
  timestamp: Date;
  source: string;
  status: Status;
}

const mockEvents: FeedEvent[] = [
  {
    id: "1",
    type: "Cyclone",
    title: "Cyclone Warning: Biparjoy",
    description: "Severe cyclonic storm expected to make landfall within 24 hours. Evacuation ordered in coastal areas.",
    location: "Coastal Gujarat",
    coordinates: { lat: 23.2599, lng: 72.6253 }, // Arbitrary for demo
    severity: "Critical",
    timestamp: new Date(Date.now() - 5 * 60000), // 5 mins ago
    source: "NDMA India",
    status: "Active"
  },
  {
    id: "2",
    type: "Flood",
    title: "Flash Flood Alert",
    description: "Water levels rising above danger mark due to heavy rainfall. Avoid low-lying areas.",
    location: "Mumbai, Maharashtra",
    coordinates: { lat: 19.0760, lng: 72.8777 },
    severity: "High",
    timestamp: new Date(Date.now() - 15 * 60000),
    source: "IMD Weather Alerts",
    status: "Active"
  },
  {
    id: "3",
    type: "Road Accident",
    title: "Major Highway Collision",
    description: "Multi-vehicle collision reported on Expressway. Traffic diverted. Emergency services on scene.",
    location: "NH-48, Delhi-Gurgaon",
    coordinates: { lat: 28.5355, lng: 77.3910 },
    severity: "Medium",
    timestamp: new Date(Date.now() - 45 * 60000),
    source: "Traffic Police",
    status: "Ongoing"
  },
  {
    id: "4",
    type: "Fire",
    title: "Industrial Area Fire",
    description: "Chemical factory on fire. Fire brigade attempting to control the blaze. Surrounding area cordoned off.",
    location: "Peenya Industrial Area, Bengaluru",
    coordinates: { lat: 13.0285, lng: 77.5197 },
    severity: "High",
    timestamp: new Date(Date.now() - 120 * 60000),
    source: "State Fire Services",
    status: "Active"
  },
  {
    id: "5",
    type: "Medical Emergency",
    title: "Medical Camp Request",
    description: "Need immediate medical supplies and personnel at relief camp due to outbreak of waterborne diseases.",
    location: "Relief Camp A, Assam",
    coordinates: { lat: 26.2006, lng: 92.9376 },
    severity: "Medium",
    timestamp: new Date(Date.now() - 150 * 60000),
    source: "Local NGO",
    status: "Ongoing"
  },
  {
    id: "6",
    type: "Earthquake",
    title: "Mild Tremors Felt",
    description: "Magnitude 4.2 earthquake recorded. No major damage reported so far.",
    location: "Shimla, Himachal Pradesh",
    coordinates: { lat: 31.1048, lng: 77.1734 },
    severity: "Low",
    timestamp: new Date(Date.now() - 240 * 60000),
    source: "National Center for Seismology",
    status: "Resolved"
  }
];

const getSeverityColor = (severity: Severity) => {
  switch (severity) {
    case "Critical": return "bg-red-500 text-white";
    case "High": return "bg-orange-500 text-white";
    case "Medium": return "bg-yellow-500 text-black";
    case "Low": return "bg-green-500 text-white";
    default: return "bg-slate-500 text-white";
  }
};

const getDisasterIcon = (type: DisasterType) => {
  switch (type) {
    case "Fire": return <Flame className="w-5 h-5" />;
    case "Flood": return <CloudRain className="w-5 h-5" />;
    case "Heavy Rain": return <CloudRain className="w-5 h-5" />;
    case "Cyclone": return <Wind className="w-5 h-5" />;
    case "Earthquake": return <Activity className="w-5 h-5" />;
    case "Heatwave": return <ThermometerSun className="w-5 h-5" />;
    case "Thunderstorm": return <Zap className="w-5 h-5" />;
    case "Road Accident": return <Car className="w-5 h-5" />;
    case "Medical Emergency": return <HeartPulse className="w-5 h-5" />;
    default: return <AlertTriangle className="w-5 h-5" />;
  }
};

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

interface LiveEmergencyFeedProps {
  isDarkMode?: boolean;
  isOnline: boolean;
}

export const LiveEmergencyFeed: React.FC<LiveEmergencyFeedProps> = ({ isDarkMode = false, isOnline }) => {
  const [events, setEvents] = useState<FeedEvent[]>(mockEvents);
  const [filterSeverity, setFilterSeverity] = useState<Severity | "All">("All");
  const [filterType, setFilterType] = useState<DisasterType | "All">("All");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Simulate live feed updates
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      // In a real app, this would fetch from an API
      // Here we just trigger a re-render to update the "time ago" timestamps
      // and randomly we could add a new event, but we'll just keep it simple
      setLastUpdated(new Date());
      setEvents(prev => [...prev].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline]);

  const filteredEvents = events.filter(e => {
    if (filterSeverity !== "All" && e.severity !== filterSeverity) return false;
    if (filterType !== "All" && e.type !== filterType) return false;
    return true;
  });

  const criticalEvents = events.filter(e => (e.severity === "Critical" || e.severity === "High") && e.status === "Active");
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);
  
  const visibleCriticalEvents = criticalEvents.filter(e => !dismissedBanners.includes(e.id));

  return (
    <div className={`flex flex-col ${isDarkMode ? "bg-[#15161B] text-white" : "bg-slate-50 text-slate-900"} rounded-3xl min-h-[calc(100vh-120px)]`}>
      <div className="px-6 py-6 md:px-12 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl relative">
              {isOnline && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />}
              {isOnline && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />}
              <Radio className="w-7 h-7" />
            </div>
            Live Emergency Feed
          </h1>
          {!isOnline && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-500/10 text-slate-500 rounded-full text-sm font-bold">
              <WifiOff className="w-4 h-4" />
              Offline
            </div>
          )}
        </div>
        <p className={`font-medium text-lg ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          Real-time disaster updates, alerts, and rescue operations.
        </p>
      </div>

      {visibleCriticalEvents.length > 0 && isOnline && (
        <div className="px-6 md:px-12 mb-4 flex-shrink-0 space-y-3">
          {visibleCriticalEvents.map(event => (
            <div key={event.id} className="bg-red-500 text-white p-4 rounded-2xl flex items-start gap-4 shadow-lg shadow-red-500/20">
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-red-100 text-sm font-medium mt-1">{event.location}</p>
              </div>
              <button 
                onClick={() => setDismissedBanners(prev => [...prev, event.id])}
                className="text-white/70 hover:text-white p-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className={`px-6 md:px-12 py-3 flex gap-3 overflow-x-auto no-scrollbar flex-shrink-0 ${isDarkMode ? "border-white/5" : "border-slate-200"} border-b`}>
        <div className="flex items-center gap-2 text-sm font-bold shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Filters:</span>
        </div>
        <select 
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value as any)}
          className={`px-4 py-2 rounded-xl text-sm font-bold outline-none cursor-pointer border ${
            isDarkMode ? "bg-[#1A1C21] border-white/10" : "bg-white border-slate-200"
          }`}
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className={`px-4 py-2 rounded-xl text-sm font-bold outline-none cursor-pointer border ${
            isDarkMode ? "bg-[#1A1C21] border-white/10" : "bg-white border-slate-200"
          }`}
        >
          <option value="All">All Types</option>
          <option value="Flood">Flood</option>
          <option value="Cyclone">Cyclone</option>
          <option value="Earthquake">Earthquake</option>
          <option value="Fire">Fire</option>
          <option value="Road Accident">Road Accident</option>
        </select>
      </div>

      <div className="flex-1 p-6 md:p-12 space-y-6">
        {!isOnline && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl flex items-center gap-3 font-medium text-sm">
            <WifiOff className="w-5 h-5 shrink-0" />
            Offline - Showing last available emergency updates.
          </div>
        )}

        {filteredEvents.map(event => (
          <div key={event.id} className={`rounded-3xl border ${isDarkMode ? "bg-[#22252D] border-white/5" : "bg-white border-slate-200"} p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isDarkMode ? "bg-[#1A1C21]" : "bg-slate-100"}`}>
                  <div className={
                    event.severity === "Critical" ? "text-red-500" :
                    event.severity === "High" ? "text-orange-500" :
                    event.severity === "Medium" ? "text-yellow-500" :
                    "text-green-500"
                  }>
                    {getDisasterIcon(event.type)}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg ${
                      event.status === "Active" ? "bg-red-500/10 text-red-500" :
                      event.status === "Ongoing" ? "bg-blue-500/10 text-blue-500" :
                      "bg-green-500/10 text-green-500"
                    }`}>
                      {event.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTimeAgo(event.timestamp)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                  <p className={`text-sm font-medium leading-relaxed mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {event.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#5B7CFA]" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-[#5B7CFA]" />
                      Source: {event.source}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {event.status === "Active" && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Activate SOS
                </button>
                <button className="px-4 py-2 bg-[#5B7CFA]/10 text-[#5B7CFA] text-sm font-bold rounded-xl hover:bg-[#5B7CFA]/20 transition-colors flex items-center gap-2">
                  <NavigationIcon className="w-4 h-4" />
                  Find Shelter
                </button>
                <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center gap-2 ml-auto">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            {event.status !== "Active" && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end">
                <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center gap-2">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            
          </div>
        ))}
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <Radio className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No updates found</h3>
            <p className="text-slate-500">Try adjusting your filters to see more events.</p>
          </div>
        )}
      </div>
    </div>
  );
};
