import type { Request, Response, Router } from "express";
import crypto from "crypto";

import { APIError } from "@/lib";

export function setupGetStartEndpoint(router: Router)
{
    router.get("/", (_req: Request, res: Response) =>
    {
        const bungieClientId = process.env.BUNGIE_CLIENT_ID;
        if (!bungieClientId) throw new APIError("Bungie client ID is not configured", 500);

        const state = crypto.randomBytes(32).toString("hex");
        const bungieAuthUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=${bungieClientId}&response_type=code&state=${state}`;

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("bungie_oauth_state", state, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 5,
        });

        return res.redirect(bungieAuthUrl);
    });
}
