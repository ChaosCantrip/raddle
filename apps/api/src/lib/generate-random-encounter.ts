import type { Encounter } from "@raddle/types";
import { Encounters } from "@raddle/common";

export function generateRandomEncounter(): Encounter
{
    return Encounters[Math.floor(Math.random() * Encounters.length)];
}    
