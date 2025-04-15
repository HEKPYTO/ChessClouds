// src/lib/socketService.ts
import { 
  ServerMessage, 
  MoveCallback, 
  ConnectCallback, 
  ErrorCallback, 
  HistoryCallback, 
  GameEndCallback, 
} from '@/types/shared';

let socketInstance: SocketService | null = null;

export class SocketService {
  private socket: WebSocket | null = null;
  private gameId: string = '';
  private userId: string = '';
  private onMoveCallback: MoveCallback | null = null;
  private onConnectCallback: ConnectCallback | null = null;
  private onErrorCallback: ErrorCallback | null = null;
  private onHistoryCallback: HistoryCallback | null = null;
  private onGameEndCallback: GameEndCallback | null = null;
  private authenticated: boolean = false;
  private reconnectAttempt: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private manualDisconnect: boolean = false;
  private connecting: boolean = false;
  private serverUrl: string;

  constructor(serverUrl: string = 'ws://localhost:8000/ws') {
    this.serverUrl = serverUrl;
  }

  static getInstance(serverUrl: string = 'ws://localhost:8000/ws'): SocketService {
    if (!socketInstance) {
      socketInstance = new SocketService(serverUrl);
    }
    return socketInstance;
  }

  static resetInstance(): void {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
  }

  connect(gameId: string, userId: string): void {
    if (this.isConnected() && this.gameId === gameId && this.userId === userId) {
      console.log('Already connected to the same game');
      if (this.onConnectCallback) this.onConnectCallback();
      return;
    }

    this.gameId = gameId;
    this.userId = userId;
    this.authenticated = false;
    this.reconnectAttempt = 0;
    this.manualDisconnect = false;
    
    if (this.connecting) {
      console.log('Connection attempt already in progress');
      return;
    }
    
    this.createSocketConnection();
  }

  private createSocketConnection(): void {
    if (this.connecting) return;
    this.connecting = true;

    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close();
      }
      this.socket = null;
    }

    try {
      console.log(`Creating socket connection to ${this.serverUrl}...`);
      this.socket = new WebSocket(this.serverUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connection opened, authenticating...');
        this.connecting = false;
        this.authenticate();
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as ServerMessage;
          console.log('Received message:', message);

          switch (message.kind) {
            case 'Move':
              if (this.onMoveCallback) this.onMoveCallback(message.value);
              break;
            case 'AuthSuccess':
              this.authenticated = true;
              this.reconnectAttempt = 0; // Reset on successful authentication
              if (this.onConnectCallback) this.onConnectCallback();
              console.log('Authentication successful');
              break;
            case 'MoveHistory':
              if (this.onHistoryCallback) this.onHistoryCallback(message.value);
              break;
            case 'GameEnd':
              if (this.onGameEndCallback) this.onGameEndCallback(message.value);
              break;
            case 'Error':
              console.error('Server error:', message.value);
              if (this.onErrorCallback) this.onErrorCallback(typeof message.value === 'string' 
                ? message.value 
                : String(message.value));
              break;
          }
        } catch (error) {
          console.error('Error parsing message:', error, event.data);
          if (this.onErrorCallback) {
            this.onErrorCallback('Failed to parse server message');
          }
        }
      };

      this.socket.onerror = (event) => {
        this.connecting = false;
        console.error('WebSocket error:', event);
        if (this.onErrorCallback) {
          this.onErrorCallback('Connection error occurred');
        }
      };

      this.socket.onclose = (event) => {
        this.connecting = false;
        this.authenticated = false;
        console.log(`WebSocket closed: ${event.code} ${event.reason || 'No reason provided'}`);
        
        if (this.onErrorCallback && !this.manualDisconnect) {
          this.onErrorCallback('Connection closed: ' + (event.reason || 'Unknown reason'));
        }
        
        if (!this.manualDisconnect && this.reconnectAttempt < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      this.connecting = false;
      console.error('Failed to create WebSocket:', error);
      if (this.onErrorCallback) {
        this.onErrorCallback('Failed to create connection: ' + String(error));
      }
    }
  }

  private scheduleReconnect(): void {
    const baseDelay = 1000;
    const maxDelay = 10000;
    const delay = Math.min(baseDelay * Math.pow(1.5, this.reconnectAttempt), maxDelay);
    const jitter = 0.2 * delay * (Math.random() - 0.5);
    const finalDelay = Math.floor(delay + jitter);
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempt + 1} in ${finalDelay}ms`);
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectTimer = setTimeout(() => {
      if (this.reconnectAttempt < this.maxReconnectAttempts && !this.manualDisconnect) {
        console.log(`Reconnect attempt ${this.reconnectAttempt + 1}/${this.maxReconnectAttempts}`);
        this.reconnectAttempt++;
        this.createSocketConnection();
      } else if (!this.manualDisconnect) {
        console.error('Maximum reconnection attempts reached');
        if (this.onErrorCallback) {
          this.onErrorCallback('Maximum reconnection attempts reached');
        }
      }
    }, finalDelay);
  }

  private authenticate(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot authenticate: socket not open');
      return;
    }

    const authMsg = {
      kind: 'Auth',
      value: {
        game_id: this.gameId,
        user_id: this.userId,
      },
    };

    console.log('Sending auth message:', authMsg);
    this.socket.send(JSON.stringify(authMsg));
  }

  sendMove(move: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send move: socket not open');
      if (this.onErrorCallback) {
        this.onErrorCallback('Cannot send move: connection not open');
      }
      return;
    }

    if (!this.authenticated) {
      console.error('Cannot send move: not authenticated');
      if (this.onErrorCallback) {
        this.onErrorCallback('Cannot send move: not authenticated');
      }
      return;
    }

    const moveMsg = {
      kind: 'Move',
      value: move,
    };

    console.log('Sending move:', moveMsg);
    this.socket.send(JSON.stringify(moveMsg));
  }

  onMove(callback: MoveCallback): void {
    this.onMoveCallback = callback;
  }

  onConnect(callback: ConnectCallback): void {
    this.onConnectCallback = callback;
    if (this.isConnected()) {
      callback();
    }
  }

  onError(callback: ErrorCallback): void {
    this.onErrorCallback = callback;
  }

  onHistory(callback: HistoryCallback): void {
    this.onHistoryCallback = callback;
  }

  onGameEnd(callback: GameEndCallback): void {
    this.onGameEndCallback = callback;
  }

  disconnect(): void {
    this.manualDisconnect = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close(1000, "Disconnected by user");
      }
      this.socket = null;
    }
    
    this.authenticated = false;
    this.connecting = false;
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN && this.authenticated;
  }
}