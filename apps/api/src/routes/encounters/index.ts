import express from "express";
import type { Router } from "express";

import { setupGetEncountersEndpoint } from "./get.js";

const encountersRouter: Router = express.Router();

setupGetEncountersEndpoint(encountersRouter);

export function setupEncountersRouter(router: Router)
{
    router.use("/encounters", encountersRouter);
}
