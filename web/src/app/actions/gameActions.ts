'use server';

import { GameStatus, PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * Create a new game in the gamestate table
 */
export async function createGame(white: string, black: string) {
  const gameId = uuidv4();

  try {
    const game = await prisma.gamestate.create({
      data: {
        gameid: gameId,
        white,
        black,
        pgn: '',
        status: 'ONGOING',
      },
    });

    return { success: true, gameId: game.gameid };
  } catch (error) {
    console.error('Error creating game:', error);
    return { success: false, error: 'Failed to create game' };
  }
}

/**
 * Update game PGN
 */
export async function updateGamePgn(gameId: string, pgn: string) {
  try {
    await prisma.gamestate.update({
      where: { gameid: gameId },
      data: { pgn },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating game PGN:', error);
    return { success: false, error: 'Failed to update game PGN' };
  }
}

/**
 * Update game status when game ends
 */
export async function updateGameStatus(gameId: string, status: GameStatus) {
  try {
    await prisma.gamestate.update({
      where: { gameid: gameId },
      data: { status },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating game status:', error);
    return { success: false, error: 'Failed to update game status' };
  }
}

/**
 * Get game by id
 */
export async function getGame(gameId: string) {
  try {
    const game = await prisma.gamestate.findUnique({
      where: { gameid: gameId },
    });

    return { success: true, game };
  } catch (error) {
    console.error('Error fetching game:', error);
    return { success: false, error: 'Failed to fetch game' };
  }
}

/**
 * Get user's game history (not ONGOING STATUS)
 */
export async function getUserHistoryGames(
  username: string,
  limit = 10,
  offset = 0
) {
  try {
    const games = await prisma.gamestate.findMany({
      where: {
        OR: [{ white: username }, { black: username }],
        NOT: { status: 'ONGOING' },
      },
      orderBy: { createdat: 'desc' },
      take: limit,
      skip: offset,
    });

    return { success: true, games };
  } catch (error) {
    console.error('Error fetching completed games:', error);
    return { success: false, error: 'Failed to fetch completed games' };
  }
}

/**
 * Get user's ongoing games
 */
export async function getUserOngoingGames(username: string) {
  try {
    const games = await prisma.gamestate.findMany({
      where: {
        OR: [{ white: username }, { black: username }],
        status: 'ONGOING',
      },
      select: {
        gameid: true,
        white: true,
        black: true,
        pgn: true,
        createdat: true,
        status: true,
      },
      orderBy: { createdat: 'desc' },
    });

    const processedGames = games.map((game) => {
      const lastMove = getLastMoveFromPgn(game.pgn);
      const lastMoveTime = getLastMoveTime(game.createdat);

      return {
        ...game,
        opponent: game.white === username ? game.black : game.white,
        lastMove: lastMove || 'Game started',
        lastMoveTime: lastMoveTime,
      };
    });

    return { success: true, games: processedGames };
  } catch (error) {
    console.error('Error fetching ongoing games:', error);
    return { success: false, error: 'Failed to fetch ongoing games' };
  }
}

/**
 * Get turn from pgn
 */
function getLastMoveFromPgn(pgn: string): string {
  if (!pgn || pgn.trim() === '') return '';

  const moveRegex =
    /\d+\.\s+([A-Za-z0-9\+\#\=\-]+)(?:\s+([A-Za-z0-9\+\#\=\-]+))?/g;
  let lastMatch;
  let match;

  while ((match = moveRegex.exec(pgn)) !== null) {
    lastMatch = match;
  }

  if (lastMatch) {
    return lastMatch[2] ? lastMatch[2] : lastMatch[1];
  }

  return '';
}

function getLastMoveTime(createdat: Date | null): string {
  if (!createdat) return 'recently';

  const now = new Date();
  const moveTime = new Date(createdat);
  const diffMs = now.getTime() - moveTime.getTime();

  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
