import { GridCellState } from "@raddle/types";
import type { GuessPair } from "@raddle/types";

import GridCell from "./GridCell";
import GridRow from "./GridRow";
import GridTable from "./GridTable";

import gridRowStyles from "./GridRow.module.css";

type GuessGridTableProps = {
    guessPairs: GuessPair[];
    screenshotMode: boolean;
    shifting: boolean;
    noGuessesClassName?: string;
};

export default function GuessGridTable({ guessPairs, screenshotMode, shifting, noGuessesClassName }: GuessGridTableProps)
{
    return (
        <GridTable>
            {
                guessPairs.length === 0 &&
                <div className={noGuessesClassName}>
                    <GridRow>
                        <GridCell state={GridCellState.empty} />
                        <GridCell state={GridCellState.empty} />
                        <GridCell state={GridCellState.empty} />
                        <GridCell state={GridCellState.empty} />
                        <GridCell state={GridCellState.empty} />
                        <GridCell state={GridCellState.empty} />
                    </GridRow>
                </div>
            }
            {guessPairs.map((pair, pairIndex) => (
                <GridRow key={pair.id ?? pairIndex} className={shifting && pairIndex > 0 ? gridRowStyles.shiftDown : undefined}>
                    <GridCell state={pair.cellStates[0] ?? undefined} hideText={screenshotMode}>{pair.encounter.name}</GridCell>
                    <GridCell state={pair.cellStates[1] ?? undefined} hideText={screenshotMode}>{pair.encounter.activityType}</GridCell>
                    <GridCell state={pair.cellStates[2] ?? undefined} hideText={screenshotMode}>{pair.encounter.activity}</GridCell>
                    <GridCell state={pair.cellStates[3] ?? undefined} hideText={screenshotMode}>{pair.encounter.enemyTypes.join(", ")}</GridCell>
                    <GridCell state={pair.cellStates[4] ?? undefined} hideText={screenshotMode}>{pair.encounter.encounters.join(", ")}</GridCell>
                    <GridCell state={pair.cellStates[5] ?? undefined} hideText={screenshotMode}>{pair.encounter.expansion}</GridCell>
                </GridRow>
            ))}
        </GridTable>
    );
}
