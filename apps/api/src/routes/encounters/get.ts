import type { Request, Response, Router } from "express";

import { Encounters } from "@raddle/common";

export function setupGetEncountersEndpoint(router: Router)
{
    router.get("/", (_req: Request, res: Response) => 
    {
        res.send(Encounters);
    });
}
