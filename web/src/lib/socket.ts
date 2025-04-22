'use client';

import {
  ClientMessage,
  AuthCallback,
  ErrorCallback,
  GameEndCallback,
  HistoryCallback,
  MoveCallback,
  ServerMessage,
} from '@/types/shared';
import { useEffect, useRef, useState } from 'react';

export type SocketStatus = 'connecting' | 'authenticated' | 'closed';

export type SocketResponse = {
  status: SocketStatus;
  move: (move: string) => void;
  disconnect: () => void;
};

export default function useSocket(
  url: string | URL,
  gameId: string,
  userId: string,
  onError?: ErrorCallback,
  onAuth?: AuthCallback,
  onGameEnd?: GameEndCallback,
  onHistory?: HistoryCallback,
  onMove?: MoveCallback
): SocketResponse {
  const socket_ref = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<SocketStatus>('connecting');

  useEffect(() => {
    const socket = new WebSocket(url);

    socket_ref.current = socket;

    socket.onopen = () => {
      const authMsg: ClientMessage = {
        kind: 'Auth',
        value: { game_id: gameId, user_id: userId },
      };
      socket.send(JSON.stringify(authMsg));
    };

    socket.onerror = () => {
      setStatus('closed');
      if (onError) {
        onError('Connection closed due to an error');
      }
    };

    socket.onclose = (event) => {
      setStatus('closed');
      const normalClosure =
        event.code === 1000 || event.code === 1001 || event.code === 1005;
      const gameRelatedMessage =
        event.reason &&
        (event.reason.includes('game') || event.reason.includes('complete'));

      if (normalClosure || gameRelatedMessage) {
        if (onError)
          onError(`disconnect:normal:${event.reason || 'Game session ended'}`);
      } else {
        if (onError)
          onError(`disconnect:error:${event.reason || 'Connection lost'}`);
      }
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as ServerMessage;

        switch (message.kind) {
          case 'Move':
            if (onMove) onMove(message.value);
            break;

          case 'AuthSuccess':
            setStatus('authenticated');
            if (onAuth) onAuth();
            break;

          case 'MoveHistory':
            if (onHistory) onHistory(message.value);
            break;

          case 'GameEnd':
            if (onGameEnd) onGameEnd(message.value);
            break;

          case 'Error':
            if (onError)
              onError(
                typeof message.value === 'string'
                  ? message.value
                  : String(message.value)
              );
            break;
        }
      } catch (error) {
        if (onError) {
          onError('Failed to parse server message');
          console.error(error);
        }
      }
    };

    return () => {
      socket.close();
    };
  }, [url, gameId, userId, onAuth, onError, onGameEnd, onHistory, onMove]);

  const move = (move: string) => {
    const moveMsg: ClientMessage = { kind: 'Move', value: move };
    if (!socket_ref.current) {
      return;
    }
    socket_ref.current.send(JSON.stringify(moveMsg));
  };

  const disconnect = () => {
    if (!socket_ref.current) {
      return;
    }
    socket_ref.current.close(1000, 'Disconnected by user');
    setStatus('closed');
  };

  return { status, move, disconnect };
}
