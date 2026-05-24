import { NextResponse } from "next/server";
import Encounters from "@/app/lib/Encounters";

export async function GET() 
{
    return NextResponse.json(Encounters);
}
