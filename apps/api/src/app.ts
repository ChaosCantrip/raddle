import express from "express";
import { router } from "./routes/index.js";
import cookieParser from "cookie-parser";

export const createApp = () => 
{
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use("/api", router);

    return app;
};
