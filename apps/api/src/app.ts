import express from "express";
import { setupRootRouter } from "./routes/index.js";
import cookieParser from "cookie-parser";
import { logRequest } from "./middlewares/index.js";
import { handleMalformedJSON, handleNotFound, handleUncaughtErrors } from "./error-handlers/index.js";

export const createApp = () => 
{
    const app = express();

    // Standard middleware
    app.use(express.json());
    app.use(cookieParser());

    // Custom middleware
    app.use(logRequest);

    // Routes
    const rootRouter = express.Router();

    setupRootRouter(rootRouter);

    app.use("/", rootRouter);

    // Error Handlers
    app.use(handleNotFound);
    app.use(handleMalformedJSON);
    app.use(handleUncaughtErrors);

    return app;
};
