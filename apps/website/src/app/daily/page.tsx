"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faEye, faEyeSlash, faShare } from "@fortawesome/free-solid-svg-icons";

import { GridTable, GridRow, GridCell, GuessEntryBox } from "@/components";

import { GridCellState } from "@raddle/types";
import type { Encounter, ErrorResult, NonErrorResult, DailyGuessRequest, GuessPair } from "@raddle/types";

import { getDateString, getDaysSinceBeginning, getTimeUntilNextReset, timeDeltaToString } from "@raddle/common/date";
import { Utils } from "@/lib";

import SharePopup from "./SharePopup";

import styles from "./page.module.css";
import gridRowStyles from "@/components/GridRow.module.css";

interface DailyState {
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

    const [guesses, setGuesses] = useState<Encounter[]>(initialDailyState?.guesses ?? []);
    const [guessPairs, setGuessPairs] = useState<GuessPair[]>(initialDailyState?.guessPairs ?? []);
    const [shifting, setShifting] = useState(false);
    const [screenshotMode, setScreenshotMode] = useState(false);
    const [guessedCorrectly, setGuessedCorrectly] = useState(initialDailyState?.guessedCorrectly ?? false);
    const [demoAnswer, setDemoAnswer] = useState<Encounter | null>(null);
    const [place, setPlace] = useState<number | null>(initialDailyState?.place ?? null);
    const [timeUntilReset, setTimeUntilReset] = useState<string>("");
    const [sharePopupOpen, setSharePopupOpen] = useState<boolean>(false);

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
        try
        {
            const state: DailyState = {
                guesses,
                guessPairs,
                guessedCorrectly,
                place,
            };
            window.localStorage.setItem(dailyStorageKey, JSON.stringify(state));
        }
        catch (err)
        {
            console.warn("Unable to save daily game state:", err);
        }
    }, [guesses, guessPairs, guessedCorrectly, place, dailyStorageKey]);

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
            setPlace(data.place!);
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
            <SharePopup open={sharePopupOpen} setOpen={setSharePopupOpen} guessPairs={guessPairs} />
        </div>
    );
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
            <p className={styles.subText}>You were the {place}{Utils.GetOrdinalSuffix(place!)} person to guess correctly today!</p>
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
