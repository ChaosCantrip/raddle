import type { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    membershipId: string;
    displayName: string;
    createdAt: Date;
    updatedAt: Date;
}
