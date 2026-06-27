import type { Encounter } from "@raddle/types";

import encounters_data from "./encounters.json" with { type: "json" };

export const Encounters: Encounter[] = encounters_data as Encounter[];
