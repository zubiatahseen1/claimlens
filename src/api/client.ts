import type { CaseInfo, MedicalEvent, ReviewStatus } from "../types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(new URL(url, window.location.origin), {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body.message ?? `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export function getCase() {
  return request<CaseInfo>("/api/case");
}

export function getEvents() {
  return request<MedicalEvent[]>("/api/events");
}

export function updateEventStatus(id: number, status: ReviewStatus) {
  return request<MedicalEvent>(`/api/events/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
