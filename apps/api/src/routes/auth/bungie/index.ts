import express from "express";
import type { Router } from "express";

import { setupStartRouter } from "./start/index.js";

const bungieRouter: Router = express.Router();

setupStartRouter(bungieRouter);

export function setupBungieRouter(router: Router)
{
    router.use("/bungie", bungieRouter);
}
