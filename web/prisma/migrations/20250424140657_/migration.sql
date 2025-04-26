-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('White Wins', 'Black Wins', 'Draw', 'On Going', 'Abort');

-- CreateTable
CREATE TABLE "gamestate" (
    "gameid" UUID NOT NULL,
    "white" TEXT NOT NULL,
    "black" TEXT NOT NULL,
    "pgn" TEXT NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "GameStatus" NOT NULL DEFAULT 'On Going',

    CONSTRAINT "gamestate_pkey" PRIMARY KEY ("gameid")
);
