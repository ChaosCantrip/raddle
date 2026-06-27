import express from "express";
import type { Router } from "express";

const startRouter: Router = express.Router();

export function setupStartRouter(router: Router)
{
    router.use("/start", startRouter);
}
