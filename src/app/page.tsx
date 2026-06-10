"use client";

import GridTable from "@/components/GridTable";
import GridRow from "@/components/GridRow";
import GridCell from "@/components/GridCell";

import styles from "./page.module.css";
import GridCellState from "@/components/GridCellState";

import { useState } from "react";

export default function HomePage() 
{
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

    function AddRow() 
    {
        setRows(prev => [...prev, [null, null, null, null, null, null]]);
    }

    return (
        <div className={styles.content}>
            <div>
                <h1>RaDdle</h1>
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
