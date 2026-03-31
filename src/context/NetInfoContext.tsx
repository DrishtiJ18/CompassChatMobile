import React, {createContext, useEffect, useState, ReactNode} from 'react';
import NetInfo from '@react-native-community/netinfo';

interface NetInfoContextType {
  isOnline: boolean;
}

const initialContext: NetInfoContextType = {
  isOnline: false,
};

export const NetInfoContext = createContext(initialContext);

interface NetInfoProviderProps {
  children: ReactNode;
}

export const NetInfoProvider: React.FC<NetInfoProviderProps> = ({children}) => {
  const [isOnline, setisOnline] = useState(initialContext.isOnline);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setisOnline(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetInfoContext.Provider value={{isOnline}}>
      {children}
    </NetInfoContext.Provider>
  );
};
