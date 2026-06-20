import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() 
{
    const clientId = process.env.BUNGIE_CLIENT_ID;

    if (!clientId) 
    {
        return new Response("Missing Bungie OAuth env vars", { status: 500 });
    }

    const state = crypto.randomBytes(32).toString("hex");

    const bungieAuthUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=${clientId}&response_type=code&state=${state}`;

    const response = NextResponse.redirect(bungieAuthUrl);

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("bungie_oauth_state", state, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 5,
    });

    return response;
}
