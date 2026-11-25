import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");

  // 'bypass': let requests we don't mock (fonts, the PDF) go to the network quietly.

  return worker.start({ onUnhandledFrame: "bypass" });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
