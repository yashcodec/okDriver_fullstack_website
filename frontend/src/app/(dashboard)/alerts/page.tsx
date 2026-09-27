"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Car, User, ShieldAlert, X, AlertTriangle } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);

  const fetchAlerts = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/events`)
      .then(res => res.json())
      .then(data => {
        // Only show actual alerts, sort by timestamp desc
        setAlerts(data.filter((e: any) => e.is_alert).sort((a:any, b:any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchAlerts();
    
    // Listen for real-time alerts
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}`}/ws`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ALERT" && data.data.is_alert) {
        setAlerts(prev => {
          const newAlerts = [data.data, ...prev].sort((a:any, b:any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          return newAlerts;
        });
      }
    };
    return () => ws.close();
  }, []);

  const handleSimulate = async () => {
    const randomPlates = ["GJ01XX0001", "GJ05AB1234", "MH02CD9999"];
    const randomCameras = ["C001", "C002", "C003"];
    const plate = randomPlates[Math.floor(Math.random() * randomPlates.length)];
    const cam = randomCameras[Math.floor(Math.random() * randomCameras.length)];
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          camera_id: cam,
          event_type: "ANPR",
          entity_value: plate,
          confidence: 96.5 + Math.random() * 3
        })
      });
      fetchAlerts();
      window.dispatchEvent(new Event("alertsUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, nextStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/events/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchAlerts();
        window.dispatchEvent(new Event("alertsUpdated"));
        if (selectedAlert && selectedAlert.id === id) {
          setSelectedAlert({ ...selectedAlert, status: nextStatus });
          if (nextStatus === "RESOLVED") {
            setSelectedAlert(null);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getLevel = (alert: any) => {
    if (alert.entity_value?.includes("GJ01") || alert.entity_value?.includes("GJ05")) return "HIGH";
    if (alert.event_type?.includes("Person")) return "MEDIUM";
    return "LOW";
  };

  const getLevelStyles = (level: string) => {
    if (level === "HIGH") return "bg-red-500/20 text-red-500 border border-red-500/30";
    if (level === "MEDIUM") return "bg-orange-500/20 text-orange-500 border border-orange-500/30";
    return "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30";
  };

  const getStatusColor = (status: string) => {
    if (status === "ACKNOWLEDGED" || status === "RESOLVED") return "text-emerald-500";
    return "text-red-500";
  };

  return (
    <div className="p-6 md:p-8 h-full bg-[#0b0e14] overflow-auto relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-[1.7rem] font-bold text-white mb-1 tracking-tight">Real-Time Alerts & Incident Dispatch</h1>
          <p className="text-[13px] text-slate-400">Acknowledge, resolve, and audit automated ANPR and perimeter alarms</p>
        </div>
        <button 
          onClick={handleSimulate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c212c] hover:bg-[#252b38] border border-[#2a3143] rounded-2xl text-slate-300 hover:text-white transition shadow-sm text-sm"
        >
          <Plus size={16} /> Simulate Incident Alert
        </button>
      </div>

      <div className="bg-[#121620] border border-[#1e2532] rounded-3xl flex flex-col p-4 space-y-4 shadow-2xl">
        {alerts.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            <ShieldAlert size={32} className="mx-auto mb-3 text-slate-600" />
            No active alerts right now.
          </div>
        )}
        
        {alerts.map(alert => {
          const level = getLevel(alert);
          const status = alert.status || "ACTIVE";
          const icon = alert.event_type?.includes("Person") ? <User size={20} className="text-slate-400" /> : <Car size={20} className="text-rose-500" />;

          return (
            <div key={alert.id} className="bg-[#151a25] border border-[#1e2532] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between hover:border-[#2a3547] transition">
              <div className="flex gap-4 items-start">
                <div className="mt-1 flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-2xl inline-block mb-2 ${getLevelStyles(level)}`}>
                    {level}
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">
                    {alert.event_type === "Person Detection" ? "Person Detected" : "Vehicle on Watchlist"} - {alert.entity_value} detected at {alert.camera_id}
                  </h3>
                  <p className="text-xs text-slate-400 mb-1.5">
                    Camera: {alert.camera_id} | Matched Entity: {alert.entity_value} | Confidence: {alert.confidence?.toFixed(0)}%
                  </p>
                  <p className={`text-[11px] font-bold ${getStatusColor(status)}`}>
                    Status: {status}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end justify-between mt-4 md:mt-0 h-full self-stretch">
                <span className="text-[11px] text-slate-500 font-mono">
                  {format(new Date(alert.timestamp), "yyyy-MM-dd'T'HH:mm:ss'Z'")}
                </span>
                <button 
                  onClick={() => setSelectedAlert(alert)}
                  className="mt-4 px-5 py-1.5 bg-indigo-500 hover:bg-purple-700 text-white rounded text-sm font-medium transition shadow-lg shadow-cyan-400/20"
                >
                  Manage
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Manage Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f141e] border border-[#1e2532] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-[#1e2532] bg-[#121620]">
              <h2 className="text-white font-bold text-lg uppercase tracking-wide">
                {getLevel(selectedAlert)} ALERT: {selectedAlert.event_type === "Person Detection" ? "Person Detected" : "Vehicle on Watchlist"}
              </h2>
              <button onClick={() => setSelectedAlert(null)} className="text-slate-500 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Red banner */}
              <div className="flex justify-between items-center bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-2xl mb-6 font-bold text-[13px] tracking-wider">
                <span className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500 fill-red-500/20" /> 
                  AI MATCH FLAGGED
                </span>
                <span>{format(new Date(selectedAlert.timestamp), "HH:mm")}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {selectedAlert.entity_value} detected at {selectedAlert.camera_id}
              </h3>
              <p className="text-[14px] text-slate-400 mb-6 leading-relaxed">
                Blacklisted asset matching armed suspect alert flagged at {selectedAlert.camera_id} checkpoint.
              </p>

              {/* Info Grid */}
              <div className="bg-[#151a25] border border-[#1e2532] rounded-2xl p-5 grid grid-cols-2 gap-y-5 gap-x-4 text-[13.5px]">
                <div>
                  <span className="text-white font-semibold block mb-1">Camera:</span> 
                  <span className="text-cyan-300">{selectedAlert.camera_id} - RTO Checkpoint</span>
                </div>
                <div>
                  <span className="text-white font-semibold block mb-1">Confidence:</span> 
                  <span className="text-emerald-400 font-medium">{selectedAlert.confidence?.toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-white font-semibold block mb-1">Target Entity:</span> 
                  <span className="text-orange-400">{selectedAlert.entity_value} (Blacklisted Vehicle)</span>
                </div>
                <div>
                  <span className="text-white font-semibold block mb-1">Status:</span> 
                  <span className={`font-medium ${getStatusColor(selectedAlert.status || "ACTIVE")}`}>
                    {selectedAlert.status || "ACTIVE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#1e2532] bg-[#121620] flex justify-end gap-3">
              <button 
                onClick={() => setSelectedAlert(null)} 
                className="px-5 py-2.5 rounded-2xl border border-[#2a3547] text-slate-300 hover:bg-[#1e2532] transition font-medium text-sm"
              >
                Close
              </button>
              <button 
                onClick={() => updateStatus(selectedAlert.id, 'ACKNOWLEDGED')} 
                className="px-5 py-2.5 rounded-2xl border border-[#2a3547] text-slate-300 hover:bg-[#1e2532] hover:text-white transition font-medium text-sm"
              >
                Acknowledge
              </button>
              <button 
                onClick={() => updateStatus(selectedAlert.id, 'RESOLVED')} 
                className="px-6 py-2.5 rounded-2xl bg-indigo-500 hover:bg-purple-700 text-white transition font-medium shadow-lg shadow-cyan-400/20 text-sm"
              >
                Resolve & Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
