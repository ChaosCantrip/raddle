import type { Request, Response, Router } from "express";
import crypto from "crypto";

import { APIError } from "@/lib";

export function setupGetStartEndpoint(router: Router)
{
    router.get("/", (_req: Request, res: Response) =>
    {
        const bungieClientId = process.env.BUNGIE_CLIENT_ID;
        if (!bungieClientId) throw new APIError("Bungie client ID is not configured", 500);

        const callbackUrl = getCallbackUrl();

        const state = crypto.randomBytes(32).toString("hex");
        const bungieAuthUrl = new URL("https://www.bungie.net/en/OAuth/Authorize");
        bungieAuthUrl.searchParams.set("client_id", bungieClientId);
        bungieAuthUrl.searchParams.set("response_type", "code");
        bungieAuthUrl.searchParams.set("state", state);
        bungieAuthUrl.searchParams.set("redirect_uri", callbackUrl);

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("bungie_oauth_state", state, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 1000 * 60 * 5,
        });

        return res.redirect(bungieAuthUrl.toString());
    });
}

function getCallbackUrl(): string
{
    const explicitRedirectUrl = process.env.BUNGIE_REDIRECT_URI;
    if (explicitRedirectUrl)
    {
        return explicitRedirectUrl;
    }

    const websiteUrl = process.env.WEBSITE_URL;
    if (!websiteUrl) throw new APIError("Website URL is not configured", 500);

    return new URL("/api/auth/bungie/callback", websiteUrl).toString();
}
