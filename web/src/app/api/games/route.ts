// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { activegames, gamehistory } from '@/db/schema';
// import { eq } from 'drizzle-orm';

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const gameId = searchParams.get('gameId');

//     if (gameId) {
      
//       const game = await db
//         .select()
//         .from(activegames)
//         .where(eq(activegames.gameid, gameId))
//         .limit(1);

//       if (!game || game.length === 0) {
//         return NextResponse.json({ error: 'Game not found' }, { status: 404 });
//       }

//       return NextResponse.json(game[0]);
//     } else {
      
//       const games = await db.select().from(activegames);
//       return NextResponse.json(games);
//     }
//   } catch (error) {
//     console.error('Failed to fetch games:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { gameId, white, black } = body;

//     if (!gameId || !white || !black) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

    
//     const existingGame = await db
//       .select()
//       .from(activegames)
//       .where(eq(activegames.gameid, gameId))
//       .limit(1);

//     if (existingGame && existingGame.length > 0) {
//       return NextResponse.json(
//         { error: 'Game already exists' },
//         { status: 409 }
//       );
//     }

    
//     const newGame = await db
//       .insert(activegames)
//       .values({
//         gameid: gameId,
//         white,
//         black,
//       })
//       .returning();

//     return NextResponse.json(newGame[0]);
//   } catch (error) {
//     console.error('Failed to create game:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const gameId = searchParams.get('gameId');

//     if (!gameId) {
//       return NextResponse.json(
//         { error: 'Game ID is required' },
//         { status: 400 }
//       );
//     }

    
//     const game = await db
//       .select()
//       .from(activegames)
//       .where(eq(activegames.gameid, gameId))
//       .limit(1);

//     if (!game || game.length === 0) {
//       return NextResponse.json({ error: 'Game not found' }, { status: 404 });
//     }

    
//     await db.insert(gamehistory).values({
//       gameid: game[0].gameid,
//       playera: game[0].white,
//       playerb: game[0].black,
//       pgn: '', 
//     });

    
//     await db.delete(activegames).where(eq(activegames.gameid, gameId));

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Failed to delete game:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }