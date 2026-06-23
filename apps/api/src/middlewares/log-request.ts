import type { Request, Response, NextFunction } from "express";

export const logRequest = (req: Request, res: Response, next: NextFunction) => 
{
    const now = process.hrtime();

    console.log(`[INCOMING REQ] ${req.method} ${req.originalUrl}`);

    res.on("finish", () => 
    {
        const diff = process.hrtime(now);
        const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);

        console.log(`[OUTGOING RES] ${req.method} ${req.originalUrl} -> [Response ${res.statusCode}]  (${durationMs}ms)`);
    });

    next();
}
