import Encounter from "@/models/Encounter";

function FilterEncounters(inputValue: string, encounters: Encounter[], guesses: Encounter[]) 
{
    const query = inputValue.toLowerCase();

    const startsWithMatches = encounters.filter(encounter => encounter.name.toLowerCase().startsWith(query) && !guesses.includes(encounter));
    const includesMatches = encounters.filter(encounter => encounter.name.toLowerCase().includes(query) && !startsWithMatches.includes(encounter));

    return [...startsWithMatches, ...includesMatches];
}

export default FilterEncounters;
