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

const pingInterval = 10000;

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
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<SocketStatus>('connecting');
  const intervalRef = useRef<number | null>(null);

  console.log(`gameID: ${gameId}, userId: ${userId}`);

  useEffect(() => {
    const socket = new WebSocket(url);

    socketRef.current = socket;

    socket.onopen = () => {
      console.log('socket open');
      const authMsg: ClientMessage = {
        kind: 'Auth',
        value: { game_id: gameId, user_id: userId },
      };
      console.log(authMsg);
      socket.send(JSON.stringify(authMsg));
      intervalRef.current = window.setInterval(() => {
        const pingMsg: ClientMessage = {
          kind: 'Ping',
        };
        console.log('Sending ping message');
        socket.send(JSON.stringify(pingMsg));
      }, pingInterval);
    };

    socket.onerror = (event) => {
      setStatus('closed');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      console.error('Websocket error:', event);
      if (onError) {
        onError('Connection closed due to an error');
      }
    };

    socket.onclose = (event) => {
      setStatus('closed');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Add closure condition for end game displays
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
          onError(`disconnect:error:${event.reason || 'Disconnected'}`);
      }
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as ServerMessage;
        console.log('Socket received message:', message);

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
        console.error('Error parsing message:', error, event.data);
        if (onError) {
          onError('Failed to parse server message');
          console.error(error);
        }
      }
    };

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      socket.close();
    };
  }, [url, gameId, userId, onAuth, onError, onGameEnd, onHistory, onMove]);

  const move = (move: string) => {
    const moveMsg: ClientMessage = { kind: 'Move', value: move };
    console.log(`Sending move: ${move}`);
    if (!socketRef.current) {
      console.error('socket is null');
      return;
    }
    socketRef.current.send(JSON.stringify(moveMsg));
  };

  const disconnect = () => {
    if (!socketRef.current) {
      console.error('socket is null');
      return;
    }
    socketRef.current.close(1000, 'Disconnected by user');
    setStatus('closed');
  };

  return { status, move, disconnect };
}
