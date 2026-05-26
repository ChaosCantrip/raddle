"use client";

import { useEffect, useState } from "react";
import styles from "./GuessEntryBox.module.css";
import Encounter from "@/app/models/Encounter";

export default function GuessEntryBox({ encounters, callback }: { encounters: Encounter[]; callback: (guess: Encounter) => void }) 
{
    const [inputValue, setInputValue] = useState("");
    const [filteredEncounters, setFilteredEncounters] = useState<Encounter[]>([]);
    const [inputFocused, setInputFocused] = useState(false);

    useEffect(() => 
    {
        function FilterEncounters() 
        {
            const query = inputValue.toLowerCase();

            const startsWithMatches = encounters.filter(encounter => encounter.name.toLowerCase().startsWith(query));
            const includesMatches = encounters.filter(encounter => encounter.name.toLowerCase().includes(query) && !startsWithMatches.includes(encounter));

            setFilteredEncounters([...startsWithMatches, ...includesMatches]);
        }

        FilterEncounters();
    }, [inputValue, encounters]);

    function HandleSubmit(encounter: Encounter) 
    {
        callback(encounter);
        setInputValue("");
    }

    return (
        <div className={styles.container}>
            <input type="text" className={styles.input} placeholder="Search..." value={inputValue} onChange={(event) => setInputValue(event.target.value)} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)}/>
            <div className={styles.suggestions + " " + ((filteredEncounters.length > 0 && inputFocused) ? styles.show : "")}>
                {filteredEncounters.map(encounter => (
                    <div key={encounter.id} className={styles.suggestion} onMouseDown={() => HandleSubmit(encounter)}>
                        {encounter.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
