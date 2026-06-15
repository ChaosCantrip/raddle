"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

import Popup from "@/components/Popup";
import GuessPair from "@/models/GuessPair";
import GridCellState from "@/models/GridCellState";
import Toast from "@/components/Toast";

import styles from "./SharePopup.module.css";

type SharePopupProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    guessPairs: GuessPair[];
}

export default function SharePopup({ open, setOpen, guessPairs }: SharePopupProps)
{
    const [text, setText] = useState("");
    const [toast, setToast] = useState<{ id: number, message: string } | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => 
    {
        function updateText()
        {
            const lines: string[] = [];
            const numGuesses: number = guessPairs.length;
        
            lines.push(`I just completed today's RaDdle in ${numGuesses} guess${numGuesses > 1 ? "es" : ""}!`)
            lines.push("");

            guessPairs.forEach((guessPair) => 
            {
                const cellStateEmojis: string[] = [];
                guessPair.cellStates.forEach((cellState) => 
                {
                    if (cellState == GridCellState.Green) 
                    {
                        cellStateEmojis.push("🟩")
                    }
                    else if (cellState == GridCellState.Yellow) 
                    {
                        cellStateEmojis.push("🟨")
                    }
                    else 
                    {
                        cellStateEmojis.push("⬛")
                    }
                })
                lines.push(cellStateEmojis.join(""));
            })

            setText(lines.join("\n"));
        }

        updateText();

    }, [guessPairs])

    function handleCopy() 
    {
        navigator.clipboard.writeText(text);
        setToast({ id: Date.now(), message: "Copied to Clipboard!" });
        setCopied(true);
    }

    function handleClose() 
    {
        setCopied(false);
        setOpen(false);
    }

    return (
        <>
            <Popup open={open} onClose={handleClose}>
                <div className={styles.popup}>
                    <h1 className={styles.title}>Share Results</h1>
                    <div className={styles.copy_box} onClick={handleCopy}>
                        {text}
                    </div>
                    <div className={styles.buttons}>
                        <div className={styles.spacer} />
                        <button className={styles.copy_button + (copied ? " " + styles.copied : "")} onClick={handleCopy}>
                            <CopyIcon /> {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>
            </Popup>
            {
                toast && <Toast key={toast.id} message={toast.message} onClose={() => setToast(null)} />
            }
        </>
    )
}

function CopyIcon() 
{
    return <FontAwesomeIcon icon={faCopy} className={styles.button_icon} />
}
