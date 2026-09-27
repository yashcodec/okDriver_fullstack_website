"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Lock, Bell, Moon, Sun, ShieldAlert, KeyRound, MonitorSmartphone } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("security");
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/users/${user.id || 'undefined'}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: passwordData.newPassword }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setPwSuccess("Password successfully updated!");
        setPasswordData({ newPassword: "", confirmPassword: "" });
      } else {
        setPwError(data.detail || "Failed to update password.");
      }
    } catch (err) {
      setPwError("Server error. Ensure Django backend is running.");
    }
  };

  if (!user) return <div className="p-8 text-white">Loading settings...</div>;

  return (
    <div className="p-6 md:p-8 h-full flex flex-col overflow-hidden">
      <h1 className="text-2xl font-bold text-white mb-6">Account Settings</h1>

      <div className="flex-1 bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#171920] border-r border-white/10 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-3 px-4 py-3 rounded-3xl transition font-medium text-sm ${activeTab === 'general' ? 'bg-indigo-500/20 text-cyan-400' : 'text-slate-400 hover:bg-[#1f222b] hover:text-white'}`}
          >
            <Settings size={18} /> General
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-4 py-3 rounded-3xl transition font-medium text-sm ${activeTab === 'security' ? 'bg-indigo-500/20 text-cyan-400' : 'text-slate-400 hover:bg-[#1f222b] hover:text-white'}`}
          >
            <Lock size={18} /> Security & Password
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3 px-4 py-3 rounded-3xl transition font-medium text-sm ${activeTab === 'notifications' ? 'bg-indigo-500/20 text-cyan-400' : 'text-slate-400 hover:bg-[#1f222b] hover:text-white'}`}
          >
            <Bell size={18} /> Notification Preferences
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">General Preferences</h2>
                <p className="text-sm text-slate-400 mb-6">Manage your UI and localization settings.</p>
              </div>

              <div className="bg-[#14161c] border border-white/10 rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2"><Moon size={16}/> Dark Mode</h3>
                    <p className="text-xs text-slate-500 mt-1">Command center is locked to dark mode for optimal visibility.</p>
                  </div>
                  <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-not-allowed opacity-80">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-[#14161c] border border-white/10 rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2"><MonitorSmartphone size={16}/> Responsive Layout</h3>
                    <p className="text-xs text-slate-500 mt-1">Automatically adjust camera grids on smaller screens.</p>
                  </div>
                  <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer transition">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Security & Password</h2>
                <p className="text-sm text-slate-400 mb-6">Update your password and secure your account.</p>
              </div>

              {pwError && <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-3 rounded-2xl text-sm mb-4 leading-relaxed">{pwError}</div>}
              {pwSuccess && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 p-3 rounded-2xl text-sm mb-4 leading-relaxed">{pwSuccess}</div>}

              <form onSubmit={handlePasswordChange} className="bg-[#14161c] border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-cyan-400 mb-4 pb-4 border-b border-white/10">
                  <KeyRound size={20} />
                  <span className="font-medium text-white">Change Password</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                  <input 
                    type="password" required minLength={8}
                    className="w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                  <p className="text-xs text-slate-500 mt-1.5">Must be at least 8 chars, 1 uppercase, 1 number, 1 special character.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
                  <input 
                    type="password" required
                    className="w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" className="bg-indigo-500 hover:bg-purple-700 text-white font-medium px-6 py-2.5 rounded-2xl transition-colors shadow-lg shadow-cyan-400/20">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Alert Preferences</h2>
                <p className="text-sm text-slate-400 mb-6">Choose how you want to be notified of critical CCTV detections.</p>
              </div>

              <div className="space-y-3">
                <div className="bg-[#14161c] border border-white/10 rounded-3xl p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Critical Intrusions (Watchlist)</h3>
                    <p className="text-xs text-slate-500 mt-1">Receive loud desktop alarms and push notifications.</p>
                  </div>
                  <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer transition">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="bg-[#14161c] border border-white/10 rounded-3xl p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Daily Summary Reports</h3>
                    <p className="text-xs text-slate-500 mt-1">Email me a CSV report of all detections every midnight.</p>
                  </div>
                  <div className="w-12 h-6 bg-[#262936] rounded-full relative cursor-pointer transition">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-[#14161c] border border-white/10 rounded-3xl p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2 text-rose-400"><ShieldAlert size={16}/> SMS Emergency Alerts</h3>
                    <p className="text-xs text-slate-500 mt-1">Send SMS to {user.phone || 'your phone'} on Level 1 threats.</p>
                  </div>
                  <div className="w-12 h-6 bg-rose-600 rounded-full relative cursor-pointer transition">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
