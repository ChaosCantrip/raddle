import styles from "./GridCell.module.css";
import GridCellState from "./GridCellState";

export default function GridCell({ children, state = GridCellState.Empty }: { children?: React.ReactNode; state?: GridCellState })
{
    const colourStyle = getColourStyle(state);

    return (
        <div className={styles.gridCell + " " + colourStyle}>
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
