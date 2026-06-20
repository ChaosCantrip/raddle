import { cookies } from "next/headers";
import { VerifyJWT, type SessionPayload } from "./VerifyJWT";

export async function GetSession(): Promise<SessionPayload | null> 
{
    const cookie = (await cookies()).get("raddle_session")?.value;
    if (!cookie) return null;

    return VerifyJWT(cookie);
}
