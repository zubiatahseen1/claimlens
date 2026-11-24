import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Same handlers as the browser, but for tests running in Node.
export const server = setupServer(...handlers);
