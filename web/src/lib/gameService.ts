import prisma from './prisma'

export const getActiveGames = async () => {
  return prisma.activegames.findMany()
}

export const getActiveGame = async (gameId: string) => {
  return prisma.activegames.findUnique({
    where: { gameid: gameId }
  })
}

export const createActiveGame = async (gameId: string, white: string, black: string) => {
  return prisma.activegames.create({
    data: { gameid: gameId, white, black }
  })
}

export const deleteActiveGame = async (gameId: string) => {
  return prisma.activegames.delete({
    where: { gameid: gameId }
  })
}

export const getGameHistory = async (options?: {
  gameId?: string,
  playerId?: string,
  limit?: number,
  offset?: number
}) => {
  const { gameId, playerId, limit = 10, offset = 0 } = options || {}
  
  const whereConditions: any = {}
  
  if (gameId) {
    whereConditions.gameid = gameId
  }
  
  if (playerId) {
    whereConditions.OR = [
      { playera: playerId },
      { playerb: playerId }
    ]
  }
  
  return prisma.gamehistory.findMany({
    where: whereConditions,
    orderBy: { createdat: 'desc' },
    take: limit,
    skip: offset
  })
}

export const createGameHistory = async (gameId: string, playerA: string, playerB: string, pgn: string) => {
  return prisma.gamehistory.create({
    data: { gameid: gameId, playera: playerA, playerb: playerB, pgn }
  })
}

export const completeGame = async (gameId: string, pgn: string) => {
  const game = await prisma.activegames.findUnique({
    where: { gameid: gameId }
  })
  
  if (!game) {
    throw new Error('Game not found')
  }
  
  await prisma.gamehistory.create({
    data: {
      gameid: game.gameid,
      playera: game.white,
      playerb: game.black,
      pgn
    }
  })
  
  return prisma.activegames.delete({
    where: { gameid: gameId }
  })
}