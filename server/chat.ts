import { WebSocketServer } from "ws";
import type { Server } from "http";
import type { User } from "@shared/schema";

interface ChatMessage {
  type: 'text' | 'voice' | 'video';
  from: number;
  to: number;
  content: string;
  timestamp: number;
}

export function setupChatServer(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/chat' });

  const clients = new Map<number, WebSocket>();

  wss.on('connection', (ws, req) => {
    const userId = parseInt(req.url?.split('userId=')[1] || '0');
    clients.set(userId, ws);

    ws.on('message', (data: string) => {
      try {
        const message: ChatMessage = JSON.parse(data);
        const targetClient = clients.get(message.to);
        
        if (targetClient?.readyState === WebSocket.OPEN) {
          targetClient.send(JSON.stringify(message));
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(userId);
    });
  });
}
