export const setupUncaughtExceptionHandler = () => 
{
    process.on("uncaughtException", (err) => 
    {
        console.error("There was an uncaught error", err);
        process.exit(1);
    });
}
