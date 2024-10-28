import { useAuth } from "@/modules/auth/hooks";
import { IUseAuthDetails } from "@/types/auth";
import React, { createContext, useContext } from "react";

interface AuthContextProps {
  authDetails: IUseAuthDetails;
}

const BakoAuthContext = createContext<AuthContextProps | undefined>(undefined);

const BakoAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authDetails: IUseAuthDetails = useAuth();

  return (
    <BakoAuthContext.Provider value={{ authDetails }}>
      {children}
    </BakoAuthContext.Provider>
  );
};

const useBakoAuthContext = () => {
  const context = useContext(BakoAuthContext);
  if (!context) {
    throw new Error(
      "useBakoAuthContext must be used within an BakoAuthProvider",
    );
  }
  return context;
};

export { BakoAuthProvider, useBakoAuthContext };
