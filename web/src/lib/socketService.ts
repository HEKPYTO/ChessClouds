import { ServerMessage } from "@/types/socket-types";

export class SocketService {
  private socket: WebSocket | null = null;
  private gameId: string = '';
  private userId: string = '';
  private onMoveCallback: ((move: string) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onHistoryCallback: ((moves: string[]) => void) | null = null;
  private onGameEndCallback: ((outcome: any) => void) | null = null;
  private authenticated: boolean = false;

  constructor(private serverUrl: string = 'ws://localhost:8000/ws') {}

  connect(gameId: string, userId: string): void {
    this.gameId = gameId;
    this.userId = userId;
    this.authenticated = false;
    
    try {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
      
      this.socket = new WebSocket(this.serverUrl);
      
      this.socket.onopen = () => {
        this.authenticate();
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as ServerMessage;
          
          switch (message.kind) {
            case 'Move':
              if (this.onMoveCallback) this.onMoveCallback(message.value);
              break;
            case 'AuthSuccess':
              this.authenticated = true;
              if (this.onConnectCallback) this.onConnectCallback();
              break;
            case 'MoveHistory':
              if (this.onHistoryCallback) this.onHistoryCallback(message.value);
              break;
            case 'GameEnd':
              if (this.onGameEndCallback) this.onGameEndCallback(message.value);
              break;
            case 'Error':
              if (this.onErrorCallback) this.onErrorCallback(message.value);
              break;
          }
        } catch (error) {
          if (this.onErrorCallback) this.onErrorCallback('Error parsing message');
        }
      };

      this.socket.onerror = () => {
        if (this.onErrorCallback) this.onErrorCallback('Connection error');
      };
      
      this.socket.onclose = () => {
        if (this.authenticated && this.onErrorCallback) {
          this.onErrorCallback('Connection closed');
        }
      };
    } catch (error) {
      if (this.onErrorCallback) this.onErrorCallback('Connection failed');
    }
  }

  private authenticate(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    const authMsg = {
      kind: 'Auth',
      value: {
        game_id: this.gameId,
        user_id: this.userId
      }
    };

    this.socket.send(JSON.stringify(authMsg));
  }

  sendMove(move: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    const moveMsg = {
      kind: 'Move',
      value: move
    };

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
    this.authenticated = false;
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN && this.authenticated;
  }
}