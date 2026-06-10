import { NextRequest, NextResponse } from "next/server";
import Encounters from "@//lib/Encounters";
import GetDailyAnswer from "@/lib/DailyAnswer";
import CompareEncounters from "@/lib/CompareEncounters";

export async function POST(request: NextRequest) 
{
    const todays_answer = GetDailyAnswer();

    let guess_id: string;

    try 
    {
        const body = await request.json();

        if (!body || typeof body.guess_id !== "string") 
        {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        guess_id = body.guess_id;
    }
    catch 
    {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const guess = Encounters.find(encounter => encounter.id === guess_id);

    if (!guess) 
    {
        return NextResponse.json({ error: "Invalid Encounter ID" }, { status: 400 });
    }

    if (guess.id === todays_answer.id) 
    {
        return NextResponse.json({ result: "correct" });
    }

    const result = CompareEncounters(guess, todays_answer);

    return NextResponse.json({
        result: "incorrect",
        comparisons: result
    });
}
