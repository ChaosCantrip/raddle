import { Encounters, GenerateRandomEncounter } from "@/lib";

import { Encounter } from "@raddle/types";
import { GetDateString } from "./Date";
import getMongoClient from "./MongoDB";

const DB_NAME = process.env.MONGODB_DB_NAME || "raddle";
const COLLECTION_NAME = "daily_answers";

export default async function GetDailyAnswer(): Promise<Encounter>
{
    const today = GetDateString();

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
