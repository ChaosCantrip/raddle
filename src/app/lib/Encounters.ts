import encounters_data from "@/../public/encounters.json";
import Encounter from "@/app/models/Encounter";

const Encounters: Encounter[] = encounters_data as Encounter[];

export default Encounters;
