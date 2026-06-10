"use client";

import { useEffect, useState } from "react";
import styles from "./GuessEntryBox.module.css";
import Encounter from "@/app/models/Encounter";

export default function GuessEntryBox({ callback }: { callback: (guess: string) => void }) 
{
    const [inputValue, setInputValue] = useState("");
    const [encounters, setEncounters] = useState<Encounter[]>([]);
    const [filteredEncounters, setFilteredEncounters] = useState<Encounter[]>([]);

    useEffect(() => 
    {
        async function LoadEncounters() 
        {
            try 
            {
                const res = await fetch("/api/encounters");
                if (!res.ok) 
                {
                    throw new Error(`Fetch failed: ${res.status}`);
                }
                const data = await res.json();

                data.sort((a: Encounter, b: Encounter) => a.name.localeCompare(b.name));

                setEncounters(Array.isArray(data) ? data : []);
            }
            catch (err) 
            {
                console.error("Error fetching encounters:", err);
            }
        }

        LoadEncounters();
    }, []);

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
        callback(encounter.id);
        setInputValue("");
    }

    return (
        <div className={styles.container}>
            <input type="text" className={styles.input} placeholder="Search..." value={inputValue} onChange={(event) => setInputValue(event.target.value)}
            />
            <div className={styles.suggestions}>
                {filteredEncounters.map(encounter => (
                    <div key={encounter.id} className={styles.suggestion} onClick={() => HandleSubmit(encounter)}>
                        {encounter.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
