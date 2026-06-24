import type { Encounter } from "@raddle/types";
import { Encounters } from "@raddle/common";

export default function GenerateRandomEncounter(): Encounter
{
    return Encounters[Math.floor(Math.random() * Encounters.length)];
}
