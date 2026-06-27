"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faEye, faEyeSlash, faShare } from "@fortawesome/free-solid-svg-icons";

import { GameMode, GameState } from "@raddle/types";
import type { Encounter, Game, GridCellState, Guess, GuessPair } from "@raddle/types";
import { getDateString, getDaysSinceBeginning, getTimeUntilNextReset, timeDeltaToString } from "@raddle/common/date";
import type { MakeGuessRequest } from "@raddle/types/requests";

import { GuessEntryBox, GuessGridTable } from "@/components";
import { utils } from "@/lib";

import SharePopup from "./SharePopup";

import styles from "./page.module.css";

interface DailyState {
    gameId?: string;
}

type DailyViewState = {
    guesses: Encounter[];
    guessPairs: GuessPair[];
    guessedCorrectly: boolean;
    place: number | null;
}

export default function HomePage() 
{
    const [encounters, setEncounters] = useState<Encounter[]>([]);
    const dailyStorageKey = `raddle-daily-state-${getDateString()}`;
    const initialDailyState = useMemo<DailyState | null>(() => 
    {
        if (typeof window === "undefined") return null;

        try
        {
            const raw = window.localStorage.getItem(dailyStorageKey);
            return raw ? JSON.parse(raw) as DailyState : null;
        }
        catch
        {
            return null;
        }
    }, [dailyStorageKey]);

    const [gameId, setGameId] = useState<string | undefined>(initialDailyState?.gameId);
    const [guesses, setGuesses] = useState<Encounter[]>([]);
    const [guessPairs, setGuessPairs] = useState<GuessPair[]>([]);
    const [shifting, setShifting] = useState(false);
    const [screenshotMode, setScreenshotMode] = useState(false);
    const [guessedCorrectly, setGuessedCorrectly] = useState(false);
    const [place, setPlace] = useState<number | null>(null);
    const [timeUntilReset, setTimeUntilReset] = useState<string>("");
    const [sharePopupOpen, setSharePopupOpen] = useState<boolean>(false);

    const applyGameState = useCallback((game: Game, encounterData: Encounter[]) =>
    {
        const derivedState = getDailyViewState(game, encounterData);
        setGuesses(derivedState.guesses);
        setGuessPairs(derivedState.guessPairs);
        setGuessedCorrectly(derivedState.guessedCorrectly);
        setPlace(derivedState.place);
    }, []);

    const resetDailyState = useCallback(() =>
    {
        window.localStorage.removeItem(dailyStorageKey);
        setGameId(undefined);
        setGuesses([]);
        setGuessPairs([]);
        setGuessedCorrectly(false);
        setPlace(null);
        setShifting(false);
    }, [dailyStorageKey]);

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
        if (!gameId || encounters.length === 0)
        {
            return;
        }

        async function LoadGame(): Promise<void>
        {
            const response = await fetch(`/api/games/${gameId}`);

            if (!response.ok)
            {
                resetDailyState();
                return;
            }

            const game = await response.json() as Game;
            applyGameState(game, encounters);
        }

        LoadGame().catch((error: unknown) =>
        {
            console.warn("Unable to load daily game:", error);
            resetDailyState();
        });
    }, [applyGameState, encounters, gameId, resetDailyState]);

    useEffect(() =>
    {
        try
        {
            const state: DailyState = {
                gameId,
            };
            window.localStorage.setItem(dailyStorageKey, JSON.stringify(state));
        }
        catch (err)
        {
            console.warn("Unable to save daily game state:", err);
        }
    }, [gameId, dailyStorageKey]);

    useEffect(() =>
    {
        function UpdateTimeUntilReset()
        {
            const delta = getTimeUntilNextReset();
            setTimeUntilReset(timeDeltaToString(delta));
        }

        UpdateTimeUntilReset();
        const interval = setInterval(UpdateTimeUntilReset, 1000);

        return () => clearInterval(interval);
    }, []);

    async function HandleGuessSubmit(guess: Encounter) 
    {
        const response_body: MakeGuessRequest = {
            guessId: guess.id,
            gameMode: GameMode.daily,
            gameId,
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
            console.error("Error submitting guess:", data.error || response.statusText);
            alert("Error submitting guess.");
            return;
        }

        const game = await response.json() as Game;
        setGameId(game.id);
        applyGameState(game, encounters);
        setShifting(true);
        setTimeout(() => setShifting(false), 450);
    }

    function ToggleScreenshotMode() 
    {
        setScreenshotMode(prev => !prev);
    }

    function handleOpenSharePopup() 
    {
        setSharePopupOpen(true);
    }

    return (
        <div className={styles.content}>
            {guessedCorrectly ? (
                <CongratulationsBox guessCount={guesses.length} place={place} timeUntilReset={timeUntilReset} onToggleScreenshotMode={ToggleScreenshotMode} screenshotMode={screenshotMode} handleOpenSharePopup={handleOpenSharePopup} />
            ) : (
                <MainTextBox timeUntilReset={timeUntilReset} />
            )}
            <div className={styles.guessEntryBoxWrapper} hidden={guessedCorrectly}>
                <GuessEntryBox encounters={encounters} guesses={guesses} callback={HandleGuessSubmit} />
            </div>
            <div className={styles.gridTableWrapper}>
                <GuessGridTable guessPairs={guessPairs} screenshotMode={screenshotMode} shifting={shifting} noGuessesClassName={styles.noGuessesMessage} />
            </div>
            <SharePopup open={sharePopupOpen} setOpen={setSharePopupOpen} guessPairs={guessPairs} />
        </div>
    );
}

function getDailyViewState(game: Game, encounters: Encounter[]): DailyViewState
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

    const guessedCorrectly = game.gameState === GameState.complete;

    return {
        guesses,
        guessPairs,
        guessedCorrectly,
        place: guessedCorrectly ? getCompletionPosition(game) : null,
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

function getCompletionPosition(game: Game): number | null
{
    if (!("completionDetails" in game))
    {
        return null;
    }

    if (typeof game.completionDetails !== "object" || game.completionDetails === null)
    {
        return null;
    }

    const details = game.completionDetails as { position?: unknown };
    return typeof details.position === "number" ? details.position : null;
}

function MainTextBox({ timeUntilReset }: { timeUntilReset: string }) 
{
    return (
        <div className={styles.mainTextBox}>
            <p className={styles.mainText}>Guess today&apos;s Raid or Dungeon Encounter!</p>
            <p className={styles.subText}>RaDdle #{getDaysSinceBeginning()} ({getDateString()})</p>
            <p className={styles.timerText}>Time left to complete today&apos;s RaDdle: {timeUntilReset || "--:--:--"}</p>
            <p className={styles.subText}>Type any Encounter Name to start...</p>
        </div>
    );
}

type CongratulationsBoxProps = {
    guessCount: number;
    place: number | null;
    timeUntilReset: string;
    onToggleScreenshotMode: () => void;
    screenshotMode: boolean;
    handleOpenSharePopup: () => void;
}

function CongratulationsBox({ guessCount, place, timeUntilReset, onToggleScreenshotMode, screenshotMode, handleOpenSharePopup }: CongratulationsBoxProps) 
{
    return (
        <div className={styles.mainTextBox}>
            <p className={styles.mainText}>Congratulations!</p>
            <p className={styles.subText}>You guessed the Encounter in {guessCount} guess{guessCount !== 1 ? "es" : ""}!</p>
            <p className={styles.subText}>You were the {place}{utils.GetOrdinalSuffix(place!)} person to guess correctly today!</p>
            <p className={styles.subText}>Check back in {timeUntilReset} for tomorrow&apos;s Encounter!</p>
            <div className={styles.buttons_container}>
                <Link className={styles.button + " " + styles.arcadeLink} href="/arcade">
                Arcade Mode <CaretRightIcon />
                </Link>
                <button className={styles.button + " " + styles.shareButton} onClick={onToggleScreenshotMode} aria-pressed={screenshotMode}>
                    {screenshotMode ? <ShowTextIcon /> : <HideTextIcon />} {screenshotMode ? "Show Text" : "Hide Text"}
                </button>
                <button className={styles.button + " " + styles.shareButton} onClick={handleOpenSharePopup}>
                    <ShareIcon /> Share
                </button>
            </div>
        </div>
    )
}

function CaretRightIcon()
{
    return <FontAwesomeIcon icon={faCaretRight} className={styles.caretIcon} />;
}

function HideTextIcon()
{
    return <FontAwesomeIcon icon={faEyeSlash} className={styles.icon + " " + styles.shareIcon} />
}

function ShowTextIcon()
{
    return <FontAwesomeIcon icon={faEye} className={styles.icon + " " + styles.shareIcon} />
}

function ShareIcon() 
{
    return <FontAwesomeIcon icon={faShare} className={styles.icon + " " + styles.shareIcon} />
}
