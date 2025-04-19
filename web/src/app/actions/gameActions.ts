'use server';

import { GameStatus, PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * Create a new game in the gamehistory table
 */
export async function createGame(playerA: string, playerB: string) {
  const gameId = uuidv4();

  try {
    const game = await prisma.gamehistory.create({
      data: {
        gameid: gameId,
        playera: playerA,
        playerb: playerB,
        pgn: '',
        status: 'ONGOING',
      },
    });

    return { success: true, gameId: game.gameid as string };
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
    await prisma.gamehistory.update({
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
    await prisma.gamehistory.update({
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
    const game = await prisma.gamehistory.findUnique({
      where: { gameid: gameId },
    });

    return { success: true, game };
  } catch (error) {
    console.error('Error fetching game:', error);
    return { success: false, error: 'Failed to fetch game' };
  }
}

/**
 * Get user's game history
 */
export async function getUserGames(username: string, limit = 10, offset = 0) {
  try {
    const games = await prisma.gamehistory.findMany({
      where: {
        OR: [{ playera: username }, { playerb: username }],
      },
      orderBy: { createdat: 'desc' },
      take: limit,
      skip: offset,
    });

    return { success: true, games };
  } catch (error) {
    console.error('Error fetching user games:', error);
    return { success: false, error: 'Failed to fetch user games' };
  }
}
