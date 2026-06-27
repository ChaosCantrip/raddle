import type { Router, Request, Response } from "express";

import { setupEncountersRouter } from "./encounters/index.js";
import { setupGamesRouter } from "./games/index.js";

export function setupRootRouter(router: Router)
{
    setupEncountersRouter(router);
    setupGamesRouter(router);

    router.get("/health", (_req: Request, res: Response) => 
    {
        res.json({ status: "ok" });
    });
}
