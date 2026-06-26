import express from "express";
import type { Router } from "express";

const guessRouter: Router = express.Router();

export function setupGuessRouter(router: Router)
{
    router.use("/guess", guessRouter);
}
