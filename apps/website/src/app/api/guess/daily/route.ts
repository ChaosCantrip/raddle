import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { CompareEncounters } from "@/lib";
import { Encounters } from "@raddle/common";
import GetDailyAnswer from "@/lib/DailyAnswer";
import getMongoClient from "@/lib/MongoDB";
import { getDateString } from "@raddle/common/date";
import type { DailyGuessRequest, GuessResponse } from "@raddle/types";

export async function POST(request: NextRequest) 
{
    const todays_answer = await GetDailyAnswer();

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
        const response: GuessResponse = { result: "correct", place: await GetHowManyPeopleAnsweredToday() };
        return NextResponse.json(response);
    }

    const result = CompareEncounters(guess, todays_answer);

    const response: GuessResponse = {
        result: "incorrect",
        comparisons: result
    };

    return NextResponse.json(response);
}

const DB_NAME = process.env.MONGODB_DB_NAME || "raddle";
const COLLECTION_NAME = "daily_guesses";

async function GetHowManyPeopleAnsweredToday() 
{
    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const today = getDateString();

    const stats = await collection.findOneAndUpdate(
        { date: today },
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: "after" }
    );

    return stats!.count;
}
