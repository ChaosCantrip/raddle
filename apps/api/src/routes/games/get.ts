import type { Request, Response, Router } from "express";

import { HttpStatus } from "@raddle/types";
import type { Game } from "@raddle/types";

import { APIError, getMongoClient } from "@/lib";

type GetGameParams = {
    gameId: string;
}

export function setupGetGameEndpoint(router: Router)
{
    router.get("/:gameId", async (_req: Request, res: Response) =>
    {
        const { gameId } = parseRequestParams(res);
        const game = await fetchGameById(gameId);

        const response: Partial<Game> = { ...game };
        res.status(HttpStatus.Ok).json({ ...response, answerId: undefined, _id: undefined });
    });
}

function parseRequestParams(res: Response): GetGameParams
{
    return res.locals.parsedParams as GetGameParams;
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
