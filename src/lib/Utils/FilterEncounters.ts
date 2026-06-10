import Encounter from "@/models/Encounter";

function FilterEncounters(inputValue: string, encounters: Encounter[], guesses: Encounter[]) 
{
    const query = inputValue.toLowerCase();

    const guessedIds = new Set(guesses.map(g => g.id));

    const startsWithMatches = encounters.filter(encounter => 
    {
        const name = encounter.name.toLowerCase();
        if (guessedIds.has(encounter.id)) return false;
        return name.startsWith(query);
    });

    const includesMatches = encounters.filter(encounter => 
    {
        const name = encounter.name.toLowerCase();
        if (guessedIds.has(encounter.id)) return false;
        if (startsWithMatches.includes(encounter)) return false;
        return name.includes(query);
    });

    return [...startsWithMatches, ...includesMatches];
}

export default FilterEncounters;
