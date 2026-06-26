import { APIError } from "@/lib";
import { HttpStatus } from "@raddle/types";
import type { Request, Response, Router } from "express";

export function setupPostGuessEndpoint(router: Router)
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    router.post("/", (req: Request, res: Response) => 
    {
        throw new APIError("Not Implemented.", HttpStatus.NotImplemented);
    });
}
