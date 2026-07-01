import jwt from "jsonwebtoken";

export interface SessionPayload {
    bungieName: string;
    iat?: number;
    exp?: number;
}

export async function verifyJWT(token: string): Promise<SessionPayload | null> 
{
    try 
    {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as SessionPayload;
        return payload;
    }
    catch 
    {
        return null;
    }
}

export function getSessionFromRequest(req: Request): SessionPayload | null 
{
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
        cookieHeader.split(";").filter(Boolean).map(c => 
        {
            const [k, ...rest] = c.trim().split("=");
            return [k, rest.join("=")];
        })
    );

    const sessionToken = cookies["raddle_session"];
    const secret = process.env.JWT_SECRET;
    if (!sessionToken || !secret) return null;

    try 
    {
        return jwt.verify(sessionToken, secret) as SessionPayload;
    }
    catch 
    {
        return null;
    }
}
