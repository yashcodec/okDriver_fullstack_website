import re

def replace_exact(filepath, old, new):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Sidebar Nav Links
layout_path = "frontend/src/app/(dashboard)/layout.tsx"
replace_exact(layout_path, 'label="Camera Registry"', 'label="Sensor Fleet"')
replace_exact(layout_path, 'label="Live Monitoring"', 'label="Real-Time Telemetry"')
replace_exact(layout_path, 'label="Alerts"', 'label="Critical Incidents"')
replace_exact(layout_path, 'label="Watchlist"', 'label="Flagged Entities"')
replace_exact(layout_path, 'label="Analytics"', 'label="Insights Engine"')
replace_exact(layout_path, 'label="Reports"', 'label="Compliance Logs"')

# 2. Login Page
login_path = "frontend/src/app/(auth)/login/page.tsx"
replace_exact(login_path, 'Enter your credentials to access the Command Center.', 'Secure authentication required for Central Operations Hub.')
replace_exact(login_path, 'Sign In to Dashboard', 'Authenticate')

# 3. Topbar Search placeholder
topbar_path = "frontend/src/components/Topbar.tsx"
replace_exact(topbar_path, 'placeholder="Search cameras, vehicles, alerts..."', 'placeholder="Search sensors, assets, incidents..."')
replace_exact(topbar_path, 'Recent Alerts', 'Recent Incidents')
