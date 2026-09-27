"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Search, Navigation } from "lucide-react";

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function MapPage() {
  const [searchPlate, setSearchPlate] = useState("");
  const [traceData, setTraceData] = useState<any[]>([]);
  const [isTracing, setIsTracing] = useState(false);

  const handleTrace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPlate) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/events/trace/${searchPlate.toUpperCase()}`);
      const data = await res.json();
      setTraceData(data);
      setIsTracing(true);
      if (data.length === 0) alert("No movement history found for this asset.");
    } catch (err) {
      alert("Error fetching trace data.");
    }
  };

  const clearTrace = () => {
    setTraceData([]);
    setSearchPlate("");
    setIsTracing(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Overlay Search Box */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-[#14161c]/90 backdrop-blur-md border border-white/10 p-4 rounded-3xl shadow-2xl w-[90%] max-w-lg">
        <form onSubmit={handleTrace} className="flex items-center gap-2">
          <Search size={18} className="text-slate-400 ml-2" />
          <input 
            type="text" 
            placeholder="Search asset number to trace route (e.g. GJ01XX0001)"
            value={searchPlate}
            onChange={e => setSearchPlate(e.target.value.toUpperCase())}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:font-sans placeholder:text-slate-500 text-sm"
          />
          {isTracing ? (
            <button type="button" onClick={clearTrace} className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded transition">Clear</button>
          ) : (
            <button type="submit" className="text-xs bg-indigo-500 hover:bg-purple-700 text-white px-3 py-1.5 rounded transition flex items-center gap-1"><Navigation size={12}/> Trace</button>
          )}
        </form>
      </div>

      <div className="flex-1">
        <MapComponent traceData={traceData} />
      </div>
      
      {/* Timeline Panel */}
      {traceData.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-[#14161c]/90 backdrop-blur-md border border-white/10 p-4 rounded-3xl shadow-2xl w-[90%] max-w-2xl max-h-[30vh] overflow-y-auto">
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2"><Navigation size={14} className="text-cyan-400"/> Movement History: <span className="text-yellow-500 font-mono">{searchPlate}</span></h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {traceData.map((trace, idx) => (
              <div key={idx} className="shrink-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 p-3 rounded-2xl min-w-[200px]">
                <div className="text-xs text-slate-500 mb-1">Stop {idx + 1}</div>
                <div className="text-white text-sm font-medium">{trace.camera_name}</div>
                <div className="text-xs text-cyan-300 mt-1">{new Date(trace.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
