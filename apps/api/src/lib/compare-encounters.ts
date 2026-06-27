import { GridCellState } from "@raddle/types";
import type { Encounter, EncounterComparisonResult } from "@raddle/types";

export function compareEncounters(guess: Encounter, answer: Encounter): EncounterComparisonResult
{
    return {
        name: compareName(guess.name, answer.name),
        activity_type: compareActivityType(guess.activity_type, answer.activity_type),
        activity: compareActivity(guess.activity, answer.activity),
        enemy_types: compareEnemyTypes(guess.enemy_types, answer.enemy_types),
        encounters: compareEncounterNumber(guess.encounters, answer.encounters),
        expansion: compareExpansion(guess.expansion, answer.expansion)
    }
}

function compareName(guess: string, answer: string): GridCellState
{
    // Added for future proofing. I don't know how this would ever change, but... Ah well.
    if (guess === answer) 
    {
        return GridCellState.Green;
    }
    
    return GridCellState.Grey;
}

function compareEnemyTypes(guess: string[], answer: string[]): GridCellState
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

function compareActivityType(guess: string, answer: string): GridCellState
{
    // Added for future proofing. I don't know how this would ever change, but... Ah well.
    if (guess === answer) 
    {
        return GridCellState.Green;
    }

    return GridCellState.Grey;
}

function compareActivity(guess: string, answer: string): GridCellState
{
    // Added for future proofing. I don't know how this would ever change, but... Ah well.
    if (guess === answer) 
    {
        return GridCellState.Green;
    }

    return GridCellState.Grey;
}

function compareExpansion(guess: string, answer: string): GridCellState 
{
    // Added for future proofing. I don't know how this would ever change, but... Ah well.
    
    if (guess === answer) 
    {
        return GridCellState.Green;
    }

    return GridCellState.Grey;

}

function compareEncounterNumber(guess: number[], answer: number[]): GridCellState 
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
