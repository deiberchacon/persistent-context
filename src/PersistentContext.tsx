import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Type of storage to use for persisting context state
 */
export type StorageType = "localStorage" | "sessionStorage";

/**
 * Interface for the data provided by PersistentContext
 * @template T - The type of state being stored
 */
export interface PersistentContextProps<T> {
  /** The current state */
  state: T;
  /** Function to update the state */
  setState: React.Dispatch<React.SetStateAction<T>>;
}

/**
 * Type for the context object
 * @template T - The type of state being stored
 */
export type PersistentContextType<T> = PersistentContextProps<T> | undefined;

// Create a context with a generic parameter
const PersistentContext = createContext<PersistentContextType<any>>(undefined);

/**
 * Props for the PersistentProvider component
 * @template T - The type of state being stored
 */
export interface PersistentProviderProps<T> {
  /** Key to use when storing in localStorage/sessionStorage */
  storageKey?: string;
  /** Type of storage to use */
  storageType?: StorageType;
  /** Initial state value when no stored state exists */
  initialState?: T;
  /** React children */
  children: React.ReactNode;
}

/**
 * Provider component that persists context state in localStorage or sessionStorage
 * @template T - The type of state being stored
 */
export const PersistentProvider = <T extends Record<string, any> = Record<string, any>>({
  storageKey = "persistent-context",
  storageType = "localStorage",
  initialState = {} as T,
  children,
}: PersistentProviderProps<T>): React.ReactElement => {
  const storage = storageType === "sessionStorage" ? sessionStorage : localStorage;

  const [state, setState] = useState<T>(() => {
    try {
      const storedData = storage.getItem(storageKey);
      return storedData ? JSON.parse(storedData) : initialState;
    } catch (error) {
      console.error("Error retrieving state from storage:", error);
      return initialState;
    }
  });

  useEffect(() => {
    try {
      storage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error("Error storing state:", error);
    }
  }, [state, storageKey, storage]);

  return (
    <PersistentContext.Provider value={{ state, setState }}>
      {children}
    </PersistentContext.Provider>
  );
};

/**
 * Hook to access the persistent context state
 * @template T - The type of state being stored
 * @returns The current state and setState function
 */
export const usePersistentContext = <T extends Record<string, any> = Record<string, any>>(): PersistentContextProps<T> => {
  const context = useContext(PersistentContext) as PersistentContextProps<T>;
  
  if (!context) {
    throw new Error(
      "usePersistentContext must be used within a PersistentProvider"
    );
  }
  
  return context;
};
