import glob
import re

files = glob.glob("frontend/src/**/*.tsx", recursive=True) + glob.glob("frontend/src/**/*.ts", recursive=True)

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix function declarations
    content = content.replace("function Sensor NodesPage", "function SensorNodesPage")
    content = content.replace("function Sensor NodePage", "function SensorNodePage")
    content = content.replace("function Real-time TelemetryPage", "function RealTimeTelemetryPage")
    
    # Fix variables and setters
    content = content.replace("setSensor Nodes", "setSensorNodes")
    content = content.replace("[sensor nodes,", "[sensorNodes,")
    content = content.replace("sensor nodes.map", "sensorNodes.map")
    content = content.replace("sensor nodes.filter", "sensorNodes.filter")
    content = content.replace("sensor nodes.length", "sensorNodes.length")
    content = content.replace("sensor nodes", "sensorNodes") # This might catch text but JSX text is usually {sensorNodes} or plain text. Wait, plain text "sensor nodes" in UI is fine, but in JS it's broken. Let's rely on regex.
    
    # Let's use a safer regex approach for fixing broken camelCases that got spaced out.
    # We introduced things like "Sensor Node", "Sensor Nodes", "sensor nodes".
    # Where these are part of a variable or property like `a.sensor nodes` -> `a.sensorNodes`.
    
    content = re.sub(r'setSensor Node(s?)', r'setSensorNode\1', content)
    content = re.sub(r'setMonitored Asset(s?)', r'setMonitoredAsset\1', content)
    content = re.sub(r'setFlagged Entit(y|ies)', r'setFlaggedEntit\1', content)
    content = re.sub(r'setReal-time Telemetr(y|ies)', r'setRealTimeTelemetr\1', content)
    content = re.sub(r'setCritical Incident(s?)', r'setCriticalIncident\1', content)
    
    # [variable,
    content = re.sub(r'\[sensor node(s?),', r'[sensorNode\1,', content)
    content = re.sub(r'\[Monitored Asset(s?),', r'[monitoredAsset\1,', content)
    content = re.sub(r'\[Flagged Entit(y|ies),', r'[flaggedEntit\1,', content)
    content = re.sub(r'\[Critical Incident(s?),', r'[criticalIncident\1,', content)
    
    # function Component
    content = re.sub(r'function ([a-zA-Z0-9_]+) ([a-zA-Z0-9_ ]+)Page', lambda m: f"function {m.group(1)}{m.group(2).replace(' ', '')}Page", content)
    content = content.replace("function Sensor NodesPage", "function SensorNodesPage")
    content = content.replace("function Sensor NodePage", "function SensorNodePage")
    
    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
