import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { APIError } from "@/lib/Errors";

export async function GET(req: NextRequest) 
{
    try 
    {
        const code: string = await ValidateRequest(req);

        const tokenExchangeResponse: Response = await ExchangeCodeForAccessToken(code);

        const { accessToken, bungieMembershipId } : TokenData = await ExtractTokenData(tokenExchangeResponse);

        const bungieName: string = await FetchBungieName(accessToken, bungieMembershipId);

        const sessionJWT: string = CreateJWT(bungieName);

        const baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const response: NextResponse = NextResponse.redirect(baseUrl);

        SetResponseCookies(response, sessionJWT);

        return response;
    }
    catch (err) 
    {
        if (err instanceof APIError) 
        {
            return new Response(err.message, { status: err.status });
        }

        return new Response("Internal Server Error", { status: 500 });
    }
}

async function ValidateRequest(req: NextRequest): Promise<string>
{
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const cookieStore = await cookies();

    if (!code || !state) 
    {
        throw new APIError("Missing code or state", 400);
    }

    const storedState = cookieStore.get("bungie_oauth_state");
    if (!storedState || storedState.value !== state) 
    {
        throw new APIError("Invalid OAuth state", 400);
    }

    return code;
}

async function ExchangeCodeForAccessToken(code: string): Promise<Response>
{
    const tokenExchangeResponse = await fetch("https://www.bungie.net/platform/app/oauth/token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-API-Key": process.env.BUNGIE_API_KEY!
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: process.env.BUNGIE_CLIENT_ID!
        }),
    });

    if (!tokenExchangeResponse.ok) 
    {
        const err = await tokenExchangeResponse.text();
        throw new APIError(`Token exchange failed: ${err}`, 500);
    }

    return tokenExchangeResponse;
}

interface TokenData {
    accessToken: string;
    bungieMembershipId: string;
}

async function ExtractTokenData(tokenExchangeResponse: Response): Promise<TokenData>
{
    const tokenData = await tokenExchangeResponse.json();
    const accessToken = tokenData.access_token;
    const bungieMembershipId = tokenData.membership_id;

    if (!accessToken || !bungieMembershipId) 
    {
        throw new APIError("Invalid token response from Bungie", 500);
    }

    return { accessToken, bungieMembershipId }
}

async function FetchBungieName(accessToken: string, membershipId: string): Promise<string>
{
    const profileRes = await fetch(
        `https://www.bungie.net/Platform/User/GetMembershipsById/${membershipId}/-1/`,
        {
            headers: {
                "X-API-Key": process.env.BUNGIE_API_KEY!,
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!profileRes.ok) 
    {
        const err = await profileRes.text();
        throw new APIError(`Failed to fetch Bungie profile: ${err}`, 500);
    }

    const profile = await profileRes.json();
    const bungieNetUser = profile.Response?.bungieNetUser;
    const bungieName = bungieNetUser?.uniqueName || bungieNetUser?.displayName || "Unknown Guardian";

    return bungieName;
}

function CreateJWT(bungieName: string): string
{
    const sessionJWT = jwt.sign(
        {
            bungieName,
        },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
    );

    return sessionJWT;
}

function SetResponseCookies(response: NextResponse, sessionJWT: string) 
{
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("raddle_session", sessionJWT, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set("bungie_oauth_state", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}
