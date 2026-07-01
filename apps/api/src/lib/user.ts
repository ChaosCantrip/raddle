import { getMongoClient } from "./mongodb.js";

const DB_NAME = process.env.MONGODB_DB_NAME || "raddle";
const COLLECTION_NAME = "users";

type UpsertUserParams = {
    membershipId: string;
    displayName: string;
};

export async function upsertUser({ membershipId, displayName }: UpsertUserParams): Promise<void>
{
    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const now = new Date();

    await collection.findOneAndUpdate(
        { membershipId },
        {
            $set: {
                displayName,
                updatedAt: now,
            },
            $setOnInsert: {
                membershipId,
                createdAt: now,
            },
        },
        {
            upsert: true,
        }
    );
}
