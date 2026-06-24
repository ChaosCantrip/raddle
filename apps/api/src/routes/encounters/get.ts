import { Encounters } from "@raddle/common";
import type { Request, Response, Router } from "express";

export function setupGetEncountersEndpoint(router: Router)
{
    router.get("/", (_req: Request, res: Response) => 
    {
        res.send(Encounters);
    });
}
