import type { Encounter } from "@/models";
import { Encounters } from "@/lib";

export default function GenerateRandomEncounter(): Encounter
{
    return Encounters[Math.floor(Math.random() * Encounters.length)];
}
