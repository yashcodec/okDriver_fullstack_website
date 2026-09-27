"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Server error. Make sure backend is running.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-full text-white">
          <span className="font-bold text-xl">NG</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-wide">okDriver</h1>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
        <p className="text-slate-400 text-sm mb-6">Secure authentication required for Central Operations Hub.</p>
        
        {error && <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-3 rounded-2xl text-sm mb-4">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
            <input 
              type="email" required
              className="w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-colors"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input 
              type="password" required
              className="w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-colors"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="w-full bg-indigo-500 hover:bg-purple-700 text-white font-medium py-2.5 rounded-2xl transition-colors mt-2">
            Authenticate
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account? <Link href="/signup" className="text-cyan-400 hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
