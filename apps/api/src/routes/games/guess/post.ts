import type { Request, Response, Router } from "express";
import crypto from "crypto";

import { APIError, compareEncounters, generateRandomEncounter, getDailyAnswer, getMongoClient } from "@/lib";
import { validateRequestBody } from "@/middlewares";

import { HttpStatus, GameState, GameMode } from "@raddle/types";
import type { CompletedGame, Encounter, EncounterComparisonResult, Game, Guess } from "@raddle/types";

import { MakeGuessRequestSchema } from "@raddle/types/requests";
import type { MakeGuessRequest } from "@raddle/types/requests";

import { Encounters } from "@raddle/common";
import { getDateString } from "@raddle/common/date";

export function setupPostGuessEndpoint(router: Router)
{
     
    router.post("/", validateRequestBody(MakeGuessRequestSchema), async (req: Request , res: Response) => 
    {
        // Parse params
        const { gameId, gameMode, guessId } = parseRequestParams(res);
        // Create/fetch game

        const game = await getGame(gameId, gameMode);

        if (game.gameMode !== gameMode)
        {
            throw new APIError("Game mode mismatch.", HttpStatus.BadRequest);
        }

        await validateGameStillPlayable(game);
        validateGuessNotAlreadyMade(game, guessId);

        const guessEncounter = getEncounterById(guessId);
        const answerEncounter = getEncounterById(game.answerId);

        const result: EncounterComparisonResult = compareEncounters(guessEncounter, answerEncounter);
        const guess: Guess = {
            encounterId: guessEncounter.id,
            comparisonResult: result,
            createdAt: new Date()
        };

        game.guesses.push(guess);
        if (guessEncounter.id === answerEncounter.id) 
        {
            game.gameState = GameState.complete;
            (game as CompletedGame).completedAt = new Date();
        }
        game.updatedAt = new Date();

        await saveGame(game);

        const response: Partial<Game> = { ...game };

        res.status(HttpStatus.Ok).json({ ...response, answerId: undefined, _id: undefined });
    });
}

function parseRequestParams(res: Response): MakeGuessRequest 
{
    return res.locals.parsedBody as MakeGuessRequest;
}

async function getGame(gameId: string | undefined, gameMode: GameMode): Promise<Game>
{
    if (gameId) 
    {
        return await fetchGameById(gameId);
    }
    else 
    {
        return await createNewGame(gameMode);
    }
}

async function fetchGameById(gameId: string): Promise<Game>
{
    const client = await getMongoClient();
    const db = client.db(process.env.DB_NAME || "raddle");
    const collection = db.collection<Game>("games");

    const game = await collection.findOne({ 
        id: gameId
    });

    if (!game)
    {
        throw new APIError("Game not found.", HttpStatus.NotFound);
    }

    return game as Game;
}

async function createNewGame(gameMode: GameMode): Promise<Game> 
{
    const newGame = {
        id: await generateUniqueGameId(),
        guesses: [] as Guess[],
        createdAt: new Date(),
        updatedAt: new Date(),
        gameState: GameState.incomplete
    };

    if (gameMode === GameMode.daily)
    {
        return {
            ...newGame,
            answerId: (await getDailyAnswer()).id,
            gameMode: GameMode.daily,
            dailyDate: getDateString()
        };
    }
    else 
    {
        return {
            ...newGame,
            answerId: generateRandomEncounter().id,
            gameMode: GameMode.arcade
        };   
    }
}

async function generateUniqueGameId(): Promise<string>
{
    let uniqueId: string;
    do 
    {
        uniqueId = crypto.randomUUID();
    } while (await gameIdExists(uniqueId));

    return uniqueId;
}

async function gameIdExists(gameId: string): Promise<boolean> 
{
    const client = await getMongoClient();
    const db = client.db(process.env.DB_NAME || "raddle");
    const collection = db.collection<Game>("games");

    const game = await collection.find({ 
        id: gameId
    }).toArray();

    return game.length > 0;
}

async function validateGameStillPlayable(game: Game): Promise<void>
{
    if (game.gameMode === GameMode.daily && game.dailyDate !== getDateString())
    {
        game.gameState = GameState.abandoned;
        await saveGame(game);
        throw new APIError("Daily game is not for today.", HttpStatus.BadRequest);
    }
    switch (game.gameState)
    {
        case GameState.complete:
            throw new APIError("Game is already complete.", HttpStatus.BadRequest);
        case GameState.abandoned:
            throw new APIError("Game has been abandoned.", HttpStatus.BadRequest);
    }
}

function validateGuessNotAlreadyMade(game: Game, guessId: string): void
{
    const encounterAlreadyGuessed = game.guesses.some((guess) => guess.encounterId === guessId);
    if (encounterAlreadyGuessed)
    {
        throw new APIError("Encounter already guessed in this game.", HttpStatus.BadRequest);
    }
}

function getEncounterById(encounterId: string): Encounter
{
    const encounter = Encounters.find((encounter) => encounter.id === encounterId);
    if (!encounter)
    {
        throw new APIError("Encounter not found.", HttpStatus.NotFound);
    }
    return encounter;
}

async function saveGame(game: Game): Promise<void> 
{
    const client = await getMongoClient();
    const db = client.db(process.env.DB_NAME || "raddle");
    const collection = db.collection<Game>("games");

    await collection.updateOne(
        { id: game.id },
        { $set: { ...game } },
        { upsert: true }
    );
}
