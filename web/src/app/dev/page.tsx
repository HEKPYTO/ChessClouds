'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type Color = 'Black' | 'White';
export type GameOutcome = { Decisive: { winner: Color } } | 'Draw';
export type ErrorType =
  | 'Deserialization'
  | 'Unauthorized'
  | 'InvalidTurn'
  | 'InvalidMove';
export type ClientMessage =
  | { kind: 'Auth'; value: { game_id: string; user_id: string } }
  | { kind: 'Move'; value: string };
export type ServerMessage =
  | { kind: 'Move'; value: string }
  | { kind: 'GameEnd'; value: GameOutcome }
  | { kind: 'Error'; value: ErrorType }
  | { kind: 'AuthSuccess' }
  | { kind: 'MoveHistory'; value: string[] };

export default function DevPage() {
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('8000');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [gameId, setGameId] = useState('game');
  const [userId, setUserId] = useState('white');
  const [moveToSend, setMoveToSend] = useState('e4');

  const logMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const connectWebSocket = () => {
    try {
      const serverUrl = `ws://${host}:${port}/ws`;
      logMessage(`Connecting to WebSocket at ${serverUrl}`);

      const ws = new WebSocket(serverUrl);
      setSocket(ws);

      ws.addEventListener('open', () => {
        setConnected(true);
        logMessage('WebSocket connection established');
      });

      ws.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data) as ServerMessage;
          logMessage(`Received: ${JSON.stringify(data)}`);

          if (data.kind === 'AuthSuccess') {
            setAuthenticated(true);
            logMessage('Authentication successful');
          } else if (data.kind === 'Error') {
            logMessage(`Error: ${data.value}`);
          } else if (data.kind === 'MoveHistory') {
            logMessage(`Move history: ${data.value.join(', ')}`);
          } else if (data.kind === 'Move') {
            logMessage(`Move: ${data.value}`);
          } else if (data.kind === 'GameEnd') {
            logMessage(`Game ended: ${JSON.stringify(data.value)}`);
          }
        } catch (error) {
          logMessage(`Raw message received: ${event.data}`);
          logMessage(`Error parsing message: ${error}`);
        }
      });

      ws.addEventListener('error', (error) => {
        logMessage(`WebSocket error: ${error}`);
      });

      ws.addEventListener('close', (event) => {
        setConnected(false);
        setAuthenticated(false);
        logMessage(`WebSocket closed: ${event.code} ${event.reason}`);
      });

      return ws;
    } catch (error) {
      logMessage(`Error creating WebSocket: ${error}`);
      return null;
    }
  };

  const initializeGame = async () => {
    try {
      logMessage(
        `Initializing game ${gameId} with white: ${userId}, black: ${
          userId === 'white' ? 'black' : 'white'
        }`
      );

      const initBody = {
        game_id: gameId,
        white_user_id: 'white',
        black_user_id: 'black',
      };

      const response = await fetch(`http://${host}:${port}/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(initBody),
      });

      if (response.ok) {
        logMessage('Game initialized successfully');
      } else {
        const text = await response.text();
        logMessage(`Game initialization failed: ${response.status} ${text}`);
      }
    } catch (error) {
      logMessage(`Error initializing game: ${error}`);
    }
  };

  const authenticate = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      logMessage('Cannot authenticate: WebSocket not connected');
      return;
    }

    try {
      const authMsg: ClientMessage = {
        kind: 'Auth',
        value: {
          game_id: gameId,
          user_id: userId,
        },
      };

      logMessage(`Sending auth: ${JSON.stringify(authMsg)}`);
      socket.send(JSON.stringify(authMsg));
    } catch (error) {
      logMessage(`Error sending auth: ${error}`);
    }
  };

  const sendMove = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      logMessage('Cannot send move: WebSocket not connected');
      return;
    }

    if (!authenticated) {
      logMessage('Cannot send move: Not authenticated');
      return;
    }

    try {
      const moveMsg: ClientMessage = {
        kind: 'Move',
        value: moveToSend,
      };

      logMessage(`Sending move: ${JSON.stringify(moveMsg)}`);
      socket.send(JSON.stringify(moveMsg));
    } catch (error) {
      logMessage(`Error sending move: ${error}`);
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">WebSocket Testing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/50 dark:bg-slate-800/50">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Controls</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Server Host</label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full p-2 border rounded bg-amber-50 dark:bg-slate-700"
                    placeholder="localhost"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm mb-1">Port</label>
                  <input
                    type="text"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="w-full p-2 border rounded bg-amber-50 dark:bg-slate-700"
                    placeholder="8000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Game ID</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="w-full p-2 border rounded bg-amber-50 dark:bg-slate-700"
                  />
                  <Button
                    onClick={initializeGame}
                    className="bg-amber-600 text-white hover:bg-amber-700"
                  >
                    Initialize
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">User ID</label>
                <div className="flex gap-2">
                  <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full p-2 border rounded bg-amber-50 dark:bg-slate-700"
                  >
                    <option value="white">white</option>
                    <option value="black">black</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={connectWebSocket}
                  disabled={connected}
                  className="flex-1 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  Connect WebSocket
                </Button>

                <Button
                  onClick={authenticate}
                  disabled={!connected || authenticated}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Authenticate
                </Button>
              </div>

              <div>
                <label className="block text-sm mb-1">Move (e.g., e4)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={moveToSend}
                    onChange={(e) => setMoveToSend(e.target.value)}
                    className="w-full p-2 border rounded bg-amber-50 dark:bg-slate-700"
                  />
                  <Button
                    onClick={sendMove}
                    disabled={!authenticated}
                    className="bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
                  >
                    Send Move
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Badge
                  className={`${
                    connected ? 'bg-green-600' : 'bg-red-600'
                  } text-white`}
                >
                  {connected ? 'Connected' : 'Disconnected'}
                </Badge>

                <Badge
                  className={`${
                    authenticated ? 'bg-green-600' : 'bg-red-600'
                  } text-white`}
                >
                  {authenticated ? 'Authenticated' : 'Not Authenticated'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Message Log</h2>
              <Button
                onClick={() => setMessages([])}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Clear
              </Button>
            </div>

            <div className="bg-amber-50 dark:bg-slate-700 border border-amber-200 dark:border-slate-600 rounded p-2 h-[400px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-amber-600 dark:text-amber-400 py-4">
                  No messages yet
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className="py-1 border-b border-amber-100 dark:border-slate-600 text-xs font-mono"
                  >
                    {msg}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
