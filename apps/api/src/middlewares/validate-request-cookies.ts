import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateRequestCookies = (schema: ZodType) => 
{
    return async (req: Request, res: Response, next: NextFunction) => 
    {
        const result = await schema.safeParseAsync(req.cookies);

        if (!result.success) 
        {
            return res.status(422).json({
                error: "Request Cookies Schema Validation Failed",
                details: result.error.issues.map((e) => ({
                    field: e.path.join("."),
                    issue: e.message
                }))
            });
        }

        res.locals.parsedCookies = result.data;

        next();
    }
}
