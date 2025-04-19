'use client';

import { getUserHistoryGames } from '@/app/actions/gameActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLastTime } from '@/lib/time';
import { DashboardTabProps } from '@/types/dashboard-props';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import LoadingScreen from '../LoadingScreen';

const HISTORY_LIMIT = 10;
// const FRIEND_PER_PAGE = 5;

export default function OverviewTab({
  setActiveTab,
  username,
}: DashboardTabProps) {
  const handleViewGames = () => {
    setActiveTab('games');
  };

  // const handleViewFriends = () => {
  //   setActiveTab('friends');
  // };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'online':
  //       return 'bg-green-600';
  //     case 'playing':
  //       return 'bg-amber-600';
  //     case 'offline':
  //       return 'bg-slate-400';
  //     default:
  //       return 'bg-slate-400';
  //   }
  // };

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

  if (loadingGameHistory) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* Player Stats Row */}
      <Card className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-amber-900 dark:text-amber-100">
            Player Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex flex-col items-center bg-amber-50/80 dark:bg-slate-700/50 p-4 rounded-lg border border-amber-200/40 dark:border-amber-800/20">
              <div className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-100">
                {gameHistory === undefined
                  ? 500
                  : Math.max(
                      100,
                      500 -
                        gameHistory.filter(
                          (g) =>
                            (g.status === 'WHITE_WINS' &&
                              g.black === username) ||
                            (g.status === 'BLACK_WINS' && g.white === username)
                        ).length *
                          10 +
                        gameHistory.filter(
                          (g) =>
                            (g.status === 'WHITE_WINS' &&
                              g.white === username) ||
                            (g.status === 'BLACK_WINS' && g.black === username)
                        ).length *
                          10
                    )}
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-300">
                Rating
              </div>
            </div>

            <div className="flex flex-col items-center bg-amber-50/80 dark:bg-slate-700/50 p-4 rounded-lg border border-amber-200/40 dark:border-amber-800/20">
              <div className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-100">
                {gameHistory?.length ?? 0}
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-300">
                Games Played
              </div>
            </div>

            <div className="flex flex-col items-center bg-amber-50/80 dark:bg-slate-700/50 p-4 rounded-lg border border-amber-200/40 dark:border-amber-800/20">
              <div className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-100">
                {gameHistory === undefined
                  ? 0
                  : gameHistory.length
                  ? Math.round(
                      (100 *
                        gameHistory.filter(
                          (g) =>
                            (g.status === 'WHITE_WINS' &&
                              g.white === username) ||
                            (g.status === 'BLACK_WINS' && g.black === username)
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
              <div className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-100">
                {gameHistory === undefined
                  ? 0
                  : ((i) => (i === -1 ? gameHistory.length : i))(
                      gameHistory.findIndex(
                        (g) =>
                          !(
                            (g.status === 'WHITE_WINS' &&
                              g.white === username) ||
                            (g.status === 'BLACK_WINS' && g.black === username)
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

      {/* Content area - separate divs instead of grid */}
      <div className="w-full flex flex-col xl:flex-row gap-6">
        {/* Recent Games */}
        <div className="w-full xl:flex-1">
          <Card className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                Recent Games
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900
                  shadow-[0_2px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[1px]
                  dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
                  dark:shadow-[0_2px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
                onClick={handleViewGames}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="min-w-full text-sm">
                    <thead className="text-amber-700 dark:text-amber-300 border-b border-amber-200/30 dark:border-amber-700/30">
                      <tr>
                        <th className="text-left py-2 px-2">Opponent</th>
                        <th className="text-left py-2 px-2">Result</th>
                        <th className="hidden md:table-cell text-left py-2 px-2">
                          Date
                        </th>
                        <th className="text-center py-2 px-2">Moves</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameHistory !== undefined &&
                        gameHistory.slice(0, HISTORY_LIMIT).map((game, i) => (
                          <tr
                            key={i}
                            className="border-b border-amber-100/50 dark:border-slate-700/30 hover:bg-amber-50 hover:text-amber-900 dark:hover:bg-slate-700/30 transition-colors"
                          >
                            <td className="py-2 px-2 font-medium truncate max-w-[100px] sm:max-w-none">
                              {game.black === username
                                ? game.white
                                : game.black}
                            </td>
                            <td
                              className={`py-2 px-2 font-medium ${
                                (game.status === 'WHITE_WINS' &&
                                  game.white === username) ||
                                (game.status === 'BLACK_WINS' &&
                                  game.black === username)
                                  ? 'text-green-600 dark:text-green-400'
                                  : game.status === 'DRAW'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {game.status === 'DRAW'
                                ? '½-½'
                                : (game.status === 'WHITE_WINS' &&
                                    game.white === username) ||
                                  (game.status === 'BLACK_WINS' &&
                                    game.black === username)
                                ? '1-0'
                                : '0-1'}
                            </td>
                            <td className="hidden md:table-cell py-2 px-2">
                              {game.createdat
                                ? getLastTime(game.createdat)
                                : '—'}
                            </td>
                            <td className="text-center py-2 px-2">
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Friends */}
        {/* <div className="w-full xl:w-80 flex-shrink-0">
          <Card className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-amber-900 dark:text-amber-100 flex justify-between items-center">
                <span>Friends</span>
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  {mockFriends.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 pr-1">
                {mockFriends.slice(0, FRIEND_PER_PAGE).map((friend, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-amber-50/70 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-amber-200/30 dark:hover:border-amber-800/20"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-slate-700 flex items-center justify-center text-amber-600 dark:text-amber-400 font-medium">
                          {friend.name[0].toUpperCase()}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-slate-800 ${getStatusColor(
                            friend.status
                          )}`}
                        ></div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-amber-800 dark:text-amber-200 truncate max-w-[120px]">
                          {friend.name}
                        </div>
                        <div className="text-xs text-amber-600 dark:text-amber-400">
                          {friend.rating}
                        </div>
                      </div>
                    </div>
                    <button className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 w-full
                  shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px]
                  dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
                  dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
                  onClick={handleViewFriends}
                >
                  View All Friends
                </Button>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </>
  );
}
