import React from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  Building2,
  AlertCircle,
  LifeBuoy,
  MessageSquareCode,
  Camera,
  HeartPulse,
  Settings,
  Users,
  ShieldAlert,
  UserPlus,
  Radio,
  X,
} from "lucide-react";

export type TabType =
  | "home"
  | "livefeed"
  | "alerts"
  | "shelters"
  | "sos"
  | "rescue"
  | "chat"
  | "reporting"
  | "firstaid"
  | "volunteer";

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isDarkMode?: boolean;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  isDarkMode = false,
  onOpenSettings,
  onOpenProfile,
  isMobileMenuOpen = false,
  onCloseMobileMenu,
}) => {
  const tabs = [
    { id: "home", label: "Dashboard", icon: LayoutDashboard },
    { id: "livefeed", label: "Live Feed", icon: Radio },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "shelters", label: "Shelters", icon: Building2 },
    { id: "sos", label: "SOS", icon: AlertCircle, isDanger: true },
    { id: "rescue", label: "Rescue", icon: LifeBuoy },
    { id: "chat", label: "AI Chat", icon: MessageSquareCode },
    { id: "reporting", label: "Reports", icon: Camera },
    { id: "firstaid", label: "First Aid", icon: HeartPulse },
    { id: "volunteer", label: "Volunteer", icon: UserPlus },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Desktop Left Sidebar & Mobile Drawer */}
      <aside
        className={`flex flex-col w-64 fixed top-0 lg:top-20 bottom-0 lg:bottom-4 left-0 lg:left-4 z-50 lg:z-30 lg:rounded-3xl p-4 transition-transform duration-300 backdrop-blur-2xl ${
          isDarkMode
            ? "bg-[#1E2028]/95 border-r lg:border border-white/10 text-slate-200 shadow-2xl"
            : "bg-white/95 border-r lg:border border-white/80 text-[#2D2D2D] shadow-xl shadow-purple-900/5"
        } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Navigation Header / Logo */}
        <div className="px-3 py-2 mb-4 flex items-center justify-between border-b border-slate-200/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#5B7CFA]/10 text-[#5B7CFA]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#2D2D2D] dark:text-white block">
                Emergency Hub
              </span>
              <span className="text-[10px] text-[#757575] uppercase font-bold tracking-wider">
                Navigation
              </span>
            </div>
          </div>
          {onCloseMobileMenu && (
            <button onClick={onCloseMobileMenu} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menu Links */}
        <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            if (tab.isDanger) {
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#E53935] text-white shadow-lg shadow-red-500/30 animate-pulse"
                      : "bg-[#E53935]/10 text-[#E53935] hover:bg-[#E53935]/20 border border-[#E53935]/20"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 animate-bounce" />
                  <span className="flex-1 text-left">{tab.label}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-white/20 font-bold">
                    SOS
                  </span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#5B7CFA] to-[#4665E0] text-white shadow-md shadow-blue-500/20 font-bold"
                    : isDarkMode
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-[#757575] hover:text-[#2D2D2D] hover:bg-purple-50/80"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-white" : "text-[#757575]"
                  }`}
                />
                <span className="flex-1 text-left">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Contacts & Settings */}
        <div className="pt-3 border-t border-slate-200/20 space-y-1 mt-auto">
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-[#757575] hover:text-[#2D2D2D] hover:bg-purple-50/80"
              }`}
            >
              <Users className="w-4 h-4 text-[#5B7CFA]" />
              <span>User Profile</span>
            </button>
          )}

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-[#757575] hover:text-[#2D2D2D] hover:bg-purple-50/80"
              }`}
            >
              <Settings className="w-4 h-4 text-[#B89AE7]" />
              <span>Settings</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Glass Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-2xl px-2 py-2 transition-all ${
          isDarkMode
            ? "bg-[#15161B]/90 border-white/10 text-slate-300"
            : "bg-white/85 border-purple-100 text-[#2D2D2D] shadow-lg"
        }`}
      >
        <div className="flex items-center justify-around">
          {tabs.slice(0, 5).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as TabType)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all min-w-[56px] min-h-[48px] cursor-pointer ${
                  tab.isDanger
                    ? isActive
                      ? "bg-[#E53935] text-white shadow-md shadow-red-500/40"
                      : "text-[#E53935]"
                    : isActive
                    ? "text-[#5B7CFA] font-bold bg-[#5B7CFA]/10"
                    : "text-[#757575] hover:text-[#2D2D2D]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${tab.isDanger ? "animate-pulse" : ""}`}
                />
                <span className="text-[10px] mt-0.5 font-semibold tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => {
              const remaining = ["rescue", "chat", "reporting", "firstaid", "volunteer"];
              const currentIndex = remaining.indexOf(activeTab);
              const nextTab =
                remaining[(currentIndex + 1) % remaining.length];
              onSelectTab(nextTab as TabType);
            }}
            className={`flex flex-col items-center justify-center p-1.5 rounded-2xl text-[#757575] min-w-[56px] min-h-[48px] cursor-pointer ${
              ["rescue", "chat", "reporting", "firstaid", "volunteer"].includes(activeTab)
                ? "text-[#5B7CFA] font-bold bg-[#5B7CFA]/10"
                : ""
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-semibold tracking-tight">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

