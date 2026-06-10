import EncounterComparisonResult from "@/models/EncounterComparisonResult";

export interface CorrectResult {
    result: "correct";
}

export interface IncorrectResult {
    result: "incorrect";
    comparisons: EncounterComparisonResult;
}

export interface ErrorResult {
    error: string;
}

export type NonErrorResult = CorrectResult | IncorrectResult;

export type GuessResponse = CorrectResult | IncorrectResult | ErrorResult;
export default GuessResponse;
