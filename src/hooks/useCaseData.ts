import { useCallback, useEffect, useState } from "react";
import { getCase, getEvents, updateEventStatus } from "../api/client";
import type { CaseInfo, MedicalEvent, ReviewStatus } from "../types";

type LoadState = "loading" | "success" | "error";

export function useCaseData() {
  const [caseInfo, setCaseInfo] = useState<CaseInfo | null>(null);
  const [events, setEvents] = useState<MedicalEvent[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setState("loading");
    setError(null);
    try {
      const [caseData, eventData] = await Promise.all([getCase(), getEvents()]);
      setCaseInfo(caseData);
      setEvents(eventData);
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = useCallback(
    async (id: number, status: ReviewStatus) => {
      const previous = events.find((e) => e.id === id)?.status;
      if (previous === undefined) return;

      setSaveError(null);
      setSavingId(id);
      setEvents((current) =>
        current.map((e) => (e.id === id ? { ...e, status } : e)),
      );

      try {
        await updateEventStatus(id, status);
      } catch (err) {
        setEvents((current) =>
          current.map((e) => (e.id === id ? { ...e, status: previous } : e)),
        );
        setSaveError(err instanceof Error ? err.message : "Could not save");
      } finally {
        setSavingId(null);
      }
    },
    [events],
  );

  return {
    caseInfo,
    events,
    state,
    error,
    reload: load,
    setStatus,
    savingId,
    saveError,
  };
}
