import jwt from "jsonwebtoken";

export interface SessionPayload {
    bungieName: string;
    iat?: number;
    exp?: number;
}

export async function VerifyJWT(token: string): Promise<SessionPayload | null> 
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

export function GetSessionFromRequest(req: Request): SessionPayload | null 
{
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
        cookieHeader.split(";").map(c => 
        {
            const [k, v] = c.trim().split("=");
            return [k, v];
        })
    );

    const sessionToken = cookies["raddle_session"];
    if (!sessionToken) return null;

    try 
    {
        return jwt.verify(sessionToken, process.env.JWT_SECRET!) as SessionPayload;
    }
    catch 
    {
        return null;
    }
}
