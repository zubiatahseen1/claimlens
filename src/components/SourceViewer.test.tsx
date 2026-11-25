import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import SourceViewer, { findExcerptItems } from "./SourceViewer";
import { events } from "../data/events";
import type { MedicalEvent } from "../types";

vi.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: {} },
  Document: ({
    children,
    onLoadSuccess,
  }: {
    children: ReactNode;
    onLoadSuccess: (pdf: { numPages: number }) => void;
  }) => {
    useEffect(() => onLoadSuccess({ numPages: 412 }), [onLoadSuccess]);
    return <div>{children}</div>;
  },
  Page: ({ pageNumber }: { pageNumber: number }) => (
    <div>PDF page {pageNumber}</div>
  ),
}));

const mri: MedicalEvent = { ...events[4], status: "pending" }; // cited on page 41

describe("SourceViewer", () => {
  it("opens at the cited page", () => {
    render(<SourceViewer event={mri} onClose={vi.fn()} />);

    expect(
      screen.getByRole("dialog", { name: "Imaging_Westview.pdf" }),
    ).toBeInTheDocument();
    expect(screen.getByText("PDF page 41")).toBeInTheDocument();
    expect(screen.getByText("Cited page")).toBeInTheDocument();
  });

  it("pages through the document and jumps back to the cited page", async () => {
    const user = userEvent.setup();
    render(<SourceViewer event={mri} onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Next ›" }));
    expect(screen.getByText("PDF page 42")).toBeInTheDocument();
    expect(screen.queryByText("Cited page")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Back to cited page" }),
    );
    expect(screen.getByText("PDF page 41")).toBeInTheDocument();
  });

  it("calls onClose when the close button is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<SourceViewer event={mri} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Close document" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe("findExcerptItems", () => {
  it("finds the run of text items that spell out the excerpt, ignoring spacing", () => {
    const items = [
      { str: "Clinical note" },
      { str: "Cleared for" },
      { str: " full duties." },
      {}, // marked-content items have no text
      { str: "Vital signs" },
    ];
    expect(findExcerptItems(items, "Cleared for full duties.")).toEqual(
      new Set([1, 2]),
    );
  });

  it("returns an empty set when the excerpt is not on the page", () => {
    expect(findExcerptItems([{ str: "Something else" }], "Cleared")).toEqual(
      new Set(),
    );
  });
});
