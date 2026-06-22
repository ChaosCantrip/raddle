import type { GameMode } from "../Game";
import type { Encounter } from "../Encounter";
import type { Game } from "../Game";

export interface MakeGuessRequest {
    guessId: Encounter["id"];
    gameMode: GameMode;
    gameId?: Game["id"];
}
