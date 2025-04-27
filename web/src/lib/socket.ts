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
const MAX_SILENT_RETRIES = 3;

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
  const connectionAttemptsRef = useRef(0);
  const isInitialConnectPhaseRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create connection function to allow retries
    const createConnection = () => {
      try {
        connectionAttemptsRef.current += 1;
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
          isInitialConnectPhaseRef.current = false;
          const authMsg: ClientMessage = {
            kind: 'Auth',
            value: { game_id: gameId, user_id: userId },
          };
          socket.send(JSON.stringify(authMsg));

          intervalRef.current = window.setInterval(() => {
            const pingMsg: ClientMessage = {
              kind: 'Ping',
            };
            socket.send(JSON.stringify(pingMsg));
          }, pingInterval);
        };

        socket.onerror = () => {
          // Only report errors once we've exhausted silent retries or if we've already connected once
          const shouldReportError =
            !isInitialConnectPhaseRef.current ||
            connectionAttemptsRef.current > MAX_SILENT_RETRIES;

          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }

          if (status === 'authenticated') {
            setStatus('closed');
          }

          if (shouldReportError && onError) {
            onError('Connection closed due to an error');
          }

          // Try to reconnect silently during initial connection phase
          if (
            isInitialConnectPhaseRef.current &&
            connectionAttemptsRef.current <= MAX_SILENT_RETRIES
          ) {
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }

            reconnectTimeoutRef.current = setTimeout(() => {
              if (socketRef.current) {
                try {
                  socketRef.current.close();
                } catch (e) {
                  // Ignore errors closing an already closed socket
                  console.error(e);
                }
              }
              createConnection();
            }, 1000);
          }
        };

        socket.onclose = (event) => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }

          // Only update status if we were previously authenticated
          if (status === 'authenticated') {
            setStatus('closed');
          }

          // Add closure condition for end game displays
          const normalClosure =
            event.code === 1000 || event.code === 1001 || event.code === 1005;
          const gameRelatedMessage =
            event.reason &&
            (event.reason.includes('game') ||
              event.reason.includes('complete'));

          // Only report non-game-related closures if we've already connected once
          // or if we've exhausted silent retries
          const shouldReportError =
            !isInitialConnectPhaseRef.current ||
            connectionAttemptsRef.current > MAX_SILENT_RETRIES;

          if (normalClosure || gameRelatedMessage) {
            if (shouldReportError && onError) {
              onError(
                `disconnect:normal:${event.reason || 'Game session ended'}`
              );
            }
          } else {
            // Silent retry during initial connection phase
            if (
              isInitialConnectPhaseRef.current &&
              connectionAttemptsRef.current <= MAX_SILENT_RETRIES
            ) {
              if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
              }

              reconnectTimeoutRef.current = setTimeout(() => {
                createConnection();
              }, 1000);
            }
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
                isInitialConnectPhaseRef.current = false;
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
            if (!isInitialConnectPhaseRef.current && onError) {
              onError('Failed to parse server message');
            }
            console.error(error);
          }
        };
      } catch (error) {
        // Only report errors if we've exhausted silent retries
        if (connectionAttemptsRef.current > MAX_SILENT_RETRIES && onError) {
          onError('Failed to create WebSocket connection');
        }

        // Try to reconnect silently during initial connection phase
        if (
          isInitialConnectPhaseRef.current &&
          connectionAttemptsRef.current <= MAX_SILENT_RETRIES
        ) {
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }

          reconnectTimeoutRef.current = setTimeout(() => {
            createConnection();
          }, 1000);
        }

        console.error(error);
      }
    };

    // Start initial connection
    createConnection();

    // Cleanup function
    return () => {
      isInitialConnectPhaseRef.current = false;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch (error) {
          // Ignore errors when closing during cleanup
          console.error(error);
        }
      }
    };
  }, [
    url,
    gameId,
    userId,
    onAuth,
    onError,
    onGameEnd,
    onHistory,
    onMove,
    status,
  ]);

  const move = (move: string) => {
    const moveMsg: ClientMessage = { kind: 'Move', value: move };
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }
    socketRef.current.send(JSON.stringify(moveMsg));
  };

  const disconnect = () => {
    if (!socketRef.current) {
      return;
    }
    socketRef.current.close(1000, 'Disconnected by user');
    setStatus('closed');
  };

  return { status, move, disconnect };
}
