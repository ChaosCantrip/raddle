import { MongoClient } from "mongodb";

let clientPromise: Promise<MongoClient>;

export async function getMongoClient(): Promise<MongoClient> 
{
    if (!clientPromise) 
    {
        const MONGODB = {
            USER: process.env.MONGODB_USER,
            PASS: process.env.MONGODB_PASS,
            HOST: process.env.MONGODB_HOST,
            PORT: process.env.MONGODB_PORT
        }

        if (!MONGODB.USER || !MONGODB.PASS || !MONGODB.HOST || !MONGODB.PORT) 
        {
            throw new Error("Invalid MONGODB Environment Variables!");
        }

        const uri = `mongodb://${MONGODB.USER}:${MONGODB.PASS}@${MONGODB.HOST}:${MONGODB.PORT}/`

        const options = {};

        const client = new MongoClient(uri, options);
        clientPromise = client.connect();
    }

    return clientPromise;
}
