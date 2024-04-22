import { useSyncExternalStore } from "react";
import { getParams } from "../functions/getParams";

export const useParams = () => {
  return useSyncExternalStore(subscribe, getParams);
}

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}