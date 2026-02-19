
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface WalletState {
  connected: boolean;
  address: string | null;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletState>({
  connected: false,
  address: null,
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Check persisted connection on mount
  useEffect(() => {
    try {
      const { isConnected, getLocalStorage } = require('@stacks/connect');
      if (isConnected()) {
        const userData = getLocalStorage();
        if (userData?.addresses?.stx?.[0]?.address) {
          setAddress(userData.addresses.stx[0].address);
          setConnected(true);
        }
      }
    } catch {
      // stacks/connect not available
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setConnecting(true);
    try {
      const { connect, getLocalStorage } = await import('@stacks/connect');
      const response = await connect();
      if (response) {
        const userData = getLocalStorage();
        const stxAddr = userData?.addresses?.stx?.[0]?.address || null;
        setAddress(stxAddr);
        setConnected(true);
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    try {
      const { disconnect } = require('@stacks/connect');
      disconnect();
    } catch {
      // ignore
    }
    setConnected(false);
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider value={{ connected, address, connecting, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
