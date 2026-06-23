import { setupProcessErrorHandlers } from "./process-error-handlers/index.js";
setupProcessErrorHandlers();

import { createApp } from "./app.js";

const app = createApp();

const port = process.env.PORT ?? 3000;

app.listen(port, () => 
{
    console.log(`Server running on http://localhost:${port}`);
});
