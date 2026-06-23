import { setupUncaughtExceptionHandler } from "./handle-uncaught-exceptions.js";
import { setupUnhandledRejectionHandler } from "./handle-unhandled-rejections.js";

export * from "./handle-uncaught-exceptions.js";
export * from "./handle-unhandled-rejections.js";

export function setupProcessErrorHandlers()
{
    setupUncaughtExceptionHandler();
    setupUnhandledRejectionHandler();
}
