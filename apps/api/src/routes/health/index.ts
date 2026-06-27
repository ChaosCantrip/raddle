import express from "express";
import type { Router } from "express";

import { setupGetHealthEndpoint } from "./get.js";

const healthRouter: Router = express.Router();

setupGetHealthEndpoint(healthRouter);

export function setupHealthRouter(router: Router)
{
    router.use("/health", healthRouter);
}
