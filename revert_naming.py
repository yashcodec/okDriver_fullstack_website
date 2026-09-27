import glob

files = glob.glob("frontend/src/**/*.tsx", recursive=True) + glob.glob("frontend/src/**/*.ts", recursive=True)

var_fixes = {
    "sensor nodes": "cameras",
    "Sensor Nodes": "Cameras",
    "sensorNodes": "cameras",
    "SensorNodes": "Cameras",
    "sensor node": "camera",
    "Sensor Node": "Camera",
    "sensorNode": "camera",
    "SensorNode": "Camera",
    "sensors": "cameras",
    "Sensors": "Cameras",
    "sensor": "camera",
    "Sensor": "Camera",
    
    "flagged entities": "watchlist",
    "Flagged Entities": "Watchlist",
    "flaggedEntities": "watchlist",
    "FlaggedEntities": "Watchlist",
    
    "monitored assets": "vehicles",
    "Monitored Assets": "Vehicles",
    "monitored asset": "vehicle",
    "Monitored Asset": "Vehicle",
    "monitoredAsset": "vehicle",
    "MonitoredAsset": "Vehicle",
    
    "critical incidents": "alerts",
    "Critical Incidents": "Alerts",
    "critical incident": "alert",
    "Critical Incident": "Alert",
    "criticalIncidents": "alerts",
    "CriticalIncidents": "Alerts",
    "criticalIncident": "alert",
    "CriticalIncident": "Alert",
    
    "Real-time Telemetry": "Live Monitoring",
    "RealTimeTelemetry": "LiveMonitoring",
    "Insights Engine": "Analytics",
    "InsightsEngine": "Analytics",
    "Compliance Logs": "Reports",
    "ComplianceLogs": "Reports",
    "Central Operations Hub": "Command Center",
    "Advanced IoT Telemetry & Analytics Platform": "CCTV Monitoring & Video Analytics",
    "AI-Powered Next-Gen Telemetry.": "Smarter Roads. Safer Tomorrow.",
    "Authenticate": "Sign In to Dashboard",
    "Register Operator": "Create Account",
    "Recent Incidents": "Recent Alerts",
    "Hub Operational": "System Online",
    "Secure authentication required for Central Operations Hub.": "Enter your credentials to access the Command Center.",
    
    "IoT Cameras": "Camera Registry",
    "IoT Camera": "Camera Registry",
    "IoT Cameras": "Camera Registry",
    "IoT cameras": "camera registry",
    
    "IoT Sensor Nodes": "Camera Registry",
}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    for k, v in var_fixes.items():
        content = content.replace(k, v)
        
    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
