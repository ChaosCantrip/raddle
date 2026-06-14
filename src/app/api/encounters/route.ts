import { NextResponse } from "next/server";
import { Encounters } from "@/lib";

export async function GET() 
{
    return NextResponse.json(Encounters);
}
