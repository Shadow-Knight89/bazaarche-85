
import React, { createContext, useContext, useState } from "react";

interface StoreContextType {
  storeName: string;
  setStoreName: (name: string) => void;
}

const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const useStoreContext = () => useContext(StoreContext);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeName, setStoreName] = useState<string>("بازارچه آنلاین دبیرستان شهید بهشتی");

  const value = {
    storeName,
    setStoreName
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
