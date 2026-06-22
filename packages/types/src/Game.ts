import type { ObjectId } from "mongodb";
import type { Encounter } from "./Encounter";
import type { GuessResult } from "./GuessResult";

export type GameMode = "daily" | "arcade";
export type GameState = "complete" | "incomplete" | "abandoned";

export type BaseGame = {
    _id?: ObjectId;
    id: string;
    gameMode: GameMode;
    gameState: GameState;
    answerId: Encounter["id"];
    guessResults: GuessResult[];
    createdAt: Date;
    updatedAt: Date;
}

export type CompletedGame = BaseGame & {
    gameState: "complete";
    completedAt: Date;
}

export type IncompleteGame = BaseGame & {
    gameState: "incomplete";
}

export type AbandonedGame = BaseGame & {
    gameState: "abandoned";
    abandonedAt: Date;
}

export type DailyGame = BaseGame & {
    gameMode: "daily";
    dailyDate: string;
}

export type ArcadeGame = BaseGame & {
    gameMode: "arcade";
}

export type CompletedDailyGame = CompletedGame & DailyGame;
export type CompletedArcadeGame = CompletedGame & ArcadeGame;
export type IncompleteDailyGame = IncompleteGame & DailyGame;
export type IncompleteArcadeGame = IncompleteGame & ArcadeGame;
export type AbandonedDailyGame = AbandonedGame & DailyGame;
export type AbandonedArcadeGame = AbandonedGame & ArcadeGame;

export type Game = CompletedDailyGame | CompletedArcadeGame | IncompleteDailyGame | IncompleteArcadeGame | AbandonedDailyGame | AbandonedArcadeGame;
