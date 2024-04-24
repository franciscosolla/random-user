import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { User } from "../../../shared/types/RandomUserApi";
import { api } from "../api/api";
import clone from "just-clone";

export type UserID = string;

const UserContext = createContext({
  subscribe: (onChange: () => void) => () => { },
  refresh: () => Promise.resolve([] as UserID[]),
  getUserIds: () => [] as UserID[],
  getUser: (id: UserID) => undefined as User | undefined,
  mutateUser: (id: UserID, mutate: (user: User) => User) => { }
});

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const subscribersRef = useRef(new Set<() => void>());
  const userMapRef = useRef(new Map<UserID, User>());
  const userIdsRef = useRef<UserID[]>([]);

  const subscribe = useCallback((onChange: () => void) => {
    subscribersRef.current.add(onChange);
    return () => {
      subscribersRef.current.delete(onChange);
    };
  }, []);

  const refresh: () => Promise<UserID[]> = useCallback(() => {
    return api.getUsers().then(users => {
      users.forEach(({ id, data }) => {
        userMapRef.current.set(id, data);
      });

      userIdsRef.current = users.map(({ id }) => id);

      subscribersRef.current.forEach(subscriber => subscriber());

      return userIdsRef.current;
    });
  }, []);

  const getUserIds = useCallback(() => userIdsRef.current, []);

  const getUser = useCallback((id: UserID) => userMapRef.current.get(id), []);

  const mutateUser = useCallback((id: UserID, mutate: (user: User) => User, callback?: (success: boolean) => void) => {
    if (userMapRef.current.has(id)) {
      const newUser = mutate(clone(userMapRef.current.get(id)!));
      api.patchUser(id, newUser)
        .then(({ id, data }) => {
          console.log('User updated', id, data);
          userMapRef.current.set(id, data);
          callback?.(true);
        })
        .catch(() => {
          console.log('Failed to update user');
          callback?.(false);
        })
        .finally(() => {
          console.log('finally');
          subscribersRef.current.forEach(subscriber => subscriber());
        });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({
    subscribe,
    refresh,
    getUserIds,
    getUser,
    mutateUser,
  }), [getUser, getUserIds, refresh, mutateUser, subscribe]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserIds = () => {
  const { subscribe, getUserIds } = useContext(UserContext);
  return useSyncExternalStore(subscribe, getUserIds);
};

export const useUserFirstName = (id: UserID) => {
  const { subscribe, getUser, mutateUser } = useContext(UserContext);

  const userFirstName = useSyncExternalStore(subscribe, () => getUser(id)?.name.first);

  const setUserFirstName = useCallback((firstName: string) => {
    mutateUser(id, user => {
      user.name.first = firstName;
      return user;
    })
  }, [id, mutateUser]);

  return [userFirstName, setUserFirstName] as const;
};

export function useUserSelector<T = User>(id: UserID, selector: (user: User) => T): T | undefined {
  const { subscribe, getUser } = useContext(UserContext);

  return useSyncExternalStore(subscribe, () => {
    const user = getUser(id);
    return user ? selector(user) : undefined;
  });
}

export const useUserMutation = (id: UserID) => {
  const { mutateUser } = useContext(UserContext);
  return useCallback((mutate: (user: User) => User) => mutateUser(id, mutate), [id, mutateUser]);
}

export interface UserSelectorProps<T> {
  userId: UserID;
  selector: (user: User) => T | undefined;
  children: (data: T | undefined) => React.ReactNode;
}

export function UserSelector<T>({ userId, selector, children }: UserSelectorProps<T>) {
  return children(useUserSelector(userId, selector));
}