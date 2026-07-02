import { GridCellState } from "@raddle/types";

import styles from "./GridCell.module.css";

type GridCellProps = {
    state?: GridCellState;
    hideText?: boolean;
    children?: React.ReactNode;
}

export default function GridCell({ state = GridCellState.empty, hideText = false, children }: GridCellProps)
{
    const colourStyle = getColourStyle(state);

    return (
        <div className={styles.gridCell + " " + colourStyle + (hideText ? " " + styles.textHidden : "")}>
            {children}
        </div>
    );
}

function getColourStyle(state: GridCellState) 
{
    switch (state) 
    {
        case GridCellState.empty:
            return styles.empty;
        case GridCellState.grey:
            return styles.grey;
        case GridCellState.yellow:
            return styles.yellow;
        case GridCellState.green:
            return styles.green;
    }
}
