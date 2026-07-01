import { NextResponse } from "next/server";

export async function GET(request: Request)
{
    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set("raddle_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    response.cookies.set("bungie_oauth_state", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    return response;
}
