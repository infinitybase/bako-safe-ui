import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

interface NetworkSwitchContextValue {
  isSwitchingNetwork: boolean;
  startNetworkSwitch: () => void;
  finishNetworkSwitch: () => void;
}

const NetworkSwitchContext = createContext<NetworkSwitchContextValue | null>(
  null,
);

export const NetworkSwitchProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  const startNetworkSwitch = useCallback(() => {
    setIsSwitchingNetwork(true);
  }, []);

  const finishNetworkSwitch = useCallback(() => {
    setIsSwitchingNetwork(false);
  }, []);

  return (
    <NetworkSwitchContext.Provider
      value={{
        isSwitchingNetwork,
        startNetworkSwitch,
        finishNetworkSwitch,
      }}
    >
      {children}
    </NetworkSwitchContext.Provider>
  );
};

export const useNetworkSwitch = () => {
  const context = useContext(NetworkSwitchContext);
  if (!context) {
    throw new Error(
      'useNetworkSwitch must be used within a NetworkSwitchProvider',
    );
  }
  return context;
};

export default NetworkSwitchContext;
