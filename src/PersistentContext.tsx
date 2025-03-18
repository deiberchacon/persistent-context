import React, { createContext, useContext, useEffect, useState } from "react";

type StorageType = "localStorage" | "sessionStorage";

interface PersistentContextProps {
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

const PersistentContext = createContext<PersistentContextProps | undefined>(
  undefined
);

export const PersistentProvider: React.FC<{
  storageKey?: string;
  storageType?: StorageType;
  children: React.ReactNode;
}> = ({
  storageKey = "persistent-context",
  storageType = "localStorage",
  children,
}) => {
  const storage =
    storageType === "sessionStorage" ? sessionStorage : localStorage;

  const [state, setState] = useState(() => {
    try {
      const storedData = storage.getItem(storageKey);
      return storedData ? JSON.parse(storedData) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    storage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey, storage]);

  return (
    <PersistentContext.Provider value={{ state, setState }}>
      {children}
    </PersistentContext.Provider>
  );
};

export const usePersistentContext = () => {
  const context = useContext(PersistentContext);
  if (!context) {
    throw new Error(
      "usePersistentContext must be used within a PersistentProvider"
    );
  }
  return context;
};
