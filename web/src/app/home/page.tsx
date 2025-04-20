'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LockClosedIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { LatestChessBoard } from '@/components/DisplayChessBoard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getUserInfo, handleAuthCallback } from '@/lib/auth/googleAuth';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from 'sonner';
import { testEngine } from '@/lib/engine';
import { useMatchmaking } from '@/lib/MatchmakingContext';
import {
  createGame,
  getUserHistoryGames,
  getUserOngoingGames,
} from '../actions/gameActions';
import { gamestate } from '@prisma/client';
import { getLastTime } from '@/lib/time';

const HISTORY_LIMIT = 5;

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState('Player');
  const [greeting, setGreeting] = useState('Hello');
  const [isProcessingAuth, setIsProcessingAuth] = useState(true);
  const [showEngineOptions, setShowEngineOptions] = useState(false);
  const [isEngineAvailable, setIsEngineAvailable] = useState(false);
  const [isTestingEngine, setIsTestingEngine] = useState(true);
  const {
    isMatchmaking,
    startMatchmaking,
    cancelMatchmaking,
    playCooldownState,
    cooldownRemaining,
  } = useMatchmaking();

  const [gamesInPlay, setGamesInPlay] = useState<
    Awaited<ReturnType<typeof getUserOngoingGames>>['games']
  >([]);
  const [loadingOngoingGames, setLoadingOngoingGames] = useState(true);

  useEffect(() => {
    const fetchOngoingGames = async () => {
      try {
        setLoadingOngoingGames(true);
        const { success, games = [] } = await getUserOngoingGames(username);
        if (success) {
          setGamesInPlay(games);
        } else {
          toast.error('Failed to load ongoing games');
        }
      } catch {
        toast.error('Error loading ongoing games');
      } finally {
        setLoadingOngoingGames(false);
      }
    };

    if (username) {
      fetchOngoingGames();
      const interval = setInterval(fetchOngoingGames, 60000);
      return () => clearInterval(interval);
    }
  }, [username]);

  const [gameHistory, setGameHistory] = useState<
    Awaited<ReturnType<typeof getUserHistoryGames>>['games']
  >([]);
  const [loadingGameHistory, setLoadingGameHistory] = useState(true);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        setLoadingGameHistory(true);
        const { success, games = [] } = await getUserHistoryGames(username);
        if (success) {
          setGameHistory(games);
        } else {
          toast.error('Failed to load game history');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading game history');
      } finally {
        setLoadingGameHistory(false);
      }
    };

    if (username) fetchGameHistory();
  }, [username]);

  const testEngineAvailability = async () => {
    try {
      const data = await testEngine();
      setIsEngineAvailable(data.status === 'success');
    } catch (err) {
      console.error('Engine Error: ', err);
      setIsEngineAvailable(false);
    } finally {
      setIsTestingEngine(false);
    }
  };

  useEffect(() => {
    const { token, error, redirectPath } = handleAuthCallback();

    if (token) {
      if (window.location.hash) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }

      if (redirectPath) {
        router.push(redirectPath);
      }
    } else if (error) {
      toast.warning('Authentication Error', {
        description: error,
      });
    }

    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        return 'Good morning';
      } else if (hour >= 12 && hour < 18) {
        return 'Good afternoon';
      } else {
        return 'Good evening';
      }
    };

    testEngineAvailability();

    setGreeting(getTimeBasedGreeting());
    setUsername(getUserInfo()?.email?.split('@')[0] || 'Player');
    setIsProcessingAuth(false);

    const greetingInterval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 60000);

    return () => clearInterval(greetingInterval);
  }, [router]);

  const handlePlayNow = () => {
    if (playCooldownState === 'cooldown' && !isMatchmaking) {
      toast.info(
        `Please wait ${Math.ceil(
          cooldownRemaining / 1000
        )} seconds before trying again`
      );
      return;
    }

    if (isMatchmaking) {
      cancelMatchmaking();
      toast.info('Matchmaking canceled');
    } else {
      startMatchmaking(username);
      toast.success('Finding a match...', {
        description: "We'll connect you with an opponent soon",
      });
    }
  };

  const handleSettingButton = () => {
    router.push('/dashboard');
  };

  const handleViewAllHistory = () => {
    router.push('/dashboard?tab=games');
  };

  const handleComputerClick = () => {
    if (isTestingEngine || !isEngineAvailable) return;
    setShowEngineOptions(() => !showEngineOptions);
  };

  const handlePlayAsWhite = (e: React.MouseEvent) => {
    e.stopPropagation();
    createAndRedirectToGame('w');
  };

  const handlePlayAsBlack = (e: React.MouseEvent) => {
    e.stopPropagation();
    createAndRedirectToGame('b');
  };

  const createAndRedirectToGame = async (color: 'w' | 'b') => {
    try {
      const computerName = 'computer';
      const playerName = username;
      const white = color === 'w' ? playerName : computerName;
      const black = color === 'w' ? computerName : playerName;

      console.log(white, black);

      const result = await createGame(white, black);

      if (result.success && result.gameId) {
        router.push(`/computer?color=${color}&game_id=${result.gameId}`);
      } else {
        toast.error('Failed to create game', {
          description: result.error || 'Please try again later',
        });
      }
    } catch (error) {
      toast.error('Error starting game', {
        description: 'An unexpected error occurred',
      });
      console.error('Error creating game:', error);
    }
  };

  const getTurnFromPgn = (pgn: string): 'w' | 'b' => {
    const moves =
      pgn.match(
        /\b([PNBRQK]?[a-h]?[1-8]?x?[a-h][1-8](?:=[NBRQ])?|O-O(?:-O)?|[a-h][1-8])\b/g
      ) || [];
    return moves.length % 2 === 0 ? 'w' : 'b';
  };

  function handleContinueGame(game: gamestate) {
    if (!game || !game.gameid) {
      toast.error('Game information is missing');
      return;
    }

    const opponent = game.white === username ? game.black : game.white;
    const userColor = game.white === username ? 'w' : 'b';

    const isComputerGame = opponent === 'computer';

    if (isComputerGame) {
      router.push(`/computer?color=${userColor}&game_id=${game.gameid}`);
    } else {
      router.push(`/socket?game_id=${game.gameid}&playas=${userColor}`);
    }
  }

  if (isProcessingAuth || loadingGameHistory) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl relative">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/noise.png)',
          backgroundRepeat: 'repeat',
          opacity: 0.025,
          pointerEvents: 'none',
        }}
      />

      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 font-display">
          {greeting},{' '}
          <span className="text-amber-600 dark:text-amber-400">{username}</span>
        </h1>

        <div className="flex space-x-3 items-center">
          <Button
            className="h-10 w-10 p-0 rounded-md bg-amber-600 hover:bg-amber-700 text-white transition-all 
            shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e] hover:translate-y-[2px]
            dark:bg-amber-500 dark:hover:bg-amber-600
            dark:shadow-[0_4px_0_0_#92400e] dark:hover:shadow-[0_2px_0_0_#78350f]"
            onClick={handleSettingButton}
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-5 gap-6 mb-6 min-h-[467px]">
        <Card className="col-span-5 lg:col-span-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900 dark:text-amber-100">
              Play Chess
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className={`w-full flex justify-center items-center
                        bg-amber-600 hover:bg-amber-700 text-white px-6 rounded-md
                        shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e]
                        hover:translate-y-[2px] transition-all
                        ${
                          playCooldownState === 'cooldown' && !isMatchmaking
                            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed shadow-none'
                            : ''
                        }`}
              onClick={handlePlayNow}
              disabled={playCooldownState === 'cooldown' && !isMatchmaking}
            >
              {isMatchmaking ? (
                <>
                  Finding
                  <span className="inline-flex ml-1">
                    <span
                      className="animate-bounce mx-0.5"
                      style={{ animationDelay: '0ms' }}
                    >
                      .
                    </span>
                    <span
                      className="animate-bounce mx-0.5"
                      style={{ animationDelay: '150ms' }}
                    >
                      .
                    </span>
                    <span
                      className="animate-bounce mx-0.5"
                      style={{ animationDelay: '300ms' }}
                    >
                      .
                    </span>
                  </span>
                </>
              ) : playCooldownState === 'cooldown' ? (
                <>Wait {Math.ceil(cooldownRemaining / 1000)}s</>
              ) : (
                <>Play Now</>
              )}
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Button>

            {/* <Button
              className="w-full flex justify-center items-center
                        bg-amber-600 hover:bg-amber-700 text-white px-6 rounded-md
                        shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e]
                        hover:translate-y-[2px] transition-all"
              onClick={handlePlayFriend}
            >
              Play a Friend
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Button> */}

            <Button
              variant="outline"
              className={`w-full flex justify-center items-center
                          border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900
                          px-6 rounded-md transition-all shadow-[0_4px_0_0_#fcd34d]
                          hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
                          dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200
                          dark:hover:bg-slate-800/50 dark:shadow-[0_4px_0_0_#475569]
                          dark:hover:shadow-[0_2px_0_0_#475569]
                          ${
                            !isEngineAvailable
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
              onClick={handleComputerClick}
              disabled={!isEngineAvailable || isTestingEngine}
            >
              Play with Computer
              {!isEngineAvailable && (
                <LockClosedIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          </CardContent>

          {showEngineOptions && (
            <div className="flex justify-center md:justify-start border-t border-amber-200/30 dark:border-slate-700/30 px-6 pt-4 gap-2">
              <Button
                className="flex-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300
                          shadow-[0_4px_0_0_#d1d5db] hover:shadow-[0_2px_0_0_#9ca3af] hover:translate-y-[2px]
                          dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900
                          dark:shadow-[0_4px_0_0_#9ca3af] dark:hover:shadow-[0_2px_0_0_#6b7280]"
                onClick={handlePlayAsWhite}
              >
                Play White
              </Button>

              <Button
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white
                          shadow-[0_4px_0_0_#4b5563] hover:shadow-[0_2px_0_0_#374151] hover:translate-y-[2px]
                          dark:bg-gray-700 dark:hover:bg-gray-800
                          dark:shadow-[0_4px_0_0_#6b7280] dark:hover:shadow-[0_2px_0_0_#4b5563]"
                onClick={handlePlayAsBlack}
              >
                Play Black
              </Button>
            </div>
          )}
        </Card>

        <Card className="col-span-5 lg:col-span-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900 dark:text-amber-100">
              Games in Play
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingOngoingGames ? (
              <div className="text-center py-8 text-amber-700 dark:text-amber-300">
                Loading your games…
              </div>
            ) : !gamesInPlay || gamesInPlay.length === 0 ? (
              <div className="text-center py-8 text-amber-700 dark:text-amber-300">
                No active games at the moment
              </div>
            ) : (
              <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                  {gamesInPlay.map((game) => (
                    <CarouselItem
                      key={game.gameid}
                      className="pl-2 md:basis-1/2 lg:basis-1/3"
                    >
                      <div
                        className="bg-amber-50/80 dark:bg-slate-800/70 rounded-lg border border-amber-200/40 dark:border-amber-800/20 cursor-pointer hover:bg-amber-100/80 dark:hover:bg-slate-700/70 transition-colors h-full"
                        onClick={() => handleContinueGame(game)}
                      >
                        <div className="flex items-center justify-center pt-3 px-3">
                          <div className="w-full aspect-square bg-amber-100 dark:bg-slate-700 max-w-[180px]">
                            <LatestChessBoard
                              className="w-full h-full"
                              pgn={game.pgn}
                              color={game.white === username ? 'w' : 'b'}
                            />
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium text-amber-900 dark:text-amber-100">
                              vs{' '}
                              {game.white === username
                                ? game.black
                                : game.white}
                            </h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                getTurnFromPgn(game.pgn) ===
                                (game.white === username ? 'w' : 'b')
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                              }`}
                            >
                              {getTurnFromPgn(game.pgn) ===
                              (game.white === username ? 'w' : 'b')
                                ? 'Your turn'
                                : `${
                                    game.white === username ? 'Black' : 'White'
                                  } turn`}
                            </span>
                          </div>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                            {game.lastMove !== 'Game started'
                              ? `Last move: ${game.lastMove} ${game.lastMoveTime}`
                              : `Game started: ${game.lastMoveTime}`}
                          </p>
                          <Button
                            size="sm"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-all 
                          shadow-[0_2px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px]
                          dark:bg-amber-500 dark:hover:bg-amber-600
                          dark:shadow-[0_2px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-4">
                  <CarouselPrevious
                    className="relative inset-0 translate-y-0 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 rounded-md
        dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50"
                  />
                  <CarouselNext
                    className="relative inset-0 translate-y-0 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 rounded-md
        dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50"
                  />
                </div>
              </Carousel>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <Card className="col-span-5 lg:col-span-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-amber-900 dark:text-amber-100">
              Game History
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900
              dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50"
              onClick={() => handleViewAllHistory()}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-amber-700 dark:text-amber-300 border-b border-amber-200/30 dark:border-amber-700/30">
                  <tr>
                    <th className="text-left py-2 pl-2">Opponent</th>
                    <th className="text-left py-2">Result</th>
                    <th className="text-center py-2">Date</th>
                    <th className="text-right py-2 pr-2">Moves</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory !== undefined &&
                    gameHistory.slice(0, HISTORY_LIMIT).map((game) => (
                      <tr
                        key={game.gameid}
                        className="border-b border-amber-100/50 dark:border-slate-700/30 hover:bg-amber-50 hover:text-amber-900 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="text-left py-2 pl-2">
                          {game.black === username ? game.white : game.black}
                        </td>
                        <td
                          className={`text-left py-2 ${
                            (game.status === 'WHITE_WINS' &&
                              game.white === username) ||
                            (game.status === 'BLACK_WINS' &&
                              game.black === username)
                              ? 'text-green-600 dark:text-green-400' // Win
                              : game.status === 'DRAW'
                              ? 'text-amber-600 dark:text-amber-400' // Draw
                              : 'text-red-600 dark:text-red-400' // Loss
                          }`}
                        >
                          {game.status === 'DRAW'
                            ? 'Draw'
                            : (game.status === 'WHITE_WINS' &&
                                game.white === username) ||
                              (game.status === 'BLACK_WINS' &&
                                game.black === username)
                            ? 'Win'
                            : game.status === 'ONGOING'
                            ? 'In progress'
                            : 'Loss'}
                        </td>
                        <td className="text-center py-2">
                          {game.createdat ? getLastTime(game.createdat) : '—'}
                        </td>
                        <td
                          className={`text-right py-2 pr-2 ${
                            (game.status === 'WHITE_WINS' &&
                              game.white === username) ||
                            (game.status === 'BLACK_WINS' &&
                              game.black === username)
                              ? 'text-green-600 dark:text-green-400' // Win
                              : game.status === 'DRAW'
                              ? 'text-amber-600 dark:text-amber-400' // Draw
                              : 'text-red-600 dark:text-red-400' // Loss
                          }`}
                        >
                          {game.pgn
                            ? (
                                game.pgn.match(
                                  /\b([PNBRQK]?[a-h]?[1-8]?x?[a-h][1-8](?:=[NBRQ])?|O-O(?:-O)?|[a-h][1-8])\b/g
                                ) || []
                              ).length
                            : 0}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {gameHistory && gameHistory.length >= 10 && (
              <div className="flex justify-end items-center mt-4 text-sm text-amber-700 dark:text-amber-300">
                Showing up to 10 most recent games
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-5 lg:col-span-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900 dark:text-amber-100">
              Player Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center bg-amber-50/80 dark:bg-slate-700/50 p-4 rounded-lg border border-amber-200/40 dark:border-amber-800/20">
                <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {gameHistory === undefined
                    ? 500
                    : Math.max(
                        100,
                        500 -
                          10 *
                            gameHistory.filter(
                              (g) =>
                                (g.status === 'WHITE_WINS' &&
                                  g.black === username) ||
                                (g.status === 'BLACK_WINS' &&
                                  g.white === username)
                            ).length +
                          10 *
                            gameHistory.filter(
                              (g) =>
                                (g.status === 'WHITE_WINS' &&
                                  g.white === username) ||
                                (g.status === 'BLACK_WINS' &&
                                  g.black === username)
                            ).length
                      )}
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Rating
                </div>
              </div>

              <div className="flex flex-col items-center bg-amber-50/80 dark:bg-slate-700/50 p-4 rounded-lg border border-amber-200/40 dark:border-amber-800/20">
                <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {gameHistory?.length ?? 0}
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Games Played
                </div>
              </div>

              <div className="flex flex-col items-center bg-amber-50/80 dark:bg-slate-700/50 p-4 rounded-lg border border-amber-200/40 dark:border-amber-800/20">
                <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {gameHistory === undefined
                    ? 0
                    : gameHistory.length
                    ? Math.round(
                        (100 *
                          gameHistory.filter(
                            (g) =>
                              (g.status === 'WHITE_WINS' &&
                                g.white === username) ||
                              (g.status === 'BLACK_WINS' &&
                                g.black === username)
                          ).length) /
                          gameHistory.length
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Win Rate
                </div>
              </div>

              <div className="flex flex-col items-center bg-amber-50/80 dark:bg-slate-700/50 p-4 rounded-lg border border-amber-200/40 dark:border-amber-800/20">
                <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {gameHistory === undefined
                    ? 0
                    : ((i) => (i === -1 ? gameHistory.length : i))(
                        gameHistory.findIndex(
                          (g) =>
                            !(
                              (g.status === 'WHITE_WINS' &&
                                g.white === username) ||
                              (g.status === 'BLACK_WINS' &&
                                g.black === username)
                            )
                        )
                      )}
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Current Streak
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
