"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// SVG Strings for Icons
const cameraSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;
const carSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`;

// Create custom solid markers with Camera icon
const createSolidIcon = (colorClass: string, label: string) => {
  const bgColor = colorClass === 'green' ? '#10b981' : colorClass === 'red' ? '#ef4444' : '#f59e0b';
  
  // Add a ripple animation specifically for RED (Alert) cameras
  const rippleHtml = colorClass === 'red' 
    ? `<div style="position:absolute; width: 50px; height: 50px; background: rgba(239, 68, 68, 0.4); border-radius: 50%; left: 50%; top: 50%; transform: translate(-50%, -50%); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` 
    : '';

  return L.divIcon({
    className: "custom-solid-marker",
    html: `
      <div style="position: relative; display: flex; justify-content: center; align-items: center;">
        ${rippleHtml}
        <div style="
          background-color: ${bgColor}; 
          border: 2px solid white;
          border-radius: 20px;
          color: white;
          font-family: sans-serif;
          font-weight: 700;
          font-size: 11px;
          padding: 4px 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          position: relative;
          z-index: 10;
        ">
          ${cameraSvg}
          ${label}
        </div>
      </div>
      <style>
        @keyframes ping {
          75%, 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
      </style>
    `,
    iconAnchor: [30, 15],
    popupAnchor: [0, -15],
  });
};

// Create the blue Car icon
const createCarIcon = () => {
  return L.divIcon({
    className: "custom-car-marker",
    html: `
      <div style="
        background-color: #3b82f6; 
        border: 2px solid white;
        border-radius: 50%;
        color: white;
        width: 28px;
        height: 28px;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.8), 0 4px 6px rgba(0,0,0,0.3);
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        ${carSvg}
      </div>
    `,
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

// Moving Car Component
function MovingCar({ coords }: { coords: [number, number][] }) {
  const [pos, setPos] = useState<[number, number]>(coords[0]);
  
  useEffect(() => {
    if (coords.length < 2) return;
    let animationFrameId: number;
    let startTime = Date.now();
    const duration = 12000; // 12 seconds loop

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      let progress = (elapsed % duration) / duration; 
      
      const segmentsCount = coords.length - 1;
      const segmentProgress = progress * segmentsCount;
      const currentSegment = Math.floor(segmentProgress);
      const segmentT = segmentProgress - currentSegment;

      const start = coords[currentSegment];
      const end = coords[currentSegment + 1];

      if (start && end) {
        const lat = start[0] + (end[0] - start[0]) * segmentT;
        const lng = start[1] + (end[1] - start[1]) * segmentT;
        setPos([lat, lng]);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [coords]);

  if (!pos) return null;
  return (
    <Marker position={pos} icon={createCarIcon()} zIndexOffset={2000}>
      <Popup className="custom-popup">
        <div className="text-slate-900 font-sans p-1">
          <strong className="text-base block mb-1 text-white">Target Vehicle</strong>
          <div className="text-xs text-cyan-300 mb-1 font-bold">Tracking Live Movement</div>
        </div>
      </Popup>
    </Marker>
  );
}

function MapBoundsManager({ traceData }: { traceData?: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (traceData && traceData.length > 0 && map) {
      try {
        const bounds = L.latLngBounds(traceData.map(t => [t.latitude, t.longitude]));
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (err) {
        console.warn("Leaflet fitBounds error on hot-reload ignored.", err);
      }
    }
  }, [traceData, map]);
  return null;
}

export default function MapComponent({ traceData = [] }: { traceData?: any[] }) {
  const [cameras, setCameras] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const tileUrl = "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/cameras`)
      .then((res) => res.json())
      .then((data) => setCameras(data))
      .catch(console.error);
  }, []);

  const traceCoords = traceData.map(t => [t.latitude, t.longitude] as [number, number]);

  return (
    <div className="h-full w-full overflow-hidden bg-slate-100 relative z-0 rounded-b-2xl">
      <MapContainer
        center={[23.0225, 72.5714]}
        zoom={12}
        style={{ height: "100%", width: "100%", backgroundColor: '#f1f5f9' }}
        zoomControl={true}
      >
        <MapBoundsManager traceData={traceData} />
        <TileLayer url={tileUrl} />
        
        {/* Render Polyline Route */}
        {traceCoords.length > 1 && (
          <Polyline 
            positions={traceCoords} 
            color="#2563eb" 
            weight={5}
            opacity={0.8}
          />
        )}

        {/* Render Cameras */}
        {cameras.map((cam) => {
          const isTraceEnd = traceData.length > 0 && traceData[traceData.length - 1].camera_name === cam.name;
          let color = cam.status === 'Online' ? 'green' : cam.status === 'Degraded' ? 'yellow' : 'red';
          if (isTraceEnd) color = 'red'; // Highlight

          return (
            <Marker key={cam.id} position={[cam.latitude, cam.longitude]} icon={createSolidIcon(color, cam.id)}>
              <Popup className="custom-popup">
                <div className="text-slate-900 font-sans p-1">
                  <strong className="text-base block mb-1 text-white">{cam.name}</strong>
                  <div className="text-xs text-slate-400 mb-2 font-mono">ID: {cam.id}</div>
                  <span className={`px-2 py-1 rounded text-xs font-bold text-white ${cam.status === 'Online' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    {cam.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Animated Moving Car */}
        {traceCoords.length > 1 && (
          <MovingCar coords={traceCoords} />
        )}
      </MapContainer>
      
      {/* Target Tracker Overlay (Bottom) */}
      {traceData.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-2xl border border-white/10/95 backdrop-blur border border-white/10 p-3 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between z-[400]">
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-sm font-bold text-white">Vehicle: <span className="font-mono text-cyan-300">GJ01XX0001</span></span>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-slate-400 font-mono">
            {traceData.map((t, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${i === traceData.length - 1 ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                {new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} <span className="text-[10px]">({t.camera_name.split(' ')[0]})</span>
                {i < traceData.length - 1 && <span className="mx-1 text-[#1e293b]">&rarr;</span>}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowDetails(true)}
            className="hidden md:block text-xs bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-3 py-1.5 rounded-2xl hover:bg-cyan-400 hover:text-white transition font-medium ml-2"
          >
            View Details
          </button>
        </div>
      )}

      {/* View Details Modal */}
      {showDetails && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-black/40 backdrop-blur-2xl border-white/10 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col relative" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-slate-900/80 backdrop-blur-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Target Tracking Report</h3>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {traceData.length > 0 ? 'GJ01XX0001' : 'UNKNOWN'}</p>
                </div>
              </div>
              <button onClick={() => setShowDetails(false)} className="text-slate-500 hover:text-white bg-[#1e293b]/50 hover:bg-[#1e293b] rounded-full p-1.5 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
              
              {/* Left Column: Image/Snapshot */}
              <div className="flex flex-col gap-3">
                <div className="aspect-video bg-black rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 mix-blend-overlay"></div>
                  {/* Fake ANPR Box overlay */}
                  <div className="absolute top-[30%] left-[25%] w-[50%] h-[40%] border-2 border-rose-500 bg-rose-500/10 rounded flex flex-col items-center justify-end pb-1">
                    <span className="bg-rose-500 text-white text-[8px] font-bold px-1 rounded-2xl shadow-md translate-y-3">MATCH 98%</span>
                  </div>
                  <span className="text-slate-600 font-mono text-xs flex flex-col items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                    Live Snapshot Feed
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 p-3 rounded-2xl text-center">
                    <p className="text-[10px] text-slate-400">Est. Speed</p>
                    <p className="text-lg font-bold text-emerald-400 font-mono">68 <span className="text-[10px] text-slate-500">km/h</span></p>
                  </div>
                  <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 p-3 rounded-2xl text-center">
                    <p className="text-[10px] text-slate-400">Confidence</p>
                    <p className="text-lg font-bold text-cyan-300 font-mono">98.4<span className="text-[10px] text-slate-500">%</span></p>
                  </div>
                </div>
              </div>

              {/* Right Column: Details & Timeline */}
              <div className="flex flex-col gap-4">
                <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-rose-500/30 rounded-2xl p-3">
                  <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2">Watchlist Match Details</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-1"><span className="text-slate-400">Plate Number</span><span className="font-mono font-bold text-white bg-yellow-500/20 text-yellow-400 px-1 rounded">GJ01XX0001</span></div>
                    <div className="flex justify-between border-b border-white/10 pb-1"><span className="text-slate-400">Vehicle Type</span><span className="text-slate-200">White SUV</span></div>
                    <div className="flex justify-between border-b border-white/10 pb-1"><span className="text-slate-400">Owner Status</span><span className="text-rose-400 font-bold">Wanted</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">FIR / Reason</span><span className="text-slate-200">FIR-2026/102</span></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Movement Timeline</h4>
                  <div className="space-y-3 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#1e293b] before:to-transparent">
                    {traceData.map((t, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-[#121826] bg-cyan-400 group-[.is-active]:bg-rose-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2"></div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-2 rounded-md border border-white/10 shadow ml-6 md:ml-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white font-bold">{t.camera_name}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{new Date(t.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
