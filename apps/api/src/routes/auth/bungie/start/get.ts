import type { Request, Response, Router } from "express";

import { APIError } from "@/lib";

export function setupGetStartEndpoint(router: Router)
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    router.get("/", (req: Request, res: Response) =>
    {
        throw new APIError("Not Implemented", 501);
    });
}
