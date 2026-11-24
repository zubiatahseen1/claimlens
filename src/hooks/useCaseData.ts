import { useCallback, useEffect, useState } from "react";
import { getCase, getEvents } from "../api/client";
import type { CaseInfo, MedicalEvent } from "../types";

type LoadState = "loading" | "success" | "error";

export function useCaseData() {
  const [caseInfo, setCaseInfo] = useState<CaseInfo | null>(null);
  const [events, setEvents] = useState<MedicalEvent[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);

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

  return { caseInfo, events, state, error, reload: load };
}
