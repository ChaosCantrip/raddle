import express from "express";
import type { Router } from "express";

import { setupGuessRouter } from "./guess/index.js";

const gamesRouter: Router = express.Router();

setupGuessRouter(gamesRouter);

export function setupGamesRouter(router: Router)
{
    router.use("/games", gamesRouter);
}
