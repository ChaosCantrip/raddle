import type { Request, Response, Router } from "express";

export function setupGetHealthEndpoint(router: Router)
{
    router.get("/", (_req: Request, res: Response) => 
    {
        res.json({ status: "ok" });
    });
}
