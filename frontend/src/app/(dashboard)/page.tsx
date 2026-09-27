"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Video, Activity, AlertCircle, AlertTriangle, Bell, Search, Plus, Zap, ChevronDown, Clock, Car, Truck, User, MoreVertical } from "lucide-react";
import { format } from "date-fns";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 48, online: 44, offline: 2, degraded: 2, alerts: 5, detections: 6
  });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);

  // Simulated cameras based on image
  const liveCameras = [
    { id: "C001", name: "Traffic Junction 1", status: "Online" },
    { id: "C002", name: "RTO Checkpoint", status: "Online" },
    { id: "C003", name: "City Entry Toll", status: "Degraded" },
    { id: "C004", name: "Highway Stretch", status: "Offline" },
    { id: "C005", name: "Navrangpura Cross", status: "Online" },
  ];

  useEffect(() => {
    // Initial fetch for events
    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/events`)
      .then(res => res.json())
      .then(data => {
        const active = data.filter((e: any) => e.is_alert);
        setAlerts(data.slice(0, 5));
        setStats(prev => ({ ...prev, alerts: active.length, detections: data.length }));
      })
      .catch(console.error);

    // Initial fetch for watchlist
    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/watchlist`)
      .then(res => res.json())
      .then(data => setWatchlist(data))
      .catch(console.error);

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}`}/ws`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ALERT" || data.type === "EVENT") {
        setAlerts(prev => [data.data, ...prev].slice(0, 5));
        if (data.data.is_alert) setStats(prev => ({ ...prev, alerts: prev.alerts + 1 }));
        setStats(prev => ({ ...prev, detections: prev.detections + 1 }));
      }
    };
    return () => ws.close();
  }, []);

  const handleTriggerANPR = async () => {
    const plates = ['GJ01XX0001', 'MH02CD9999', 'RJ14AB5678', 'DL01ZZ1234'];
    const cameras = ['C001', 'C002', 'C003', 'C004'];
    
    const randomPlate = plates[Math.floor(Math.random() * plates.length)];
    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          camera_id: randomCamera,
          event_type: "anpr",
          entity_value: randomPlate,
          confidence: 0.98
        })
      });
    } catch (error) {
      console.error("Error triggering ANPR match:", error);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-sm text-slate-400">Real-time monitoring and AI-powered insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleTriggerANPR}
            className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-2xl border border-white/10 hover:bg-[#1e293b] border border-white/10 text-yellow-500 px-4 py-2 rounded-2xl font-medium transition text-sm active:scale-95"
          >
            <Zap size={16} className="fill-current" /> Trigger ANPR Match
          </button>
          <button className="flex items-center gap-2 bg-indigo-500 hover:bg-purple-700 text-white px-4 py-2 rounded-2xl font-medium transition shadow-lg shadow-cyan-400/20 text-sm">
            <Plus size={16} /> Onboard Camera
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Total Cameras */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl p-4 flex flex-col justify-between hover:border-cyan-400/30 transition">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-cyan-400/10 rounded-3xl text-cyan-400">
              <Video size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Total Cameras</p>
              <h2 className="text-2xl font-bold text-white leading-none">{stats.total}</h2>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 2 Offline
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 ml-1"></span> 1 Degraded
          </p>
        </div>

        {/* Online */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl p-4 flex flex-col justify-between hover:border-emerald-500/30 transition">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-3xl text-emerald-500">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Online</p>
              <h2 className="text-2xl font-bold text-white leading-none">{stats.online}</h2>
            </div>
          </div>
          <p className="text-[10px] text-emerald-500 mt-3 font-medium bg-emerald-500/10 px-2 py-0.5 rounded w-fit">93.75%</p>
        </div>

        {/* Offline */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl p-4 flex flex-col justify-between hover:border-rose-500/30 transition">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-rose-500/10 rounded-3xl text-rose-500">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Offline</p>
              <h2 className="text-2xl font-bold text-white leading-none">{stats.offline}</h2>
            </div>
          </div>
          <p className="text-[10px] text-rose-500 mt-3 font-medium bg-rose-500/10 px-2 py-0.5 rounded w-fit">4.17%</p>
        </div>

        {/* Degraded */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl p-4 flex flex-col justify-between hover:border-yellow-500/30 transition">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-yellow-500/10 rounded-3xl text-yellow-500">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Degraded</p>
              <h2 className="text-2xl font-bold text-white leading-none">{stats.degraded}</h2>
            </div>
          </div>
          <p className="text-[10px] text-yellow-500 mt-3 font-medium bg-yellow-500/10 px-2 py-0.5 rounded w-fit">2.08%</p>
        </div>

        {/* Alerts */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/10 transition"></div>
          <div className="flex items-start gap-3 relative z-10">
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-500">
              <Bell size={20} className={stats.alerts > 0 ? "animate-pulse" : ""} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Active Alerts</p>
              <h2 className="text-2xl font-bold text-white leading-none">{stats.alerts}</h2>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-medium relative z-10">
            <span className="text-rose-500">↑ 2</span> new in last hour
          </p>
        </div>

        {/* Detections */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-400/10 transition"></div>
          <div className="flex items-start gap-3 relative z-10">
            <div className="p-2.5 bg-cyan-400/10 border border-cyan-400/20 rounded-3xl text-cyan-400">
              <Search size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Recent Detections</p>
              <h2 className="text-2xl font-bold text-white leading-none">{stats.detections}</h2>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-medium relative z-10">
            <span className="text-cyan-400">↑ 4</span> new in last hour
          </p>
        </div>
      </div>

      {/* 3 Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[550px]">
        
        {/* Left: Live Feeds */}
        <div className="xl:col-span-4 bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-semibold text-white">Live Camera Feeds</h3>
            </div>
            <a href="/cameras" className="text-xs text-cyan-400 hover:underline">View All &rarr;</a>
          </div>
          <div className="flex-1 p-4 grid grid-cols-2 gap-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-black/50 overflow-y-auto">
            {liveCameras.map((cam, i) => (
              <div key={cam.id} className={`relative rounded-3xl overflow-hidden aspect-video bg-[#05080f] border ${cam.status === 'Online' ? 'border-emerald-500/30' : cam.status === 'Degraded' ? 'border-yellow-500/30' : 'border-rose-500/30'} group`}>
                
                {/* Simulated Camera Feed Background */}
                <div 
                  className={`absolute inset-0 pointer-events-none ${cam.status === 'Offline' ? 'bg-static opacity-40' : 'opacity-20'}`} 
                  style={cam.status !== 'Offline' ? { backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' } : {}}
                ></div>

                {/* Glitch effect for degraded */}
                {cam.status === 'Degraded' && (
                  <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay animate-[glitch_1s_infinite]"></div>
                )}
                
                {/* Horizontal Scanline */}
                {cam.status !== 'Offline' && (
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_3s_ease-in-out_infinite] pointer-events-none z-0"></div>
                )}

                {/* Moving Graphics / AI Bounding Boxes */}
                {cam.status === 'Online' && i % 2 === 0 && (
                  <>
                    <div className="absolute top-[40%] left-0 w-12 h-10 border-2 border-emerald-500 bg-emerald-500/20 rounded-2xl animate-[drive_4s_linear_infinite]">
                      <div className="absolute -top-5 left-0 text-[8px] font-mono text-emerald-400 bg-black/50 px-1.5">VEHICLE</div>
                    </div>
                    <div className="absolute top-[60%] right-0 w-14 h-12 border-2 border-rose-500 bg-rose-500/20 rounded-2xl animate-[drive-reverse_5s_linear_infinite] delay-1000">
                       <div className="absolute -top-5 left-0 text-[8px] font-mono text-rose-400 bg-black/50 px-1.5">MATCH</div>
                    </div>
                  </>
                )}
                {cam.status === 'Online' && i % 2 !== 0 && (
                  <>
                    <div className="absolute top-[30%] left-0 w-10 h-10 border-2 border-cyan-400 bg-cyan-400/20 rounded-2xl animate-[drive_3s_linear_infinite]">
                      <div className="absolute -top-5 left-0 text-[8px] font-mono text-cyan-300 bg-black/50 px-1.5">TRACKING</div>
                    </div>
                  </>
                )}
                {cam.status === 'Degraded' && (
                  <>
                    <div className="absolute top-[50%] left-0 w-12 h-10 border-2 border-yellow-500 bg-yellow-500/20 rounded-2xl animate-[drive_6s_linear_infinite] opacity-50"></div>
                  </>
                )}
                {cam.status === 'Offline' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="bg-black/80 px-3 py-1 rounded border border-rose-500/50 text-rose-500 font-mono text-xs font-bold tracking-widest animate-pulse">NO SIGNAL</div>
                  </div>
                )}

                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e17] via-transparent to-[#090e17]/80 opacity-80 z-10 pointer-events-none"></div>
                
                {/* Top Badges */}
                <div className="absolute top-2 left-2 right-2 z-20 flex justify-between">
                  <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded bg-black/40 backdrop-blur-2xl border-white/10/80 border border-white/10 backdrop-blur flex items-center gap-1.5 ${cam.status === 'Offline' ? 'text-rose-500' : 'text-white'}`}>
                    {cam.status !== 'Offline' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_5px_rgba(244,63,94,0.8)]"></span>}
                    {cam.status === 'Offline' ? 'OFFLINE' : 'LIVE'}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded bg-black/40 backdrop-blur-2xl border-white/10/80 border border-white/10 backdrop-blur ${cam.status === 'Online' ? 'text-emerald-400' : cam.status === 'Degraded' ? 'text-yellow-400' : 'text-rose-500'}`}>
                    {cam.status === 'Online' ? '30 FPS' : cam.status === 'Degraded' ? '15 FPS' : '0 FPS'}
                  </span>
                </div>
                
                {/* Bottom Overlay Text */}
                <div className="absolute bottom-2 left-2 right-2 z-20 flex justify-between items-end">
                  <div>
                    <p className="text-white text-xs font-bold font-mono drop-shadow-md">{cam.id}</p>
                    <p className="text-slate-300 text-[10px] truncate max-w-[100px] drop-shadow-md">{cam.name}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold backdrop-blur ${cam.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : cam.status === 'Degraded' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                    {cam.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Map */}
        <div className="xl:col-span-5 bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl flex flex-col overflow-hidden relative">
          <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center z-10 bg-slate-900/80 backdrop-blur-2xl border border-white/10">
            <h3 className="font-semibold text-white">Camera Locations & Vehicle Movement</h3>
            <a href="/map" className="text-xs text-cyan-400 hover:underline">Full Map &rarr;</a>
          </div>
          <div className="flex-1 relative z-0">
            <MapComponent traceData={[
              {latitude: 23.0225, longitude: 72.5714, camera_name: "Traffic Junction", timestamp: new Date(Date.now() - 4000000).toISOString()},
              {latitude: 23.0360, longitude: 72.5715, camera_name: "City Center", timestamp: new Date(Date.now() - 3000000).toISOString()},
              {latitude: 23.0450, longitude: 72.5600, camera_name: "Navrangpura Cross", timestamp: new Date(Date.now() - 2000000).toISOString()},
              {latitude: 23.0550, longitude: 72.5750, camera_name: "Ashram Road", timestamp: new Date(Date.now() - 1000000).toISOString()},
              {latitude: 23.0604, longitude: 72.5800, camera_name: "RTO Checkpoint", timestamp: new Date().toISOString()}
            ]} />
          </div>
        </div>

        {/* Right: Alerts */}
        <div className="xl:col-span-3 bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-semibold text-white">Recent Alerts</h3>
            <a href="/alerts" className="text-xs text-cyan-400 hover:underline">View All &rarr;</a>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gradient-to-br from-indigo-950 via-slate-900 to-black/30">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No recent activity</div>
            ) : (
              alerts.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-3xl border ${alert.is_alert ? 'bg-slate-900/80 backdrop-blur-2xl border border-white/10 border-rose-500/20' : 'bg-slate-900/80 backdrop-blur-2xl border border-white/10 border-white/10'} hover:border-cyan-400/30 transition`}>
                  <div className="flex justify-between items-start mb-2">
                    {alert.is_alert ? (
                      <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> HIGH
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold rounded">
                        MEDIUM
                      </span>
                    )}
                    <span className="text-slate-500 text-[10px] font-mono">{alert.timestamp ? format(new Date(alert.timestamp), 'HH:mm') : 'Now'}</span>
                  </div>
                  <h4 className={`text-sm font-medium ${alert.is_alert ? 'text-rose-400' : 'text-slate-300'}`}>
                    {alert.is_alert ? 'Vehicle on Watchlist' : 'Detection Activity'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="text-white font-mono bg-white/5 px-1 rounded">{alert.entity_value}</span> detected at {alert.camera_name || alert.camera_id}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Second Row: Camera Registry, System Statistics, Watchlist Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[400px]">
        
        {/* Camera Registry (Wider Column) */}
        <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-semibold text-white">Camera Registry</h3>
            <a href="/cameras" className="text-xs text-cyan-400 hover:underline">View All &rarr;</a>
          </div>
          <div className="flex-1 overflow-auto bg-gradient-to-br from-indigo-950 via-slate-900 to-black/30">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead className="text-slate-500 font-medium sticky top-0 bg-slate-900/80 backdrop-blur-2xl border border-white/10">
                <tr>
                  <th className="px-4 py-3 font-medium uppercase">Camera ID</th>
                  <th className="px-4 py-3 font-medium uppercase">Name</th>
                  <th className="px-4 py-3 font-medium uppercase">Department</th>
                  <th className="px-4 py-3 font-medium uppercase">Type</th>
                  <th className="px-4 py-3 font-medium uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/50 text-slate-300">
                <tr className="hover:bg-[#1e293b]/30">
                  <td className="px-4 py-2.5 font-mono text-slate-400">C001</td>
                  <td className="px-4 py-2.5">Traffic Junction (Ahmedabad)</td>
                  <td className="px-4 py-2.5">Traffic Police</td>
                  <td className="px-4 py-2.5">PTZ</td>
                  <td className="px-4 py-2.5"><span className="flex items-center gap-1.5 text-emerald-500 font-medium border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online</span></td>
                </tr>
                <tr className="hover:bg-[#1e293b]/30">
                  <td className="px-4 py-2.5 font-mono text-slate-400">C002</td>
                  <td className="px-4 py-2.5">RTO Checkpoint</td>
                  <td className="px-4 py-2.5">RTO</td>
                  <td className="px-4 py-2.5">Fixed</td>
                  <td className="px-4 py-2.5"><span className="flex items-center gap-1.5 text-emerald-500 font-medium border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online</span></td>
                </tr>
                <tr className="hover:bg-[#1e293b]/30">
                  <td className="px-4 py-2.5 font-mono text-slate-400">C003</td>
                  <td className="px-4 py-2.5">City Center</td>
                  <td className="px-4 py-2.5">City Police</td>
                  <td className="px-4 py-2.5">Fixed</td>
                  <td className="px-4 py-2.5"><span className="flex items-center gap-1.5 text-yellow-500 font-medium border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 rounded-full w-fit"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Degraded</span></td>
                </tr>
                <tr className="hover:bg-[#1e293b]/30">
                  <td className="px-4 py-2.5 font-mono text-slate-400">C004</td>
                  <td className="px-4 py-2.5">Highway</td>
                  <td className="px-4 py-2.5">Highway Police</td>
                  <td className="px-4 py-2.5">PTZ</td>
                  <td className="px-4 py-2.5"><span className="flex items-center gap-1.5 text-rose-500 font-medium border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 rounded-full w-fit"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Offline</span></td>
                </tr>
                <tr className="hover:bg-[#1e293b]/30">
                  <td className="px-4 py-2.5 font-mono text-slate-400">C005</td>
                  <td className="px-4 py-2.5">Railway Station</td>
                  <td className="px-4 py-2.5">Railways</td>
                  <td className="px-4 py-2.5">Fixed</td>
                  <td className="px-4 py-2.5"><span className="flex items-center gap-1.5 text-emerald-500 font-medium border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* System Statistics */}
        <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-semibold text-white">System Statistics</h3>
            <span className="text-xs text-slate-400 flex items-center cursor-pointer">Last 24 hours <ChevronDown size={12} className="ml-1"/></span>
          </div>
          <div className="flex-1 p-4 grid grid-cols-2 gap-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-black/30">
            {/* Stat 1 */}
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl p-4 flex flex-col justify-center relative">
              <div className="absolute top-4 right-4 text-cyan-300 bg-cyan-400/10 p-1.5 rounded-2xl"><Activity size={14}/></div>
              <p className="text-xs text-slate-400 mb-1">Total Events</p>
              <h2 className="text-2xl font-bold text-white mb-1">1,248</h2>
              <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">↑ 12%</p>
            </div>
            {/* Stat 2 */}
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl p-4 flex flex-col justify-center relative">
              <div className="absolute top-4 right-4 text-yellow-500 bg-yellow-500/10 p-1.5 rounded-2xl"><Zap size={14}/></div>
              <p className="text-xs text-slate-400 mb-1">AI Detections</p>
              <h2 className="text-2xl font-bold text-white mb-1">892</h2>
              <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">↑ 18%</p>
            </div>
            {/* Stat 3 */}
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl p-4 flex flex-col justify-center relative">
              <div className="absolute top-4 right-4 text-rose-500 bg-rose-500/10 p-1.5 rounded-2xl"><Bell size={14}/></div>
              <p className="text-xs text-slate-400 mb-1">Alerts Generated</p>
              <h2 className="text-2xl font-bold text-white mb-1">32</h2>
              <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1">↑ 6%</p>
            </div>
            {/* Stat 4 */}
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl p-4 flex flex-col justify-center relative">
              <div className="absolute top-4 right-4 text-indigo-300 bg-indigo-400/10 p-1.5 rounded-2xl"><Clock size={14}/></div>
              <p className="text-xs text-slate-400 mb-1">Avg. Response Time</p>
              <h2 className="text-2xl font-bold text-white mb-1">28s</h2>
              <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">↓ 22%</p>
            </div>
          </div>
        </div>

        {/* Watchlist Matches */}
        <div className="lg:col-span-3 bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-3xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-semibold text-white">Watchlist Matches</h3>
            <a href="/watchlist" className="text-xs text-cyan-400 hover:underline">View All &rarr;</a>
          </div>
          <div className="flex-1 overflow-y-auto p-2 bg-gradient-to-br from-indigo-950 via-slate-900 to-black/30">
            {watchlist.length > 0 ? watchlist.map((item: any, idx: number) => (
              <div key={idx} className="p-3 border-b border-white/10/50 flex items-center justify-between hover:bg-[#1e293b]/30 cursor-pointer rounded-2xl transition group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${item.entity_type === 'asset' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-indigo-400/10 border-indigo-400/20 text-indigo-300'}`}>
                    {item.entity_type === 'asset' ? <Car size={14}/> : <User size={14}/>}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-0.5 font-mono">{item.identifier}</h4>
                    <p className="text-[10px] text-slate-400">{item.reason.substring(0, 30)}{item.reason.length > 30 ? '...' : ''}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Added: {new Date(item.added_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <MoreVertical size={14} className="text-slate-500 opacity-0 group-hover:opacity-100 transition" />
              </div>
            )) : (
              <div className="p-6 text-center text-slate-500 text-sm">
                No active watchlist matches.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
