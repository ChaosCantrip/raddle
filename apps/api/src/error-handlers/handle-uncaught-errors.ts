import type { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleUncaughtErrors = (err: unknown, req: Request, res: Response, next: NextFunction) => 
{
    console.error("[GLOBAL ERROR]:", err);

    res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occured."
    })
}
