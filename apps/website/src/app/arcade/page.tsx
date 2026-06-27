"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { GameMode, GameState, GridCellState } from "@raddle/types";
import type { Encounter, Game, Guess } from "@raddle/types";
import type { MakeGuessRequest } from "@raddle/types/requests";

import { GridTable, GridRow, GridCell, GuessEntryBox } from "@/components";

import styles from "./page.module.css";
import gridRowStyles from "@/components/GridRow.module.css";

type GuessPair = {
    encounter: Encounter;
    cellStates: GridCellState[];
    id?: number;
}

type ArcadeState = {
    gameId?: string;
}

type GameViewState = {
    guesses: Encounter[];
    guessPairs: GuessPair[];
    guessedCorrectly: boolean;
};

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

    const [gameId, setGameId] = useState<string | undefined>(initialArcadeState?.gameId);

    const [guesses, setGuesses] = useState<Encounter[]>([]);
    const [guessPairs, setGuessPairs] = useState<GuessPair[]>([]);
    const [shifting, setShifting] = useState(false);
    const [screenshotMode, setScreenshotMode] = useState(false);
    const [guessedCorrectly, setGuessedCorrectly] = useState(false);

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
        if (!gameId || encounters.length === 0)
        {
            return;
        }

        async function LoadGame(): Promise<void>
        {
            const response = await fetch(`/api/games/${gameId}`);

            if (!response.ok)
            {
                ResetGame();
                return;
            }

            const game = await response.json() as Game;
            applyGameState(game, encounters);
        }

        LoadGame().catch((error: unknown) =>
        {
            console.warn("Unable to load arcade game:", error);
            ResetGame();
        });
    }, [encounters, gameId]);

    useEffect(() =>
    {
        try
        {
            const state: ArcadeState = {
                gameId
            };
            window.localStorage.setItem(arcadeStorageKey, JSON.stringify(state));
        }
        catch (err)
        {
            console.warn("Unable to save arcade game state:", err);
        }
    }, [gameId, arcadeStorageKey]);

    function ResetGame()
    {
        window.localStorage.removeItem(arcadeStorageKey);
        setGuesses([]);
        setGuessPairs([]);
        setGuessedCorrectly(false);
        setGameId(undefined);
        setShifting(false);
    }

    function ToggleScreenshotMode() 
    {
        setScreenshotMode(prev => !prev);
    }

    async function HandleGuessSubmit(guess: Encounter) 
    {
        const response_body: MakeGuessRequest = {
            guessId: guess.id,
            gameMode: GameMode.arcade,
            gameId: gameId
        };
        
        const response = await fetch("/api/games/guess", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(response_body),
        });

        if (!response.ok)
        {
            const data = await response.json() as { error?: string };
            throw new Error(`Error submitting guess: ${data.error ?? response.statusText}`);
        }

        const game = await response.json() as Game;
        setGameId(game.id);
        applyGameState(game, encounters);
        setShifting(true);
        setTimeout(() => setShifting(false), 450);
    }

    function applyGameState(game: Game, encounterData: Encounter[])
    {
        const derivedState = getGameViewState(game, encounterData);
        setGuesses(derivedState.guesses);
        setGuessPairs(derivedState.guessPairs);
        setGuessedCorrectly(derivedState.guessedCorrectly);
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

function getGameViewState(game: Game, encounters: Encounter[]): GameViewState
{
    const encounterById = new Map(encounters.map((encounter) => [encounter.id, encounter]));
    const orderedGuesses = [...game.guesses].reverse();

    const guesses: Encounter[] = [];
    const guessPairs: GuessPair[] = [];

    orderedGuesses.forEach((guess, index) =>
    {
        const encounter = encounterById.get(guess.encounterId);

        if (!encounter)
        {
            return;
        }

        guesses.push(encounter);
        guessPairs.push({
            encounter,
            cellStates: getCellStates(guess),
            id: Date.parse(guess.createdAt as unknown as string) || index
        });
    });

    return {
        guesses,
        guessPairs,
        guessedCorrectly: game.gameState === GameState.complete,
    };
}

function getCellStates(guess: Guess): GridCellState[]
{
    return [
        guess.comparisonResult.name,
        guess.comparisonResult.activity_type,
        guess.comparisonResult.activity,
        guess.comparisonResult.enemy_types,
        guess.comparisonResult.encounters,
        guess.comparisonResult.expansion,
    ];
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
