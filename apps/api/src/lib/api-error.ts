import type { HttpStatus } from "@raddle/types";

export class APIError extends Error
{
    status: HttpStatus;

    constructor(message: string, status: HttpStatus)
    {
        super(message);
        this.status = status;
    }
}
