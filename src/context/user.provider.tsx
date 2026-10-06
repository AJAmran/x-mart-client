"use client";

import {
  clearCurrentUserCache,
  fetchCurrentUser,
} from "@/src/services/AuthService/clientSession";
import { IUser } from "@/src/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface IUserProviderValues {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  /** Re-fetch the current user, bypassing the short-lived client cache. */
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<IUserProviderValues | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Writes through to the browser-side memo so a later `fetchCurrentUser`
   * cannot resurrect a stale identity after a login/logout.
   */
  const setUser = useCallback((next: IUser | null) => {
    clearCurrentUserCache();
    setUserState(next);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      clearCurrentUserCache();
      setUserState(await fetchCurrentUser());
    } catch {
      setUserState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({ user, setUser, isLoading, setIsLoading, refreshUser }),
    [user, setUser, isLoading, refreshUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within the UserProvider context");
  }

  return context;
};

export default UserProvider;
