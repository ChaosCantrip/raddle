
const RESET_TIME_HOUR = 17; // 5 PM UTC

export function GetDate(): Date
{
    const now = new Date();

    if (now.getUTCHours() < RESET_TIME_HOUR) 
    {
        now.setUTCDate(now.getUTCDate() - 1);
    }

    return now;
}

export function GetDateString(): string
{
    const date = GetDate();
    return date.toISOString().split("T")[0];
}

export function GetNextResetTime(): Date
{
    const date = GetDate();
    date.setUTCDate(date.getUTCDate() + 1);
    date.setUTCHours(RESET_TIME_HOUR, 0, 0, 0);
    return date;
}

export function GetTimeUntilNextReset(): number
{
    const now = new Date();
    const nextReset = GetNextResetTime();
    return nextReset.getTime() - now.getTime();
}

export function TimeDeltaToString(delta: number): string
{
    const totalSeconds = Math.floor(delta / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let result = "";
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0) result += `${minutes}m `;
    result += `${seconds}s`;
    return result;
}

const BEGINNING_DATE = new Date("2026-06-02T00:00:00Z");

export function GetDaysSinceEpoch(): number
{
    const epoch = BEGINNING_DATE;
    const today = GetDate();
    const diff = today.getTime() - epoch.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}
