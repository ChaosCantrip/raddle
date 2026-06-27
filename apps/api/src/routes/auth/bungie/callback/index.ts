import express from "express";
import type { Router } from "express";

const callbackRouter: Router = express.Router();

export function setupCallbackRouter(router: Router)
{
    router.use("/callback", callbackRouter);
}
