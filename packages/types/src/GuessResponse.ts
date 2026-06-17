import type { EncounterComparisonResult } from "./EncounterComparisonResult";

export interface CorrectResult {
    result: "correct";
    place?: number;
}

export interface IncorrectResult {
    result: "incorrect";
    comparisons: EncounterComparisonResult;
}

export interface ErrorResult {
    error: string;
}

export type NonErrorResult = CorrectResult | IncorrectResult;

export type GuessResponse = NonErrorResult | ErrorResult;
