import styles from "./GridCell.module.css";
import GridCellState from "../models/GridCellState";

export default function GridCell({ children, state = GridCellState.Empty, hideText = false }: { children?: React.ReactNode; state?: GridCellState; hideText?: boolean })
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
