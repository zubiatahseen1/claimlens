import { http, HttpResponse, delay } from "msw";
import { db } from "./db";
import type { ReviewStatus } from "../types";

const VALID_STATUSES: ReviewStatus[] = ["pending", "verified", "flagged"];

export const handlers = [
  http.get("/api/case", async () => {
    await delay(400);
    return HttpResponse.json(db.caseInfo);
  }),

  http.get("/api/events", async () => {
    await delay(600);
    return HttpResponse.json(db.events);
  }),

  http.patch("/api/events/:id", async ({ params, request }) => {
    await delay(300);

    const id = Number(params.id);
    const event = db.events.find((e) => e.id === id);
    if (!event) {
      return HttpResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const body = (await request.json()) as { status?: ReviewStatus };
    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return HttpResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    event.status = body.status;
    return HttpResponse.json(event);
  }),
];
