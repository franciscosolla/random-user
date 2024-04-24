import { useEffect, useState } from "react";

export const useOptimistic = <State>(state: State) => {
  const [internalState, setInternalState] = useState(state);

  useEffect(() => {
    setInternalState(state);
  }, [state]);

  return [internalState, setInternalState] as const;
}