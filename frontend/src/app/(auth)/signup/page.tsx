"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", countryCode: "+91", password: "" });
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Frontend Password Validation
    const pw = formData.password;
    if (pw.length < 8 || !/[A-Z]/.test(pw) || !/\d/.test(pw) || !/[^a-zA-Z0-9]/.test(pw)) {
      setError("Password must be at least 8 chars long, contain 1 uppercase letter, 1 number, and 1 special character.");
      return;
    }

    if (formData.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.countryCode + formData.phone,
          password: formData.password
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/");
      } else {
        setError(data.detail || "Registration failed");
      }
    } catch (err) {
      setError("Server error. Make sure Django backend is running on port 8000.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-full text-white">
          <span className="font-bold text-xl">ok</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-wide">okDriver</h1>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-slate-400 text-sm mb-6">Register to manage CCTV feeds and AI alerts.</p>
        
        {error && <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-3 rounded-2xl text-sm mb-4 leading-relaxed">{error}</div>}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
            <input 
              type="text" required
              className="w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-colors"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
            <input 
              type="email" required
              className="w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-colors"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number (10 Digits)</label>
            <div className="flex gap-2">
              <select 
                value={formData.countryCode} 
                onChange={e => setFormData({...formData, countryCode: e.target.value})}
                className="bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded-2xl px-2 py-2.5 text-white focus:outline-none focus:border-cyan-400 w-[90px] text-sm"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+61">+61</option>
              </select>
              <input 
                type="text" required placeholder="9876543210"
                className="flex-1 bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                value={formData.phone} 
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({...formData, phone: val});
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1 flex justify-between">
              Password
              <span className="text-xs text-slate-500 flex items-center gap-1"><ShieldCheck size={12}/> Strong req.</span>
            </label>
            <input 
              type="password" required
              className="w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-colors"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="w-full bg-indigo-500 hover:bg-purple-700 text-white font-medium py-2.5 rounded-2xl transition-colors mt-2 shadow-lg shadow-cyan-400/20">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account? <Link href="/login" className="text-cyan-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
