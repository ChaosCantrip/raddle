"use client";

import { useEffect, useState } from "react";
import styles from "./GuessEntryBox.module.css";
import Encounter from "@/models/Encounter";
import Utils from "@/app/lib/Utils";

export default function GuessEntryBox({ encounters, guesses, callback }: { encounters: Encounter[]; guesses: Encounter[]; callback: (guess: Encounter) => void }) 
{
    const [inputValue, setInputValue] = useState("");
    const [filteredEncounters, setFilteredEncounters] = useState<Encounter[]>([]);
    const [inputFocused, setInputFocused] = useState(false);

    useEffect(() => 
    {
        // We suppress ESLint here as the logic is sound
        //eslint-disable-next-line react-hooks/set-state-in-effect
        setFilteredEncounters(Utils.FilterEncounters(inputValue, encounters, guesses));
    }, [inputValue, encounters, guesses]);

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
