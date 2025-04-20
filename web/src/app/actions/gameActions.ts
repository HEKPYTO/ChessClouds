'use server';

import { GameStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { getLastTime } from '@/lib/time';

/**
 * Create a new game in the gamestate table
 */
export async function createGame(white: string, black: string) {
  try {
    const game = await prisma.gamestate.create({
      data: {
        gameid: uuidv4(),
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
export async function getUserHistoryGames(username: string, offset = 0) {
  try {
    const games = await prisma.gamestate.findMany({
      where: {
        OR: [{ white: username }, { black: username }],
        NOT: {
          status: { in: ['ONGOING', 'ABORTED'] },
        },
      },
      orderBy: {
        createdat: 'desc',
      },
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
      orderBy: {
        createdat: 'desc',
      },
    });

    const processedGames = games.map((game) => {
      const lastMove = getLastMoveFromPgn(game.pgn);
      const lastMoveTime = getLastTime(game.createdat);

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
