import type { Request, Response as ExpressResponse, Router } from "express";
import jwt from "jsonwebtoken";

import { HttpStatus } from "@raddle/types";

import { APIError } from "@/lib";

export function setupGetCallbackEndpoint(router: Router)
{
    router.get("/", async (req: Request, res: ExpressResponse) =>
    {
        const code = validateRequest(req);
        const tokenExchangeResponse = await exchangeCodeForAccessToken(code);
        const { accessToken, bungieMembershipId } = await extractTokenData(tokenExchangeResponse);
        const bungieName = await fetchBungieName(accessToken, bungieMembershipId);
        const sessionJWT = createJWT(bungieName);

        setResponseCookies(res, sessionJWT);

        const baseUrl = process.env.WEBSITE_URL;
        if (!baseUrl) throw new APIError("Website URL is not configured", HttpStatus.InternalServerError);
        return res.redirect(baseUrl);
    });
}

function validateRequest(req: Request): string
{
    const code = getQueryString(req, "code");
    const state = getQueryString(req, "state");

    if (!code || !state)
    {
        throw new APIError("Missing code or state", HttpStatus.BadRequest);
    }

    const storedState = req.cookies?.bungie_oauth_state;
    if (!storedState || storedState !== state)
    {
        throw new APIError("Invalid OAuth state", HttpStatus.BadRequest);
    }

    return code;
}

function getQueryString(req: Request, key: string): string | null
{
    const value = req.query[key];
    return typeof value === "string" ? value : null;
}

async function exchangeCodeForAccessToken(code: string): Promise<Response>
{
    const bungieApiKey = process.env.BUNGIE_API_KEY;
    const bungieClientId = process.env.BUNGIE_CLIENT_ID;
    const redirectUri = getCallbackUrl();

    if (!bungieApiKey || !bungieClientId)
    {
        throw new APIError("Bungie OAuth env vars are not configured", HttpStatus.InternalServerError);
    }

    const tokenExchangeResponse = await fetch("https://www.bungie.net/platform/app/oauth/token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-API-Key": bungieApiKey
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: bungieClientId,
            redirect_uri: redirectUri
        }),
    });

    if (!tokenExchangeResponse.ok)
    {
        const err = await tokenExchangeResponse.text();
        throw new APIError(`Token exchange failed: ${err}`, HttpStatus.InternalServerError);
    }

    return tokenExchangeResponse;
}

function getCallbackUrl(): string
{
    const explicitRedirectUrl = process.env.BUNGIE_REDIRECT_URI;
    if (explicitRedirectUrl)
    {
        return explicitRedirectUrl;
    }

    const websiteUrl = process.env.WEBSITE_URL;
    if (!websiteUrl)
    {
        throw new APIError("Website URL is not configured", HttpStatus.InternalServerError);
    }

    return new URL("/api/auth/bungie/callback", websiteUrl).toString();
}

interface TokenData {
    accessToken: string;
    bungieMembershipId: string;
}

async function extractTokenData(tokenExchangeResponse: globalThis.Response): Promise<TokenData>
{
    const tokenData = await tokenExchangeResponse.json() as {
        access_token?: string;
        membership_id?: string;
    };

    const accessToken = tokenData.access_token;
    const bungieMembershipId = tokenData.membership_id;

    if (!accessToken || !bungieMembershipId)
    {
        throw new APIError("Invalid token response from Bungie", HttpStatus.InternalServerError);
    }

    return { accessToken, bungieMembershipId };
}

async function fetchBungieName(accessToken: string, membershipId: string): Promise<string>
{
    const bungieApiKey = process.env.BUNGIE_API_KEY;

    if (!bungieApiKey)
    {
        throw new APIError("Bungie API key is not configured", HttpStatus.InternalServerError);
    }

    const profileResponse = await fetch(
        `https://www.bungie.net/Platform/User/GetMembershipsById/${membershipId}/-1/`,
        {
            headers: {
                "X-API-Key": bungieApiKey,
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!profileResponse.ok)
    {
        const err = await profileResponse.text();
        throw new APIError(`Failed to fetch Bungie profile: ${err}`, HttpStatus.InternalServerError);
    }

    const profile = await profileResponse.json() as {
        Response?: {
            bungieNetUser?: {
                uniqueName?: string;
                displayName?: string;
            };
        };
    };

    const bungieNetUser = profile.Response?.bungieNetUser;
    return bungieNetUser?.uniqueName || bungieNetUser?.displayName || "Unknown Guardian";
}

function createJWT(bungieName: string): string
{
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret)
    {
        throw new APIError("JWT secret is not configured", HttpStatus.InternalServerError);
    }

    return jwt.sign(
        {
            bungieName,
        },
        jwtSecret,
        { expiresIn: "7d" }
    );
}

function setResponseCookies(res: ExpressResponse, sessionJWT: string): void
{
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("raddle_session", sessionJWT, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.cookie("bungie_oauth_state", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}
