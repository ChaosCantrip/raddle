"use client";

import GridTable from "@/components/GridTable";
import GridRow from "@/components/GridRow";
import GridCell from "@/components/GridCell";

import styles from "./page.module.css";
import GridCellState from "@/app/models/GridCellState";

import { useEffect, useState } from "react";
import GuessEntryBox from "@/components/GuessEntryBox";
import Encounter from "./models/Encounter";

export default function HomePage() 
{
    const [encounters, setEncounters] = useState<Encounter[]>([]);
    const [guesses, setGuesses] = useState<Encounter[]>([]);
    const [rows, setRows] = useState([
        [
            GridCellState.Grey,
            GridCellState.Grey,
            GridCellState.Green,
            GridCellState.Grey,
            GridCellState.Yellow,
            GridCellState.Yellow,
        ],
        [null, null, null, null, null, null]
    ]);

    // Load Encounters
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

    function AddRow() 
    {
        setRows(prev => [...prev, [null, null, null, null, null, null]]);
    }

    function HandleGuessSubmit(guess: Encounter) 
    {
        setGuesses(prev => [...prev, guess]);
        alert(`You guessed: ${guess.name}`); // Placeholder for actual guess handling logic
    }

    return (
        <div className={styles.content}>
            <div>
                <h1>RaDdle</h1>
            </div>
            <div className={styles.guessEntryBoxWrapper}>
                <GuessEntryBox encounters={encounters} guesses={guesses} callback={HandleGuessSubmit} />
            </div>
            <div className={styles.gridTableWrapper}>
                <GridTable>
                    {rows.map((row, rowIndex) => (
                        <GridRow key={rowIndex}>
                            {row.map((cellState, cellIndex) => (
                                <GridCell key={cellIndex} state={cellState ?? undefined} />
                            ))}
                        </GridRow>
                    ))}
                </GridTable>
                <button onClick={AddRow}>Add Row</button>
            </div>
        </div>
    );
}
