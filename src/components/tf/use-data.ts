import { useEffect, useState } from "react";
import { errorText } from "@/lib/teachflow/errors";

export function useData<T>(load: () => Promise<T>, deps: readonly unknown[]) {
  const key = JSON.stringify(deps);
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<{
    status: "loading" | "ready" | "error";
    data: T | null;
    error: string;
    unauthorized: boolean;
  }>({ status: "loading", data: null, error: "", unauthorized: false });

  useEffect(() => {
    let live = true;
    setState((current) => ({ ...current, status: current.data ? "ready" : "loading", error: "" }));
    load()
      .then((data) => {
        if (live) setState({ status: "ready", data, error: "", unauthorized: false });
      })
      .catch((error: unknown) => {
        if (!live) return;
        const unauthorized = error instanceof Error && error.message === "Unauthorized";
        setState({
          status: "error",
          data: null,
          unauthorized,
          error: unauthorized ? "Please sign in again." : errorText(error),
        });
      });
    return () => {
      live = false;
    };
    // `load` is current for this key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick]);

  return { ...state, reload: () => setTick((value) => value + 1) };
}
