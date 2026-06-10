import Encounters from "@/lib/Encounters";
import Encounter from "@/models/Encounter";
import clientPromise from "@/lib/MongoDB";
import GenerateRandomEncounter from "@/lib/GenerateRandomEncounter";

const DB_NAME = process.env.MONGODB_DB_NAME || "raddle";
const COLLECTION_NAME = "daily_answers";

export default async function GetDailyAnswer(): Promise<Encounter>
{
    const today = new Date().toISOString().split("T")[0];

    const client = await clientPromise;
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
