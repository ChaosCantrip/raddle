import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateRequestParams = (schema: ZodType) => 
{
    return async (req: Request, res: Response, next: NextFunction) => 
    {
        const result = await schema.safeParseAsync(req.params);

        if (!result.success) 
        {
            return res.status(422).json({
                error: "URI Params Schema Validation Failed",
                details: result.error.issues.map((e) => ({
                    field: e.path.join("."),
                    issue: e.message
                }))
            });
        }

        res.locals.parsedParams = result.data;

        next();
    }
}
