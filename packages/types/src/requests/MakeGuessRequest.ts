import type { GameMode } from "../Game.js";
import type { Encounter } from "../Encounter.js";
import type { Game } from "../Game.js";

export interface MakeGuessRequest {
    guessId: Encounter["id"];
    gameMode: GameMode;
    gameId?: Game["id"];
}
