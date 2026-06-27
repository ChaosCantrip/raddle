import type { Router } from "express";

import { setupEncountersRouter } from "./encounters/index.js";
import { setupGamesRouter } from "./games/index.js";
import { setupAuthRouter } from "./auth/index.js";
import { setupHealthRouter } from "./health/index.js";

export function setupRootRouter(router: Router)
{
    setupEncountersRouter(router);
    setupGamesRouter(router);
    setupAuthRouter(router);
    setupHealthRouter(router);
}
