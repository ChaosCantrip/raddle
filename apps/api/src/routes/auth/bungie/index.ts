import express from "express";
import type { Router } from "express";

import { setupCallbackRouter } from "./callback/index.js";
import { setupStartRouter } from "./start/index.js";

const bungieRouter: Router = express.Router();

setupCallbackRouter(bungieRouter);
setupStartRouter(bungieRouter);

export function setupBungieRouter(router: Router)
{
    router.use("/bungie", bungieRouter);
}
