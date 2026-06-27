import express from "express";
import type { Router } from "express";

import { setupGetGameEndpoint } from "./get.js";
import { setupGuessRouter } from "./guess/index.js";

const gamesRouter: Router = express.Router();

setupGuessRouter(gamesRouter);
setupGetGameEndpoint(gamesRouter);

export function setupGamesRouter(router: Router)
{
    router.use("/games", gamesRouter);
}
