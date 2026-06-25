import encounters_data from "./encounters.json" with { type: "json" };
import type { Encounter } from "@raddle/types";

export const Encounters: Encounter[] = encounters_data as Encounter[];
