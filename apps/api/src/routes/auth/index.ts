import express from "express";
import type { Router } from "express";

import { setupBungieRouter } from "./bungie/index.js";

const authRouter: Router = express.Router();

setupBungieRouter(authRouter);

export function setupAuthRouter(router: Router)
{
    router.use("/auth", authRouter);
}
