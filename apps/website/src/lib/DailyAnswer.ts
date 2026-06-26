import { GenerateRandomEncounter } from "@/lib";
import { Encounters } from "@raddle/common";

import type { Encounter } from "@raddle/types";
import { getDateString } from "@raddle/common/date";
import getMongoClient from "./MongoDB";

const DB_NAME = process.env.MONGODB_DB_NAME || "raddle";
const COLLECTION_NAME = "daily_answers";

export default async function GetDailyAnswer(): Promise<Encounter>
{
    const today = getDateString();

    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.findOneAndUpdate(
        { date: today },
        { $setOnInsert: { date: today, answer_id: GenerateRandomEncounter().id } },
        { upsert: true, returnDocument: "after" }
    );

    const encounter = Encounters.find(encounter => encounter.id === result!.answer_id);
    return encounter!;
}
