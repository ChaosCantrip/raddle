import express from "express";
import { router } from "./routes/index.js";
import cookieParser from "cookie-parser";
import { LogRequest } from "./middlewares/index.js";

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

    return app;
};
