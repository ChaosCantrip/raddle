import { Encounter } from "@/models";

type Condition = (encounter: Encounter, query: string) => boolean;

const conditions: Condition[] = [
    (encounter, query) => encounter.name.toLowerCase().startsWith(query),
    (encounter, query) => encounter.name.toLowerCase().includes(query),
    (encounter, query) => encounter.search_terms.some(term => term.startsWith(query)),
    (encounter, query) => encounter.search_terms.some(term => term.includes(query))
]

function FilterEncounters(inputValue: string, encounters: Encounter[], guesses: Encounter[]) 
{
    const query = inputValue.toLowerCase().trim();

    const filteredGuesses = encounters.filter(encounter => !guesses.includes(encounter));

    const filteredConditions: Encounter[] = [];

    for (const condition of conditions) 
    {
        filteredConditions.push(...filteredGuesses.filter(encounter => condition(encounter, query)));
    }

    const unique = [
        ...new Map(filteredConditions.map(encounter => [encounter.id, encounter])).values()
    ]

    return unique;
}

export default FilterEncounters;
