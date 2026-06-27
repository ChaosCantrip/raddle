import express from "express";
import type { Router } from "express";

import { setupGetStartEndpoint } from "./get.js";

const startRouter: Router = express.Router();

setupGetStartEndpoint(startRouter);

export function setupStartRouter(router: Router)
{
    router.use("/start", startRouter);
}
