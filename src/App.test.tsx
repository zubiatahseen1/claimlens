import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import App from "./App";
import { server } from "./mocks/server";

// Waits for the case to finish loading.
async function renderApp() {
  render(<App />);
  await screen.findByRole("heading", { name: "Jordan Reyes" });
}

describe("App", () => {
  it("shows a loading message, then the case", async () => {
    render(<App />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading case…");
    expect(
      await screen.findByRole("heading", { name: "Jordan Reyes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Showing 10 of 10 events")).toBeInTheDocument();
  });

  it("shows an error and recovers when the user retries", async () => {
    server.use(
      http.get(
        "/api/events",
        () => HttpResponse.json({ message: "Server down" }, { status: 500 }),
        {
          once: true,
        },
      ),
    );
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Server down");
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(
      await screen.findByRole("heading", { name: "Jordan Reyes" }),
    ).toBeInTheDocument();
  });

  it("filters the timeline when the user searches", async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.type(screen.getByLabelText("Search records"), "MRI");
    expect(screen.getByText("Showing 3 of 10 events")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Search records"));
    await user.type(screen.getByLabelText("Search records"), "zzz");
    await user.click(screen.getByRole("button", { name: "Clear all filters" }));
    expect(screen.getByText("Showing 10 of 10 events")).toBeInTheDocument();
  });

  it("filters by event type with the chips", async () => {
    const user = userEvent.setup();
    await renderApp();

    const imaging = screen.getByRole("button", { name: "Imaging" });
    await user.click(imaging);
    expect(imaging).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Showing 2 of 10 events")).toBeInTheDocument();
  });

  it("marks an event as verified and updates review progress", async () => {
    const user = userEvent.setup();
    await renderApp();

    const details = screen.getByRole("complementary", {
      name: "Event details",
    });
    await user.click(
      within(details).getByRole("button", { name: "Mark verified" }),
    );

    //UI updates right away
    const verified = within(details).getByRole("button", {
      name: "✓ Verified",
    });
    expect(verified).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("1/10")).toBeInTheDocument();
    await waitFor(() => expect(verified).toBeEnabled());
    expect(within(details).getByRole("status")).toHaveTextContent("");
  });

  it("rolls back and shows an error when saving fails", async () => {
    server.use(
      http.patch("/api/events/:id", () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );
    const user = userEvent.setup();
    await renderApp();

    const details = screen.getByRole("complementary", {
      name: "Event details",
    });
    await user.click(
      within(details).getByRole("button", { name: "Flag for review" }),
    );

    expect(await within(details).findByRole("alert")).toHaveTextContent(
      "Couldn't save: Server error",
    );
    expect(
      within(details).getByRole("button", { name: "Flag for review" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("0/10")).toBeInTheDocument();
  });

  it("shows the low-confidence warning for uncertain extractions", async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(
      screen.getByRole("button", { name: /Return-to-work assessment/ }),
    );
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText(/Low confidence/)).toBeInTheDocument();
  });
});
