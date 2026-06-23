import type { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleNotFound = (req: Request, res: Response, next: NextFunction) => 
{
    res.status(404).json({
        error: "Not Found",
        message: `The path '${req.originalUrl}' does not exist on this server.`,
        method: req.method
    })
}
