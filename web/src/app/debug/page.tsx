'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRightIcon,
  SignalIcon,
  SignalSlashIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { MatchMakingService } from '@/lib/matchmakingService';

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
  const [gameId, setGameId] = useState('test');
  const [userId, setUserId] = useState('white');
  const [moveToSend, setMoveToSend] = useState('e4');
  const [copySuccess, setCopySuccess] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [matchmakingError, setMatchmakingError] = useState<string | null>(null);

  const logMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);

    setTimeout(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 50);
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
      logMessage(`Initializing game ${gameId} with white: white, black: black`);

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
        toast.success('Game initialized successfully', {
          description: 'Ready to connect and play!',
        });
        return true;
      } else {
        const text = await response.text();
        if (text === 'Game already exists') {
          logMessage('Game already exists, ready to connect');
          toast.info('Game already exists', {
            description: 'You can connect to this existing game',
          });
          return true;
        } else {
          logMessage(`Game initialization failed: ${response.status} ${text}`);
          toast.error('Game initialization failed', {
            description: text,
          });
          return false;
        }
      }
    } catch (error) {
      logMessage(`Error initializing game: ${error}`);
      toast.error('Error initializing game', {
        description: String(error),
      });
      return false;
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

  const copyGameLink = () => {
    const playas = userId === 'white' ? 'b' : 'w';
    const url = `${window.location.origin}/socket?game_id=${gameId}&playas=${playas}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        toast.success('Game link copied!', {
          description: 'Share this with your opponent',
        });
      })
      .catch((err) => {
        toast.error('Failed to copy', {
          description: String(err),
        });
      });
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const findMatch = async () => {
    try {
      setIsMatchmaking(true);
      setMatchmakingError(null);
      logMessage(`Starting matchmaking for user: ${userId}`);

      const matchmakingService = MatchMakingService.getInstance();
      const { game_id, color } = await matchmakingService.findMatch(userId);

      setGameId(game_id);
      logMessage(`Match found! Game ID: ${game_id}, Playing as: ${color}`);
      toast.success('Match found!', {
        description: `Game ID: ${game_id}, Playing as: ${color}`,
      });

      // Optional: Auto-connect to game
      // window.location.href = `/socket?game_id=${game_id}&playas=${color}`;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setMatchmakingError(errorMsg);
      logMessage(`Matchmaking error: ${errorMsg}`);
      toast.error('Matchmaking failed', { description: errorMsg });
    } finally {
      setIsMatchmaking(false);
    }
  };

  const cancelMatchmaking = () => {
    const matchmakingService = MatchMakingService.getInstance();
    matchmakingService.cancelMatch();
    setIsMatchmaking(false);
    logMessage('Matchmaking canceled');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-amber-900 dark:text-amber-100 font-display">
        Chess Game Setup
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-amber-900 dark:text-amber-100">
              Game Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1 text-amber-700 dark:text-amber-300">
                  Server Host
                </label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full p-2 border rounded bg-amber-50/80 dark:bg-slate-700/80 border-amber-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="localhost"
                />
              </div>
              <div className="w-1/3">
                <label className="block text-sm mb-1 text-amber-700 dark:text-amber-300">
                  Port
                </label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full p-2 border rounded bg-amber-50/80 dark:bg-slate-700/80 border-amber-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="8000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-amber-700 dark:text-amber-300">
                Game ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  className="w-full p-2 border rounded bg-amber-50/80 dark:bg-slate-700/80 border-amber-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button
                  onClick={initializeGame}
                  className="bg-amber-600 hover:bg-amber-700 text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[2px]
                   dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]"
                >
                  Initialize
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-amber-700 dark:text-amber-300">
                User ID
              </label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-2 border rounded bg-amber-50/80 dark:bg-slate-700/80 border-amber-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="white">white</option>
                <option value="black">black</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={connectWebSocket}
                disabled={connected}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[2px]
                 dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] disabled:opacity-50 disabled:shadow-none"
              >
                Connect WebSocket
              </Button>

              <Button
                onClick={authenticate}
                disabled={!connected || authenticated}
                className="flex-1 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px]
                dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50 dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569] disabled:opacity-50 disabled:shadow-none"
                variant="outline"
              >
                Authenticate
              </Button>
            </div>

            <div className="flex gap-2">
              {isMatchmaking ? (
                <Button
                  onClick={cancelMatchmaking}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-[0_3px_0_0_#b91c1c] hover:shadow-[0_1px_0_0_#991b1b] hover:translate-y-[2px]
                    dark:bg-red-500 dark:hover:bg-red-600 dark:shadow-[0_3px_0_0_#991b1b] dark:hover:shadow-[0_1px_0_0_#7f1d1d]"
                >
                  Cancel Matchmaking
                </Button>
              ) : (
                <Button
                  onClick={findMatch}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[2px]
                    dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]"
                >
                  Find Match
                </Button>
              )}
            </div>

            {matchmakingError && (
              <div className="mt-2 text-red-600 dark:text-red-400 text-sm">
                {matchmakingError}
              </div>
            )}

            <div>
              <label className="block text-sm mb-1 text-amber-700 dark:text-amber-300">
                Move (e.g., e4)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={moveToSend}
                  onChange={(e) => setMoveToSend(e.target.value)}
                  className="w-full p-2 border rounded bg-amber-50/80 dark:bg-slate-700/80 border-amber-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button
                  onClick={sendMove}
                  disabled={!authenticated}
                  className="bg-amber-600 hover:bg-amber-700 text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[2px]
                   dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] disabled:opacity-50 disabled:shadow-none"
                >
                  Send Move
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex gap-4 items-center">
                <div className="flex gap-2 items-center">
                  <Badge
                    className={`${
                      connected ? 'bg-green-600' : 'bg-red-600'
                    } text-white w-6 h-6 flex items-center justify-center p-0`}
                  >
                    {connected ? (
                      <SignalIcon className="h-4 w-4" />
                    ) : (
                      <SignalSlashIcon className="h-4 w-4" />
                    )}
                  </Badge>
                  <span className="text-sm text-amber-700 dark:text-amber-300">
                    {connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <div className="flex gap-2 items-center ml-4">
                  <Badge
                    className={`${
                      authenticated ? 'bg-green-600' : 'bg-red-600'
                    } text-white w-6 h-6 flex items-center justify-center p-0`}
                  >
                    {authenticated ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </Badge>
                  <span className="text-sm text-amber-700 dark:text-amber-300">
                    {authenticated ? 'Authenticated' : 'Not Authenticated'}
                  </span>
                </div>
              </div>

              <Button
                onClick={copyGameLink}
                className="bg-amber-600 hover:bg-amber-700 text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[2px]
                dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]"
              >
                {copySuccess ? 'Copied!' : 'Copy Game Link for Opponent'}
                <ClipboardIcon className="ml-2 h-4 w-4" />
              </Button>

              <a
                href={`/socket?game_id=${gameId}&playas=${
                  userId === 'white' ? 'w' : 'b'
                }`}
                target="_blank"
                className="text-center p-2 border border-amber-300 dark:border-amber-700 rounded-md text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700"
              >
                Open Game in This Browser
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md">
          <CardHeader className="pb-3 flex flex-row justify-between items-center">
            <CardTitle className="text-xl text-amber-900 dark:text-amber-100">
              Message Log
            </CardTitle>
            <Button
              onClick={() => setMessages([])}
              size="sm"
              variant="outline"
              className="h-8 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 shadow-[0_2px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[1px]
                dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50 dark:shadow-[0_2px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
            >
              Clear Log
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div
              ref={logRef}
              className="bg-amber-50/80 dark:bg-slate-700/80 border border-amber-200/50 dark:border-slate-600/50 rounded-lg p-3 h-[400px] overflow-y-auto font-mono text-sm"
            >
              {messages.length === 0 ? (
                <div className="text-center text-amber-600 dark:text-amber-400 py-4">
                  No messages yet
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className="py-1 border-b border-amber-100/50 dark:border-slate-600/50 text-xs"
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
