'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const mockFriends = Array(30)
  .fill(null)
  .map((_, i) => {
    const names = [
      'martin-xiii',
      'dj-ron-passano',
      'Jdomenusrex',
      'knight_rider',
      'chess_lover99',
      'tactical_genius',
      'queen_gambit',
      'pawn_star',
      'rook_roller',
      'bishop_boss',
      'checkmate101',
      'kingpin',
      'queenb',
      'castle_master',
      'endgame_expert',
      'opening_theory',
      'pawn_pusher',
      'knight_mover',
      'bishop_slider',
      'rook_checker',
    ];
    const statuses = ['online', 'offline', 'playing'];
    const ratings = [
      1800, 1350, 446, 550, 700, 625, 520, 830, 490, 675, 900, 1200, 1500, 1600,
      1700,
    ];

    return {
      id: i + 1,
      name: names[i % names.length],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      rating: ratings[i % ratings.length],
      lastSeen: Math.floor(Math.random() * 30) + 1,
    };
  });

const mockInvitations = [
  { id: 1, name: 'chess_master42', rating: 1650 },
  { id: 2, name: 'grand_wizard', rating: 1423 },
  { id: 3, name: 'rook_rookie', rating: 820 },
];

const mockUserSearch = [
  { id: 101, name: 'chess_prodigy', rating: 1920 },
  { id: 102, name: 'pawn_punisher', rating: 1340 },
  { id: 103, name: 'knight_rider99', rating: 1675 },
  { id: 104, name: 'bishop_blitz', rating: 1580 },
  { id: 105, name: 'queen_attack', rating: 1460 },
];

export default function FriendsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [friendSearchTerm, setFriendSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<
    typeof mockUserSearch
  >([]);
  const [invitationSearchTerm, setInvitationSearchTerm] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);

  const itemsPerPage = 8;

  const filteredFriends = mockFriends.filter(
    (friend) =>
      friendSearchTerm === '' ||
      friend.name.toLowerCase().includes(friendSearchTerm.toLowerCase())
  );

  const filteredInvitations = mockInvitations.filter(
    (invitation) =>
      invitationSearchTerm === '' ||
      invitation.name
        .toLowerCase()
        .includes(invitationSearchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFriends.length / itemsPerPage);
  const paginatedFriends = filteredFriends.slice(
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

  const handleUserSearch = () => {
    if (userSearchTerm.trim() === '') {
      setUserSearchResults([]);
      return;
    }

    const results = mockUserSearch.filter((user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    setUserSearchResults(results);
    setShowUserSearch(true);
  };

  const handlePlayerSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      handleUserSearch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-600';
      case 'playing':
        return 'bg-amber-600';
      case 'offline':
        return 'bg-slate-400';
      default:
        return 'bg-slate-400';
    }
  };

  const getStatusText = (status: string, lastSeen: number) => {
    switch (status) {
      case 'online':
        return 'Online now';
      case 'playing':
        return 'Playing now';
      case 'offline':
        return `Last online ${lastSeen} ${lastSeen === 1 ? 'day' : 'days'} ago`;
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
      {/* Friends List */}
      <div className="w-full lg:flex-1 order-2 lg:order-1">
        <Card className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              Friends ({filteredFriends.length})
            </CardTitle>
            <div className="relative w-full max-w-[300px]">
              <Input
                type="text"
                placeholder="Search friends"
                value={friendSearchTerm}
                onChange={(e) => setFriendSearchTerm(e.target.value)}
                className="pl-8 bg-amber-50/80 dark:bg-slate-700/80 border-amber-200 dark:border-slate-600"
              />
              <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-amber-700 dark:text-amber-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedFriends.length > 0 ? (
                paginatedFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-4 rounded-lg bg-amber-50/70 dark:bg-slate-700/50 border border-amber-200/30 dark:border-amber-800/20 hover:bg-amber-100/70 dark:hover:bg-slate-700/70 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative mt-1">
                        <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-slate-600 flex items-center justify-center text-amber-600 dark:text-amber-400 font-medium text-lg">
                          {friend.name[0].toUpperCase()}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-700 ${getStatusColor(
                            friend.status
                          )}`}
                        ></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-amber-800 dark:text-amber-200 truncate">
                          {friend.name}
                        </div>
                        <div className="text-sm text-amber-600 dark:text-amber-400">
                          Rating: {friend.rating}
                        </div>
                        <div className="text-xs text-amber-500 dark:text-amber-500 mt-1">
                          {getStatusText(friend.status, friend.lastSeen)}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1.5 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20">
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

                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
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
                              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 py-8 text-center text-amber-600 dark:text-amber-400">
                  No friends found matching your search.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
                <div className="text-sm text-amber-700 dark:text-amber-300 order-2 sm:order-1">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredFriends.length)}{' '}
                  of {filteredFriends.length} friends
                </div>
                <div className="flex space-x-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900
                    dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900
                    dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50"
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

      {/* Find Players */}
      <div className="w-full lg:w-80 lg:flex-shrink-0 order-1 lg:order-2">
        <Card className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              Find Players
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search players"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  onKeyDown={handlePlayerSearchKeyDown}
                  className="pl-8 bg-amber-50/80 dark:bg-slate-700/80 border-amber-200 dark:border-slate-600"
                />
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-amber-700 dark:text-amber-300" />
              </div>
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white
                shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[2px]
                dark:bg-amber-500 dark:hover:bg-amber-600
                dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]"
                onClick={handleUserSearch}
              >
                Search
              </Button>
            </div>

            {/* User Search Results */}
            {showUserSearch && (
              <div className="space-y-2 mt-4">
                <div className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Search Results
                </div>
                <div className="space-y-2">
                  {userSearchResults.length > 0 ? (
                    userSearchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-amber-50/70 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-amber-200/30 dark:hover:border-amber-800/20"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-slate-700 flex items-center justify-center text-amber-600 dark:text-amber-400 font-medium flex-shrink-0">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm text-amber-800 dark:text-amber-200 truncate">
                              {user.name}
                            </div>
                            <div className="text-xs text-amber-600 dark:text-amber-400">
                              {user.rating}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="h-8 px-2 bg-amber-600 hover:bg-amber-700 text-white ml-2 flex-shrink-0
                          shadow-[0_2px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px]
                          dark:bg-amber-500 dark:hover:bg-amber-600
                          dark:shadow-[0_2px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]"
                        >
                          <UserPlusIcon className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-amber-600 dark:text-amber-400">
                      No players found matching your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator className="my-2 bg-amber-200/30 dark:bg-amber-700/20" />

            {/* Friend Invitations */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-amber-800 dark:text-amber-200 flex justify-between items-center">
                <span>Friend Invitations</span>
                <span className="text-amber-600 dark:text-amber-400">
                  {filteredInvitations.length}
                </span>
              </div>

              {filteredInvitations.length > 0 ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search invitations"
                      value={invitationSearchTerm}
                      onChange={(e) => setInvitationSearchTerm(e.target.value)}
                      className="pl-8 bg-amber-50/80 dark:bg-slate-700/80 border-amber-200 dark:border-slate-600"
                    />
                    <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-amber-700 dark:text-amber-300" />
                  </div>

                  {filteredInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-amber-50/70 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-amber-200/30 dark:hover:border-amber-800/20"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-slate-700 flex items-center justify-center text-amber-600 dark:text-amber-400 font-medium flex-shrink-0">
                          {invitation.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-amber-800 dark:text-amber-200 truncate">
                            {invitation.name}
                          </div>
                          <div className="text-xs text-amber-600 dark:text-amber-400">
                            {invitation.rating}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button className="h-7 w-7 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center">
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button className="h-7 w-7 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-amber-600 dark:text-amber-400">
                  No pending invitations.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}