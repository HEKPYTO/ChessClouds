import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { gamehistory } from '@/db/schema';
import { eq, desc, and, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const gameId = searchParams.get('gameId');
    const playerId = searchParams.get('playerId');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    const conditions = [];
    
    if (gameId) {
      conditions.push(eq(gamehistory.gameid, gameId));
    }
    
    if (playerId) {
      conditions.push(
        or(
          eq(gamehistory.playera, playerId),
          eq(gamehistory.playerb, playerId)
        )
      );
    }
    
    const games = await db
      .select()
      .from(gamehistory)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(gamehistory.createdat))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(games);
  } catch (error) {
    console.error('Failed to fetch game history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}