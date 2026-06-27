import "server-only";
import { cookies } from "next/headers";

import { verifyJWT, type SessionPayload } from "@raddle/common/auth";

export async function getSession(): Promise<SessionPayload | null> 
{
    const cookie = (await cookies()).get("raddle_session")?.value;
    if (!cookie) return null;

    return verifyJWT(cookie);
}
