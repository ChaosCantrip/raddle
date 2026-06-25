import type { EncounterComparisonResult } from "./EncounterComparisonResult.js";

export interface GuessResult {
    guessId: string;
    comparisonResult: EncounterComparisonResult;
    timestamp: Date;
}
