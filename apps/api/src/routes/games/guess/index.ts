import express from "express";
import type { Router } from "express";

import { setupPostGuessEndpoint } from "./post.js";

const guessRouter: Router = express.Router();

setupPostGuessEndpoint(guessRouter);

export function setupGuessRouter(router: Router)
{
    router.use("/guess", guessRouter);
}
