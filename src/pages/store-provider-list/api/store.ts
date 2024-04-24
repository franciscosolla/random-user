export const createStore = <T>(initialData: T) => {
  let data = initialData;
  let subscribers = new Set<(data: T) => void>();

  const setData = (mutate: (data: T) => T) => {
    data = mutate(data);
    subscribers.forEach(subscriber => subscriber(data));
  }

  const subscribe = (subscriber: (data: T) => void) => {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  };

  const getData = () => data;

  return {
    getData,
    setData,
    subscribe,
  } as const;
}