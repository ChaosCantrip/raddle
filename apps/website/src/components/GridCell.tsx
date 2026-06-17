import { GridCellState } from "@raddle/types";

import styles from "./GridCell.module.css";

type GridCellProps = {
    state?: GridCellState;
    hideText?: boolean;
    children?: React.ReactNode;
}

export default function GridCell({ state = GridCellState.Empty, hideText = false, children }: GridCellProps)
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
        case GridCellState.Empty:
            return styles.empty;
        case GridCellState.Grey:
            return styles.grey;
        case GridCellState.Yellow:
            return styles.yellow;
        case GridCellState.Green:
            return styles.green;
    }
}
