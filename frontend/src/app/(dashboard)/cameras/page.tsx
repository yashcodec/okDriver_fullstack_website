"use client";

import { useEffect, useState } from "react";
import { Search, Plus, X } from "lucide-react";

export default function CamerasPage() {
  const [cameras, setCameras] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCam, setNewCam] = useState({
    id: "", name: "", department: "Traffic Police", zone: "Central Zone",
    latitude: 23.0, longitude: 72.5, camera_type: "Fixed", status: "Online"
  });

  const fetchCameras = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/cameras`)
      .then(res => res.json())
      .then(data => setCameras(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const handleAddSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/cameras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCam)
      });
      setShowAddModal(false);
      fetchCameras();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCameras = cameras.filter(c => {
    const matchesSearch = c.id?.toLowerCase().includes(search.toLowerCase()) || 
                          c.name?.toLowerCase().includes(search.toLowerCase()) ||
                          c.zone?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === "All Departments" || c.department === departmentFilter;
    const matchesStatus = statusFilter === "All Statuses" || c.status === statusFilter;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 h-full bg-[#0b0e14] overflow-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Camera Registry & Onboarding</h1>
          <p className="text-[13px] text-slate-400">Centralized registry supporting manual and API-based camera ingestion</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-purple-700 rounded-2xl text-white transition shadow-sm text-sm font-medium"
        >
          <Plus size={16} /> Onboard Camera Source
        </button>
      </div>

      <div className="bg-[#121620] border border-[#1e2532] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Filters Area */}
        <div className="p-4 border-b border-[#1e2532] flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Filter by Camera ID, Name, or Location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0b0e14] border border-[#1e2532] rounded-2xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-600"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-[#0b0e14] border border-[#1e2532] rounded-2xl px-3 py-2 text-sm text-slate-300 focus:outline-none"
            >
              <option value="All Departments">All Departments</option>
              <option value="Traffic Police">Traffic Police</option>
              <option value="City Police">City Police</option>
              <option value="RTO">RTO</option>
              <option value="Highways">Highways</option>
              <option value="Railways">Railways</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0b0e14] border border-[#1e2532] rounded-2xl px-3 py-2 text-sm text-slate-300 focus:outline-none"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Degraded">Degraded</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1e2532] text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                <th className="px-6 py-4">CAMERA ID</th>
                <th className="px-6 py-4">NAME</th>
                <th className="px-6 py-4">DEPARTMENT</th>
                <th className="px-6 py-4">ZONE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">PROTOCOL</th>
                <th className="px-6 py-4">RESOLUTION</th>
                <th className="px-6 py-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2532]/50 text-slate-300">
              {filteredCameras.map((cam) => (
                <tr key={cam.id} className="hover:bg-[#1a1f2e]/50 transition group">
                  <td className="px-6 py-3 font-medium text-slate-200">{cam.id}</td>
                  <td className="px-6 py-3">{cam.name}</td>
                  <td className="px-6 py-3">{cam.department}</td>
                  <td className="px-6 py-3">{cam.zone}</td>
                  <td className="px-6 py-3">
                    {cam.status === 'Online' && <span className="flex items-center gap-1.5 text-emerald-500 font-medium border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit text-[11px]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online</span>}
                    {cam.status === 'Degraded' && <span className="flex items-center gap-1.5 text-orange-500 font-medium border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 rounded-full w-fit text-[11px]"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Degraded</span>}
                    {cam.status === 'Offline' && <span className="flex items-center gap-1.5 text-rose-500 font-medium border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 rounded-full w-fit text-[11px]"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Offline</span>}
                  </td>
                  <td className="px-6 py-3">{cam.source_protocol || "RTSP"}</td>
                  <td className="px-6 py-3">{cam.resolution || "1080p 30fps"}</td>
                  <td className="px-6 py-3">
                    <button className="text-cyan-300 hover:text-blue-300 font-medium text-[12px] transition">
                      Live View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCameras.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No cameras found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Camera Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-black/40 backdrop-blur-2xl border-white/10 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-slate-900/80 backdrop-blur-2xl border border-white/10">
              <h3 className="font-bold text-white">Add New Camera</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Camera ID</label>
                  <input 
                    type="text" required value={newCam.id} onChange={(e) => setNewCam({...newCam, id: e.target.value})}
                    placeholder="e.g. C008"
                    className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-2xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Camera Name / Location Name</label>
                  <input 
                    type="text" required value={newCam.name} onChange={(e) => setNewCam({...newCam, name: e.target.value})}
                    placeholder="e.g. SG Highway Checkpoint"
                    className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Department</label>
                  <select 
                    value={newCam.department} onChange={(e) => setNewCam({...newCam, department: e.target.value})}
                    className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="Traffic Police">Traffic Police</option>
                    <option value="City Police">City Police</option>
                    <option value="RTO">RTO</option>
                    <option value="Highways">Highways</option>
                    <option value="Railways">Railways</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Zone</label>
                  <input 
                    type="text" required value={newCam.zone} onChange={(e) => setNewCam({...newCam, zone: e.target.value})}
                    className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Latitude</label>
                  <input 
                    type="number" step="0.0001" required value={newCam.latitude} onChange={(e) => setNewCam({...newCam, latitude: parseFloat(e.target.value)})}
                    className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-2xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Longitude</label>
                  <input 
                    type="number" step="0.0001" required value={newCam.longitude} onChange={(e) => setNewCam({...newCam, longitude: parseFloat(e.target.value)})}
                    className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-2xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Camera Type</label>
                  <select 
                    value={newCam.camera_type} onChange={(e) => setNewCam({...newCam, camera_type: e.target.value})}
                    className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="Fixed">Fixed Lens</option>
                    <option value="PTZ">PTZ (Pan-Tilt-Zoom)</option>
                    <option value="ANPR">ANPR Dedicated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
                  <select 
                    value={newCam.status} onChange={(e) => setNewCam({...newCam, status: e.target.value})}
                    className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="Online">Online</option>
                    <option value="Degraded">Degraded</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                  type="button" onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-500 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-2xl transition shadow-lg shadow-cyan-400/20"
                >
                  Save Camera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
