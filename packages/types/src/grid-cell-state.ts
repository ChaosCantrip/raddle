export const GridCellState = {
    empty: "empty",
    grey: "grey",
    yellow: "yellow",
    green: "green",
} as const;

export type GridCellState = (typeof GridCellState)[keyof typeof GridCellState];
