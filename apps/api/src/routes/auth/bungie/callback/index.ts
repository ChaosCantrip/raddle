import express from "express";
import type { Router } from "express";

import { setupGetCallbackEndpoint } from "./get.js";

const callbackRouter: Router = express.Router();

setupGetCallbackEndpoint(callbackRouter);

export function setupCallbackRouter(router: Router)
{
    router.use("/callback", callbackRouter);
}
