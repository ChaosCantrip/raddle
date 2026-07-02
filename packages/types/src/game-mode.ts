export const GameMode = {
    daily: "daily",
    arcade: "arcade"
} as const;

export type GameMode = (typeof GameMode)[keyof typeof GameMode];
