import { GridCellState } from "@raddle/types";
import type { Encounter, EncounterComparisonResult } from "@raddle/types";

export default function CompareEncounters(guess: Encounter, answer: Encounter): EncounterComparisonResult
{
    return {
        name: CompareName(guess.name, answer.name),
        activity_type: CompareActivityType(guess.activity_type, answer.activity_type),
        activity: CompareActivity(guess.activity, answer.activity),
        enemy_types: CompareEnemyTypes(guess.enemy_types, answer.enemy_types),
        encounters: CompareEncounterNumber(guess.encounters, answer.encounters),
        expansion: CompareExpansion(guess.expansion, answer.expansion)
    }
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

function CompareEncounterNumber(guess: number[], answer: number[]): GridCellState 
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
