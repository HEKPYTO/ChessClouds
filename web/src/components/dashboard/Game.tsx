import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { getUserHistoryGames } from '@/app/actions/gameActions';
import { gamestate } from '@prisma/client';
import { toast } from 'sonner';
import LoadingScreen from '../LoadingScreen';

export default function GamesTab({ username }: { username: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState('All');
  const [games, setGames] = useState<gamestate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  const itemsPerPage = 25;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const result = await getUserHistoryGames(username);
        if (result.success) {
          setGames(result.games || []);
        } else {
          toast.error('Failed to load game history');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        toast.error('Error loading game history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [username]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (searchInputFocused) {
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [searchInputFocused]);

  const getGameResult = (game: gamestate): string => {
    if (game.status === 'DRAW') return '½-½';
    if (game.status === 'WHITE_WINS')
      return game.white === username ? '1-0' : '0-1';
    if (game.status === 'BLACK_WINS')
      return game.black === username ? '1-0' : '0-1';
    return '-';
  };

  const getOpponent = (game: gamestate): string => {
    return game.white === username ? game.black : game.white;
  };

  const getMoveCount = (pgn: string): number => {
    const moves = pgn.match(
      /\b([PNBRQK]?[a-h]?[1-8]?x?[a-h][1-8](?:=[NBRQ])?|O-O(?:-O)?|[a-h][1-8])\b/g
    );
    return moves ? moves.length : 0;
  };

  const getFormattedDate = (createdat: Date | null): string => {
    if (!createdat) return '-';
    const date = new Date(createdat);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const filteredGames = games.filter((game) => {
    const opponent = getOpponent(game);
    const result = getGameResult(game);

    const matchesSearch =
      searchTerm === '' ||
      opponent.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesResult =
      resultFilter === 'All' ||
      (resultFilter === 'Win' && result === '1-0') ||
      (resultFilter === 'Loss' && result === '0-1') ||
      (resultFilter === 'Draw' && result === '½-½');

    return matchesSearch && matchesResult;
  });

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setResultFilter('All');
  };

  const getResultClass = (result: string) => {
    if (result === '1-0') return 'text-green-600 dark:text-green-400';
    if (result === '0-1') return 'text-red-600 dark:text-red-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
      <div className="w-full lg:flex-1 order-2 lg:order-1">
        <Card className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              Game History
            </CardTitle>
            <div className="text-sm text-amber-700 dark:text-amber-300">
              {filteredGames.length} games
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full text-sm">
                  <thead className="text-amber-700 dark:text-amber-300 border-b border-amber-200/30 dark:border-amber-700/30">
                    <tr>
                      <th className="text-left py-2 px-2">Opponent</th>
                      <th className="text-left py-2 px-2">Result</th>
                      <th className="hidden sm:table-cell text-left py-2 px-2">
                        Date
                      </th>
                      <th className="text-center py-2 px-2">Moves</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="text-center py-6">
                          Loading game history...
                        </td>
                      </tr>
                    ) : paginatedGames.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-6">
                          No games found
                        </td>
                      </tr>
                    ) : (
                      paginatedGames.map((game) => {
                        const result = getGameResult(game);
                        const opponent = getOpponent(game);
                        const moveCount = getMoveCount(game.pgn);
                        const date = getFormattedDate(game.createdat);

                        return (
                          <tr
                            key={game.gameid}
                            className="border-b border-amber-100/50 dark:border-slate-700/30 hover:bg-amber-50 hover:text-amber-900 dark:hover:bg-slate-700/30 dark:hover:text-slate-100/80 transition-colors"
                          >
                            <td className="py-2 px-2 font-medium truncate max-w-[100px] sm:max-w-none">
                              {opponent}
                            </td>
                            <td
                              className={`py-2 px-2 font-medium ${getResultClass(
                                result
                              )}`}
                            >
                              {result}
                            </td>
                            <td className="hidden sm:table-cell py-2 px-2">
                              {date}
                            </td>
                            <td className="py-2 px-2 text-center">
                              {moveCount}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
                <div className="text-sm text-amber-700 dark:text-amber-300 order-2 sm:order-1">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredGames.length)}{' '}
                  of {filteredGames.length} games
                </div>
                <div className="flex space-x-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900
                    shadow-[0_2px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[1px]
                    dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
                    dark:shadow-[0_2px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900
                    shadow-[0_2px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[1px]
                    dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
                    dark:shadow-[0_2px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:w-80 lg:flex-shrink-0 order-1 lg:order-2">
        <Card className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              Search Games
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-amber-700 dark:text-amber-300">
                Opponent
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search opponent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchInputFocused(true)}
                  onBlur={() => setSearchInputFocused(false)}
                  className="pl-8 bg-amber-50/80 dark:bg-slate-700/80 border-amber-200 dark:border-slate-600 focus:border-amber-400 dark:focus:border-amber-400"
                />
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-amber-700 dark:text-amber-300" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-amber-700 dark:text-amber-300">
                Result
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={resultFilter === 'Draw' ? 'default' : 'outline'}
                  size="sm"
                  className={
                    resultFilter === 'Draw'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-[0_2px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_2px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]'
                      : 'border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 shadow-[0_2px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[1px] dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50 dark:shadow-[0_2px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]'
                  }
                  onClick={() => setResultFilter('Draw')}
                >
                  Draws
                </Button>
                <Button
                  variant={resultFilter === 'Win' ? 'default' : 'outline'}
                  size="sm"
                  className={
                    resultFilter === 'Win'
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-[0_2px_0_0_#16a34a] hover:shadow-[0_1px_0_0_#15803d] hover:translate-y-[1px] dark:bg-green-500 dark:hover:bg-green-600 dark:shadow-[0_2px_0_0_#15803d] dark:hover:shadow-[0_1px_0_0_#166534]'
                      : 'border-green-300 text-green-800 hover:bg-green-50/50 hover:text-green-900 shadow-[0_2px_0_0_#86efac] hover:shadow-[0_1px_0_0_#86efac] hover:translate-y-[1px] dark:border-green-700/50 dark:text-green-200 dark:hover:bg-green-900/20 dark:shadow-[0_2px_0_0_#166534] dark:hover:shadow-[0_1px_0_0_#14532d]'
                  }
                  onClick={() => setResultFilter('Win')}
                >
                  Wins
                </Button>
                <Button
                  variant={resultFilter === 'Loss' ? 'default' : 'outline'}
                  size="sm"
                  className={
                    resultFilter === 'Loss'
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_2px_0_0_#dc2626] hover:shadow-[0_1px_0_0_#b91c1c] hover:translate-y-[1px] dark:bg-red-500 dark:hover:bg-red-600 dark:shadow-[0_2px_0_0_#b91c1c] dark:hover:shadow-[0_1px_0_0_#991b1b]'
                      : 'border-red-300 text-red-800 hover:bg-red-50/50 hover:text-red-900 shadow-[0_2px_0_0_#fca5a5] hover:shadow-[0_1px_0_0_#fca5a5] hover:translate-y-[1px] dark:border-red-700/50 dark:text-red-200 dark:hover:bg-red-900/20 dark:shadow-[0_2px_0_0_#991b1b] dark:hover:shadow-[0_1px_0_0_#7f1d1d]'
                  }
                  onClick={() => setResultFilter('Loss')}
                >
                  Losses
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900
              shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px]
              dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
              dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
              onClick={handleResetFilters}
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
