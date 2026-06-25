import { NextResponse } from "next/server";
import { Encounters } from "@raddle/common";

export async function GET() 
{
    return NextResponse.json(Encounters);
}
