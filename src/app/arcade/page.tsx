"use client";

import GridTable from "@/components/GridTable";
import GridRow from "@/components/GridRow";
import gridRowStyles from "@/components/GridRow.module.css";
import GridCell from "@/components/GridCell";

import styles from "./page.module.css";
import GridCellState from "@/models/GridCellState";

import { useEffect, useMemo, useState } from "react";
import GuessEntryBox from "@/components/GuessEntryBox";
import Encounter from "@/models/Encounter";
import type ArcadeGuessRequest from "@/models/ArcadeGuessRequest";
import type { ErrorResult, NonErrorResult } from "@/models/GuessResponse";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface GuessPair {
    encounter: Encounter;
    cellStates: GridCellState[];
    id?: number;
}

interface ArcadeState {
    answer: Encounter | null;
    guesses: Encounter[];
    guessPairs: GuessPair[];
    guessedCorrectly: boolean;
}

export default function HomePage() 
{
    const [encounters, setEncounters] = useState<Encounter[]>([]);
    const arcadeStorageKey = "raddle-arcade-state";
    const initialArcadeState = useMemo<ArcadeState | null>(() => 
    {
        if (typeof window === "undefined") return null;

        try
        {
            const raw = window.localStorage.getItem(arcadeStorageKey);
            return raw ? JSON.parse(raw) as ArcadeState : null;
        }
        catch
        {
            return null;
        }
    }, [arcadeStorageKey]);

    const [guesses, setGuesses] = useState<Encounter[]>(initialArcadeState?.guesses ?? []);
    const [guessPairs, setGuessPairs] = useState<GuessPair[]>(initialArcadeState?.guessPairs ?? []);
    const [shifting, setShifting] = useState(false);
    const [screenshotMode, setScreenshotMode] = useState(false);
    const [guessedCorrectly, setGuessedCorrectly] = useState(initialArcadeState?.guessedCorrectly ?? false);
    const [answer, setAnswer] = useState<Encounter | null>(initialArcadeState?.answer ?? null);

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
                throw new Error("Failed to load encounters.", { cause: err });
            }
        }

        LoadEncounters();
    }, []);

    useEffect(() =>
    {
        try
        {
            const state: ArcadeState = {
                answer,
                guesses,
                guessPairs,
                guessedCorrectly,
            };
            window.localStorage.setItem(arcadeStorageKey, JSON.stringify(state));
        }
        catch (err)
        {
            console.warn("Unable to save arcade game state:", err);
        }
    }, [answer, guesses, guessPairs, guessedCorrectly, arcadeStorageKey]);

    useEffect(() =>
    {
        async function LoadAnswer() 
        {
            if (answer === null && encounters.length > 0)
            {
                const randomAnswer = encounters[Math.floor(Math.random() * encounters.length)];
                setAnswer(randomAnswer);
            }
        }

        LoadAnswer();
    }, [encounters, answer]);

    function ResetGame()
    {
        window.localStorage.removeItem(arcadeStorageKey);
        setGuesses([]);
        setGuessPairs([]);
        setGuessedCorrectly(false);
        setAnswer(null);
    }

    function ToggleScreenshotMode() 
    {
        setScreenshotMode(prev => !prev);
    }

    async function HandleGuessSubmit(guess: Encounter) 
    {
        setGuesses(prev => [guess, ...prev]);
        setShifting(true);

        const response_body: ArcadeGuessRequest = {
            guess_id: guess.id,
            answer_id: answer!.id,
        };
        
        const response = await fetch("/api/guess/arcade", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(response_body),
        });

        if (!response.ok)         
        {
            const data = await response.json() as ErrorResult;
            throw new Error(`Error submitting guess: ${data.error}`);
        }

        const data = await response.json() as NonErrorResult;

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
                <CongratulationsBox guessCount={guesses.length} onReset={ResetGame} onToggleScreenshotMode={ToggleScreenshotMode} screenshotMode={screenshotMode} />
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
                            <GridCell state={pair.cellStates[0] ?? undefined} hideText={screenshotMode}>{pair.encounter.name}</GridCell>
                            <GridCell state={pair.cellStates[1] ?? undefined} hideText={screenshotMode}>{pair.encounter.activity_type}</GridCell>
                            <GridCell state={pair.cellStates[2] ?? undefined} hideText={screenshotMode}>{pair.encounter.activity}</GridCell>
                            <GridCell state={pair.cellStates[3] ?? undefined} hideText={screenshotMode}>{pair.encounter.enemy_types.join(", ")}</GridCell>
                            <GridCell state={pair.cellStates[4] ?? undefined} hideText={screenshotMode}>{pair.encounter.encounters.join(", ")}</GridCell>
                            <GridCell state={pair.cellStates[5] ?? undefined} hideText={screenshotMode}>{pair.encounter.expansion}</GridCell>
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
            <p className={styles.mainText}>Arcade Mode</p>
            <p className={styles.mainText}>Guess the Raid or Dungeon Encounter!</p>
            <p className={styles.subText}>Type any Encounter Name to start...</p>
        </div>
    );
}

function CongratulationsBox({ guessCount, onReset, onToggleScreenshotMode, screenshotMode }: { guessCount: number, onReset: () => void, onToggleScreenshotMode: () => void, screenshotMode: boolean }) 
{
    return (
        <div className={styles.mainTextBox}>
            <p className={styles.mainText}>Congratulations!</p>
            <p className={styles.subText}>You guessed the Encounter in {guessCount} guesses!</p>
            <div className={styles.buttons_container}>
                <button className={styles.button + " " + styles.resetButton} onClick={onReset}>
                    <PlayAgainIcon /> Play Again
                </button>
                <button className={styles.button + " " + styles.shareButton} onClick={onToggleScreenshotMode} aria-pressed={screenshotMode}>
                    {screenshotMode ? <ShowTextIcon /> : <HideTextIcon />} {screenshotMode ? "Show Text" : "Hide Text"}
                </button>
            </div>
        </div>
    )
}

function HideTextIcon()
{
    return <FontAwesomeIcon icon={faEyeSlash} className={styles.icon + " " + styles.shareIcon} />
}

function ShowTextIcon()
{
    return <FontAwesomeIcon icon={faEye} className={styles.icon + " " + styles.shareIcon} />
}

function PlayAgainIcon()
{
    return <FontAwesomeIcon icon={faArrowRotateLeft} className={styles.icon + " " + styles.playAgainIcon} />
}
