'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BellIcon,
  UserGroupIcon,
  LockClosedIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import CustomChessBoard from '@/components/DisplayChessBoard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function HomePage() {
  const [username, setUsername] = useState('Player');
  const [greeting, setGreeting] = useState('Hello');
  const [gamesInPlay] = useState([
    {
      id: 1,
      opponent: 'Magnus C.',
      lastMove: '10m ago',
      fen: 'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
    },
    {
      id: 2,
      opponent: 'Hikaru N.',
      lastMove: '23m ago',
      fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
    },
    {
      id: 3,
      opponent: 'Fabiano C.',
      lastMove: '45m ago',
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
    },
    {
      id: 4,
      opponent: 'Ian N.',
      lastMove: '1h ago',
      fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
    },
    {
      id: 5,
      opponent: 'Ding L.',
      lastMove: '2h ago',
      fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1',
    },
  ]);

  const [gameHistory] = useState([
    {
      id: 1,
      opponent: 'Bobby F.',
      result: 'Win',
      date: '2023-04-12',
      rating: '+8',
      moves: 42,
    },
    {
      id: 2,
      opponent: 'Garry K.',
      result: 'Loss',
      date: '2023-04-11',
      rating: '-5',
      moves: 36,
    },
    {
      id: 3,
      opponent: 'Vishy A.',
      result: 'Draw',
      date: '2023-04-10',
      rating: '+1',
      moves: 67,
    },
    {
      id: 4,
      opponent: 'Judit P.',
      result: 'Win',
      date: '2023-04-09',
      rating: '+7',
      moves: 29,
    },
    {
      id: 5,
      opponent: 'Wesley S.',
      result: 'Loss',
      date: '2023-04-08',
      rating: '-6',
      moves: 54,
    },
  ]);

  const [stats] = useState({
    rating: 1682,
    gamesPlayed: 152,
    winRate: 62,
    currentStreak: 3,
    bestRating: 1745,
    tournamentCount: 5,
  });

  useEffect(() => {
    const fetchUsername = async () => {
      setUsername('Alex');
    };

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

    fetchUsername();
    setGreeting(getTimeBasedGreeting());

    const greetingInterval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 60000);

    return () => clearInterval(greetingInterval);
  }, []);

  const handlePlayNow = () => {
    window.location.href = '/game';
  };

  const handlePlayFriend = () => {
    window.location.href = '/invite';
  };

  const handlePlayComputer = () => {
    window.location.href = '/computer';
  };

  const handleGoToGame = (gameId: number) => {
    window.location.href = `/game/${gameId}`;
  };

  const getTurnFromFen = (fen: string, playingAs: 'w' | 'b' = 'w') => {
    try {
      const turn = fen.split(' ')[1];
      return turn === playingAs ? 'Your' : "Opponent's";
    } catch (error) {
      console.error('Error parsing FEN:', error);
      return 'Unknown';
    }
  };

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
            variant="outline"
            className="h-10 w-10 p-0 rounded-md border-amber-300 text-amber-800 hover:bg-amber-50
            shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px]
            dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
            dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
          >
            <UserGroupIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            className="h-10 w-10 p-0 rounded-md border-amber-300 text-amber-800 hover:bg-amber-50
            shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px]
            dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
            dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]
            relative"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-amber-600 dark:bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </Button>

          <Button
            className="h-10 w-10 p-0 rounded-md bg-amber-600 hover:bg-amber-700 text-white transition-all 
            shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e] hover:translate-y-[2px]
            dark:bg-amber-500 dark:hover:bg-amber-600
            dark:shadow-[0_4px_0_0_#92400e] dark:hover:shadow-[0_2px_0_0_#78350f]"
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
              className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 rounded-md transition-all 
              shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e] hover:translate-y-[2px]
              dark:bg-amber-500 dark:hover:bg-amber-600
              dark:shadow-[0_4px_0_0_#92400e] dark:hover:shadow-[0_2px_0_0_#78350f]"
              onClick={handlePlayNow}
            >
              Play Now
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full border-amber-300 text-amber-800 hover:bg-amber-50 px-6 rounded-md transition-all 
              shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
              dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
              dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]"
              onClick={handlePlayFriend}
            >
              Play a Friend
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full border-amber-300 text-amber-800 hover:bg-amber-50 px-6 rounded-md transition-all 
              shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
              dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
              dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]"
              onClick={handlePlayComputer}
              disabled
            >
              <LockClosedIcon className="-ml-8 h-4 w-4" />
              Play with Computer
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-5 lg:col-span-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900 dark:text-amber-100">
              Games in Play
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gamesInPlay.length === 0 ? (
              <div className="text-center py-8 text-amber-700 dark:text-amber-300">
                No active games at the moment
              </div>
            ) : (
              <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                  {gamesInPlay.map((game) => (
                    <CarouselItem
                      key={game.id}
                      className="pl-2 md:basis-1/2 lg:basis-1/3"
                    >
                      <div
                        className="bg-amber-50/80 dark:bg-slate-800/70 rounded-lg border border-amber-200/40 dark:border-amber-800/20 cursor-pointer hover:bg-amber-100/80 dark:hover:bg-slate-700/70 transition-colors h-full"
                        onClick={() => handleGoToGame(game.id)}
                      >
                        <div className="flex items-center justify-center pt-3 px-3">
                          <div className="w-full aspect-square bg-amber-100 dark:bg-slate-700 max-w-[180px]">
                            <CustomChessBoard
                              className="w-full h-full"
                              initialFen={game.fen}
                            />
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium text-amber-900 dark:text-amber-100">
                              vs {game.opponent}
                            </h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                getTurnFromFen(game.fen) === 'Your'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                              }`}
                            >
                              {getTurnFromFen(game.fen)}
                            </span>
                          </div>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                            Last move: {game.lastMove}
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
                    className="relative inset-0 translate-y-0 border-amber-300 text-amber-800 hover:bg-amber-50 rounded-md
                  dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50"
                  />
                  <CarouselNext
                    className="relative inset-0 translate-y-0 border-amber-300 text-amber-800 hover:bg-amber-50 rounded-md
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
              className="border-amber-300 text-amber-800 hover:bg-amber-50
              dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50"
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
                    <th className="text-left py-2">Date</th>
                    <th className="text-center py-2">Moves</th>
                    <th className="text-right py-2 pr-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory.map((game) => (
                    <tr
                      key={game.id}
                      className="border-b border-amber-100/50 dark:border-slate-700/30 hover:bg-amber-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="py-2 pl-2">{game.opponent}</td>
                      <td
                        className={`py-2 ${
                          game.result === 'Win'
                            ? 'text-green-600 dark:text-green-400'
                            : game.result === 'Loss'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {game.result}
                      </td>
                      <td className="py-2">{game.date}</td>
                      <td className="py-2 text-center text-amber-700 dark:text-amber-300">
                        {game.moves}
                      </td>
                      <td
                        className={`py-2 pr-2 text-right font-medium ${
                          game.rating.startsWith('+')
                            ? 'text-green-600 dark:text-green-400'
                            : game.rating.startsWith('-')
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {game.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm text-amber-700 dark:text-amber-300">
              <div>Showing 1-5 of 152 games</div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border-amber-300 text-amber-800 hover:bg-amber-50
                  dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50"
                  disabled
                >
                  &lt;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border-amber-300 text-amber-800 hover:bg-amber-50
                  dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50"
                >
                  &gt;
                </Button>
              </div>
            </div>
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
                  {stats.rating}
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Rating
                </div>
              </div>

              <div className="flex flex-col items-center bg-amber-50/80 dark:bg-slate-700/50 p-4 rounded-lg border border-amber-200/40 dark:border-amber-800/20">
                <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {stats.gamesPlayed}
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Games Played
                </div>
              </div>

              <div className="flex flex-col items-center bg-amber-50/80 dark:bg-slate-700/50 p-4 rounded-lg border border-amber-200/40 dark:border-amber-800/20">
                <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {stats.winRate}%
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Win Rate
                </div>
              </div>

              <div className="flex flex-col items-center bg-amber-50/80 dark:bg-slate-700/50 p-4 rounded-lg border border-amber-200/40 dark:border-amber-800/20">
                <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {stats.currentStreak}
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
