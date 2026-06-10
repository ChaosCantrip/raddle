import { NextRequest, NextResponse } from "next/server";
import Encounters from "@/lib/Encounters";
import CompareEncounters from "@/lib/CompareEncounters";
import type ArcadeGuessRequest from "@/models/ArcadeGuessRequest";
import { GuessResponse } from "@/models/GuessResponse";

export async function POST(request: NextRequest) 
{
    let guess_id: string;
    let answer_id: string;

    try 
    {
        const body = await request.json() as ArcadeGuessRequest;

        if (!body || typeof body.guess_id !== "string" || typeof body.answer_id !== "string")
        {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        guess_id = body.guess_id;
        answer_id = body.answer_id;
    }
    catch 
    {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const guess = Encounters.find(encounter => encounter.id === guess_id);
    const answer = Encounters.find(encounter => encounter.id === answer_id);

    if (!guess || !answer)
    {
        return NextResponse.json({ error: "Invalid Encounter ID" }, { status: 400 });
    }

    if (guess.id === answer.id) 
    {
        const response: GuessResponse = { result: "correct" };
        return NextResponse.json(response);
    }

    const result = CompareEncounters(guess, answer);

    const response: GuessResponse = {
        result: "incorrect",
        comparisons: result
    };

    return NextResponse.json(response);
}
    
