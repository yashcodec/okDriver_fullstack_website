"use client";

import { useState, useEffect } from "react";
import { Activity, LayoutGrid, LayoutList, Filter } from "lucide-react";

export default function LiveMonitoringPage() {
  const [cameras, setCameras] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/cameras`)
      .then((res) => res.json())
      .then((data) => setCameras(data))
      .catch(console.error);
  }, []);

  const filteredCameras = filterStatus === "All" 
    ? cameras 
    : cameras.filter(c => c.status === filterStatus);

  return (
    <div className="p-6 md:p-8 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Activity className="text-cyan-400" /> Live Feed Wall
          </h1>
          <p className="text-sm text-slate-400">Real-time video wall for all unified CCTV feeds</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl border border-white/10">
          <Filter size={16} className="text-slate-500 ml-2" />
          {["All", "Online", "Degraded", "Offline"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${filterStatus === status ? 'bg-[#1e293b] text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCameras.map((cam, i) => (
            <div key={cam.id} className={`relative rounded-3xl overflow-hidden aspect-video bg-[#05080f] border ${cam.status === 'Online' ? 'border-emerald-500/30' : cam.status === 'Degraded' ? 'border-yellow-500/30' : 'border-rose-500/30'} group shadow-xl`}>
              
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
                  <div className="absolute top-[40%] left-0 w-16 h-12 border-2 border-emerald-500 bg-emerald-500/20 rounded-2xl animate-[drive_4s_linear_infinite]">
                    <div className="absolute -top-5 left-0 text-[10px] font-mono text-emerald-400 bg-black/50 px-1.5">VEHICLE</div>
                  </div>
                  <div className="absolute top-[60%] right-0 w-20 h-14 border-2 border-rose-500 bg-rose-500/20 rounded-2xl animate-[drive-reverse_5s_linear_infinite] delay-1000">
                     <div className="absolute -top-5 left-0 text-[10px] font-mono text-rose-400 bg-black/50 px-1.5">MATCH</div>
                  </div>
                </>
              )}
              {cam.status === 'Online' && i % 2 !== 0 && (
                <>
                  <div className="absolute top-[30%] left-0 w-14 h-14 border-2 border-cyan-400 bg-cyan-400/20 rounded-2xl animate-[drive_3s_linear_infinite]">
                    <div className="absolute -top-5 left-0 text-[10px] font-mono text-cyan-300 bg-black/50 px-1.5">TRACKING</div>
                  </div>
                </>
              )}
              {cam.status === 'Degraded' && (
                <>
                  <div className="absolute top-[50%] left-0 w-16 h-12 border-2 border-yellow-500 bg-yellow-500/20 rounded-2xl animate-[drive_6s_linear_infinite] opacity-50"></div>
                </>
              )}
              {cam.status === 'Offline' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="bg-black/80 px-4 py-1.5 rounded border border-rose-500/50 text-rose-500 font-mono text-sm font-bold tracking-widest animate-pulse">NO SIGNAL</div>
                </div>
              )}

              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090e17] via-transparent to-[#090e17]/80 opacity-80 z-10 pointer-events-none"></div>
              
              {/* Top Badges */}
              <div className="absolute top-3 left-3 right-3 z-20 flex justify-between">
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold text-white rounded bg-black/40 backdrop-blur-2xl border-white/10/80 border border-white/10 backdrop-blur flex items-center gap-1.5 ${cam.status === 'Offline' ? 'text-rose-500' : 'text-white'}`}>
                    {cam.status !== 'Offline' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_5px_rgba(244,63,94,0.8)]"></span>}
                    {cam.status === 'Offline' ? 'OFFLINE' : 'LIVE'}
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-bold text-slate-300 rounded bg-black/40 backdrop-blur-2xl border-white/10/80 border border-white/10 backdrop-blur flex items-center">
                    {cam.source_protocol || 'WebRTC'}
                  </span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded bg-black/40 backdrop-blur-2xl border-white/10/80 border border-white/10 backdrop-blur ${cam.status === 'Online' ? 'text-emerald-400' : cam.status === 'Degraded' ? 'text-yellow-400' : 'text-rose-500'}`}>
                  {cam.resolution || (cam.status === 'Online' ? '30 FPS' : cam.status === 'Degraded' ? '15 FPS' : '0 FPS')}
                </span>
              </div>
              
              {/* Bottom Overlay Text */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
                <div>
                  <p className="text-white text-sm font-bold font-mono drop-shadow-md">{cam.id}</p>
                  <p className="text-slate-300 text-xs truncate max-w-[150px] drop-shadow-md">{cam.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full border text-[10px] font-bold backdrop-blur ${cam.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : cam.status === 'Degraded' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                  {cam.status}
                </span>
              </div>
            </div>
          ))}

          {filteredCameras.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500">
              No cameras found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
