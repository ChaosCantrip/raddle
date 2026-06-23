import express from "express";
import { router } from "./routes/index.js";
import cookieParser from "cookie-parser";
import { LogRequest } from "./middlewares/index.js";
import { handleMalformedJSON, handleNotFound, handleUncaughtErrors } from "./error-handlers/index.js";

export const createApp = () => 
{
    const app = express();

    // Standard middleware
    app.use(express.json());
    app.use(cookieParser());

    // Custom middleware
    app.use(LogRequest);

    // Routes
    app.use("/api", router);

    // Error Handlers
    app.use(handleNotFound);
    app.use(handleMalformedJSON);
    app.use(handleUncaughtErrors);

    return app;
};
