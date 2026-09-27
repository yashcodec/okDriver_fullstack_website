"use client";
import Link from "next/link";
import { 
  LayoutDashboard, Video, Bell, Map as MapIcon, 
  Bookmark, BarChart3, FileText, Settings, Activity
} from "lucide-react";
import Topbar from "@/components/Topbar";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      let parsedUser = JSON.parse(stored);
      if (parsedUser.name === "Aryan Jain") {
        parsedUser.name = "Yash Chauhan";
        localStorage.setItem("user", JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
    } else {
      router.push("/login");
    }
  }, [router]);

  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);

  const fetchAlertsCount = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/events`)
      .then(res => res.json())
      .then(data => {
        const active = data.filter((e: any) => e.is_alert && (!e.status || e.status === "ACTIVE"));
        setUnreadAlertsCount(active.length);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchAlertsCount();

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}`}/ws`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ALERT" && data.data.is_alert && (!data.data.status || data.data.status === "ACTIVE")) {
        setUnreadAlertsCount(prev => prev + 1);
      }
      if (data.type === "ALERT_UPDATE") {
        fetchAlertsCount();
      }
    };

    window.addEventListener("alertsUpdated", fetchAlertsCount);

    return () => {
      ws.close();
      window.removeEventListener("alertsUpdated", fetchAlertsCount);
    };
  }, []);

  if (!user) return <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black w-full"></div>;

  const NavLink = ({ href, icon: Icon, label, activeBadge }: any) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={`flex items-center justify-between px-3 py-2.5 rounded-2xl font-medium transition-all duration-200 ${isActive ? 'bg-indigo-500 text-white shadow-lg shadow-cyan-400/20' : 'text-slate-400 hover:text-white hover:bg-[#1e293b]/50'}`}>
        <div className="flex items-center gap-3">
          <Icon size={18} /> {label}
        </div>
        {activeBadge > 0 && <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeBadge}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="w-[240px] bg-black/40 backdrop-blur-2xl border-white/10 border-r border-white/10 flex flex-col z-50 shrink-0 h-screen shadow-[4px_0_24px_rgba(168,85,247,0.15)]">
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="relative flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-3xl shadow-[0_0_10px_rgba(168,85,247,0.8)] text-white">
            <ShieldIcon size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-400">okDriver</h1>
            <p className="text-[9px] text-cyan-300 tracking-widest uppercase mt-0.5">Neural Net Analytics</p>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          <NavLink href="/" icon={LayoutDashboard} label="Dashboard" />
          <NavLink href="/cameras" icon={Video} label="Sensor Fleet" />
          <NavLink href="/live" icon={Activity} label="Real-Time Telemetry" />
          <NavLink href="/alerts" icon={Bell} label="Critical Incidents" activeBadge={unreadAlertsCount} />
          <NavLink href="/watchlist" icon={Bookmark} label="Flagged Entities" />
          <NavLink href="/analytics" icon={BarChart3} label="Insights Engine" />
          <NavLink href="/map" icon={MapIcon} label="Maps" />
          <NavLink href="/reports" icon={FileText} label="Compliance Logs" />
          <div className="pt-4 mt-4 border-t border-white/10">
            <NavLink href="/settings" icon={Settings} label="Settings & Simulator" />
          </div>
        </nav>
        
        {/* Bottom System Status */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-emerald-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
          <span className="text-slate-500 font-mono">v1.0.0</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
        <Topbar />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-indigo-950 via-slate-900 to-black scrollbar-hide">
          {children}
        </main>
      </div>
    </>
  );
}

// Temporary Icon since Shield isn't imported from lucide above
function ShieldIcon({size}: {size:number}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
}
