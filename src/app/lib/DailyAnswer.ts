import Encounters from "@/app/lib/Encounters";
import Encounter from "@/app/models/Encounter";

export default function GetDailyAnswer() 
{
    // TODO: This is just a placeholder
    const answer: Encounter = Encounters.find(encounter => encounter.id === "the_vault")!;
    return answer;
}
