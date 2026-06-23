import type { Request, Response, NextFunction } from "express";

export const handleMalformedJSON = (err: unknown, req: Request, res: Response, next: NextFunction) => 
{
    if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) 
    {
        return res.status(400).json({
            error: "Malformed JSON",
            message: "The request body contains invalid JSON syntax.",
            details: err.message
        });
    }

    next(err);
}
