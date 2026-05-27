"use client";

import GridTable from "@/components/GridTable";
import GridRow from "@/components/GridRow";
import GridCell from "@/components/GridCell";

import styles from "./page.module.css";
import GridCellState from "@/app/models/GridCellState";

import { useEffect, useState } from "react";
import GuessEntryBox from "@/components/GuessEntryBox";
import Encounter from "./models/Encounter";

interface GuessPair {
    encounter: Encounter;
    cellStates: GridCellState[];
}

export default function HomePage() 
{
    const [encounters, setEncounters] = useState<Encounter[]>([]);
    const [guesses, setGuesses] = useState<Encounter[]>([]);
    const [guessPairs, setGuessPairs] = useState<GuessPair[]>([]);
    const [guessedCorrectly, setGuessedCorrectly] = useState(false);
    const [demoAnswer, setDemoAnswer] = useState<Encounter | null>(null);

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

    useEffect(() =>
    {
        async function LoadDemoAnswer() 
        {
            if (demoAnswer === null && encounters.length > 0)
            {
                const randomAnswer = encounters[Math.floor(Math.random() * encounters.length)];
                setDemoAnswer(randomAnswer);
            }
        }

        LoadDemoAnswer();
    }, [encounters, demoAnswer]);

    function ResetGame()
    {
        setGuesses([]);
        setGuessPairs([]);
        setGuessedCorrectly(false);
        setDemoAnswer(null);
    }

    async function HandleGuessSubmit(guess: Encounter) 
    {
        setGuesses(prev => [...prev, guess]);

        console.log("Demo Answer:", demoAnswer);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/guess_demo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ guess_id: guess.id, answer_id: demoAnswer!.id }),
        });
        const data = await response.json();

        if (!response.ok)         
        {
            console.error("Error submitting guess:", data.error || response.statusText);
            alert("Error submitting guess.");
            return;
        }

        if (data.result === "correct") 
        {
            HandleCorrectGuess(guess);
            return;
        }

        const cellStates: GridCellState[] = [
            data.comparisons.name,
            data.comparisons.activity_type,
            data.comparisons.activity,
            data.comparisons.enemy_types,
            data.comparisons.encounters,
            data.comparisons.expansion,
        ]
        
        setGuessPairs(prev => [...prev, { encounter: guess, cellStates: cellStates }]);
    }

    function HandleCorrectGuess(guess: Encounter) 
    {
        setGuessPairs(prev => [...prev, { encounter: guess, cellStates: [GridCellState.Green, GridCellState.Green, GridCellState.Green, GridCellState.Green, GridCellState.Green, GridCellState.Green] }]);
        setGuessedCorrectly(true);
    }

    return (
        <div className={styles.content}>
            <div>
                <h1>RaDdle</h1>
            </div>
            <div className={styles.guessEntryBoxWrapper} hidden={guessedCorrectly}>
                <GuessEntryBox encounters={encounters} guesses={guesses} callback={HandleGuessSubmit} />
            </div>
            <div className={styles.guessedCorrectlyMessage} hidden={!guessedCorrectly}>
                <h2>Congratulations! You guessed correctly in {guesses.length} guesses!</h2>
                <button onClick={ResetGame}>Play Again</button>
            </div>
            <div className={styles.gridTableWrapper}>
                <GridTable>
                    {guessPairs.map((pair, pairIndex) => (
                        <GridRow key={pairIndex}>
                            <GridCell state={pair.cellStates[0] ?? undefined}>{pair.encounter.name}</GridCell>
                            <GridCell state={pair.cellStates[1] ?? undefined}>{pair.encounter.activity_type}</GridCell>
                            <GridCell state={pair.cellStates[2] ?? undefined}>{pair.encounter.activity}</GridCell>
                            <GridCell state={pair.cellStates[3] ?? undefined}>{pair.encounter.enemy_types.join(", ")}</GridCell>
                            <GridCell state={pair.cellStates[4] ?? undefined}>{pair.encounter.encounters.join(", ")}</GridCell>
                            <GridCell state={pair.cellStates[5] ?? undefined}>{pair.encounter.expansion}</GridCell>
                        </GridRow>
                    ))}
                </GridTable>
            </div>
            <footer className={styles.footer}>
                <p className={styles.version_number}>RaDdle v{process.env.NEXT_PUBLIC_VERSION_NUMBER}</p>
            </footer>
        </div>
    );
}
