export const GameState = {
    complete: "complete",
    incomplete: "incomplete",
    abandoned: "abandoned",
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];
