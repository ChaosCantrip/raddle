import { NextRequest, NextResponse } from "next/server";
import Encounters from "@//lib/Encounters";
import GetDailyAnswer from "@/lib/DailyAnswer";
import CompareEncounters from "@/lib/CompareEncounters";
import type DailyGuessRequest from "@/models/DailyGuessRequest";
import { GuessResponse } from "@/models/GuessResponse";

export async function POST(request: NextRequest) 
{
    const todays_answer = GetDailyAnswer();

    let guess_id: string;

    try 
    {
        const body = await request.json() as DailyGuessRequest;

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
        const response: GuessResponse = { result: "correct" };
        return NextResponse.json(response);
    }

    const result = CompareEncounters(guess, todays_answer);

    const response: GuessResponse = {
        result: "incorrect",
        comparisons: result
    };

    return NextResponse.json(response);
}
