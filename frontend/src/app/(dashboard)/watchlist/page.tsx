"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Car, User, MoreVertical, X, ShieldAlert } from "lucide-react";
import { format } from "date-fns";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlate, setNewPlate] = useState("");
  const [newReason, setNewReason] = useState("");

  const fetchWatchlist = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/watchlist`)
      .then(res => res.json())
      .then(data => setWatchlist(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const filteredItems = watchlist.filter(item => 
    item.identifier.toLowerCase().includes(search.toLowerCase()) || 
    item.reason.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_type: "asset", // Hardcoding asset for this demo
          identifier: newPlate.toUpperCase(),
          reason: newReason,
        })
      });
      setShowAddModal(false);
      setNewPlate("");
      setNewReason("");
      fetchWatchlist(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Are you sure you want to remove this from the watchlist?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`}/api/watchlist/${id}`, { method: "DELETE" });
      fetchWatchlist();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Watchlist Matches</h1>
          <p className="text-sm text-slate-400">Manage blacklisted assets and wanted persons</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search watchlist..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-2xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-400 transition-colors w-64 text-slate-200"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-2xl font-medium transition shadow-lg shadow-rose-500/20 text-sm"
          >
            <Plus size={16} /> Add to Watchlist
          </button>
        </div>
      </div>

      {/* Grid Layout of Watchlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 hover:border-rose-500/30 transition rounded-3xl p-5 relative group flex flex-col">
            
            {/* Delete Button (visible on hover) */}
            <button 
              onClick={() => handleDelete(item.id)}
              className="absolute top-3 right-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 p-1.5 rounded transition opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${item.entity_type === 'asset' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-indigo-400/10 border-indigo-400/20 text-indigo-300'}`}>
                {item.entity_type === 'asset' ? <Car size={24}/> : <User size={24}/>}
              </div>
              <div className="pt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase mb-1 inline-block border bg-black/40 backdrop-blur-2xl border-white/10 border-white/10 text-slate-300 shadow-sm">
                  {item.entity_type}
                </span>
                <h3 className="text-xl font-bold text-white font-mono">{item.identifier}</h3>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-black rounded-2xl p-3 border border-white/10 mt-auto">
              <p className="text-xs text-rose-400 font-medium mb-1">Alert Reason</p>
              <p className="text-sm text-slate-200">{item.reason}</p>
            </div>
            
            <p className="text-[10px] text-slate-500 mt-3 text-right">
              Added: {new Date(item.added_at).toLocaleDateString()}
            </p>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
            <ShieldAlert size={48} className="text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-300">No Watchlist Matches</h3>
            <p className="text-slate-500 mt-2">Your search didn't match any blacklisted entities.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-black/40 backdrop-blur-2xl border-white/10 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-slate-900/80 backdrop-blur-2xl border border-white/10">
              <h3 className="font-bold text-white">Add to Watchlist</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Vehicle Plate Number (Identifier)</label>
                <input 
                  type="text" 
                  required
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  placeholder="e.g. DL01ZZ1234"
                  className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-2xl px-4 py-2 text-white font-mono focus:outline-none focus:border-rose-500 transition-colors uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Alert Reason / FIR Details</label>
                <textarea 
                  required
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="e.g. Reported stolen in FIR-2026/89"
                  className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-rose-500 transition-colors h-24 resize-none"
                ></textarea>
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 rounded-2xl transition shadow-lg shadow-rose-500/20"
                >
                  Add to Watchlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
