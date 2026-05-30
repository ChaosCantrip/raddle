"use client";

import GridTable from "@/components/GridTable";
import GridRow from "@/components/GridRow";
import gridRowStyles from "@/components/GridRow.module.css";
import GridCell from "@/components/GridCell";

import styles from "./page.module.css";
import GridCellState from "@/models/GridCellState";

import { useEffect, useState } from "react";
import GuessEntryBox from "@/components/GuessEntryBox";
import Encounter from "@/models/Encounter";
import type { ErrorResult, NonErrorResult } from "@/models/GuessResponse";
import DailyGuessRequest from "@/models/DailyGuessRequest";

interface GuessPair {
    encounter: Encounter;
    cellStates: GridCellState[];
    id?: number;
}

export default function HomePage() 
{
    const [encounters, setEncounters] = useState<Encounter[]>([]);
    const [guesses, setGuesses] = useState<Encounter[]>([]);
    const [guessPairs, setGuessPairs] = useState<GuessPair[]>([]);
    const [shifting, setShifting] = useState(false);
    const [guessedCorrectly, setGuessedCorrectly] = useState(false);
    const [demoAnswer, setDemoAnswer] = useState<Encounter | null>(null);
    const [place, setPlace] = useState<number | null>(null);

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
        setGuesses(prev => [guess, ...prev]);
        setShifting(true);

        const response_body: DailyGuessRequest = {
            guess_id: guess.id,
        };

        const response = await fetch("/api/guess/daily", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(response_body),
        });

        if (!response.ok)         
        {
            const data = await response.json() as ErrorResult;
            console.error("Error submitting guess:", data.error || response.statusText);
            alert("Error submitting guess.");
            return;
        }

        const data = await response.json() as NonErrorResult;

        if (data.result === "correct") 
        {
            setPlace(data.place);
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
        
        setGuessPairs(prev => [{ encounter: guess, cellStates: cellStates, id: Date.now() }, ...prev]);
        setTimeout(() => setShifting(false), 450);
    }

    function HandleCorrectGuess(guess: Encounter) 
    {
        setGuessPairs(prev => [{ encounter: guess, cellStates: [GridCellState.Green, GridCellState.Green, GridCellState.Green, GridCellState.Green, GridCellState.Green, GridCellState.Green], id: Date.now() }, ...prev]);
        setShifting(true);
        setTimeout(() => setShifting(false), 450);
        setGuessedCorrectly(true);
    }

    return (
        <div className={styles.content}>
            {guessedCorrectly ? (
                <CongratulationsBox guessCount={guesses.length} onReset={ResetGame} place={place} />
            ) : (
                <MainTextBox />
            )}
            <div className={styles.guessEntryBoxWrapper} hidden={guessedCorrectly}>
                <GuessEntryBox encounters={encounters} guesses={guesses} callback={HandleGuessSubmit} />
            </div>
            <div className={styles.gridTableWrapper}>
                <GridTable>
                    {
                        guessPairs.length === 0 &&
                        <div className={styles.noGuessesMessage}>
                            <GridRow>
                                <GridCell state={GridCellState.Empty} />
                                <GridCell state={GridCellState.Empty} />
                                <GridCell state={GridCellState.Empty} />
                                <GridCell state={GridCellState.Empty} />
                                <GridCell state={GridCellState.Empty} />
                                <GridCell state={GridCellState.Empty} />
                            </GridRow>
                        </div>
                    }
                    {guessPairs.map((pair, pairIndex) => (
                        <GridRow key={pair.id ?? pairIndex} className={shifting && pairIndex > 0 ? gridRowStyles.shiftDown : undefined}>
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
        </div>
    );
}

function MainTextBox() 
{
    return (
        <div className={styles.mainTextBox}>
            <p className={styles.mainText}>Guess today&apos;s Raid or Dungeon Encounter!</p>
            <p className={styles.subText}>Type any Encounter Name to start...</p>
        </div>
    );
}

function CongratulationsBox({ guessCount, place, onReset }: { guessCount: number, place: number | null, onReset: () => void }) 
{
    return (
        <div className={styles.mainTextBox}>
            <p className={styles.mainText}>Congratulations!</p>
            <p className={styles.subText}>You guessed the Encounter in {guessCount} guess{guessCount !== 1 ? "es" : ""}!</p>
            {place !== null && (
                <p className={styles.subText}>You were the {place}{GetOrdinalSuffix(place)} person to guess correctly today!</p>
            )}
            <button className={styles.resetButton} onClick={onReset}>
                Play Again
            </button>
        </div>
    )
}

function GetOrdinalSuffix(n: number): string
{
    const j = n % 10, k = n % 100;
    if (j === 1 && k !== 11) 
    {
        return "st";
    }
    if (j === 2 && k !== 12) 
    {
        return "nd";
    }
    if (j === 3 && k !== 13) 
    {
        return "rd";
    }
    return "th";
}
