import type Encounter from "@/models/Encounter";
import Encounters from "@/lib/Encounters";

export default function GenerateRandomEncounter(): Encounter
{
    return Encounters[Math.floor(Math.random() * Encounters.length)];
}
