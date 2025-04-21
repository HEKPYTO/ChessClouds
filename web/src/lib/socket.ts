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

// const usePrevious = (value, initialValue) => {
//   const ref = useRef(initialValue);
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// };
//
// const useEffectDebugger = (
//   effectHook: any,
//   dependencies: any,
//   dependencyNames: any = []
// ) => {
//   const previousDeps = usePrevious(dependencies, []);
//
//   const changedDeps = dependencies.reduce((accum, dependency, index) => {
//     if (dependency !== previousDeps[index]) {
//       const keyName = dependencyNames[index] || index;
//       return {
//         ...accum,
//         [keyName]: {
//           before: previousDeps[index],
//           after: dependency,
//         },
//       };
//     }
//
//     return accum;
//   }, {});
//
//   if (Object.keys(changedDeps).length) {
//     console.log('[use-effect-debugger] ', changedDeps);
//   }
//
//   useEffect(effectHook, dependencies);
// };

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

  console.log(`gameID: ${gameId}, userId: ${userId}`);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket_ref.current = socket;

    socket.onopen = () => {
      console.log('socket open');
      const authMsg: ClientMessage = {
        kind: 'Auth',
        value: { game_id: gameId, user_id: userId },
      };
      console.log(authMsg);
      socket.send(JSON.stringify(authMsg));
    };

    socket.onerror = (event) => {
      setStatus('closed');
      console.error('Websocket error:', event);
      if (onError) {
        onError('Connection closed due to an error');
      }
    };

    socket.onclose = (event) => {
      setStatus('closed');
      if (onError) {
        onError(`Connection closed: ${event.reason ?? 'unknown reason'}`);
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
            console.log('Socket authentication successful');
            break;

          case 'MoveHistory':
            if (onHistory) onHistory(message.value);
            break;

          case 'GameEnd':
            if (onGameEnd) onGameEnd(message.value);
            break;

          case 'Error':
            console.error('Socket server error:', message.value);
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
        }
      }
    };

    return () => {
      socket.close();
    };
  }, [url, gameId, userId, onAuth, onError, onGameEnd, onHistory, onMove]);

  const move = (move: string) => {
    const moveMsg: ClientMessage = { kind: 'Move', value: move };
    console.log(`Sending move: ${move}`);
    if (!socket_ref.current) {
      console.error('socket is null');
      return;
    }
    socket_ref.current.send(JSON.stringify(moveMsg));
  };

  const disconnect = () => {
    if (!socket_ref.current) {
      console.error('socket is null');
      return;
    }
    socket_ref.current.close(1000, 'Disconnected by user');
    setStatus('closed');
  };

  return { status, move, disconnect };
}
