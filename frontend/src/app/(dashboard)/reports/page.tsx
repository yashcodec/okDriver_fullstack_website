"use client";
import { useState } from "react";
import { Download, RefreshCw, CheckCircle2 } from "lucide-react";

const initialLogs = [
  { id: "AUD-9075", timestamp: "2026-09-26 11:06:29", user: "Admin Officer", action: "ALERT_ACKNOWLEDGED", category: "Incident", details: "Acknowledged alert ALT-003 (Vehicle on Watchlist - GJ05AB1234 (Blacklisted Vehicle)).", color: "text-orange-500 border-orange-500/30 bg-orange-500/10" },
  { id: "AUD-9818", timestamp: "2026-09-26 11:05:39", user: "Admin Officer", action: "ALERT_RESOLVED", category: "Incident", details: "Resolved alert ALT-002. Notes: Vehicle intercepted and verified.", color: "text-orange-500 border-orange-500/30 bg-orange-500/10" },
  { id: "AUD-3527", timestamp: "2026-09-26 11:05:33", user: "Admin Officer", action: "ALERT_RESOLVED", category: "Incident", details: "Resolved alert ALT-004. Notes: Vehicle intercepted and verified.", color: "text-orange-500 border-orange-500/30 bg-orange-500/10" },
  { id: "AUD-9334", timestamp: "2026-09-26 11:05:29", user: "Admin Officer", action: "ALERT_ACKNOWLEDGED", category: "Incident", details: "Acknowledged alert ALT-001 (Vehicle on Watchlist - GJ01XX0001 (Blacklisted Vehicle)).", color: "text-orange-500 border-orange-500/30 bg-orange-500/10" },
  { id: "AUD-4370", timestamp: "2026-09-26 11:05:24", user: "Admin Officer", action: "ALERT_RESOLVED", category: "Incident", details: "Resolved alert ALT-001. Notes: Vehicle intercepted and verified.", color: "text-orange-500 border-orange-500/30 bg-orange-500/10" },
  { id: "AUD-1283", timestamp: "2026-09-26 11:04:31", user: "Admin", action: "WATCHLIST_REMOVED", category: "Database", details: "Removed watchlist entry WL-002 (RJ14AB5678).", color: "text-red-500 border-red-500/30 bg-red-500/10" },
  { id: "AUD-1974", timestamp: "2026-09-26 11:00:41", user: "Traffic Police", action: "WATCHLIST_ADDED", category: "Database", details: "Added Stolen Vehicle identifier \"GJ01ZZ8888\" with priority Critical.", color: "text-red-500 border-red-500/30 bg-red-500/10" },
  { id: "AUD-101", timestamp: "2026-04-24 14:32:05", user: "admin", action: "SYSTEM_STARTUP", category: "Core", details: "Surveillance node initialized with 48 active camera feeds.", color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" },
  { id: "AUD-102", timestamp: "2026-04-24 14:21:18", user: "officer_patel", action: "WATCHLIST_MATCH", category: "Alerts", details: "Vehicle GJ01XX0001 automatically flagged at Subhash Bridge (C002).", color: "text-red-500 border-red-500/30 bg-red-500/10" },
  { id: "AUD-103", timestamp: "2026-04-24 13:58:40", user: "inspector_sharma", action: "CAMERA_ONBOARD", category: "Registry", details: "Onboarded Highway PTZ Camera C049 into Central Zone.", color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" },
  { id: "AUD-104", timestamp: "2026-04-24 12:45:10", user: "admin", action: "ALERT_ACKNOWLEDGED", category: "Incident", details: "Acknowledged ANPR stolen asset alert ALT-003.", color: "text-orange-500 border-orange-500/30 bg-orange-500/10" },
  { id: "AUD-105", timestamp: "2026-04-24 11:15:22", user: "officer_vikram", action: "WATCHLIST_ADDED", category: "Database", details: "Added stolen asset MH02CD9999 to state active watchlist.", color: "text-red-500 border-red-500/30 bg-red-500/10" },
];

export default function ReportsPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate refreshing by fetching new data (we just shuffle or reset it for demo)
      setLogs([...initialLogs]);
      setIsRefreshing(false);
    }, 800);
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ["AUDIT ID", "TIMESTAMP", "OFFICER / USER", "ACTION TYPE", "CATEGORY", "DETAILS"];
    const csvContent = [
      headers.join(","),
      ...logs.map(log => 
        `${log.id},${log.timestamp},${log.user},${log.action},${log.category},"${log.details.replace(/"/g, '""')}"`
      )
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-[#0b0e14]">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[1.7rem] font-bold text-white mb-1 tracking-tight">Audit Reports & System Trail</h1>
          <p className="text-[13px] text-slate-400">Chain-of-custody logging, operator actions, and executive CSV export</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#1c212c] hover:bg-[#252b38] border border-[#2a3143] rounded-2xl text-slate-300 hover:text-white transition shadow-sm text-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> 
            Refresh Logs
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-purple-700 rounded-2xl text-white font-medium transition shadow-lg shadow-cyan-400/20 text-sm"
          >
            <Download size={14} /> 
            Export Official CSV
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-[#121620] border border-[#1e2532] rounded-3xl flex-1 overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-[#1e2532] flex justify-between items-center bg-[#151a25]">
          <h2 className="text-white font-semibold text-sm">Real-Time Operator Audit Trail</h2>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            Chain-of-Custody Verified
          </div>
        </div>
        
        <div className="overflow-auto flex-1 p-2">
          <table className="w-full text-left text-[13px]">
            <thead className="text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-[11px]">AUDIT ID</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-[11px]">TIMESTAMP</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-[11px]">OFFICER / USER</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-[11px]">ACTION TYPE</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-[11px]">CATEGORY</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-[11px]">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2532]/60">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-[#1a1f2e]/50 transition-colors">
                  <td className="px-4 py-3.5 text-cyan-300 font-bold tracking-wide">{log.id}</td>
                  <td className="px-4 py-3.5 text-slate-300 font-mono text-[12px]">{log.timestamp}</td>
                  <td className="px-4 py-3.5 text-slate-300">{log.user}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider ${log.color}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400">{log.category}</td>
                  <td className="px-4 py-3.5 text-slate-200">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
