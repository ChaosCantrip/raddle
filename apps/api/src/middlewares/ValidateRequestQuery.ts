import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const ValidateRequestQuery = (schema: ZodType) => 
{
    return async (req: Request, res: Response, next: NextFunction) => 
    {
        const result = await schema.safeParseAsync(req.query);

        if (!result.success) 
        {
            return res.status(422).json({
                error: "Request Query Schema Validation Failed",
                details: result.error.issues.map((e) => ({
                    field: e.path.join("."),
                    issue: e.message
                }))
            });
        }

         
        res.locals.parsedQuery = result.data;

        next();
    }
}
