import express from "express";
import type { Router } from "express";

const authRouter: Router = express.Router();

export function setupAuthRouter(router: Router)
{
    router.use("/auth", authRouter);
}
