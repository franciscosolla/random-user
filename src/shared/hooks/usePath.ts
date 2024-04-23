import { useSyncExternalStore } from "react"

export const usePath = () => {
  return useSyncExternalStore(subscribe, getSnapshot);
}

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener('popstate', onStoreChange);
  return () => window.removeEventListener('popstate', onStoreChange);
};

const getSnapshot = () => window.location.pathname;