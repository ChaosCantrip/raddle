import type { Encounter } from "@raddle/types";
import { Encounters } from "@/lib";

export default function GenerateRandomEncounter(): Encounter
{
    return Encounters[Math.floor(Math.random() * Encounters.length)];
}
