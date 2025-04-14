import { ServerMessage } from "@/types/socket-types";

export default class SocketService {
  private socket: WebSocket | null = null;
  private gameId: string = '';
  private userId: string = '';
  private onMoveCallback: ((move: string) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onHistoryCallback: ((moves: string[]) => void) | null = null;
  private onGameEndCallback: ((outcome: any) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;

  constructor(private serverUrl: string = 'ws://localhost:8000/ws') {
    console.log('[Socket] Initializing with URL:', serverUrl);
  }

  connect(gameId: string, userId: string): void {
    this.gameId = gameId;
    this.userId = userId;
    
    console.log(`[Socket] Connecting to game ${gameId} as ${userId}`);
    
    try {
      this.socket = new WebSocket(this.serverUrl);
      
      this.socket.onopen = () => {
        console.log('[Socket] Connection established');
        this.authenticate();
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        console.log('[Socket] Message received:', event.data);
        try {
          const message = JSON.parse(event.data) as ServerMessage;
          
          switch (message.kind) {
            case 'Move':
              console.log('[Socket] Move received:', message.value);
              if (this.onMoveCallback) this.onMoveCallback(message.value);
              break;
            case 'AuthSuccess':
              console.log('[Socket] Authentication successful');
              if (this.onConnectCallback) this.onConnectCallback();
              break;
            case 'MoveHistory':
              console.log('[Socket] Move history received:', message.value);
              if (this.onHistoryCallback) this.onHistoryCallback(message.value);
              break;
            case 'Error':
              console.error('[Socket] Error received:', message.value);
              if (this.onErrorCallback) this.onErrorCallback(message.value);
              break;
            case 'GameEnd':
              console.log('[Socket] Game ended:', message.value);
              if (this.onGameEndCallback) this.onGameEndCallback(message.value);
              break;
          }
        } catch (error) {
          console.error('[Socket] Error parsing message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('[Socket] WebSocket error:', error);
        if (this.onErrorCallback) this.onErrorCallback('Connection error');
      };

      this.socket.onclose = (event) => {
        console.log('[Socket] Connection closed. Code:', event.code, 'Reason:', event.reason);
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`[Socket] Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`);
          this.reconnectAttempts++;
          setTimeout(() => {
            this.connect(this.gameId, this.userId);
          }, 2000 * this.reconnectAttempts);
        } else {
          console.log('[Socket] Max reconnection attempts reached');
          if (this.onErrorCallback) this.onErrorCallback('Connection lost');
        }
      };
    } catch (error) {
      console.error('[Socket] Connection failed:', error);
      if (this.onErrorCallback) this.onErrorCallback('Failed to create WebSocket connection');
    }
  }

  private authenticate(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('[Socket] Cannot authenticate: socket not open');
      return;
    }

    const authMsg = {
      kind: 'Auth',
      value: {
        game_id: this.gameId,
        user_id: this.userId
      }
    };

    console.log('[Socket] Sending authentication:', authMsg);
    this.socket.send(JSON.stringify(authMsg));
  }

  sendMove(move: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('[Socket] Cannot send move: socket not open');
      return;
    }

    const moveMsg = {
      kind: 'Move',
      value: move
    };

    console.log('[Socket] Sending move:', moveMsg);
    this.socket.send(JSON.stringify(moveMsg));
  }

  onMove(callback: (move: string) => void): void {
    this.onMoveCallback = callback;
  }

  onConnect(callback: () => void): void {
    this.onConnectCallback = callback;
  }

  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  onHistory(callback: (moves: string[]) => void): void {
    this.onHistoryCallback = callback;
  }

  onGameEnd(callback: (outcome: any) => void): void {
    this.onGameEndCallback = callback;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}