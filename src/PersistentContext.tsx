'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Type of storage to use for persisting context state.
 */
export type StorageType = 'localStorage' | 'sessionStorage';

/**
 * Interface for the data provided by the persistent context.
 * @template T - The type of state being stored.
 */
export interface PersistentContextProps<T> {
  /** The current state */
  state: T;
  /** Function to update the state */
  setState: React.Dispatch<React.SetStateAction<T>>;
  /** A boolean to indicate if the state has been loaded from storage */
  isHydrated: boolean;
}

/**
 * The context object type. It can be undefined if accessed outside the provider.
 * @template T - The type of state being stored.
 */
export type PersistentContextType<T> = PersistentContextProps<T> | undefined;

const PersistentContext = createContext<PersistentContextType<any>>(undefined);

/**
 * Props for the PersistentProvider component.
 * @template T - The type of state being stored.
 */
export interface PersistentProviderProps<T> {
  /** A unique key to use when storing the state in web storage. */
  storageKey?: string;
  /** The type of web storage to use ('localStorage' or 'sessionStorage'). */
  storageType?: StorageType;
  /** The initial state value to use if no state is found in storage. */
  initialState?: T;
  /** The child components that will have access to this context. */
  children: React.ReactNode;
}

/**
 * A React Provider component that persists its state in localStorage or sessionStorage
 * @template T - The type of the state object.
 */
export const PersistentProvider = <T extends Record<string, any> = Record<string, any>>({
  storageKey = 'persistent-context',
  storageType = 'localStorage',
  initialState = {} as T,
  children,
}: PersistentProviderProps<T>): React.ReactElement => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [state, setInternalState] = useState<T>(initialState);

  const storage = useMemo(
    () => (storageType === 'sessionStorage' ? sessionStorage : localStorage),
    [storageType],
  );

  useEffect(() => {
    try {
      const storedData = storage.getItem(storageKey);

      if (storedData) {
        setInternalState(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error retrieving state from storage:', error);
    } finally {
      setIsHydrated(true);
    }
  }, [storage, storageKey]);

  const setState: React.Dispatch<React.SetStateAction<T>> = (action) => {
    setInternalState((prevState) => {
      const newState =
        typeof action === 'function' ? (action as (prevState: T) => T)(prevState) : action;

      if (isHydrated) {
        try {
          storage.setItem(storageKey, JSON.stringify(newState));
        } catch (error) {
          console.error('Error storing state:', error);
        }
      }
      return newState;
    });
  };

  return (
    <PersistentContext.Provider value={{ state, setState, isHydrated }}>
      {children}
    </PersistentContext.Provider>
  );
};

/**
 * A custom hook to easily access the persistent context's state and setter function.
 * This hook must be used within a component wrapped by a PersistentProvider.
 * @template T - The type of the state object.
 * @returns The context props: { state, setState, isHydrated }.
 */
export const usePersistentContext = <
  T extends Record<string, any> = Record<string, any>,
>(): PersistentContextProps<T> => {
  const context = useContext(PersistentContext) as PersistentContextProps<T>;

  if (context === undefined) {
    throw new Error('usePersistentContext must be used within a PersistentProvider');
  }

  return context;
};
