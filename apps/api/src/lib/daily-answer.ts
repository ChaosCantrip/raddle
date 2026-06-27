import { Encounters } from "@raddle/common";
import type { Encounter } from "@raddle/types";
import { getDateString } from "@raddle/common/date";

import { generateRandomEncounter } from "./generate-random-encounter.js";
import { getMongoClient } from "./mongodb.js";

const DB_NAME = process.env.MONGODB_DB_NAME || "raddle";
const COLLECTION_NAME = "daily_answers";

type DailyAnswer = {
    date: string;
    answer: Encounter;
}

let dailyAnswer: DailyAnswer | null = null;

export async function getDailyAnswer(): Promise<Encounter>
{
    const today = getDateString();

    if (dailyAnswer && dailyAnswer.date === today) 
    {
        return dailyAnswer.answer;
    }

    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.findOneAndUpdate(
        { date: today },
        { $setOnInsert: { date: today, answer_id: generateRandomEncounter().id } },
        { upsert: true, returnDocument: "after" }
    );

    const encounter = Encounters.find(encounter => encounter.id === result!.answer_id);

    dailyAnswer = {
        date: today,
        answer: encounter!
    };

    return encounter!;
}
