import { NextRequest, NextResponse } from "next/server";
import Encounters from "@/app/lib/Encounters";
import GetDailyAnswer from "@/app/lib/DailyAnswer";
import GridCellState from "@/models/GridCellState";

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

    const name_result = CompareName(guess.name, todays_answer.name);
    const enemy_types_result = CompareEnemyTypes(guess.enemy_types, todays_answer.enemy_types);
    const activity_type_result = CompareActivityType(guess.activity_type, todays_answer.activity_type);
    const activity_result = CompareActivity(guess.activity, todays_answer.activity);
    const expansion_result = CompareExpansion(guess.expansion, todays_answer.expansion);
    const encounters_result = CompareEncounters(guess.encounters, todays_answer.encounters);

    return NextResponse.json({
        result: "incorrect",
        comparisons: {
            name: name_result,
            enemy_types: enemy_types_result,
            activity_type: activity_type_result,
            activity: activity_result,
            expansion: expansion_result,
            encounters: encounters_result
        }
    });
}

function CompareName(guess: string, answer: string): GridCellState
{
    // Added for future proofing. I don't know how this would ever change, but... Ah well.
    if (guess === answer) 
    {
        return GridCellState.Green;
    }
    
    return GridCellState.Grey;
}

function CompareEnemyTypes(guess: string[], answer: string[]): GridCellState
{
    const guessSet = new Set(guess);
    const answerSet = new Set(answer);
    const intersection = new Set([...guessSet].filter(x => answerSet.has(x)));

    if (intersection.size === answerSet.size && intersection.size === guessSet.size) 
    {
        return GridCellState.Green;
    } 
    else if (intersection.size > 0) 
    {
        return GridCellState.Yellow;
    }

    return GridCellState.Grey;
}

function CompareActivityType(guess: string, answer: string): GridCellState
{
    // Added for future proofing. I don't know how this would ever change, but... Ah well.
    if (guess === answer) 
    {
        return GridCellState.Green;
    }

    return GridCellState.Grey;
}

function CompareActivity(guess: string, answer: string): GridCellState
{
    // Added for future proofing. I don't know how this would ever change, but... Ah well.
    if (guess === answer) 
    {
        return GridCellState.Green;
    }

    return GridCellState.Grey;
}

function CompareExpansion(guess: string, answer: string): GridCellState 
{
    // Added for future proofing. I don't know how this would ever change, but... Ah well.
    
    if (guess === answer) 
    {
        return GridCellState.Green;
    }

    return GridCellState.Grey;

}

function CompareEncounters(guess: number[], answer: number[]): GridCellState 
{
    const guessSet = new Set(guess);
    const answerSet = new Set(answer);
    const intersection = new Set([...guessSet].filter(x => answerSet.has(x)));

    if (intersection.size > 0) 
    {
        return GridCellState.Green;
    }

    return GridCellState.Grey;
}
