"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Bell, ShieldAlert, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Topbar() {
  const router = useRouter();
  const [alertCount, setAlertCount] = useState(0);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      let parsedUser = JSON.parse(storedUser);
      if (parsedUser.name === "Aryan Jain") {
        parsedUser.name = "Yash Chauhan";
        localStorage.setItem("user", JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
    } else {
      router.push("/login");
    }

    const timer = setInterval(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      setCurrentTime(now.toLocaleString('en-GB', options).replace(',', ''));
    }, 1000);

    const fetchActiveAlerts = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/events`)
        .then(res => res.json())
        .then(data => {
          const activeAlerts = data.filter((e: any) => e.is_alert && (!e.status || e.status === "ACTIVE"));
          setAlertCount(activeAlerts.length);
          setAlerts(activeAlerts.slice(0, 5));
        })
        .catch(err => console.error(err));
    };

    fetchActiveAlerts();
    window.addEventListener("alertsUpdated", fetchActiveAlerts);

    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}`}/ws`);
    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "ALERT" && data.data.is_alert && (!data.data.status || data.data.status === "ACTIVE")) {
        setAlertCount(prev => prev + 1);
        setAlerts(prev => [data.data, ...prev].slice(0, 5));
      }
      if (data.type === "ALERT_UPDATE") {
        fetchActiveAlerts();
      }
    };

    return () => {
      ws.current?.close();
      clearInterval(timer);
      window.removeEventListener("alertsUpdated", fetchActiveAlerts);
    };
  }, [router]);

  return (
    <header className="relative h-[70px] bg-black/40 backdrop-blur-2xl border-white/10 border-b flex items-center justify-between px-6 shrink-0 z-50">
      
      {/* Search Bar */}
      <div className="relative w-96">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search cameras, assets, alerts..." 
          className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-400 transition-colors w-full text-slate-200 placeholder:text-slate-600"
        />
      </div>
      
      <div className="flex items-center gap-6">
        
        {/* Date Time Display */}
        <div className="hidden md:block text-slate-400 text-sm font-mono bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 px-4 py-1.5 rounded-full shadow-inner">
          {currentTime || "Loading..."}
        </div>
        
        <div className="flex items-center gap-4 relative">
          
          <div className="relative">
            <button 
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); setAlertCount(0); }}
              className={`relative text-slate-400 hover:text-white transition-colors cursor-pointer p-2 rounded-full border border-transparent hover:border-white/10 ${isNotifOpen ? 'bg-[#1e293b]/50 text-white' : ''}`}
            >
              <Bell size={20} className={alertCount > 0 ? "animate-pulse text-rose-400" : ""} />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-rose-500/20 border-2 border-[#0b101e]">
                  {alertCount > 99 ? '99+' : alertCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50">
                <div className="p-3 bg-black/40 backdrop-blur-2xl border-white/10 border-b border-white/10 font-medium text-white flex justify-between items-center">
                  <span>Recent Incidents</span>
                  <span className="text-[10px] bg-[#1e293b] px-2 py-1 rounded text-slate-400 cursor-pointer">Mark all read</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
                  {alerts.map((a, i) => (
                    <div key={i} className="p-4 border-b border-white/10 hover:bg-[#1e293b]/50 transition cursor-pointer flex gap-3 items-start">
                      <div className="mt-1 text-rose-500 bg-rose-500/10 p-1.5 rounded-2xl border border-rose-500/20"><ShieldAlert size={16}/></div>
                      <div>
                        <div className="text-rose-400 text-sm font-bold mb-0.5">{a.watchlist_reason || 'Critical Detection'}</div>
                        <div className="text-slate-300 font-mono text-[11px] mb-1">{a.entity_value} detected at {a.camera_name}</div>
                        <div className="text-slate-500 text-[10px]">{a.timestamp ? format(new Date(a.timestamp), 'HH:mm:ss') : 'Just now'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <div className={`flex items-center gap-2 cursor-pointer p-1.5 rounded-full border border-white/10 transition bg-slate-900/80 backdrop-blur-2xl border border-white/10 hover:bg-[#1e293b]/50 pr-4`} onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}>
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <span className="text-sm font-medium text-white">{user?.name ? user.name.split(" ")[0] : 'Admin'}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 py-1">
                <div className="px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-2xl border-white/10">
                  <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@okDriver.in'}</p>
                </div>
                <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 hover:bg-[#1e293b]/50 cursor-pointer flex items-center gap-2 text-sm text-slate-300 transition mt-1">
                  <User size={14}/> My Profile
                </Link>
                <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 hover:bg-[#1e293b]/50 cursor-pointer flex items-center gap-2 text-sm text-slate-300 transition">
                  <Settings size={14}/> Account Settings
                </Link>
                <div className="border-t border-white/10 my-1"></div>
                <div onClick={() => { localStorage.removeItem("user"); router.push("/login"); }} className="px-4 py-2 hover:bg-rose-950/30 cursor-pointer flex items-center gap-2 text-sm text-rose-500 transition">
                  <LogOut size={14}/> Sign Out
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
