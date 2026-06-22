import type { EncounterComparisonResult } from "./EncounterComparisonResult";

export interface GuessResult {
    guessId: string;
    comparisonResult: EncounterComparisonResult;
    timestamp: Date;
}
