import express from "express";
import type { Router } from "express";

const bungieRouter: Router = express.Router();

export function setupBungieRouter(router: Router)
{
    router.use("/bungie", bungieRouter);
}
