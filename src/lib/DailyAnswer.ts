import Encounters from "@/lib/Encounters";
import Encounter from "@/models/Encounter";

export default function GetDailyAnswer() 
{
    // TODO: This is just a placeholder
    const answer: Encounter = Encounters.find(encounter => encounter.id === "the_vault")!;
    return answer;
}
