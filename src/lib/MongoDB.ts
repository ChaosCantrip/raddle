import { MongoClient } from "mongodb";

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

let client;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) 
{
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
}

// eslint-disable-next-line prefer-const
clientPromise = global._mongoClientPromise;

export default clientPromise;
