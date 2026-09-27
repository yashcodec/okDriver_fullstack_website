import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 h-full overflow-auto space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">System Analytics</h1>
          <p className="text-sm text-slate-400">AI Detection and Traffic Metrics</p>
        </div>
        <div className="text-sm px-3 py-1.5 bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 rounded-2xl text-slate-300">
          Last 30 Days
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 p-5 rounded-3xl shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-cyan-400/10 text-cyan-400 rounded-2xl"><Activity size={20} /></div>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1"><TrendingUp size={12}/> +12.5%</span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Total Detections</h3>
          <p className="text-2xl font-bold text-white">124,592</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 p-5 rounded-3xl shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-500/10 text-rose-500 rounded-2xl"><BarChart3 size={20} /></div>
            <span className="text-rose-500 text-xs font-bold flex items-center gap-1"><TrendingUp size={12} className="rotate-180"/> -3.2%</span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Critical Alerts</h3>
          <p className="text-2xl font-bold text-white">1,843</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 p-5 rounded-3xl shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Users size={20} /></div>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1"><TrendingUp size={12}/> +5.1%</span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Unique Vehicles (ANPR)</h3>
          <p className="text-2xl font-bold text-white">45,910</p>
        </div>
      </div>

      {/* Fake Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 rounded-3xl p-5 shadow-lg h-[300px] flex flex-col">
          <h3 className="text-white font-medium mb-4">Traffic Flow by Hour</h3>
          <div className="flex-1 flex items-end justify-between gap-2 pt-4">
            {[40, 25, 10, 15, 30, 60, 85, 100, 95, 75, 80, 50].map((h, i) => (
              <div key={i} className="w-full bg-cyan-400/20 rounded-t-sm hover:bg-cyan-400/40 transition-all relative group" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#262936] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">{h}k</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:59</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 rounded-3xl p-5 shadow-lg h-[300px] flex flex-col">
          <h3 className="text-white font-medium mb-4">Alert Distribution</h3>
          <div className="flex-1 space-y-4 justify-center flex flex-col">
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-slate-300">Stolen Vehicle (Watchlist)</span><span className="text-slate-400">45%</span></div>
              <div className="w-full bg-[#111318] h-2 rounded-full overflow-hidden"><div className="bg-rose-500 h-full w-[45%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-slate-300">Overspeeding</span><span className="text-slate-400">30%</span></div>
              <div className="w-full bg-[#111318] h-2 rounded-full overflow-hidden"><div className="bg-orange-500 h-full w-[30%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-slate-300">Loitering / Intrusion</span><span className="text-slate-400">15%</span></div>
              <div className="w-full bg-[#111318] h-2 rounded-full overflow-hidden"><div className="bg-yellow-500 h-full w-[15%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-slate-300">Other Detections</span><span className="text-slate-400">10%</span></div>
              <div className="w-full bg-[#111318] h-2 rounded-full overflow-hidden"><div className="bg-cyan-400 h-full w-[10%]"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
