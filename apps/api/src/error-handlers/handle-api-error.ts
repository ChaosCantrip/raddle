import type { Request, Response, NextFunction } from "express";

import { APIError } from "../lib/index.js";

export const handleAPIError = (err: unknown, _req: Request, res: Response, next: NextFunction) =>
{
    if (!(err instanceof APIError))
    {
        return next(err);
    }

    res.status(err.status).json({
        message: err.message
    });
};
