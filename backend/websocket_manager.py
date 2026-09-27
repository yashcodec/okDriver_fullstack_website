from typing import List
from fastapi import WebSocket
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # Convert dictionary to JSON string
        json_msg = json.dumps(message)
        # Using a copy of the list to iterate to prevent issues if a connection drops during broadcast
        for connection in list(self.active_connections):
            try:
                await connection.send_text(json_msg)
            except Exception as e:
                self.disconnect(connection)

manager = ConnectionManager()
