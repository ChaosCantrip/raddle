import GridTable from "@/components/GridTable";
import GridRow from "@/components/GridRow";
import GridCell from "@/components/GridCell";

import styles from "./page.module.css";
import GridCellState from "@/components/GridCellState";

export default function HomePage() 
{
    return (
        <div>
            <div>
                <h1>RaDdle</h1>
            </div>
            <div className={styles.gridTableWrapper}>
                <GridTable>
                    <GridRow>
                        <GridCell state={GridCellState.Grey}></GridCell>
                        <GridCell state={GridCellState.Grey}></GridCell>
                        <GridCell state={GridCellState.Green}></GridCell>
                        <GridCell state={GridCellState.Grey}></GridCell>
                        <GridCell state={GridCellState.Yellow}></GridCell>
                        <GridCell state={GridCellState.Yellow}></GridCell>
                    </GridRow>
                    <GridRow>
                        <GridCell></GridCell>
                        <GridCell></GridCell>
                        <GridCell></GridCell>
                        <GridCell></GridCell>
                        <GridCell></GridCell>
                        <GridCell></GridCell>
                    </GridRow>
                </GridTable>
            </div>
        </div>
    );
}
