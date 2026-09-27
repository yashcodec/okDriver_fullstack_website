"use client";
import { useEffect, useState } from "react";
import { User as UserIcon, Mail, Phone, Shield, Edit3, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push("/login");
    }
  }, [router]);

  const startEdit = () => {
    setEditData({ name: user.name, email: user.email, phone: user.phone });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      alert("Error saving profile");
    }
  };

  if (!user) return <div className="p-8 text-white">Loading profile...</div>;

  return (
    <div className="p-6 md:p-8 h-full overflow-auto">
      <h1 className="text-2xl font-bold text-white mb-6">User Profile</h1>

      <div className="max-w-4xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        
        {/* Header / Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-900/40 to-indigo-500/10 border-b border-white/10 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-24 h-24 rounded-full bg-indigo-500 border-4 border-[#1c1e26] flex items-center justify-center font-bold text-white text-4xl shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="pt-14 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-cyan-300 font-medium text-sm flex items-center gap-1.5 mt-1">
                <Shield size={14} /> Command Center Operator
              </p>
            </div>
            
            {!isEditing ? (
              <button onClick={startEdit} className="flex items-center gap-2 px-4 py-2 bg-[#262936] hover:bg-[#2d313f] text-white rounded-2xl font-medium transition text-sm shadow-md">
                <Edit3 size={16} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-[#262936] hover:bg-[#2d313f] text-slate-300 rounded-2xl font-medium transition text-sm">
                  <X size={16} /> Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-purple-700 text-white rounded-2xl font-medium transition text-sm shadow-md shadow-cyan-400/20">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            )}
          </div>

          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mt-8 mb-4 border-b border-white/10 pb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Info Card 1 */}
            <div className="bg-[#14161c] p-4 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 text-slate-400 mb-1 text-sm">
                <UserIcon size={16} /> Full Name
              </div>
              {!isEditing ? (
                <p className="text-white font-medium pl-7 text-lg">{user.name}</p>
              ) : (
                <input 
                  type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})}
                  className="w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded px-3 py-1.5 text-white mt-1 focus:outline-none focus:border-cyan-400 ml-6"
                />
              )}
            </div>

            {/* Info Card 2 */}
            <div className="bg-[#14161c] p-4 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 text-slate-400 mb-1 text-sm">
                <Mail size={16} /> Email Address
              </div>
              {!isEditing ? (
                <p className="text-white font-medium pl-7 text-lg">{user.email}</p>
              ) : (
                <input 
                  type="email" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})}
                  className="w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded px-3 py-1.5 text-white mt-1 focus:outline-none focus:border-cyan-400 ml-6"
                />
              )}
            </div>

            {/* Info Card 3 */}
            <div className="bg-[#14161c] p-4 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 text-slate-400 mb-1 text-sm">
                <Phone size={16} /> Phone Number
              </div>
              {!isEditing ? (
                <p className="text-white font-medium pl-7 text-lg">{user.phone || "Not provided"}</p>
              ) : (
                <input 
                  type="text" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})}
                  className="w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded px-3 py-1.5 text-white mt-1 focus:outline-none focus:border-cyan-400 ml-6"
                />
              )}
            </div>

            {/* Info Card 4 (Static) */}
            <div className="bg-[#14161c] p-4 rounded-3xl border border-white/10 opacity-75">
              <div className="flex items-center gap-3 text-slate-400 mb-1 text-sm">
                <Shield size={16} /> Security Clearance
              </div>
              <p className="text-emerald-500 font-bold pl-7 text-lg">Level 3 (Active)</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


