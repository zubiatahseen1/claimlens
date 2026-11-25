import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Timeline, { PAGE_SIZE } from "./Timeline";
import { generateEvents } from "../mocks/generate";

describe("Timeline", () => {
  it(`renders the first ${PAGE_SIZE} events and loads more on request`, async () => {
    const user = userEvent.setup();
    const events = generateEvents(120);
    render(
      <Timeline
        events={events}
        query=""
        selectedId={null}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(50);

    await user.click(
      screen.getByRole("button", { name: "Show 50 more (70 remaining)" }),
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(100);

    await user.click(
      screen.getByRole("button", { name: "Show 20 more (20 remaining)" }),
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(120);
    expect(
      screen.queryByRole("button", { name: /more/ }),
    ).not.toBeInTheDocument();
  });

  it("calls onSelect with the event id when a card is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const events = generateEvents(3);
    render(
      <Timeline
        events={events}
        query=""
        selectedId={null}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getAllByRole("button")[0]);
    expect(onSelect).toHaveBeenCalledWith(expect.any(Number));
  });
});
