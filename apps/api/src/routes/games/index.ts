import express from "express";
import type { Router } from "express";

const gamesRouter: Router = express.Router();

export function setupGamesRouter(router: Router)
{
    router.use("/games", gamesRouter);
}
