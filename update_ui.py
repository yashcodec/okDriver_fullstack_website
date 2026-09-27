import os
import glob

frontend_dir = "frontend/src"
files = glob.glob(f"{frontend_dir}/**/*.tsx", recursive=True) + glob.glob(f"{frontend_dir}/**/*.ts", recursive=True)

replacements = {
    "bg-slate-950": "bg-gradient-to-br from-indigo-950 via-slate-900 to-black",
    "bg-[#090e17]": "bg-gradient-to-br from-indigo-950 via-slate-900 to-black",
    "bg-[#0f1115]": "bg-gradient-to-br from-indigo-950 via-slate-900 to-black",
    "bg-slate-900": "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]",
    "bg-[#1c1e26]": "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
    "bg-[#121826]": "bg-white/5 backdrop-blur-md border border-white/10",
    "bg-[#0b101e]": "bg-black/40 backdrop-blur-2xl border-white/10",
    "border-purple-500/30": "border-white/10",
    "border-[#1e293b]": "border-white/10",
    "rounded-none": "rounded-3xl",
    "rounded-sm": "rounded-2xl",
    "purple-600": "indigo-500",
    "purple-500": "indigo-400",
    "purple-400": "indigo-300",
    "pink-500": "cyan-400",
    "pink-400": "cyan-300",
    
    "Camera Registry": "IoT Sensor Nodes",
    "Live Monitoring": "Real-time Telemetry",
    "Alerts": "Critical Incidents",
    "Watchlist": "Flagged Entities",
    "Analytics": "Insights Engine",
    "Reports": "Compliance Logs",
    "Cameras": "Sensor Nodes",
    "Camera ": "Sensor Node ",
    "cameras": "sensor nodes",
    "camera": "sensor",
    "Vehicle": "Monitored Asset",
    "Vehicles": "Monitored Assets",
    "vehicle": "asset",
    "Command Center": "Central Operations Hub",
    "Smarter Roads. Safer Tomorrow.": "AI-Powered Next-Gen Telemetry.",
    "Sign In to Dashboard": "Authenticate",
    "Create Account": "Register Operator",
    "Recent Alerts": "Recent Incidents",
    "System Online": "Hub Operational",
    "Enter your credentials to access the Command Center.": "Secure authentication required for Central Operations Hub.",
    "CCTV Monitoring & Video Analytics": "Advanced IoT Telemetry & Analytics Platform"
}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for k, v in replacements.items():
        content = content.replace(k, v)
    
    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
